'use client';

import * as stylex from '@stylexjs/stylex';
import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { CSSProperties, ReactNode, Ref, RefObject } from 'react';
import { UNSAFE_PortalProvider } from 'react-aria/PortalProvider';
import {
  Button as AriaButton, Popover as AriaPopover, Text, UNSTABLE_Toast, UNSTABLE_ToastContent, UNSTABLE_ToastQueue,
  UNSTABLE_ToastRegion,
} from 'react-aria-components';
import type { QueuedToast } from 'react-aria-components';
import { Icon } from './Icon';
import type { IconName } from './Icon';
import { motion, useSurfaceSpring } from './internal/spring';
import { overlayStyles, popupPlacement } from './internal/overlay';
import { focusStyles, hoverStyles, loadingStyles, pressStyles, transitionStyles } from './internal/states';
import { tokens as t } from '../tokens.stylex';

// Toast (DESIGN_SPEC 1.9, 2.2 Toast). ToastRegion is 300px wide with 64px rows, a 14px stack peek, a
// 10px fan gap, a scale progression, 28px actions and the surface springs; padding, type, radius and
// color come from tokens. The front toast wears the overlay
// surface (bg-elevated, border-subtle, shadow-popup) at radius xl; the cards behind it keep their 6%
// fill. Descriptions wrap to two lines. A toast leaves with the one exit: 160ms (--os-motion-hover)
// with ease-exit, sliding 60px toward the edge it came from; under reduced motion it just goes.

const reduce = '@media (prefers-reduced-motion: reduce)';
const coarse = '@media (pointer: coarse)';

const s = stylex.create({
  region: {
    position: 'fixed',
    zIndex: t['--os-z-toast'],
    width: 'min(300px, calc(100% - 32px))',
    outline: 'none',
    transitionProperty: 'height',
    transitionDuration: { default: t['--os-motion-layout'], [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  bottom: { insetBlockEnd: `max(${t['--os-space-4']}, env(safe-area-inset-bottom))` },
  top: { insetBlockStart: `max(${t['--os-space-4']}, env(safe-area-inset-top))` },
  end: { insetInlineEnd: `max(${t['--os-space-4']}, env(safe-area-inset-right))` },
  start: { insetInlineStart: `max(${t['--os-space-4']}, env(safe-area-inset-left))` },
  center: { insetInline: 0, marginInline: 'auto' },
  inline: { position: 'relative', width: '100%', maxWidth: 300, minWidth: 0, minHeight: 212 },
  inlineEnd: { marginInlineStart: 'auto' },
  inlineCenter: { marginInline: 'auto' },
  inlineContainer: { display: 'flex', width: '100%', minWidth: 0, maxWidth: '100%' },
  regionHeight: (height: number) => ({ height }),
  toast: {
    position: 'absolute',
    insetInline: 0,
    display: 'flex',
    alignItems: 'center',
    minHeight: 64,
    textAlign: 'start',
    paddingBlock: t['--os-space-3'],
    paddingInlineStart: t['--os-space-4'],
    paddingInlineEnd: t['--os-space-3'],
    gap: t['--os-space-3'],
    pointerEvents: 'auto',
    borderRadius: t['--os-radius-xl'],
    transitionProperty: 'background-color, box-shadow, border-color',
    transitionDuration: { default: t['--os-motion-hover'], [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  toastBottom: { bottom: 0, transformOrigin: '50% 0' },
  toastTop: { top: 0, transformOrigin: '50% 100%' },
  position: (offset: number, scale: number, zIndex: number) => ({ transform: `translateY(${offset}px) scale(${scale})`, zIndex }),
  fade: (opacity: number) => ({ opacity }),
  leaving: {
    opacity: 0,
    pointerEvents: 'none',
    transitionProperty: 'translate, opacity',
    transitionDuration: { default: t['--os-motion-hover'], [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-exit'],
  },
  leaveEnd: { translate: { default: '60px 0', [reduce]: '0 0' } },
  leaveStart: { translate: { default: '-60px 0', [reduce]: '0 0' } },
  // Cards behind the front toast: the 6% fill with a matching ring; the surface border goes transparent.
  back: {
    backgroundColor: `color-mix(in srgb, ${t['--os-color-fg-base']} 6%, ${t['--os-color-bg-surface']})`,
    borderColor: 'transparent',
    boxShadow: `0 0 0 1px color-mix(in srgb, ${t['--os-color-fg-base']} 6%, transparent)`,
  },
  icon: { display: 'grid', placeItems: 'center', flexShrink: 0, width: 18, height: 18, color: t['--os-color-fg-muted'] },
  success: { color: t['--os-color-fg-success'] },
  error: { color: t['--os-color-fg-error'] },
  warning: { color: t['--os-color-fg-warning'] },
  hiddenContent: {
    opacity: 0,
    pointerEvents: 'none',
    transitionProperty: 'opacity',
    transitionDuration: { default: t['--os-motion-popup'], [reduce]: '0ms' },
  },
  visibleContent: {
    opacity: 1,
    transitionProperty: 'opacity',
    transitionDuration: { default: t['--os-motion-popup'], [reduce]: '0ms' },
  },
  // For the buttons, whose color transitions already include opacity.
  hiddenButton: { opacity: 0, pointerEvents: 'none' },
  content: { flex: 1, minWidth: 0, display: 'grid', alignSelf: 'center', gap: t['--os-space-0-5'] },
  title: {
    fontSize: t['--os-font-size-sm'],
    fontWeight: t['--os-font-weight-medium'],
    lineHeight: t['--os-line-height-md'],
    letterSpacing: t['--os-tracking-tight'],
    color: t['--os-color-fg-base'],
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  description: {
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    overflow: 'hidden',
    fontSize: t['--os-font-size-caption'],
    lineHeight: t['--os-line-height-sm'],
    letterSpacing: t['--os-tracking-tight'],
    color: t['--os-color-fg-muted'],
    overflowWrap: 'anywhere',
  },
  // The 28px pill and close stay small; a ::after gives them a 44px hit area on touch.
  hit: {
    position: 'relative',
    flexShrink: 0,
    '::after': {
      content: '""',
      position: 'absolute',
      insetBlockStart: '50%',
      insetInlineStart: '50%',
      width: { default: '100%', [coarse]: 'max(100%, 44px)' },
      height: { default: '100%', [coarse]: 'max(100%, 44px)' },
      transform: 'translate(-50%, -50%)',
    },
  },
  action: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 28,
    paddingInline: t['--os-space-3'],
    borderRadius: t['--os-radius-control'],
    color: t['--os-color-fg-base'],
    fontFamily: 'inherit',
    fontSize: t['--os-font-size-caption'],
    fontWeight: t['--os-font-weight-medium'],
    lineHeight: t['--os-line-height-sm'],
    letterSpacing: t['--os-tracking-tight'],
    whiteSpace: 'nowrap',
    cursor: 'pointer',
  },
  close: {
    display: 'grid',
    placeItems: 'center',
    width: 28,
    height: 28,
    padding: 0,
    borderRadius: t['--os-radius-control'],
    color: t['--os-color-fg-muted'],
    cursor: 'pointer',
  },
  closePressed: { backgroundColor: t['--os-color-bg-interactive-secondary'] },
});

export type ToastKind = 'success' | 'error' | 'warning' | 'info' | 'loading';

export type ToastMessage = {
  title: string;
  description?: ReactNode;
  /** A status icon and the default timeout. `loading` shows a spinner and stays until it is updated or closed. */
  kind?: ToastKind;
  /** One action button. A toast with an action does not time out by default. */
  action?: { label: string; onAction: () => void };
  /** Deduplication key: adding a toast whose `id` is already queued updates that toast in place. */
  id?: string;
};

export type ToastAddOptions = {
  /** Milliseconds before the toast closes on its own; 0 keeps it until it is dismissed. Default by kind (`toastTimeouts`). */
  timeout?: number;
  /** Called when the toast closes, by the user, by its timeout or by code. */
  onClose?: () => void;
};

/** Default timeouts in ms by kind; 0 means the toast stays until dismissed. Toasts with an action also stay. */
// os-allow client-export: toasts only exist in the browser, so nothing on the server reads their timing.
export const toastTimeouts: Record<ToastKind | 'default', number> = {
  default: 5000, success: 5000, info: 5000, warning: 8000, error: 0, loading: 0,
};

type QueuedMessage = QueuedToast<ToastMessage>;
type QueueInternals = { queue: QueuedMessage[]; updateVisibleToasts(action: 'add' | 'remove' | 'clear'): void };
// React Aria keeps the list and its notifier private; updating a toast in place needs both (react-aria-components 1.22).
const internals = (queue: UNSTABLE_ToastQueue<ToastMessage>) => queue as unknown as QueueInternals;

// A pausable timer with the shape React Aria drives: reset() when the toast mounts, pause()/resume()
// while the region is hovered or focused, pause() when it unmounts.
class ToastTimer {
  private id: ReturnType<typeof setTimeout> | null = null;
  private started = 0;
  private remaining: number;
  private readonly callback: () => void;
  constructor(callback: () => void, delay: number) { this.callback = callback; this.remaining = delay; }
  reset(delay: number) { this.pause(); this.remaining = delay; this.resume(); }
  pause() {
    if (this.id == null) return;
    clearTimeout(this.id);
    this.id = null;
    this.remaining -= Date.now() - this.started;
  }
  resume() {
    if (this.remaining <= 0 || this.id != null) return;
    this.started = Date.now();
    this.id = setTimeout(() => { this.id = null; this.remaining = 0; this.callback(); }, this.remaining);
  }
}

// Mounted toasts register their exit motion here, so a timeout or `dismiss()` plays it before closing.
const exits = new WeakMap<UNSTABLE_ToastQueue<ToastMessage>, Map<string, () => void>>();

type Resolvable<T, A> = T | ((arg: A) => T);
const resolve = <T, A>(value: Resolvable<T, A>, arg: A): T => typeof value === 'function' ? (value as (arg: A) => T)(arg) : value;

export type ToastPromiseMessages<T> = {
  loading: ToastMessage;
  success: Resolvable<ToastMessage, T>;
  error: Resolvable<ToastMessage, unknown>;
};

/** The toast queue: React Aria's queue plus timeouts by kind, update in place, promise toasts and animated dismissal. */
export class ToastQueue extends UNSTABLE_ToastQueue<ToastMessage> {
  /** Adds a toast and returns its key. If `content.id` matches a queued toast, that toast is updated instead. */
  add(content: ToastMessage, options: ToastAddOptions = {}): string {
    const existing = content.id === undefined ? undefined : internals(this).queue.find(toast => toast.content.id === content.id);
    if (existing) return this.update(existing.key, content, options);
    const key = super.add(content, { onClose: options.onClose });
    if (this.arm(key, timeoutFor(content, options))) internals(this).updateVisibleToasts('add');
    return key;
  }

  /** Replaces a toast's content in place and restarts its timeout. If it has already closed, adds it again. */
  update(key: string, content: ToastMessage, options: ToastAddOptions = {}): string {
    const list = internals(this).queue;
    const index = list.findIndex(toast => toast.key === key);
    if (index < 0) return this.add(content, options);
    const previous = list[index];
    previous.timer?.pause();
    list[index] = { ...previous, content, onClose: options.onClose ?? previous.onClose, timer: undefined, timeout: undefined };
    this.arm(key, timeoutFor(content, options));
    internals(this).updateVisibleToasts('add');
    return key;
  }

  /** Shows a loading toast for the promise, then turns it into the success or error toast. Returns the promise. */
  promise<T>(promise: Promise<T>, messages: ToastPromiseMessages<T>, options: ToastAddOptions = {}): Promise<T> {
    const key = this.add({ ...messages.loading, kind: 'loading' }, { onClose: options.onClose });
    promise.then(
      value => { this.update(key, { kind: 'success', ...resolve(messages.success, value) }, options); },
      error => { this.update(key, { kind: 'error', ...resolve(messages.error, error) }, options); },
    );
    return promise;
  }

  /** Closes a toast with its exit motion. `close(key)` removes it at once. */
  dismiss(key: string) {
    const exit = exits.get(this)?.get(key);
    if (exit) exit();
    else this.close(key);
  }

  private arm(key: string, timeout: number) {
    if (!timeout) return false;
    const toast = internals(this).queue.find(item => item.key === key);
    if (!toast) return false;
    toast.timeout = timeout;
    toast.timer = new ToastTimer(() => this.dismiss(key), timeout) as unknown as QueuedMessage['timer'];
    return true;
  }
}

function timeoutFor(content: ToastMessage, options: ToastAddOptions) {
  if (options.timeout !== undefined) return Math.max(0, options.timeout);
  if (content.action) return 0;
  return toastTimeouts[content.kind ?? 'default'];
}

/** Creates the queue a ToastRegion shows. Keep one per app and add toasts to it from anywhere. */
// os-allow client-export: a queue is browser state, made and used in client code (it can't cross to the server).
export function createToastQueue(maxVisibleToasts = 3) {
  return new ToastQueue({ maxVisibleToasts });
}

export type ToastPlacement = 'bottom-end' | 'bottom-start' | 'bottom' | 'top-end' | 'top-start' | 'top';

export type ToastRegionProps = {
  /** The queue from `createToastQueue()`. */
  queue: UNSTABLE_ToastQueue<ToastMessage>;
  /** Names the landmark. Default "Notifications". */
  label?: string;
  /** Renders the region in the flow of its container instead of fixed to the viewport. */
  inline?: boolean;
  /** The viewport corner or edge the stack sits on. Default `bottom-end`. */
  placement?: ToastPlacement;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLDivElement>;
};

const icons: Partial<Record<ToastKind, IconName>> = { success: 'check-circle', error: 'alert-circle', warning: 'alert-triangle', info: 'info' };

// Preserve React Aria's queue, announcements and pause-on-hover behavior.
// Heights are measured so multiline notifications still fan out without overlap.
export function ToastRegion({ queue, label = 'Notifications', inline = false, placement = 'bottom-end', className, style, ref }: ToastRegionProps) {
  const visible = useSyncExternalStore(useCallback(listener => queue.subscribe(listener), [queue]), () => queue.visibleToasts, () => queue.visibleToasts);
  const [inlineContainer, setInlineContainer] = useState<HTMLDivElement | null>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [heights, setHeights] = useState<Record<string, number>>({});
  useEffect(() => {
    const activeKeys = new Set(visible.map(toast => toast.key));
    setHeights(previous => {
      const keys = Object.keys(previous);
      if (keys.every(key => activeKeys.has(key))) return previous;
      return Object.fromEntries(keys.filter(key => activeKeys.has(key)).map(key => [key, previous[key]]));
    });
  }, [visible]);
  const expanded = hovered || focused;
  const measure = useCallback((key: string, height: number) => setHeights(previous => previous[key] === height ? previous : { ...previous, [key]: height }), []);
  const offsets = visible.map((_, index) => visible.slice(0, index).reduce((sum, toast) => sum + (heights[toast.key] ?? 64) + 10, 0));
  const height = !visible.length ? 0 : expanded ? offsets[visible.length - 1] + (heights[visible[visible.length - 1].key] ?? 64) : (heights[visible[0].key] ?? 64) + (visible.length - 1) * 14;
  const edge = placement.startsWith('top') ? 'top' : 'bottom';
  const side = placement.endsWith('start') ? 'start' : placement.endsWith('end') ? 'end' : 'center';

  const sx = stylex.props(
    s.region, !inline && s[edge], !inline && s[side],
    inline && s.inline, inline && side === 'end' && s.inlineEnd, inline && side === 'center' && s.inlineCenter,
    s.regionHeight(inline ? Math.max(212, height) : height),
  );
  const region = (
    <div onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
      <UNSTABLE_ToastRegion
        ref={ref}
        queue={queue}
        aria-label={label}
        onPointerEnter={event => { if (event.pointerType !== 'touch') setHovered(true); }}
        onPointerLeave={() => setHovered(false)}
        onPointerDown={() => setHovered(true)}
        className={[sx.className, className].filter(Boolean).join(' ')}
        style={{ ...sx.style, ...style }}
      >
        {({ toast }) => {
          const index = Math.max(0, visible.findIndex(item => item.key === toast.key));
          return <StackedToast toast={toast} queue={queue} expanded={expanded} index={index} offset={offsets[index] ?? 0} restOffset={inline ? 60 : 0} edge={edge} side={side} onMeasure={measure} />;
        }}
      </UNSTABLE_ToastRegion>
    </div>
  );
  return inline
    ? <div ref={setInlineContainer} {...stylex.props(s.inlineContainer)}>{inlineContainer && <UNSAFE_PortalProvider getContainer={() => inlineContainer}>{region}</UNSAFE_PortalProvider>}</div>
    : region;
}

function StackedToast({ toast, queue, expanded, index, offset, restOffset, edge, side, onMeasure }: {
  toast: QueuedMessage; queue: UNSTABLE_ToastQueue<ToastMessage>; expanded: boolean; index: number; offset: number; restOffset: number;
  edge: 'top' | 'bottom'; side: 'start' | 'end' | 'center'; onMeasure: (key: string, height: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [leaving, setLeaving] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const targetOffset = expanded ? offset : restOffset + index * 14;
  const animatedOffset = useSurfaceSpring(targetOffset, restOffset - 24);
  const animatedScale = useSurfaceSpring(expanded ? 1 : Math.max(.75, 1 - index * .05), 1);
  const animatedOpacity = useSurfaceSpring(1, 0);
  const dismiss = useCallback(() => {
    if (closeTimer.current) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { queue.close(toast.key); return; }
    setLeaving(true);
    closeTimer.current = setTimeout(() => queue.close(toast.key), motion.hover);
  }, [queue, toast.key]);
  useEffect(() => {
    let map = exits.get(queue);
    if (!map) { map = new Map(); exits.set(queue, map); }
    map.set(toast.key, dismiss);
    return () => { if (map.get(toast.key) === dismiss) map.delete(toast.key); };
  }, [queue, toast.key, dismiss]);
  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const update = () => onMeasure(toast.key, element.offsetHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [toast.key, onMeasure]);
  const hidden = !expanded && index > 0;
  const visibility = hidden ? s.hiddenContent : s.visibleContent;
  const buttonVisibility = hidden && s.hiddenButton;
  const { kind, title, description, action } = toast.content;
  const icon = kind ? icons[kind] : undefined;
  return (
    <UNSTABLE_Toast
      ref={ref}
      toast={toast}
      {...stylex.props(
        overlayStyles.surface, s.toast, edge === 'top' ? s.toastTop : s.toastBottom,
        s.position(edge === 'top' ? animatedOffset : -animatedOffset, animatedScale, 1000 - index),
        s.fade(Math.max(0, Math.min(1, animatedOpacity))),
        hidden && s.back,
        leaving && [s.leaving, side === 'start' ? s.leaveStart : s.leaveEnd],
      )}
    >
      {kind === 'loading'
        ? <span aria-hidden="true" {...stylex.props(s.icon, visibility)}><span {...stylex.props(loadingStyles.spinner, loadingStyles.spinnerSize(16))} /></span>
        : icon && <span aria-hidden="true" {...stylex.props(s.icon, kind === 'success' && s.success, kind === 'error' && s.error, kind === 'warning' && s.warning, visibility)}><Icon name={icon} size={18} /></span>}
      <UNSTABLE_ToastContent {...stylex.props(s.content, visibility)}>
        <Text slot="title" {...stylex.props(s.title)}>{title}</Text>
        {description && <Text slot="description" {...stylex.props(s.description)}>{description}</Text>}
      </UNSTABLE_ToastContent>
      {action && (
        <AriaButton
          onPress={() => { action.onAction(); dismiss(); }}
          className={({ isPressed, isFocusVisible }) => stylex.props(
            s.hit, s.action, hoverStyles.neutral, transitionStyles.colorsAndPress,
            isPressed && pressStyles.scale, isFocusVisible ? focusStyles.ring : focusStyles.none, buttonVisibility,
          ).className ?? ''}
        >
          {action.label}
        </AriaButton>
      )}
      <AriaButton
        onPress={dismiss}
        aria-label={`Dismiss ${title}`}
        className={({ isPressed, isHovered, isFocusVisible }) => stylex.props(
          s.hit, s.close, hoverStyles.fill, transitionStyles.colorsAndPress,
          (isHovered || isPressed) && hoverStyles.textActive, isPressed && [s.closePressed, pressStyles.scale],
          isFocusVisible ? focusStyles.ring : focusStyles.none, buttonVisibility,
        ).className ?? ''}
      >
        <Icon name="x" size={14} />
      </AriaButton>
    </UNSTABLE_Toast>
  );
}

// Anchored toast: an overlay surface (radius lg) the height of an md control on one line (40), with
// 8px block and 12px inline padding from the outer edge, 14/20 type, a 16px icon 8 before the text.
const a = stylex.create({
  surface: {
    display: 'flex', alignItems: 'center',
    maxWidth: 'min(320px, calc(100vw - 24px))',
    minHeight: t['--os-size-md'],
    paddingBlock: `calc(${t['--os-space-2']} - ${t['--os-stroke']})`,
    paddingInline: `calc(${t['--os-space-3']} - ${t['--os-stroke']})`,
    borderRadius: t['--os-radius-lg'],
  },
  row: { display: 'flex', alignItems: 'center', gap: t['--os-space-2'] },
  icon: { display: 'grid', placeItems: 'center', flexShrink: 0, width: 16, height: 16, color: t['--os-color-fg-muted'] },
  copy: { display: 'grid', minWidth: 0 },
  title: { fontWeight: t['--os-font-weight-medium'] },
  description: { color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-sm'] },
  hidden: {
    position: 'absolute', width: 1, height: 1, margin: -1, padding: 0, overflow: 'hidden',
    clip: 'rect(0 0 0 0)', clipPath: 'inset(50%)', whiteSpace: 'nowrap', borderWidth: 0,
  },
});

export type AnchoredToastProps = Pick<ToastMessage, 'title' | 'description' | 'kind'> & {
  /** The element the toast points at, usually the button that caused it. */
  triggerRef: RefObject<Element | null>;
  /** Shows the toast. Set it to true after the action; the toast sets it back to false when it times out. */
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  /** Side of the trigger. Default `top`. It flips when there is no room. */
  placement?: 'top' | 'bottom' | 'left' | 'right';
  /** Milliseconds before it closes; 0 keeps it open. Default 2000. Hovering pauses it. */
  timeout?: number;
  className?: string;
  style?: CSSProperties;
};

/** A short confirmation next to the control that caused it, such as "Copied" by a copy button. */
export function AnchoredToast({ triggerRef, isOpen, onOpenChange, title, description, kind, placement = 'top', timeout = 2000, className, style }: AnchoredToastProps) {
  const [paused, setPaused] = useState(false);
  const change = useRef(onOpenChange);
  useEffect(() => { change.current = onOpenChange; });
  useEffect(() => {
    if (!isOpen || paused || !timeout) return;
    const id = setTimeout(() => change.current(false), timeout);
    return () => clearTimeout(id);
  }, [isOpen, paused, timeout, title, kind, description]);
  useEffect(() => { if (!isOpen) setPaused(false); }, [isOpen]);
  const icon = kind && kind !== 'loading' ? icons[kind] : undefined;
  return (
    <>
      <span role="status" {...stylex.props(a.hidden)}>{isOpen ? (typeof description === 'string' ? `${title}. ${description}` : title) : ''}</span>
      <AriaPopover
        triggerRef={triggerRef}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isNonModal
        placement={placement}
        offset={6}
        containerPadding={12}
        style={style}
        className={({ placement: side, isExiting }) => [stylex.props(
          overlayStyles.surface, a.surface, overlayStyles.popupMotion, popupPlacement(side), isExiting && overlayStyles.exit,
        ).className, className].filter(Boolean).join(' ')}
      >
        <div aria-hidden="true" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)} {...stylex.props(a.row)}>
          {kind === 'loading'
            ? <span {...stylex.props(a.icon)}><span {...stylex.props(loadingStyles.spinner, loadingStyles.spinnerSize(16))} /></span>
            : icon && <span {...stylex.props(a.icon, kind === 'success' && s.success, kind === 'error' && s.error, kind === 'warning' && s.warning)}><Icon name={icon} size={16} /></span>}
          <span {...stylex.props(a.copy)}>
            <span {...stylex.props(a.title)}>{title}</span>
            {description && <span {...stylex.props(a.description)}>{description}</span>}
          </span>
        </div>
      </AriaPopover>
    </>
  );
}
