'use client';

import * as stylex from '@stylexjs/stylex';
import { useCallback, useEffect, useRef, useState, type HTMLAttributes, type Ref, type RefObject } from 'react';
import { withStyles } from './internal/class-name';
import { SrOnly } from './internal/sr-only';

// A figure that counts its way to a new value (spec 1.19). The number inside the text is found and counted
// from what is on screen to the new value, at the new text's precision, so "24.4k" passes through 61k and
// 89k on its way to "102.6k" and the reader sees how far it traveled, not only where it landed. The count
// takes the layout duration on the settle curve, read from the theme, so a slower theme counts slower. When
// the words around the number change too ("980k" to "1.3M") it swaps at once: counting across a change of
// unit would show values that never existed. A new value mid-count starts from the figure on screen, and
// values that arrive faster than the count shorten it, so a live figure keeps up. A timer backs up the frames,
// so the text always lands on the exact value, even in a hidden tab. Reduced motion always swaps.

const s = stylex.create({
  root: { display: 'inline-flex', position: 'relative', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' },
});

type Parsed = { head: string; tail: string; value: number; decimals: number; grouped: boolean };

/** The one number in a figure and the words around it; null when there is none, or more than one. */
function parse(text: string): Parsed | null {
  const numbers = text.match(/-?\d[\d,]*(?:\.\d+)?/g);
  if (!numbers || numbers.length !== 1) return null;
  const raw = numbers[0];
  const at = text.indexOf(raw);
  const value = Number(raw.replace(/,/g, ''));
  if (!Number.isFinite(value)) return null;
  const dot = raw.indexOf('.');
  return { head: text.slice(0, at), tail: text.slice(at + raw.length), value, decimals: dot < 0 ? 0 : raw.length - dot - 1, grouped: raw.includes(',') };
}

const write = (shape: Parsed, value: number) =>
  shape.head
  + (shape.grouped
    ? value.toLocaleString('en-US', { minimumFractionDigits: shape.decimals, maximumFractionDigits: shape.decimals })
    : value.toFixed(shape.decimals))
  + shape.tail;

/** A CSS time ("420ms", ".42s") in milliseconds. */
const toMs = (time: string) => {
  const n = Number.parseFloat(time);
  return Number.isFinite(n) ? (time.trim().endsWith('ms') ? n : n * 1000) : 0;
};

/** A CSS cubic-bezier() as a function of progress, solved by Newton's method; linear when it can't be read. */
function curve(css: string): (x: number) => number {
  const points = /cubic-bezier\(([^)]+)\)/.exec(css)?.[1].split(',').map(Number);
  if (!points || points.length !== 4 || points.some(n => !Number.isFinite(n))) return x => x;
  const [x1, y1, x2, y2] = points;
  const at = (k: number, p1: number, p2: number) => ((1 - 3 * p2 + 3 * p1) * k + (3 * p2 - 6 * p1)) * k * k + 3 * p1 * k;
  const slope = (k: number, p1: number, p2: number) => 3 * (1 - 3 * p2 + 3 * p1) * k * k + 2 * (3 * p2 - 6 * p1) * k + 3 * p1;
  return x => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let k = x;
    for (let i = 0; i < 8; i++) {
      const d = slope(k, x1, x2);
      if (Math.abs(d) < 1e-6) break;
      k = Math.min(1, Math.max(0, k - (at(k, x1, x2) - x) / d));
    }
    return at(k, y1, y2);
  };
}

export type RollingNumberProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  ref?: Ref<HTMLSpanElement>;
  /** The figure as it should read: "175.6k", "$1.62", "74%". */
  value: string;
  /** @deprecated No effect: the figure counts toward its new value. */
  direction?: 'up' | 'down';
  /** @deprecated No effect: the figure counts toward its new value. */
  stagger?: number;
};

/** A figure that counts to its new value. */
export function RollingNumber({ value, direction, stagger, className, style, ref, ...props }: RollingNumberProps) {
  void direction;
  void stagger;
  const [shown, setShown] = useState(value);
  const onScreen = useRef(value);
  const lastChange = useRef(Number.NEGATIVE_INFINITY);
  const node = useRef<HTMLSpanElement | null>(null);
  const attach = useCallback((element: HTMLSpanElement | null) => {
    node.current = element;
    if (typeof ref === 'function') ref(element);
    else if (ref) (ref as RefObject<HTMLSpanElement | null>).current = element;
  }, [ref]);

  useEffect(() => {
    const show = (text: string) => { onScreen.current = text; setShown(text); };
    // Values that arrive faster than the count (a live cost ticking every second) count over the time since
    // the last one, so the figure keeps up instead of trailing.
    const now = performance.now();
    const since = now - lastChange.current;
    lastChange.current = now;
    const from = parse(onScreen.current);
    const to = parse(value);
    const element = node.current;
    const still = !element || document.hidden || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (still || !from || !to || from.head !== to.head || from.tail !== to.tail || from.value === to.value) { show(value); return; }
    const theme = getComputedStyle(element);
    const duration = Math.min(toMs(theme.getPropertyValue('--os-motion-layout')), since);
    if (duration < 1) { show(value); return; }
    const ease = curve(theme.getPropertyValue('--os-ease-settle'));
    let frame = 0;
    const land = () => { cancelAnimationFrame(frame); show(value); };
    const tick = (time: number) => {
      const progress = Math.min(1, Math.max(0, (time - now) / duration));
      show(progress >= 1 ? value : write(to, from.value + (to.value - from.value) * ease(progress)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    // Frames stop in a hidden or throttled tab; the figure still lands on the exact value.
    const fallback = window.setTimeout(land, duration + 50);
    const onVisibility = () => { if (document.hidden) land(); };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(fallback);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [value]);

  return (
    <span ref={attach} {...props} {...withStyles(stylex.props(s.root), className, style)}>
      <SrOnly>{value}</SrOnly>
      <span aria-hidden>{shown}</span>
    </span>
  );
}
