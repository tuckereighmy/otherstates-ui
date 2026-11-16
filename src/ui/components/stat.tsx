'use client';

import * as stylex from '@stylexjs/stylex';
import type { CSSProperties, ReactNode, Ref } from 'react';
import { tokens as t } from '../tokens.stylex';
import { Sparkline } from './chart';
import { Icon } from './Icon';
import { withStyles } from './internal/class-name';
import { focusStyles } from './internal/states';
import { surfaceStyles } from './internal/surface';
import { RollingNumber } from './rolling-number';

// One number that matters on a dashboard (spec 1.21): what it counts, the figure, and what makes it mean
// something, which is a change since the last period, a limit, or a trend. A Stat with `onPress` is a
// button that opens the work behind the number, so every figure is one press from what it counts.

const reduce = '@media (prefers-reduced-motion: reduce)';
const canHover = '@media (hover: hover)';

const s = stylex.create({
  root: {
    display: 'grid', gap: t['--os-space-3'], alignContent: 'start', boxSizing: 'border-box', width: '100%', margin: 0,
    padding: t['--os-space-4'], textAlign: 'start', fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'],
    letterSpacing: t['--os-tracking-tight'],
  },
  // A pressable stat steps one fill toward fg on hover and once more while pressed (spec 1.8). bg-muted, not
  // bg-subtle: a filled stat sits on a bg-subtle section and must never hover onto its own background (1.6).
  // No press scale: it is a card, not a control. The button reset already removes the border, so an
  // `outline` stat keeps its hairline.
  pressable: {
    cursor: 'pointer',
    backgroundColor: {
      default: t['--os-color-bg-surface'],
      ':hover': { default: null, [canHover]: t['--os-color-bg-muted'] },
      ':active': t['--os-color-bg-interactive-secondary'],
    },
    transitionProperty: 'background-color', transitionDuration: { default: t['--os-motion-hover'], [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  head: { display: 'flex', alignItems: 'center', gap: t['--os-space-2'], minWidth: 0, minHeight: t['--os-line-height-md'] },
  dot: { width: 6, height: 6, flexShrink: 0, borderRadius: t['--os-radius-full'] },
  warning: { backgroundColor: t['--os-color-fg-warning'] },
  error: { backgroundColor: t['--os-color-fg-error'] },
  success: { backgroundColor: t['--os-color-fg-success'] },
  label: {
    flex: '1 1 auto', minWidth: 0, color: t['--os-color-fg-muted'], overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
  go: {
    display: 'flex', flexShrink: 0, color: t['--os-color-fg-subtle'],
    transitionProperty: 'transform, color', transitionDuration: { default: t['--os-motion-hover'], [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  figureRow: { display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', columnGap: t['--os-space-2'], minWidth: 0 },
  figure: {
    color: t['--os-color-fg-base'], fontSize: t['--os-font-size-2xl'], fontWeight: t['--os-font-weight-medium'],
    lineHeight: 1.1, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums',
  },
  unit: { color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-caption'], fontVariantNumeric: 'tabular-nums' },
  foot: {
    display: 'flex', alignItems: 'center', gap: t['--os-space-2'], minWidth: 0, minHeight: t['--os-line-height-md'],
    color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-caption'], fontVariantNumeric: 'tabular-nums',
  },
  caption: { flex: '1 1 auto', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  // Arrow and figure read like a badge's icon and label: a 14px icon, 4 apart.
  change: { display: 'inline-flex', alignItems: 'center', gap: t['--os-space-1'], flexShrink: 0, fontWeight: t['--os-font-weight-medium'] },
  good: { color: t['--os-color-fg-success'] },
  bad: { color: t['--os-color-fg-error'] },
  flat: { color: t['--os-color-fg-muted'] },
  track: { position: 'relative', height: 4, overflow: 'hidden', borderRadius: t['--os-radius-full'], backgroundColor: t['--os-color-bg-muted'] },
  fill: {
    position: 'absolute', insetBlock: 0, insetInlineStart: 0, borderRadius: t['--os-radius-full'], backgroundColor: t['--os-color-accent-moderate'],
    transitionProperty: 'width, background-color', transitionDuration: { default: t['--os-motion-slow'], [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  fillWarning: { backgroundColor: t['--os-color-fg-warning'] },
  fillError: { backgroundColor: t['--os-color-fg-error'] },
  width: (percent: number) => ({ width: `${percent}%` }),
});

export type StatTone = 'neutral' | 'warning' | 'error' | 'success';

export type StatChange = {
  /** "12%", "+3", "−$4.10". */
  label: ReactNode;
  direction: 'up' | 'down' | 'flat';
  /** Whether the change is good news. Default: up is good. Set it for numbers where less is better. */
  good?: boolean;
  /** What it is compared with, for assistive tech and the tooltip: "than yesterday". */
  against?: string;
};

export type StatProps = {
  ref?: Ref<HTMLElement>;
  /** What it counts: "Waiting on you". */
  label: ReactNode;
  /** The figure as it should read: "4", "$18.40", "94%". Changed digits roll into place. */
  value: string;
  /** Text after the figure: "of $40", "runs". */
  unit?: ReactNode;
  /** The change since the last period, in green or red with an arrow. */
  change?: StatChange;
  /** One quiet line in the foot: "Longest wait 22m". */
  caption?: ReactNode;
  /** A trend, oldest first, drawn as a sparkline at the foot. */
  trend?: number[];
  /** Describes the trend for assistive tech. */
  trendLabel?: string;
  /** Use of a limit, drawn as a thin bar: amber past 80%, red at 100%. */
  limit?: { value: number; max: number };
  /** A dot before the label for a number that needs attention. Default `neutral` (no dot). */
  tone?: StatTone;
  /** Makes the whole stat a button that opens the work behind the number. */
  onPress?: () => void;
  /** `filled` (default) for a bg-subtle section; `outline` for canvas. */
  variant?: 'filled' | 'outline';
  className?: string;
  style?: CSSProperties;
  id?: string;
};

/** One dashboard number: a label, the figure, and a change, limit or trend that gives it meaning. */
export function Stat({
  label, value, unit, change, caption, trend, trendLabel, limit, tone = 'neutral', onPress, variant = 'filled', className, style, id, ref,
}: StatProps) {
  const used = limit ? Math.min(100, Math.max(0, (limit.value / (limit.max || 1)) * 100)) : 0;
  const good = change ? change.good ?? change.direction !== 'down' : true;
  const content = (
    <>
      <span {...stylex.props(s.head)}>
        {tone !== 'neutral' && <span aria-hidden {...stylex.props(s.dot, s[tone])} />}
        <span {...stylex.props(s.label)}>{label}</span>
        {onPress && <span aria-hidden {...stylex.props(s.go)}><Icon name="arrow-right" size={16} /></span>}
      </span>
      <span {...stylex.props(s.figureRow)}>
        <RollingNumber value={value} {...stylex.props(s.figure)} />
        {unit && <span {...stylex.props(s.unit)}>{unit}</span>}
      </span>
      {limit && (
        <span {...stylex.props(s.track)} aria-hidden>
          <span {...stylex.props(s.fill, s.width(used), used >= 100 ? s.fillError : used >= 80 && s.fillWarning)} />
        </span>
      )}
      {trend && trend.length > 1 && <Sparkline values={trend} height={28} aria-label={trendLabel} />}
      {(caption || change) && (
        <span {...stylex.props(s.foot)}>
          {change && (
            <span {...stylex.props(s.change, change.direction === 'flat' ? s.flat : good ? s.good : s.bad)}>
              {change.direction !== 'flat' && <Icon name={change.direction === 'up' ? 'arrow-up' : 'arrow-down'} size={14} />}
              {change.label}
              {change.against && <span {...stylex.props(s.flat)}>&nbsp;{change.against}</span>}
            </span>
          )}
          {caption && <span {...stylex.props(s.caption)}>{caption}</span>}
        </span>
      )}
    </>
  );
  const surface = [surfaceStyles.surface, surfaceStyles.cardSurface, variant === 'outline' && surfaceStyles.outline, s.root];
  if (onPress) {
    return (
      <button
        ref={ref as Ref<HTMLButtonElement>}
        id={id}
        type="button"
        onClick={onPress}
        {...withStyles(stylex.props(...surface, s.pressable, focusStyles.ringVisible), className, style)}
      >
        {content}
      </button>
    );
  }
  return (
    <div ref={ref as Ref<HTMLDivElement>} id={id} {...withStyles(stylex.props(...surface), className, style)}>
      {content}
    </div>
  );
}
