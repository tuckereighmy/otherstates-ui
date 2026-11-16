'use client';

import * as stylex from '@stylexjs/stylex';
import {
  useCallback, useEffect, useLayoutEffect, useRef, useState,
  type ComponentPropsWithRef, type FocusEvent, type Ref,
} from 'react';
import { tokens as t } from '../tokens.stylex';
import { withClassName } from './internal/class-name';
import { focusStyles } from './internal/states';
import { surfaceStyles } from './internal/surface';

// ScrollArea (DESIGN_SPEC 2.2 ScrollArea): a native scroll container on a bg-surface fill, radius lg.
// Two boxes. The outer box owns the fill, the opt-in `bordered` hairline (spec 1.5), the height limit
// and the focus ring (spec 1.8). The inner viewport scrolls and, with `fade`, masks only its content,
// so the fill and the hairline stay crisp. The viewport takes keyboard focus only while it overflows.

export type ScrollAreaOrientation = 'vertical' | 'horizontal' | 'both';
export type ScrollAreaGutter = 'stable' | 'both-edges' | 'auto';

const FADE = 24;
// The mask only reads alpha, so any opaque token works as the "visible" stop.
const opaque = t['--os-color-fg-base'];
const fadeY = `linear-gradient(to bottom, transparent, ${opaque} var(--os-scroll-fade-top, 0px), ${opaque} calc(100% - var(--os-scroll-fade-bottom, 0px)), transparent)`;
const fadeX = `linear-gradient(to right, transparent, ${opaque} var(--os-scroll-fade-left, 0px), ${opaque} calc(100% - var(--os-scroll-fade-right, 0px)), transparent)`;

const s = stylex.create({
  root: { display: 'flex', flexDirection: 'column', minWidth: 0, maxWidth: '100%' },
  viewport: {
    flexGrow: 1, flexShrink: 1, flexBasis: 'auto', minWidth: 0, minHeight: 0,
    borderRadius: t['--os-radius-lg'],
    outlineStyle: 'none',
    scrollbarWidth: 'thin',
    scrollbarColor: `${t['--os-color-fg-subtle']} transparent`,
  },
  // Inside the 1px hairline the viewport's corners sit 1px in (nesting rule, spec 1.3).
  viewportInset: { borderRadius: `calc(${t['--os-radius-lg']} - 1px)` },
  vertical: { overflowX: 'hidden', overflowY: 'auto' },
  horizontal: { overflowX: 'auto', overflowY: 'hidden' },
  both: { overflowX: 'auto', overflowY: 'auto' },
  gutterStable: { scrollbarGutter: 'stable' },
  gutterBoth: { scrollbarGutter: 'stable both-edges' },
  gutterAuto: { scrollbarGutter: 'auto' },
  contain: { overscrollBehavior: 'contain' },
  overscrollAuto: { overscrollBehavior: 'auto' },
  fadeVertical: { maskImage: fadeY },
  fadeHorizontal: { maskImage: fadeX },
  fadeBoth: { maskImage: `${fadeY}, ${fadeX}`, maskComposite: 'intersect' },
  maxHeight: (maxHeight: number | string) => ({ maxHeight }),
  padding: (padding: number | string) => ({ padding }),
});

export type ScrollAreaProps = ComponentPropsWithRef<'div'> & {
  /** The height the area grows to before it scrolls. Defaults to 160, or `none` for `horizontal`. */
  maxHeight?: number | string;
  /** Adds a 1px border-subtle hairline, for an area that sits straight on the canvas. */
  bordered?: boolean;
  /** The axes that scroll. The other axis clips. */
  orientation?: ScrollAreaOrientation;
  /** Fades the content out at each edge that has more to scroll to. */
  fade?: boolean;
  /** Space between the edge and the content. The content scrolls through it. */
  padding?: number | string;
  /** Reserves room for the vertical scrollbar so content does not shift when it appears. */
  gutter?: ScrollAreaGutter;
  /** `contain` stops a scroll that reaches the end from scrolling the page behind. */
  overscroll?: 'contain' | 'auto';
};

function assignRef<T>(ref: Ref<T> | undefined, value: T) {
  if (typeof ref === 'function') ref(value);
  else if (ref) ref.current = value;
}

function matchesFocusVisible(el: Element) {
  try { return el.matches(':focus-visible'); } catch { return true; }
}

/**
 * `className` and `style` go to the outer box: size the area there, for example to fill a flex column.
 * `ref` and every other prop go to the scrolling viewport, so `ref.current.scrollTo()` works.
 */
export function ScrollArea({
  maxHeight, bordered = false, orientation = 'vertical', fade = false, padding, gutter = 'stable', overscroll = 'contain',
  className, style, ref, onScroll, onFocus, onBlur, ...props
}: ScrollAreaProps) {
  const node = useRef<HTMLDivElement | null>(null);
  const [overflowing, setOverflowing] = useState(false);
  const [focusVisible, setFocusVisible] = useState(false);
  const setRef = useCallback((el: HTMLDivElement | null) => { node.current = el; assignRef(ref, el); }, [ref]);

  const measure = useCallback(() => {
    const el = node.current;
    if (!el) return;
    const maxY = el.scrollHeight - el.clientHeight;
    const maxX = el.scrollWidth - el.clientWidth;
    const scrollsY = orientation !== 'horizontal' && maxY > 1;
    const scrollsX = orientation !== 'vertical' && maxX > 1;
    setOverflowing(scrollsY || scrollsX);
    if (!fade) return;
    const top = scrollsY ? Math.min(FADE, el.scrollTop) : 0;
    const bottom = scrollsY ? Math.min(FADE, maxY - el.scrollTop) : 0;
    const fromLeft = getComputedStyle(el).direction === 'rtl' ? maxX + el.scrollLeft : el.scrollLeft;
    const left = scrollsX ? Math.min(FADE, fromLeft) : 0;
    const right = scrollsX ? Math.min(FADE, maxX - fromLeft) : 0;
    el.style.setProperty('--os-scroll-fade-top', `${Math.max(0, top)}px`);
    el.style.setProperty('--os-scroll-fade-bottom', `${Math.max(0, bottom)}px`);
    el.style.setProperty('--os-scroll-fade-left', `${Math.max(0, left)}px`);
    el.style.setProperty('--os-scroll-fade-right', `${Math.max(0, right)}px`);
  }, [orientation, fade]);

  // Content can change without the area changing size, so re-measure after every render too.
  useLayoutEffect(measure);

  useEffect(() => {
    const el = node.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    for (const child of Array.from(el.children)) observer.observe(child);
    return () => observer.disconnect();
  }, [measure]);

  const axis = orientation === 'horizontal' ? s.horizontal : orientation === 'both' ? s.both : s.vertical;
  const fadeStyle = fade && (orientation === 'horizontal' ? s.fadeHorizontal : orientation === 'both' ? s.fadeBoth : s.fadeVertical);
  const gutterStyle = orientation === 'horizontal' || gutter === 'auto' ? s.gutterAuto : gutter === 'both-edges' ? s.gutterBoth : s.gutterStable;

  const rootStyles = stylex.props(
    surfaceStyles.surface, s.root,
    bordered && surfaceStyles.outline,
    s.maxHeight(maxHeight ?? (orientation === 'horizontal' ? 'none' : 160)),
    focusVisible ? focusStyles.ring : focusStyles.none,
  );
  const viewportStyles = stylex.props(
    s.viewport, bordered && s.viewportInset, axis, gutterStyle,
    overscroll === 'auto' ? s.overscrollAuto : s.contain,
    padding != null && s.padding(padding),
    fadeStyle,
  );
  const role = props['aria-label'] || props['aria-labelledby'] ? 'region' : undefined;

  return (
    <div className={withClassName(rootStyles, className)} style={{ ...rootStyles.style, ...style }}>
      <div
        tabIndex={overflowing ? 0 : undefined}
        role={role}
        {...props}
        {...viewportStyles}
        ref={setRef}
        onScroll={event => { if (fade) measure(); onScroll?.(event); }}
        onFocus={(event: FocusEvent<HTMLDivElement>) => {
          if (event.target === event.currentTarget) setFocusVisible(matchesFocusVisible(event.currentTarget));
          onFocus?.(event);
        }}
        onBlur={(event: FocusEvent<HTMLDivElement>) => {
          if (event.target === event.currentTarget) setFocusVisible(false);
          onBlur?.(event);
        }}
      />
    </div>
  );
}
