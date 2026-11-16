import * as stylex from '@stylexjs/stylex';
import { isValidElement, useCallback, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactElement, ReactNode, Ref } from 'react';
import { DialogTrigger, Heading, Menu as AriaMenu, MenuTrigger, Modal, ModalOverlay, Popover as AriaPopover, Pressable, Text } from 'react-aria-components';
import type { MenuProps as AriaMenuProps, PopoverProps as AriaPopoverProps } from 'react-aria-components';
import { tokens as t } from '../../tokens.stylex';

// Overlays (DESIGN_SPEC 1.9): surfaces, panel headings, motion and list items for popups, dialogs,
// sheets, drawers and toasts.
//
// Motion. Each entry style also names its exit through two inherited custom properties
// (--os-exit-animation, --os-exit-duration), so the one `exit` style plays the right exit for any
// element: anchored popups fade and settle to .98 over 160ms, windows the same, backdrops fade,
// sheets slide back to their edge over 240ms. Exits use --os-ease-exit and never replay the entry
// in reverse. Under reduced motion every entry and exit is an opacity fade of 120ms (--os-motion-press).

const reduce = '@media (prefers-reduced-motion: reduce)';
/** The reduced-motion duration: opacity only, 120ms or less (spec 1.9). */
const reduced = t['--os-motion-press'];
/** Spec 1.9 Items: text 16px from the surface edge, less the list's 6px padding (10). */
const itemInset = `calc(${t['--os-space-4']} - ${t['--os-space-1-5']})`;
/** Spec 1.3 nesting rule: the popup radius less its 6px list padding (10). */
const itemRadius = `max(${t['--os-radius-sm']}, calc(${t['--os-radius-lg']} - ${t['--os-space-1-5']}))`;

const fadeIn = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const fadeOut = stylex.keyframes({ from: { opacity: 1 }, to: { opacity: 0 } });
// Anchored popups start 4px toward the trigger and move away from it. `origin()` sets the offset
// per placement; the fallbacks describe a popup below its trigger.
const popupEnter = stylex.keyframes({
  from: { opacity: 0, transform: 'translate(var(--os-popup-enter-x, 0px), var(--os-popup-enter-y, -4px)) scale(.96)' },
  to: { opacity: 1, transform: 'none' },
});
const settleOut = stylex.keyframes({ from: { opacity: 1, transform: 'none' }, to: { opacity: 0, transform: 'scale(.98)' } });
const windowEnter = stylex.keyframes({ from: { opacity: 0, transform: 'translateY(8px) scale(.98)' }, to: { opacity: 1, transform: 'none' } });
const windowEnterTop = stylex.keyframes({ from: { opacity: 0, transform: 'translateY(-8px) scale(.98)' }, to: { opacity: 1, transform: 'none' } });
// Sheets slide past their edge; an inset sheet also travels its gap to the viewport (--os-sheet-gap).
const slideOutTop = stylex.keyframes({ from: { transform: 'none' }, to: { transform: 'translateY(calc(-100% - var(--os-sheet-gap, 0px)))' } });
const slideOutBottom = stylex.keyframes({ from: { transform: 'none' }, to: { transform: 'translateY(calc(100% + var(--os-sheet-gap, 0px)))' } });
const slideOutLeft = stylex.keyframes({ from: { transform: 'none' }, to: { transform: 'translateX(calc(-100% - var(--os-sheet-gap, 0px)))' } });
const slideOutRight = stylex.keyframes({ from: { transform: 'none' }, to: { transform: 'translateX(calc(100% + var(--os-sheet-gap, 0px)))' } });

const overlayBase = stylex.create({
  /** Modal backdrop and centring layer: bg-overlay, no blur, z --os-z-modal. Pair with `animateIn`. */
  overlay: {
    position: 'fixed', inset: 0, zIndex: t['--os-z-modal'], display: 'grid', placeItems: 'center', overflowY: 'auto',
    padding: t['--os-space-4'], backgroundColor: t['--os-color-bg-overlay'],
  },
  /**
   * The overlay surface: bg-elevated, a 1px border-subtle hairline and shadow-popup (in dark the
   * hairline is the edge). It sets its own type (Inter 14/20 at 400, tight tracking) so portaled
   * content never inherits the page body. Radius lg; Toast and Tooltip set their own.
   * An overlay is a new surface context: inside it --os-color-bg-surface resolves to the elevated
   * fill, so fields, tiles and mixes made over bg-surface keep the relation they have on a page
   * (identical in light, where both are white).
   */
  surface: {
    '--os-color-bg-surface': t['--os-color-bg-elevated'],
    boxSizing: 'border-box', backgroundColor: t['--os-color-bg-elevated'], color: t['--os-color-fg-base'],
    borderRadius: t['--os-radius-lg'], borderWidth: 1, borderStyle: 'solid',
    borderColor: t['--os-color-border-subtle'], boxShadow: t['--os-shadow-popup'],
    fontFamily: t['--os-font-family'], fontSize: t['--os-font-size-sm'], fontWeight: t['--os-font-weight-regular'],
    lineHeight: t['--os-line-height-md'], letterSpacing: t['--os-tracking-tight'],
  },
  /** Backdrop fade over --os-motion-popup. */
  animateIn: {
    animationName: fadeIn,
    animationDuration: { default: t['--os-motion-popup'], [reduce]: reduced },
    animationTimingFunction: t['--os-ease-settle'], animationFillMode: 'both',
    '--os-exit-animation': fadeOut, '--os-exit-duration': t['--os-motion-hover'],
  },
  /** Anchored popup entry. Always pair with `origin(popupOrigin(placement))`, which aims the motion away from the trigger. */
  popupMotion: {
    animationName: { default: popupEnter, [reduce]: fadeIn },
    animationDuration: { default: t['--os-motion-popup'], [reduce]: reduced },
    animationTimingFunction: t['--os-ease-settle'], animationFillMode: 'both',
    '--os-exit-animation': settleOut, '--os-exit-duration': t['--os-motion-hover'],
  },
  /** Modal window entry (Dialog, AlertDialog): rises 8px and settles from .98 over --os-motion-modal. */
  windowMotion: {
    animationName: { default: windowEnter, [reduce]: fadeIn },
    animationDuration: { default: t['--os-motion-modal'], [reduce]: reduced },
    animationTimingFunction: t['--os-ease-settle'], animationFillMode: 'both',
    '--os-exit-animation': settleOut, '--os-exit-duration': t['--os-motion-hover'],
  },
  /** Top-anchored window entry (Command): comes down 8px instead. */
  windowMotionTop: {
    animationName: { default: windowEnterTop, [reduce]: fadeIn },
    animationDuration: { default: t['--os-motion-modal'], [reduce]: reduced },
    animationTimingFunction: t['--os-ease-settle'], animationFillMode: 'both',
    '--os-exit-animation': settleOut, '--os-exit-duration': t['--os-motion-hover'],
  },
  dialog: { display: 'grid', gap: t['--os-space-4'], padding: t['--os-space-5'], outline: 'none' },
  heading: { display: 'grid', gap: t['--os-space-1'] },
  /** Overlay title: 18/24 500 with tight tracking (spec 1.4: tight on 13-18px). */
  title: { margin: 0, fontSize: t['--os-font-size-lg'], fontWeight: t['--os-font-weight-medium'], letterSpacing: t['--os-tracking-tight'], lineHeight: t['--os-line-height-lg'] },
  /** Overlay description: 14/20 fg-muted. */
  description: { fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'], color: t['--os-color-fg-muted'] },
  /** Anchored popup sizing. No zIndex: React Aria writes z-index 100000 inline on its popovers. */
  popup: { maxWidth: 'calc(100vw - 24px)' },
  /**
   * Menu and command lists. Legacy item styles paint hover and virtual focus in bg-subtle, which
   * does not show on an elevated surface; inside the list bg-subtle resolves to the spec 2.1 C
   * highlight (bg-interactive-primary) until those items move to `overlayItemStyles.active`.
   */
  menu: {
    '--os-color-bg-subtle': t['--os-color-bg-interactive-primary'],
    display: 'grid', gap: t['--os-space-0-5'], padding: t['--os-space-1-5'], minWidth: 200, maxWidth: 'min(320px, calc(100vw - 24px))',
    maxHeight: 'inherit', overflowY: 'auto', outline: 'none',
  },
  /** @deprecated Unused: shortcuts render as Kbd `sm` (spec 2.2 Menu, Command). 12/16 with a 1px keycap edge. */
  key: {
    flexShrink: 0, borderWidth: 1, borderStyle: 'solid', borderColor: t['--os-color-border-muted'],
    borderRadius: t['--os-radius-sm'], paddingBlock: t['--os-space-0-5'], paddingInline: t['--os-space-1'], color: t['--os-color-fg-muted'],
    fontSize: t['--os-font-size-xs'], lineHeight: t['--os-line-height-xs'], backgroundColor: t['--os-color-bg-subtle'], fontFamily: t['--os-font-family'],
  },
  /** Sheet and drawer surface: a column that never leaves the viewport; slides in over --os-motion-sheet, out over 240ms. */
  sheet: {
    display: 'flex', flexDirection: 'column', maxHeight: '100dvh', maxWidth: '100vw', overflow: 'hidden',
    animationDuration: { default: t['--os-motion-sheet'], [reduce]: reduced },
    animationTimingFunction: t['--os-ease-settle'], animationFillMode: 'both',
    // Spec 1.9: sheets slide out over 240ms, the one exit that is not --os-motion-hover (no token yet).
    '--os-exit-duration': '240ms',
  },
  sheetContent: { maxHeight: '100dvh', overflowY: 'auto', overscrollBehavior: 'contain' },
  /** Top and bottom: full width up to 640 (spec 1.9). */
  vertical: { width: 'min(100%, 640px)', maxHeight: 'min(88dvh, 680px)' },
  /** Left and right: 384 wide (spec 1.9), full height. */
  horizontal: { width: 'min(100vw, 384px)', height: '100dvh' },
  top: { borderStartStartRadius: 0, borderStartEndRadius: 0, paddingBlockStart: 'env(safe-area-inset-top)', '--os-exit-animation': slideOutTop },
  bottom: { borderEndStartRadius: 0, borderEndEndRadius: 0, paddingBlockEnd: 'env(safe-area-inset-bottom)', '--os-exit-animation': slideOutBottom },
  left: { borderTopLeftRadius: 0, borderBottomLeftRadius: 0, '--os-exit-animation': slideOutLeft },
  right: { borderTopRightRadius: 0, borderBottomRightRadius: 0, '--os-exit-animation': slideOutRight },
  /**
   * Exit for every overlay element: plays the exit its entry style named (see the header), over
   * --os-exit-duration with --os-ease-exit. Apply on React Aria `isExiting`, after the entry style.
   */
  exit: {
    animationName: { default: `var(--os-exit-animation, ${fadeOut})`, [reduce]: fadeOut },
    animationDuration: { default: `var(--os-exit-duration, ${t['--os-motion-hover']})`, [reduce]: reduced },
    animationTimingFunction: t['--os-ease-exit'], animationDirection: 'normal', animationFillMode: 'both',
  },
});

// Static per-placement styles: transform origin on the trigger side, and the 4px start offset
// toward the trigger that `popupMotion` animates away from. They are static on purpose: React Aria
// render-prop classNames keep only `className`, so a dynamic StyleX style would lose its inline vars.
const placementStyles = stylex.create({
  /** Popup below its trigger. */
  below: { transformOrigin: 'top center', '--os-popup-enter-x': '0px', '--os-popup-enter-y': '-4px' },
  /** Popup above its trigger. */
  above: { transformOrigin: 'bottom center', '--os-popup-enter-x': '0px', '--os-popup-enter-y': '4px' },
  /** Popup to the left of its trigger. */
  before: { transformOrigin: 'right center', '--os-popup-enter-x': '4px', '--os-popup-enter-y': '0px' },
  /** Popup to the right of its trigger. */
  after: { transformOrigin: 'left center', '--os-popup-enter-x': '-4px', '--os-popup-enter-y': '0px' },
});

/** The placement style for a React Aria placement (`'top' | 'bottom' | 'left' | 'right'`, or null). */
export function popupPlacement(placement: string | null | undefined) {
  return placement === 'top' ? placementStyles.above : placement === 'left' ? placementStyles.before : placement === 'right' ? placementStyles.after : placementStyles.below;
}

export const overlayStyles = {
  ...overlayBase,
  /**
   * Transform origin on the trigger side plus the start offset for `popupMotion`. Takes the string
   * from `popupOrigin(placement)`; prefer `popupPlacement(placement)`.
   */
  origin: (origin: string) => origin.startsWith('bottom') ? placementStyles.above : origin.startsWith('right') ? placementStyles.before : origin.startsWith('left') ? placementStyles.after : placementStyles.below,
};

/**
 * List items inside overlays (spec 1.9 Items): menu, listbox and command rows. 36 tall, radius 10
 * (16 - 6), padding-inline 10 so text sits 16px from the surface edge, 14/20 at 400. Virtual focus and
 * hover share `active` (no ring). Icons are 16 in fg-muted with an 8px gap; a check, submenu chevron
 * or shortcut goes at the end with `end`.
 */
export const overlayItemStyles = stylex.create({
  list: { display: 'grid', gap: t['--os-space-0-5'], padding: t['--os-space-1-5'], outline: 'none' },
  item: {
    display: 'flex', alignItems: 'center', gap: t['--os-space-2'], minHeight: 36, paddingInline: itemInset,
    borderRadius: itemRadius, color: t['--os-color-fg-base'],
    fontSize: t['--os-font-size-sm'], fontWeight: t['--os-font-weight-regular'], lineHeight: t['--os-line-height-md'],
    letterSpacing: t['--os-tracking-tight'], cursor: 'default', outline: 'none', textDecoration: 'none',
    transitionProperty: 'background-color, color',
    transitionDuration: { default: t['--os-motion-hover'], [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  active: { backgroundColor: t['--os-color-bg-interactive-primary'] },
  pressed: { backgroundColor: t['--os-color-bg-interactive-secondary'] },
  /** The selected option: weight 500; render a 16px `check` Icon at the end. */
  selected: { fontWeight: t['--os-font-weight-medium'] },
  disabled: { color: t['--os-color-fg-disabled'], cursor: 'default' },
  icon: { display: 'inline-flex', flexShrink: 0, color: t['--os-color-fg-muted'] },
  end: { display: 'inline-flex', alignItems: 'center', marginInlineStart: 'auto', flexShrink: 0, color: t['--os-color-fg-muted'] },
  /** Group label: 12/16 500 fg-muted, padding 6 10. */
  groupLabel: {
    paddingBlock: t['--os-space-1-5'], paddingInline: itemInset, color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-xs'],
    fontWeight: t['--os-font-weight-medium'], lineHeight: t['--os-line-height-xs'], letterSpacing: 0,
  },
  /** Separator: 1px border-subtle, 4px above and below. */
  separator: { height: 1, marginBlock: t['--os-space-1'], borderWidth: 0, borderStyle: 'none', backgroundColor: t['--os-color-border-subtle'] },
  /**
   * Empty and loading rows (spec 1.8 Loading): a 36px row on the item inset, 14/20 fg-muted, so the
   * message sits where the first item's text would. A loading row puts a 16px spinner first, 8 before it.
   */
  empty: {
    display: 'flex', alignItems: 'center', gap: t['--os-space-2'], minHeight: 36, paddingBlock: t['--os-space-2'], paddingInline: itemInset,
    color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'], letterSpacing: t['--os-tracking-tight'],
  },
});

export function popupOrigin(placement: string | null) {
  return placement === 'top' ? 'bottom center' : placement === 'left' ? 'right center' : placement === 'right' ? 'left center' : 'top center';
}

/**
 * The retired overlay button's tones mapped to Button appearances (spec 2.1 G):
 * neutral -> tertiary, primary -> primary, danger -> destructive, at size md in overlay footers.
 */
export const overlayButtonAppearance = { neutral: 'tertiary', primary: 'primary', danger: 'destructive' } as const;
export type OverlayButtonTone = keyof typeof overlayButtonAppearance;

export type OpenProps = { isOpen?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void };
export type PortalProps = { portalContainer?: Element };
export type PanelProps = OpenProps & PortalProps & {
  trigger: ReactNode;
  title: string;
  description?: ReactNode;
  children: ReactNode | ((close: () => void) => ReactNode);
};

/** Dialog and AlertDialog widths (spec 1.9): 320 / 400 / 560. `small | medium | large` are aliases. */
export type WindowSize = 'sm' | 'md' | 'lg';
export type WindowSizeProp = WindowSize | 'small' | 'medium' | 'large';
const legacyWindowSizes = { small: 'sm', medium: 'md', large: 'lg' } as const;
export function normalizeWindowSize(size: WindowSizeProp | undefined): WindowSize {
  if (size === undefined) return 'md';
  return size in legacyWindowSizes ? legacyWindowSizes[size as keyof typeof legacyWindowSizes] : size as WindowSize;
}

/** Content that may be a node or a render function that receives `close`. */
export type PanelContent = ReactNode | ((close: () => void) => ReactNode);
export function renderPanelContent(content: PanelContent, close: () => void): ReactNode {
  return typeof content === 'function' ? content(close) : content;
}

/**
 * Open state for an overlay, controlled (`isOpen`) or not (`defaultOpen`). `onOpenChange` fires on
 * every change either way. Overlays own their state so that they can hold it open (a pending
 * confirm) or react to a close (`onCancel`).
 */
export function useOpenState({ isOpen, defaultOpen = false, onOpenChange }: OpenProps): [boolean, (open: boolean) => void] {
  const [local, setLocal] = useState(defaultOpen);
  const controlled = isOpen !== undefined;
  const setOpen = useCallback((next: boolean) => {
    if (!controlled) setLocal(next);
    onOpenChange?.(next);
  }, [controlled, onOpenChange]);
  return [controlled ? isOpen : local, setOpen];
}

/**
 * The trigger of a React Aria DialogTrigger or SheetTrigger. React Aria pressables (RAC Button and
 * the parts built on it) take the trigger's press handlers themselves. A native element, such as
 * the library `Button`, does not: after the first layout, if the element carries no aria-expanded,
 * the slot wraps it in RAC `Pressable` so it opens the overlay, gets aria-expanded and anchors a
 * popover. The switch happens in a layout effect, before paint.
 */
export function TriggerSlot({ children }: { children: ReactNode }) {
  const marker = useRef<HTMLSpanElement>(null);
  const type = isValidElement(children) ? children.type : null;
  const initial = (): 'probe' | 'native' => typeof type === 'string' ? 'native' : 'probe';
  const [state, setState] = useState<{ type: unknown; mode: 'probe' | 'pressable' | 'native' }>(() => ({ type, mode: initial() }));
  if (state.type !== type) setState({ type, mode: initial() });
  useLayoutEffect(() => {
    if (state.mode !== 'probe') return;
    const el = marker.current?.previousElementSibling;
    setState(current => ({ ...current, mode: el && !el.hasAttribute('aria-expanded') ? 'native' : 'pressable' }));
  }, [state.mode]);
  if (state.mode === 'native' && isValidElement(children)) return <Pressable>{children as ReactElement<Record<string, unknown>, string>}</Pressable>;
  return <>{children}{state.mode === 'probe' && <span hidden ref={marker} />}</>;
}

/**
 * Panel layout inside a dialog, sheet, drawer or popover (spec 1.9): header (title 18/24, description
 * 14/20, 4 apart), body and footer, 16 apart, padding 20. `compact` is the content-popup scale:
 * padding 16, gap 12, title 14/20, description 13/18. The body scrolls between a fixed header and
 * footer when the surface runs out of height, and keeps 4px of room for focus rings at its edges.
 * The footer is one end-aligned row with an 8px gap; below 480px of viewport it stacks full width
 * with the primary action, written last, at the bottom.
 */
export const panelStyles = stylex.create({
  /** The React Aria Dialog element: header, body and footer in a column. Fills a flex surface. */
  frame: {
    position: 'relative', display: 'flex', flexDirection: 'column', gap: t['--os-space-4'], padding: t['--os-space-5'],
    flexGrow: 1, flexShrink: 1, flexBasis: 'auto', minHeight: 0, minWidth: 0, outline: 'none',
  },
  frameCompact: { gap: t['--os-space-3'], padding: t['--os-space-4'] },
  heading: { display: 'grid', gap: t['--os-space-1'], flexShrink: 0, minWidth: 0 },
  headingCentered: { justifyItems: 'center', textAlign: 'center' },
  /** Keeps the title clear of the close button: 32 button, 16 inset, 8 gap, less the 20 padding (36). */
  headingClear: { paddingInlineEnd: `calc(${t['--os-size-sm']} + ${t['--os-space-4']} + ${t['--os-space-2']} - ${t['--os-space-5']})` },
  /** Compact: 24 button, 12 inset, 8 gap, less the 16 padding (28). */
  headingClearCompact: { paddingInlineEnd: `calc(${t['--os-size-xs']} + ${t['--os-space-3']} + ${t['--os-space-2']} - ${t['--os-space-4']})` },
  /** Popover title: 14/20 500. */
  titleCompact: { fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'], letterSpacing: t['--os-tracking-tight'] },
  /** Popover description: 13/18. */
  descriptionCompact: { fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-sm'] },
  body: {
    display: 'grid', gap: t['--os-space-4'], alignContent: 'start', minHeight: 0, minWidth: 0,
    flexGrow: 1, flexShrink: 1, flexBasis: 'auto', overflowY: 'auto', overscrollBehavior: 'contain',
    marginBlock: `calc(-1 * ${t['--os-space-1']})`, marginInline: `calc(-1 * ${t['--os-space-5']})`,
    paddingBlock: t['--os-space-1'], paddingInline: t['--os-space-5'],
  },
  bodyCompact: { gap: t['--os-space-3'], marginInline: `calc(-1 * ${t['--os-space-4']})`, paddingInline: t['--os-space-4'] },
  /** A body that must not scroll (a drawer resting on a snap point, so swipes move the drawer). */
  bodyStill: { overflowY: 'clip', overscrollBehavior: 'auto' },
  footer: {
    display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: t['--os-space-2'], flexShrink: 0,
    flexDirection: { default: 'row', '@media (max-width: 479px)': 'column' },
    alignItems: { default: 'center', '@media (max-width: 479px)': 'stretch' },
  },
  /** The centered media layout keeps full-width stacked actions. */
  footerStacked: { display: 'grid', justifyContent: 'stretch', alignItems: 'stretch', gap: t['--os-space-2'] },
  /** Close button position: centered on the 24px title line, 16 from the edges. */
  close: { position: 'absolute', insetBlockStart: t['--os-space-4'], insetInlineEnd: t['--os-space-4'], zIndex: 1 },
  /** Compact: a 24 button centered on the 20px title line (16 padding less 2), 12 from the edge. */
  closeCompact: { insetBlockStart: `calc(${t['--os-space-4']} - ${t['--os-space-0-5']})`, insetInlineEnd: t['--os-space-3'] },
});

export type PanelLayoutProps = {
  title?: ReactNode;
  description?: ReactNode;
  /** A close button element; the layout positions it at the top end. */
  close?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  compact?: boolean;
  centered?: boolean;
  /** Content above the header (a thumbnail). */
  lead?: ReactNode;
  /** Extra styles for the body (for example `panelStyles.bodyStill`). */
  bodyStyle?: stylex.StyleXStyles;
  /** Id for the description, so the dialog can point `aria-describedby` at it (React Aria links it only for alert dialogs). */
  descriptionId?: string;
};

/** Renders the header, body and footer of a panel. Put it inside a React Aria Dialog styled with `panelStyles.frame`. */
export function PanelLayout({ title, description, close, footer, children, compact = false, centered = false, lead, bodyStyle, descriptionId }: PanelLayoutProps) {
  const hasBody = children !== undefined && children !== null && children !== false;
  return <>
    {close && <div {...stylex.props(panelStyles.close, compact && panelStyles.closeCompact)}>{close}</div>}
    {lead}
    {(title || description) && <div {...stylex.props(panelStyles.heading, centered && panelStyles.headingCentered, !!close && (compact ? panelStyles.headingClearCompact : panelStyles.headingClear))}>
      {title && <Heading slot="title" {...stylex.props(overlayStyles.title, compact && panelStyles.titleCompact)}>{title}</Heading>}
      {description && <Text slot="description" id={descriptionId} {...stylex.props(overlayStyles.description, compact && panelStyles.descriptionCompact)}>{description}</Text>}
    </div>}
    {hasBody && <div {...stylex.props(panelStyles.body, compact && panelStyles.bodyCompact, bodyStyle)}>{children}</div>}
    {footer && <div {...stylex.props(panelStyles.footer, centered && panelStyles.footerStacked)}>{footer}</div>}
  </>;
}

/** Joins a StyleX class with a caller's class, and a StyleX inline style with a caller's style. */
export function mergeSurfaceProps(sx: { className?: string; style?: CSSProperties }, className?: string, style?: CSSProperties) {
  return {
    className: [sx.className, className].filter(Boolean).join(' '),
    style: sx.style || style ? { ...sx.style, ...style } : undefined,
  };
}

/**
 * Dialog and AlertDialog windows (spec 1.9): a column that never leaves the viewport (the backdrop
 * pads it by 16), 400 wide by default, 320 / 400 / 560 by size. Pair with `overlayStyles.surface`.
 */
export const windowStyles = stylex.create({
  window: { display: 'flex', flexDirection: 'column', width: 'min(400px, 100%)', maxHeight: 'calc(100dvh - 32px)', overflow: 'hidden' },
  sm: { width: 'min(320px, 100%)' },
  md: { width: 'min(400px, 100%)' },
  lg: { width: 'min(560px, 100%)' },
});

/** Anything `stylex.props` accepts: a style, an array of styles, or a falsy value. */
export type StyleArg = stylex.StyleXStyles;

export type ModalShellProps = OpenProps & PortalProps & {
  /** The element that opens the modal. Leave it out to control the modal with `isOpen`. */
  trigger?: ReactNode;
  /** Close when the backdrop is pressed. */
  isDismissable?: boolean;
  /** Ignore Escape. */
  isKeyboardDismissDisabled?: boolean;
  /** Static StyleX styles for the backdrop layer, merged after `overlayStyles.overlay`. */
  overlayStyle?: stylex.StyleXStyles;
  /** The surface's StyleX styles for each animation state. Return static styles (render-prop classNames drop dynamic ones). */
  surfaceStyle: (state: { isEntering: boolean; isExiting: boolean }) => StyleArg;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLDivElement>;
  /** The React Aria Dialog inside the surface. */
  children: ReactNode;
};

/**
 * A modal layer (Dialog, AlertDialog, Sheet): the backdrop (bg-overlay, --os-z-modal, fade in over
 * --os-motion-popup, fade out over 160ms) and the surface, opened by `trigger` or by `isOpen`.
 * `className`, `style` and `ref` go to the surface.
 */
export function ModalShell({
  trigger, isOpen, defaultOpen, onOpenChange, portalContainer, isDismissable, isKeyboardDismissDisabled,
  overlayStyle, surfaceStyle, className, style, ref, children,
}: ModalShellProps) {
  const layer = (open: OpenProps) => (
    <ModalOverlay
      {...open}
      isDismissable={isDismissable}
      isKeyboardDismissDisabled={isKeyboardDismissDisabled}
      UNSTABLE_portalContainer={portalContainer}
      className={({ isExiting }) => stylex.props(overlayStyles.overlay, overlayStyle, overlayStyles.animateIn, isExiting && overlayStyles.exit).className ?? ''}
    >
      <Modal
        ref={ref}
        style={style}
        className={({ isEntering, isExiting }) => [stylex.props(surfaceStyle({ isEntering, isExiting })).className, className].filter(Boolean).join(' ')}
      >
        {children}
      </Modal>
    </ModalOverlay>
  );
  if (trigger === undefined || trigger === null) return layer({ isOpen, defaultOpen, onOpenChange });
  return (
    <DialogTrigger isOpen={isOpen} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <TriggerSlot>{trigger}</TriggerSlot>
      {layer({})}
    </DialogTrigger>
  );
}

export function PanelHeading({ title, description }: { title: ReactNode; description?: ReactNode }) {
  return <div {...stylex.props(overlayStyles.heading)}>
    <Heading slot="title" {...stylex.props(overlayStyles.title)}>{title}</Heading>
    {description && <Text slot="description" {...stylex.props(overlayStyles.description)}>{description}</Text>}
  </div>;
}

export type PlacementProps = Pick<AriaPopoverProps, 'placement' | 'offset'>;

export type MenuPopupProps = PlacementProps & PortalProps & Omit<AriaMenuProps<object>, 'className' | 'style'> & {
  /** Extra StyleX styles merged after the menu list's own (for example a different gap). */
  menuStyle?: stylex.StyleXStyles;
  /** Extra StyleX styles merged after the popover surface's own. */
  popoverStyle?: stylex.StyleXStyles;
};

export function MenuPopup({ placement, offset, portalContainer, menuStyle, popoverStyle, ...menu }: MenuPopupProps) {
  return <AriaPopover placement={placement} offset={offset} UNSTABLE_portalContainer={portalContainer} className={({ isExiting, placement }) => stylex.props(overlayStyles.surface, overlayStyles.popup, overlayStyles.popupMotion, popupPlacement(placement), popoverStyle, isExiting && overlayStyles.exit).className ?? ''}>
    <AriaMenu {...menu} {...stylex.props(overlayStyles.menu, menuStyle)} />
  </AriaPopover>;
}

export function TriggeredMenu({ trigger, isOpen, defaultOpen, onOpenChange, kind, ...menu }: OpenProps & MenuPopupProps & { trigger: ReactNode; kind: 'press' | 'contextMenu' }) {
  return <MenuTrigger trigger={kind} isOpen={isOpen} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
    {trigger}
    <MenuPopup {...menu} />
  </MenuTrigger>;
}

export type Edge = 'top' | 'right' | 'bottom' | 'left';
