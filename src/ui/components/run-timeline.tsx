'use client';

import * as stylex from '@stylexjs/stylex';
import { useEffect, useRef, useState, type HTMLAttributes, type KeyboardEvent, type ReactNode, type Ref } from 'react';
import { tokens as t } from '../tokens.stylex';
import { formatCost, formatDuration, formatTokens } from './agent-format';
import { agentStateLabels, StatusDot, type AgentState } from './agent-status';
import { cardStyles as c, DetailTiles, type DetailItem } from './internal/agent-parts';
import { withStyles } from './internal/class-name';

// Where a run's time went (spec 1.21). Every step is a bar on one time axis: compute in gray, the step that
// is running in the accent, time spent waiting on a person as an amber wash, a failure in red. Point at a
// step to hold it (the rest fall back) and read its numbers underneath; press it to keep it there. With
// nothing held, the wash under the bars answers the first question about a slow run: which step, and how
// much of it was waiting on people.

const reduce = '@media (prefers-reduced-motion: reduce)';
/** The time column, wide enough for "12m 06s" in 13 px figures. Every row is its own grid, so it is fixed. */
const timeColumn = t['--os-space-14'];
const columns = `minmax(96px, 32%) minmax(0, 1fr) ${timeColumn}`;
/** Under this width the name and time sit on one line and the bar runs full width under them. */
const stackBelow = 440;
/** A bar is 8 tall, as UsageBar md, and never shorter than it is tall: the briefest step is a dot. */
const bar = '8px';

const grow = stylex.keyframes({ from: { transform: 'scaleX(0)' }, to: { transform: 'scaleX(1)' } });

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-2'], minWidth: 0, fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'] },
  // Every grid (axis, guides, rows) is inset 12, so a pinned row's wash has the same 12 px inline padding as every wash.
  grid: {
    display: 'grid', gridTemplateColumns: columns, columnGap: t['--os-space-3'], alignItems: 'center', minWidth: 0,
    boxSizing: 'border-box', paddingInline: t['--os-space-3'],
  },
  axis: { height: t['--os-line-height-xs'] },
  stacked: { gridTemplateColumns: `minmax(0, 1fr) ${timeColumn}` },
  span: { gridColumn: '1 / -1' },
  axisLane: { position: 'relative', height: '100%' },
  tick: {
    position: 'absolute', insetBlockStart: 0, transform: 'translateX(-50%)', whiteSpace: 'nowrap',
    color: t['--os-color-fg-subtle'], fontSize: t['--os-font-size-xs'], lineHeight: t['--os-line-height-xs'], fontVariantNumeric: 'tabular-nums',
  },
  tickFirst: { transform: 'none' },
  tickLast: { transform: 'translateX(-100%)' },
  body: { position: 'relative', minWidth: 0 },
  guides: { position: 'absolute', inset: 0, pointerEvents: 'none' },
  guideLane: { position: 'relative', height: '100%' },
  guide: { position: 'absolute', insetBlock: 0, width: t['--os-stroke'], backgroundColor: t['--os-color-border-subtle'] },
  now: { position: 'absolute', insetBlock: 0, width: t['--os-stroke'], backgroundColor: t['--os-color-accent-moderate'] },
  list: { position: 'relative', display: 'grid', margin: 0, padding: 0, listStyleType: 'none' },
  row: {
    width: '100%', minHeight: t['--os-size-sm'], margin: 0, paddingBlock: 0, borderWidth: 0, borderRadius: t['--os-radius-md'],
    backgroundColor: 'transparent', color: 'inherit', font: 'inherit', textAlign: 'start', cursor: 'pointer',
    outlineStyle: { default: 'none', ':focus-visible': 'solid' }, outlineWidth: 2, outlineOffset: -2, outlineColor: t['--os-color-focus-ring'],
  },
  pinned: { backgroundColor: t['--os-color-bg-muted'] },
  labelCell: { display: 'flex', alignItems: 'center', gap: t['--os-space-2'], minWidth: 0 },
  depth: (level: number) => ({ paddingInlineStart: `calc(${t['--os-space-4']} * ${level})` }),
  labelText: { minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: t['--os-color-fg-base'], letterSpacing: t['--os-tracking-tight'] },
  labelRunning: { fontWeight: t['--os-font-weight-medium'] },
  lane: { position: 'relative', height: t['--os-size-sm'] },
  laneStacked: { height: t['--os-space-4'], marginBlockEnd: t['--os-space-1'] },
  rowStacked: { rowGap: 0, paddingBlockStart: t['--os-space-1'] },
  bar: {
    position: 'absolute', insetBlock: 0, height: bar, marginBlock: 'auto', boxSizing: 'border-box',
    borderRadius: t['--os-radius-full'], transformOrigin: 'left center',
    animationName: { default: grow, [reduce]: 'none' }, animationDuration: t['--os-motion-slow'], animationTimingFunction: t['--os-ease-settle'],
    transitionProperty: 'inset-inline-start, width', transitionDuration: { default: t['--os-motion-slow'], [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  // A step still going grows with the clock, which ticks once a second: linear over that second, so it moves
  // without stopping (a formula duration, not a motion token).
  // A running bar grows between the one-second ticks, at a steady rate.
  barOpen: { transitionTimingFunction: 'linear', transitionDuration: { default: t['--os-motion-spin'], [reduce]: '0ms' } },
  place: (left: number, width: number) => ({ insetInlineStart: `${left}%`, width: `max(${bar}, ${width}%)` }),
  at: (left: number) => ({ insetInlineStart: `${left}%` }),
  done: { backgroundColor: `color-mix(in srgb, ${t['--os-color-fg-base']} 26%, transparent)` },
  running: { backgroundColor: t['--os-color-accent-moderate'] },
  waiting: { backgroundColor: t['--os-color-bg-warning'], boxShadow: `inset 0 0 0 1.5px ${t['--os-color-fg-warning']}` },
  failed: { backgroundColor: t['--os-color-fg-error'] },
  hollow: { backgroundColor: 'transparent', boxShadow: `inset 0 0 0 1.5px ${t['--os-color-fg-disabled']}` },
  duration: {
    textAlign: 'end', color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-sm'],
    letterSpacing: t['--os-tracking-tight'], fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap',
  },
  durationFailed: { color: t['--os-color-fg-error'] },
  // The readout under the bars is a wash (12 all round). Its height is the held step's, so swapping the two
  // readouts never moves the page.
  wash: {
    display: 'grid', gap: t['--os-space-3'], minHeight: `calc(${t['--os-space-12']} * 2)`, marginBlockStart: t['--os-space-2'],
  },
  washHead: { display: 'flex', alignItems: 'center', gap: t['--os-space-2'], minWidth: 0 },
  washTitle: { minWidth: 0, color: t['--os-color-fg-base'], fontWeight: t['--os-font-weight-medium'], letterSpacing: t['--os-tracking-tight'], overflowWrap: 'anywhere' },
  washMeta: { marginInlineStart: 'auto', flexShrink: 0 },
  sentence: { margin: 0 },
  strong: { color: t['--os-color-fg-base'], fontWeight: t['--os-font-weight-medium'] },
  detail: { overflowWrap: 'anywhere' },
});

export type TimelineSpan = {
  id: string;
  /** What the step did: "Run the tests". */
  label: string;
  /** The tool it called: "bash". */
  tool?: string;
  /** When it started, in ms after the run began. */
  start: number;
  /** How long it took, in ms. Leave it out while the step is still going: the bar then runs to `now`. */
  duration?: number;
  state: AgentState;
  /** Nesting under a sub-agent's step: 0 (default), 1 or 2. */
  depth?: number;
  tokens?: number;
  /** In US dollars. */
  cost?: number;
  /** The literal input or the error, shown when the step is held. */
  detail?: ReactNode;
  /** Time spent waiting on a person: an approval, an answer, a review. It keeps its amber wash after it ends. */
  waiting?: boolean;
};

export type RunTimelineProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  ref?: Ref<HTMLDivElement>;
  /** Names the timeline: "Steps of Fix the checkout crash". */
  label: string;
  spans: TimelineSpan[];
  /** How long the run has gone, in ms. Open steps end here. Default: the latest end. */
  now?: number;
  /** The pressed step (controlled). */
  selectedId?: string | null;
  defaultSelectedId?: string | null;
  onSelectionChange?: (id: string | null) => void;
  /** Hides the wash under the bars. */
  hideSummary?: boolean;
};

const steps = [1, 2, 5, 10, 15, 30, 60, 120, 300, 600, 900, 1800, 3600].map(seconds => seconds * 1000);

function axisFor(total: number, intervals: number) {
  const step = steps.find(size => total / size <= intervals) ?? Math.ceil(total / intervals / 3_600_000) * 3_600_000;
  const end = Math.max(step, Math.ceil(total / step) * step);
  const ticks: number[] = [];
  for (let at = 0; at <= end; at += step) ticks.push(at);
  return { end, ticks };
}

const isWaiting = (span: TimelineSpan) => span.waiting || span.state === 'needs-input';
const fill = (span: TimelineSpan) =>
  span.state === 'canceled' || span.state === 'skipped' ? s.hollow : isWaiting(span) ? s.waiting
    : span.state === 'running' ? s.running : span.state === 'failed' ? s.failed : span.state === 'done' ? s.done : s.hollow;

/** A run's steps on one time axis: where the time went, and what waited on a person. */
export function RunTimeline({
  label, spans, now: nowProp, selectedId, defaultSelectedId = null, onSelectionChange, hideSummary = false, className, style, ref, ...props
}: RunTimelineProps) {
  const [ownSelected, setOwnSelected] = useState<string | null>(defaultSelectedId);
  const [held, setHeld] = useState<string | null>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const box = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const node = box.current;
    if (!node || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  const stacked = width > 0 && width < stackBelow;
  // About one tick per 56 px of lane, so clock labels never touch.
  const laneWidth = stacked ? width : width * 0.68 - 80;
  const intervals = width ? Math.max(1, Math.min(5, Math.floor(laneWidth / 56))) : 5;
  const pinned = selectedId !== undefined ? selectedId : ownSelected;
  const latest = Math.max(1, ...spans.map(span => span.start + (span.duration ?? 0)));
  const now = Math.max(nowProp ?? latest, latest);
  const { end, ticks } = axisFor(now, intervals);
  const lengthOf = (span: TimelineSpan) => span.duration ?? Math.max(0, now - span.start);
  const open = spans.some(span => span.duration === undefined);
  const shown = spans.find(span => span.id === (held ?? pinned));
  const pct = (ms: number) => (ms / end) * 100;

  const select = (id: string | null) => {
    if (selectedId === undefined) setOwnSelected(id);
    onSelectionChange?.(id);
  };
  const move = (event: KeyboardEvent, index: number) => {
    const last = spans.length - 1;
    const to = event.key === 'ArrowDown' ? Math.min(last, index + 1) : event.key === 'ArrowUp' ? Math.max(0, index - 1)
      : event.key === 'Home' ? 0 : event.key === 'End' ? last : -1;
    if (to >= 0) { event.preventDefault(); buttons.current[to]?.focus(); }
    if (event.key === 'Escape' && (pinned || held)) { event.preventDefault(); select(null); setHeld(null); }
  };

  const guides = (
    <>
      {ticks.map(at => <span key={at} {...stylex.props(s.guide, s.at(pct(at)))} />)}
      {open && <span {...stylex.props(s.now, s.at(pct(now)))} />}
    </>
  );

  return (
    <div
      ref={node => {
        box.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      role="group"
      aria-label={label}
      {...props}
      {...withStyles(stylex.props(s.root), className, style)}
    >
      <div aria-hidden {...stylex.props(s.grid, stacked && s.stacked, s.axis)}>
        {!stacked && <span />}
        <span {...stylex.props(s.axisLane, stacked && s.span)}>
          {ticks.map((at, index) => (
            <span key={at} {...stylex.props(s.tick, s.at(pct(at)), index === 0 && s.tickFirst, index === ticks.length - 1 && s.tickLast)}>
              {formatDuration(at, 'clock')}
            </span>
          ))}
        </span>
        {!stacked && <span />}
      </div>

      <div {...stylex.props(s.body)} onPointerLeave={() => setHeld(null)}>
        {!stacked && (
          <div aria-hidden {...stylex.props(s.grid, s.guides)}>
            <span />
            <span {...stylex.props(s.guideLane)}>{guides}</span>
            <span />
          </div>
        )}
        <ol {...stylex.props(s.list)}>
          {spans.map((span, index) => {
            const length = lengthOf(span);
            const isOpen = span.duration === undefined;
            const dim = held !== null && held !== span.id;
            const took = isOpen ? `${isWaiting(span) ? 'waiting' : 'running'} for ${formatDuration(length)}` : `took ${formatDuration(length)}`;
            return (
              <li key={span.id} {...stylex.props(c.dimmable, dim && c.dim)}>
                <button
                  ref={node => { buttons.current[index] = node; }}
                  type="button"
                  aria-pressed={pinned === span.id}
                  aria-label={`${span.label}${span.tool ? `, ${span.tool}` : ''}. ${agentStateLabels[span.state]}. Started at ${formatDuration(span.start, 'clock')}, ${took}.`}
                  onPointerEnter={() => setHeld(span.id)}
                  onFocus={() => setHeld(span.id)}
                  onBlur={() => setHeld(null)}
                  onClick={() => select(pinned === span.id ? null : span.id)}
                  onKeyDown={event => move(event, index)}
                  {...stylex.props(s.grid, s.row, stacked && s.stacked, stacked && s.rowStacked, pinned === span.id && s.pinned)}
                >
                  <span {...stylex.props(s.labelCell, !!span.depth && s.depth(span.depth))}>
                    <StatusDot state={span.state} size="sm" />
                    <span {...stylex.props(s.labelText, span.state === 'running' && s.labelRunning)}>{span.label}</span>
                  </span>
                  {stacked && <span {...stylex.props(s.duration, span.state === 'failed' && s.durationFailed)}>{formatDuration(length)}</span>}
                  <span {...stylex.props(s.lane, stacked && s.laneStacked, stacked && s.span)}>
                    {stacked && <span aria-hidden>{guides}</span>}
                    <span {...stylex.props(s.bar, fill(span), isOpen && s.barOpen, s.place(pct(span.start), pct(length)))} />
                  </span>
                  {!stacked && <span {...stylex.props(s.duration, span.state === 'failed' && s.durationFailed)}>{formatDuration(length)}</span>}
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {!hideSummary && (shown ? <SpanWash span={shown} length={lengthOf(shown)} /> : <RunWash spans={spans} lengthOf={lengthOf} now={now} open={open} />)}
    </div>
  );
}

function SpanWash({ span, length }: { span: TimelineSpan; length: number }) {
  const items: DetailItem[] = [
    { label: 'Started at', value: formatDuration(span.start, 'clock') },
    { label: span.duration === undefined ? 'So far' : 'Took', value: formatDuration(length) },
  ];
  if (span.tokens !== undefined) items.push({ label: 'Tokens', value: formatTokens(span.tokens) });
  if (span.cost !== undefined) items.push({ label: 'Cost', value: formatCost(span.cost) });
  return (
    <div {...stylex.props(c.wash, c.washRich, s.wash)}>
      <div {...stylex.props(s.washHead)}>
        <StatusDot state={span.state} />
        <span {...stylex.props(s.washTitle)}>{span.label}</span>
        <span {...stylex.props(c.meta, s.washMeta)}>{[span.tool, agentStateLabels[span.state]].filter(Boolean).join(' · ')}</span>
      </div>
      <DetailTiles flat items={items} />
      {span.detail && <div {...stylex.props(c.meta, s.detail)}>{span.detail}</div>}
    </div>
  );
}

function RunWash({ spans, lengthOf, now, open }: { spans: TimelineSpan[]; lengthOf: (span: TimelineSpan) => number; now: number; open: boolean }) {
  const work = spans.filter(span => !isWaiting(span));
  const slowest = work.reduce<TimelineSpan | undefined>((best, span) => (!best || lengthOf(span) > lengthOf(best) ? span : best), undefined);
  const waited = spans.filter(isWaiting).reduce((sum, span) => sum + lengthOf(span), 0);
  const tokens = spans.reduce((sum, span) => sum + (span.tokens ?? 0), 0);
  const cost = spans.reduce((sum, span) => sum + (span.cost ?? 0), 0);
  const share = (ms: number) => `${Math.round((ms / Math.max(1, now)) * 100)}%`;
  const items: DetailItem[] = [
    { label: open ? 'So far' : 'Took', value: formatDuration(now) },
    { label: 'Steps', value: String(spans.length) },
  ];
  if (tokens) items.push({ label: 'Tokens', value: formatTokens(tokens) });
  if (cost) items.push({ label: 'Cost', value: formatCost(cost) });
  return (
    <div {...stylex.props(c.wash, c.washRich, s.wash)}>
      <DetailTiles flat items={items} />
      {slowest && (
        <p {...stylex.props(c.meta, s.sentence)}>
          Slowest step: <span {...stylex.props(s.strong)}>{slowest.label}</span>, {formatDuration(lengthOf(slowest))} ({share(lengthOf(slowest))} of the run).
          {waited > 0 && <> Waiting on people: <span {...stylex.props(s.strong)}>{formatDuration(waited)}</span> ({share(waited)}).</>}
        </p>
      )}
    </div>
  );
}
