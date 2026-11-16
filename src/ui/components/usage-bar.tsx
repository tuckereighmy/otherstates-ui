'use client';

import * as stylex from '@stylexjs/stylex';
import { useState, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { tokens as t } from '../tokens.stylex';
import { formatTokens } from './agent-format';
import { cardStyles as c } from './internal/agent-parts';
import { withStyles } from './internal/class-name';
import { focusStyles, pressStyles, transitionStyles } from './internal/states';
import { RollingNumber } from './rolling-number';

// One budget split into its parts: a context window by source, a run's cost by step, a rate limit by job
// (spec 1.19). Parts sit side by side in the chart colors, in the order given, with the unused budget as the
// empty track at the end; the outer ends follow the track's shape and the joins stay tight. A part can carry
// `pending`, the share of it that is about to go: that share is drawn hatched in the part's own color, so a
// person sees what an action will take before taking it. Sizes ease, and a part that drops to nothing narrows
// away rather than vanishing, so the parts after it slide over instead of jumping. Point at a part, in the bar
// or the key, to hold it while the rest fall back; the header then reads that part.

export type UsageColor = 1 | 2 | 3 | 4 | 5 | 'muted';

export type UsageSegment = {
  id: string;
  label: ReactNode;
  value: number;
  /** A chart color, 1 to 5, or `muted`. Default: the next chart color in order. */
  color?: UsageColor;
  /** Shown in the list key after the label, for example "Compacts first". */
  detail?: ReactNode;
  /** How much of `value` is about to be freed. Drawn hatched, as a preview, until `value` itself changes. */
  pending?: number;
};

const reduce = '@media (prefers-reduced-motion: reduce)';
const canHover = '@media (hover: hover)';
// The corner of a cut inside the bar and of a key swatch: half of radius-xs, so the joins of the cut pill stay
// tight and an 8 px key reads as a square, as the chart legend's key does (spec 1.18).
const joint = 0;

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-3'], minWidth: 0, width: '100%' },
  header: { display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', columnGap: t['--os-space-3'] },
  label: {
    color: t['--os-color-fg-base'], fontSize: t['--os-font-size-sm'], fontWeight: t['--os-font-weight-medium'],
    lineHeight: t['--os-line-height-md'], letterSpacing: t['--os-tracking-tight'],
  },
  value: {
    marginInlineStart: 'auto', display: 'inline-flex', gap: t['--os-space-1-5'], color: t['--os-color-fg-muted'],
    fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'], letterSpacing: t['--os-tracking-tight'],
    fontVariantNumeric: 'tabular-nums',
  },
  valueStrong: { color: t['--os-color-fg-base'], fontWeight: t['--os-font-weight-medium'] },
  track: { display: 'flex' },
  sm: { height: 6 },
  md: { height: 8 },
  lg: { height: 12 },
  xl: { height: t['--os-size-md'] },
  // Parts are spaced by a margin rather than the track's gap, so a part at zero takes its gap with it.
  part: {
    display: 'flex', overflow: 'hidden', minWidth: t['--os-space-0-5'], flexBasis: 0, flexShrink: 0,
    borderStartStartRadius: joint, borderEndStartRadius: joint, borderStartEndRadius: joint, borderEndEndRadius: joint,
    transitionProperty: 'flex-grow, margin-inline-start, min-width, opacity',
    transitionDuration: { default: `${t['--os-motion-slow']}, ${t['--os-motion-slow']}, ${t['--os-motion-slow']}, ${t['--os-motion-hover']}`, [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  spaced: { marginInlineStart: t['--os-space-0-5'] },
  gone: { minWidth: 0 },
  grow: (grow: number) => ({ flexGrow: grow }),
  startPill: { borderStartStartRadius: t['--os-radius-full'], borderEndStartRadius: t['--os-radius-full'] },
  endPill: { borderStartEndRadius: t['--os-radius-full'], borderEndEndRadius: t['--os-radius-full'] },
  startSoft: { borderStartStartRadius: t['--os-radius-sm'], borderEndStartRadius: t['--os-radius-sm'] },
  endSoft: { borderStartEndRadius: t['--os-radius-sm'], borderEndEndRadius: t['--os-radius-sm'] },
  // A part's two pieces: what stays, solid, and what is about to go, hatched in the same color.
  kept: {
    flexBasis: 0, flexShrink: 0, backgroundColor: 'currentColor',
    transitionProperty: 'flex-grow', transitionDuration: { default: t['--os-motion-slow'], [reduce]: '0ms' }, transitionTimingFunction: t['--os-ease-settle'],
  },
  pending: {
    flexBasis: 0, flexShrink: 0,
    backgroundColor: 'color-mix(in srgb, currentColor 18%, transparent)',
    backgroundImage: 'repeating-linear-gradient(-45deg, currentColor 0 1.5px, transparent 1.5px 4.5px)',
    transitionProperty: 'flex-grow', transitionDuration: { default: t['--os-motion-slow'], [reduce]: '0ms' }, transitionTimingFunction: t['--os-ease-settle'],
  },
  rest: { backgroundColor: t['--os-color-bg-muted'] },
  c1: { color: t['--os-color-chart-1'] },
  c2: { color: t['--os-color-chart-2'] },
  c3: { color: t['--os-color-chart-3'] },
  c4: { color: t['--os-color-chart-4'] },
  c5: { color: t['--os-color-chart-5'] },
  muted: { color: t['--os-color-fg-disabled'] },
  over: { color: t['--os-color-fg-error'] },

  list: { listStyleType: 'none', margin: 0, padding: 0, display: 'grid' },
  /** A key row: compact, 32 tall. */
  row: { display: 'flex', alignItems: 'center', gap: t['--os-space-2'], minHeight: t['--os-size-sm'], minWidth: 0 },
  swatch: { width: 8, height: 8, flexShrink: 0, borderRadius: joint, backgroundColor: 'currentColor' },
  rowLabel: {
    minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
    color: t['--os-color-fg-base'], fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'],
    letterSpacing: t['--os-tracking-tight'],
  },
  rowDetail: {
    color: t['--os-color-fg-subtle'], fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-sm'],
    letterSpacing: t['--os-tracking-tight'], whiteSpace: 'nowrap',
  },
  rowValue: {
    marginInlineStart: 'auto', flexShrink: 0, color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-sm'],
    lineHeight: t['--os-line-height-md'], letterSpacing: t['--os-tracking-tight'], fontVariantNumeric: 'tabular-nums',
  },
  restSwatch: {
    borderWidth: t['--os-stroke'], borderStyle: 'solid', borderColor: t['--os-color-border-muted'], boxSizing: 'border-box',
    backgroundColor: 'transparent',
  },

  // Keys as wash chips (spec 1.19): sm chips like every other chip, 32 tall, the control radius, padding 12, 13/18 500,
  // swatch, label and value 6 apart (the sm icon gap); chips sit 8 apart like buttons side by side.
  chips: { display: 'flex', flexWrap: 'wrap', gap: t['--os-space-2'] },
  chip: {
    display: 'inline-flex', alignItems: 'center', gap: t['--os-space-1-5'], height: t['--os-size-sm'], paddingInline: t['--os-space-3'],
    borderWidth: 0, borderRadius: t['--os-radius-control'], cursor: 'default', fontFamily: 'inherit',
    backgroundColor: { default: t['--os-color-bg-muted'], ':hover': { default: null, [canHover]: t['--os-color-bg-interactive-secondary'] } },
    color: t['--os-color-fg-base'], fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-sm'],
    fontWeight: t['--os-font-weight-medium'], letterSpacing: t['--os-tracking-tight'],
  },
  chipOn: { backgroundColor: t['--os-color-bg-interactive-secondary'] },
  chipValue: { color: t['--os-color-fg-muted'], fontWeight: t['--os-font-weight-regular'], fontVariantNumeric: 'tabular-nums' },
});

const hues = { 1: s.c1, 2: s.c2, 3: s.c3, 4: s.c4, 5: s.c5, muted: s.muted } as const;
const colorAt = (segment: UsageSegment, index: number) => hues[segment.color ?? (((index % 5) + 1) as 1 | 2 | 3 | 4 | 5)];

export type UsageBarProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  ref?: Ref<HTMLDivElement>;
  /** Names the budget: "Context window". Shown above the bar unless `hideLabel`. */
  label: string;
  hideLabel?: boolean;
  segments: UsageSegment[];
  /** The whole budget. Default: the sum of the segments, so the bar is full. */
  max?: number;
  /** Turns a number into text for the header and key. Default `formatTokens`. */
  format?: (value: number) => string;
  /** Replaces the header value ("175.6k of 200k"). */
  valueLabel?: ReactNode;
  /** Hides the header row (label and value), for a card that shows its own figure. */
  hideHeader?: boolean;
  /** `list` (default): a row per part with its value. `chips`: wash chips, for cards. `none`. */
  legend?: 'list' | 'chips' | 'none';
  /** @deprecated Use `legend="none"`. */
  showLegend?: boolean;
  /** Adds a key entry for what is left ("Free"). */
  restLabel?: ReactNode;
  /** Track height: 6, 8, 12 or 40 px. Default `md`. `xl` is the hero bar of a card. */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** The part held by pointing (controlled). `null` when none is. */
  active?: string | null;
  /** Called when pointing holds a part or lets go. */
  onActiveChange?: (id: string | null) => void;
};

/** A bar split into the parts of one budget, with a key. Point at a part to inspect it. */
export function UsageBar({
  label, hideLabel = false, segments, max, format = formatTokens, valueLabel, hideHeader = false, legend: legendProp,
  showLegend, restLabel, size = 'md', active, onActiveChange, className, style, ref, onPointerLeave, ...props
}: UsageBarProps) {
  const legend = legendProp ?? (showLegend === false ? 'none' : 'list');
  const [ownActive, setOwnActive] = useState<string | null>(null);
  const held = active === undefined ? ownActive : active;
  const hold = (id: string | null) => { setOwnActive(id); onActiveChange?.(id); };
  const used = segments.reduce((sum, segment) => sum + Math.max(0, segment.value), 0);
  const total = max ?? used;
  const over = max !== undefined && used > max;
  const heldSegment = segments.find(segment => segment.id === held);
  const first = segments.findIndex(segment => segment.value > 0);
  const last = segments.reduce((at, segment, index) => (segment.value > 0 ? index : at), -1);
  const hasRest = !over && total > used;
  const soft = size === 'xl';
  const summary = valueLabel ?? (heldSegment
    ? <><span>{heldSegment.label}</span><RollingNumber value={format(heldSegment.value)} {...stylex.props(s.valueStrong)} /></>
    : <RollingNumber value={max !== undefined ? `${format(used)} of ${format(max)}` : format(used)} />);

  return (
    <div
      ref={ref}
      role="group"
      aria-label={label}
      onPointerLeave={event => { onPointerLeave?.(event); hold(null); }}
      {...props}
      {...withStyles(stylex.props(s.root), className, style)}
    >
      {!hideHeader && (
        <div {...stylex.props(s.header)}>
          {!hideLabel && <span {...stylex.props(s.label)}>{label}</span>}
          <span {...stylex.props(s.value)}>{summary}</span>
        </div>
      )}
      <div aria-hidden {...stylex.props(s.track, s[size])}>
        {segments.map((segment, index) => {
          const value = Math.max(0, segment.value);
          const pending = Math.min(value, Math.max(0, segment.pending ?? 0));
          return (
            <span
              key={segment.id}
              onPointerEnter={() => hold(segment.id)}
              {...stylex.props(
                s.part, s.grow(value), over ? s.over : colorAt(segment, index),
                value > 0 ? index > first && s.spaced : s.gone,
                index === first && (soft ? s.startSoft : s.startPill),
                index === last && !hasRest && (soft ? s.endSoft : s.endPill),
                held != null && held !== segment.id && c.dim,
              )}
            >
              <span {...stylex.props(s.kept, s.grow(value - pending))} />
              <span {...stylex.props(s.pending, s.grow(pending))} />
            </span>
          );
        })}
        {hasRest && (
          <span
            onPointerEnter={() => hold(null)}
            {...stylex.props(s.part, s.rest, s.grow(total - used), first < 0 ? (soft ? s.startSoft : s.startPill) : s.spaced, soft ? s.endSoft : s.endPill)}
          />
        )}
      </div>
      {legend === 'list' && (
        <ul {...stylex.props(s.list)}>
          {segments.map((segment, index) => (
            <li
              key={segment.id}
              onPointerEnter={() => hold(segment.id)}
              {...stylex.props(s.row, c.dimmable, held != null && held !== segment.id && c.dim)}
            >
              <span aria-hidden {...stylex.props(s.swatch, colorAt(segment, index))} />
              <span {...stylex.props(s.rowLabel)}>{segment.label}</span>
              {segment.detail && <span {...stylex.props(s.rowDetail)}>{segment.detail}</span>}
              <span {...stylex.props(s.rowValue)}>{format(segment.value)}</span>
            </li>
          ))}
          {restLabel && hasRest && (
            <li {...stylex.props(s.row, c.dimmable, held != null && c.dim)}>
              <span aria-hidden {...stylex.props(s.swatch, s.restSwatch)} />
              <span {...stylex.props(s.rowLabel)}>{restLabel}</span>
              <span {...stylex.props(s.rowValue)}>{format(total - used)}</span>
            </li>
          )}
        </ul>
      )}
      {legend === 'chips' && (
        <div {...stylex.props(s.chips)}>
          {segments.map((segment, index) => (
            <button
              key={segment.id}
              type="button"
              aria-pressed={held === segment.id}
              onPointerEnter={() => hold(segment.id)}
              onFocus={() => hold(segment.id)}
              onBlur={() => hold(null)}
              {...stylex.props(s.chip, transitionStyles.colorsAndPress, pressStyles.scaleActive, focusStyles.ringVisible, held === segment.id && s.chipOn)}
            >
              <span aria-hidden {...stylex.props(s.swatch, colorAt(segment, index))} />
              {segment.label}
              <span {...stylex.props(s.chipValue)}>{format(segment.value)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
