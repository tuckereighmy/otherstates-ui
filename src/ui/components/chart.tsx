'use client';

import * as stylex from '@stylexjs/stylex';
import { useId, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { useLocale } from 'react-aria-components';
import { tokens as t } from '../tokens.stylex';
import { withClassName } from './internal/class-name';
import { focusStyles } from './internal/states';

// Charts (spec 1.18). Plain SVG drawn at the measured pixel width, so a 2px line stays 2px and a 4px
// corner stays round at any size. Marks wear the data color; every piece of text wears a text token.

const reduce = '@media (prefers-reduced-motion: reduce)';

/** The categorical slots, in a fixed order. Never cycled: a sixth series folds into "Other". */
const SLOTS = [1, 2, 3, 4, 5].map(slot => `var(--os-color-chart-${slot})`);
const ACCENT = 'var(--os-color-accent-moderate)';
/** A comparison line (last period, a target): gray and dashed, so it reads without color. */
const MUTED_LINE = 'var(--os-color-fg-disabled)';
/** Bars that step back so one can lead. */
const MUTED_FILL = 'var(--os-color-accent-dim)';
/** Rings and gaps are cut in the surface color. A chart on another surface sets --os-chart-surface. */
const SURFACE = 'var(--os-chart-surface, var(--os-color-bg-surface))';

const grow = stylex.keyframes({ from: { transform: 'scaleY(0)' }, to: { transform: 'none' } });
const fade = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });

const s = stylex.create({
  // 16px under the legend: the top tick sits half a line above the plot.
  root: { position: 'relative', display: 'grid', rowGap: t['--os-space-4'], minWidth: 0, fontFamily: t['--os-font-family'] },
  legend: {
    display: 'flex', flexWrap: 'wrap', columnGap: t['--os-space-4'], rowGap: t['--os-space-1'], margin: 0, padding: 0,
    listStyleType: 'none', fontSize: t['--os-font-size-xs'], lineHeight: t['--os-line-height-xs'], color: t['--os-color-fg-muted'],
  },
  legendItem: { display: 'inline-flex', alignItems: 'center', columnGap: t['--os-space-1-5'] },
  // A bar key is a bar's 4px data-end corner at key scale (half of radius-xs); a line key is a pill.
  keyBox: { display: 'block', width: 8, height: 8, borderRadius: 0, flexShrink: 0 },
  keyLine: { display: 'block', width: 12, height: 2, borderRadius: t['--os-radius-full'], flexShrink: 0 },
  frame: { display: 'grid', gridTemplateColumns: 'auto minmax(0, 1fr)', columnGap: t['--os-space-3'], minWidth: 0 },
  yAxis: {
    position: 'relative', fontSize: t['--os-font-size-xs'], lineHeight: t['--os-line-height-xs'],
    color: t['--os-color-fg-subtle'], textAlign: 'end', fontVariantNumeric: 'tabular-nums',
  },
  // In-flow copies size the column to the widest tick; the visible ticks sit on their gridlines.
  ySizer: { display: 'block', height: 0, overflow: 'hidden', visibility: 'hidden', whiteSpace: 'nowrap' },
  yTick: { position: 'absolute', insetInlineEnd: 0, transform: 'translateY(-50%)', whiteSpace: 'nowrap' },
  plot: { position: 'relative', minWidth: 0 },
  svg: { display: 'block', overflow: 'visible' },
  overlay: { position: 'absolute', inset: 0, borderRadius: t['--os-radius-sm'], touchAction: 'pan-y', WebkitTapHighlightColor: 'transparent' },
  xAxis: {
    position: 'relative', height: t['--os-line-height-xs'], marginTop: t['--os-space-2'], fontSize: t['--os-font-size-xs'],
    lineHeight: t['--os-line-height-xs'], color: t['--os-color-fg-subtle'], fontVariantNumeric: 'tabular-nums',
  },
  xTick: { position: 'absolute', top: 0, whiteSpace: 'nowrap', transform: 'translateX(-50%)' },
  xTickStart: { transform: 'none' },
  xTickEnd: { transform: 'translateX(-100%)' },
  gridLine: { stroke: t['--os-color-border-subtle'], strokeWidth: 1, shapeRendering: 'crispEdges' },
  baseline: { stroke: t['--os-color-border-muted'] },
  crosshair: { stroke: t['--os-color-border-muted'], strokeWidth: 1, shapeRendering: 'crispEdges' },
  line: { fill: 'none', strokeWidth: 2, strokeLinejoin: 'round', strokeLinecap: 'round' },
  sparkLine: { strokeWidth: 1.5 },
  dashed: { strokeDasharray: '4 4', strokeLinecap: 'butt' },
  dot: { strokeWidth: 2 },
  band: { fill: t['--os-color-bg-muted'] },
  valueLabel: { fill: t['--os-color-fg-base'], fontSize: t['--os-font-size-xs'], fontWeight: t['--os-font-weight-medium'], fontVariantNumeric: 'tabular-nums' },
  growIn: {
    transformBox: 'fill-box', transformOrigin: '50% 100%',
    animationName: { default: grow, [reduce]: 'none' }, animationDuration: t['--os-motion-slow'],
    animationTimingFunction: t['--os-ease-settle'], animationFillMode: 'both',
  },
  fadeIn: {
    animationName: { default: fade, [reduce]: 'none' }, animationDuration: t['--os-motion-slow'],
    animationTimingFunction: t['--os-ease-settle'], animationFillMode: 'both',
  },
  tooltip: {
    position: 'absolute', top: 0, zIndex: 1, boxSizing: 'border-box', minWidth: 132, pointerEvents: 'none',
    // 8 and 12 from the outer edge: the scale steps less the 1px hairline.
    paddingBlock: `calc(${t['--os-space-2']} - ${t['--os-stroke']})`, paddingInline: `calc(${t['--os-space-3']} - ${t['--os-stroke']})`,
    borderWidth: t['--os-stroke'], borderStyle: 'solid', borderColor: t['--os-color-border-subtle'],
    borderRadius: t['--os-radius-md'], backgroundColor: t['--os-color-bg-elevated'], boxShadow: t['--os-shadow-popup'],
    fontSize: t['--os-font-size-xs'], lineHeight: t['--os-line-height-xs'], color: t['--os-color-fg-base'], whiteSpace: 'nowrap',
  },
  tipTitle: { color: t['--os-color-fg-muted'], marginBottom: t['--os-space-1'] },
  tipRows: { display: 'grid', gridTemplateColumns: '12px auto minmax(0, 1fr)', alignItems: 'center', columnGap: t['--os-space-2'], rowGap: t['--os-space-0-5'] },
  tipValue: { fontWeight: t['--os-font-weight-medium'], fontVariantNumeric: 'tabular-nums', textAlign: 'end' },
  tipName: { color: t['--os-color-fg-muted'] },
  spark: { position: 'relative', display: 'block', width: '100%', minWidth: 0 },
  // Visually hidden. A <table> ignores width: 1, so the table sits inside this box rather than carrying it.
  sr: {
    position: 'absolute', insetBlockStart: 0, insetInlineStart: 0, width: 1, height: 1, padding: 0, margin: -1,
    overflow: 'hidden', clipPath: 'inset(50%)', whiteSpace: 'nowrap', borderWidth: 0,
  },
});

export interface ChartSeries {
  /** A stable key. Color follows the series, so keep the same order when a filter hides one. */
  id: string;
  /** Names the series in the legend, the readout and the data table. */
  label: string;
  /** One value per label, from zero up. */
  values: number[];
  /** A CSS color or `var(--os-…)` token. Overrides the slot. */
  color?: string;
  /** A comparison series (last period, a target): gray, and dashed on a line chart. */
  muted?: boolean;
}

interface ChartBaseProps {
  /** One label per position along the x axis. */
  labels: string[];
  /** Up to five colored series, plus any number of muted ones. */
  series: ChartSeries[];
  /** Names the chart for assistive technology and captions its data table. */
  'aria-label': string;
  /** Plot height in px, axes excluded. */
  height?: number;
  /** Formats values in the readout and data table. Ticks use a compact format past 10,000. */
  formatValue?: (value: number) => string;
  /** Hides the legend. It shows by default for two or more series. */
  hideLegend?: boolean;
  className?: string;
}

export interface LineChartProps extends ChartBaseProps {
  /** Washes the area under each line in its color. */
  area?: boolean;
  /** `smooth` bends through every point without overshooting it. */
  curve?: 'smooth' | 'linear';
}

export interface BarChartProps extends ChartBaseProps {
  /** Stacks several series in one bar. Off, they stand side by side. */
  stacked?: boolean;
  /** Leads with one bar (the current period): the rest step back and its value prints on its cap. */
  highlight?: number;
}

export function LineChart({ area = false, curve = 'smooth', ...props }: LineChartProps) {
  return <Chart kind="line" area={area} curve={curve} {...props} />;
}

export function BarChart({ stacked = false, highlight, ...props }: BarChartProps) {
  return <Chart kind="bar" stacked={stacked} highlight={highlight} {...props} />;
}

type ChartProps = ChartBaseProps & {
  kind: 'line' | 'bar';
  area?: boolean;
  curve?: 'smooth' | 'linear';
  stacked?: boolean;
  highlight?: number;
};

function Chart({ kind, labels, series, height = 200, formatValue, hideLegend = false, className, area, curve, stacked, highlight, ...props }: ChartProps) {
  const ariaLabel = props['aria-label'];
  const { locale } = useLocale();
  const id = useId();
  const [plotRef, width] = useWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);
  const [announce, setAnnounce] = useState('');
  const count = labels.length;
  const colors = useMemo(() => resolveColors(series, kind), [series, kind]);
  const format = useMemo(() => formatValue ?? ((value: number) => value.toLocaleString(locale)), [formatValue, locale]);
  const isStacked = kind === 'bar' && stacked && series.length > 1;

  const peak = Math.max(0, ...labels.map((_, index) => isStacked
    ? series.reduce((sum, item) => sum + (item.values[index] ?? 0), 0)
    : Math.max(0, ...series.map(item => item.values[index] ?? 0))));
  // A highlighted bar prints its value on its cap: give the scale another step if that label would leave the plot.
  const capValue = kind === 'bar' && highlight !== undefined && series.length === 1 && !series[0].color ? series[0].values[highlight] : undefined;
  const fitted = niceScale(peak);
  const scale = capValue !== undefined && (capValue / fitted.max) * height > height - 24 ? niceScale(fitted.max * 1.01) : fitted;
  const tickFormat = new Intl.NumberFormat(locale, scale.max >= 10000 ? { notation: 'compact', maximumFractionDigits: 1 } : { maximumFractionDigits: 2 });
  const yOf = (value: number) => height - (value / scale.max) * height;
  const slot = width / Math.max(1, count);
  const xOf = (index: number) => kind === 'bar' ? slot * (index + 0.5) : count <= 1 ? width / 2 : (index * width) / (count - 1);
  const indexAt = (px: number) => clamp(kind === 'bar' ? Math.floor(px / slot) : Math.round(px / (width / Math.max(1, count - 1))), 0, count - 1);

  const readout = (index: number) => `${labels[index]}: ${series.map(item => `${item.label} ${format(item.values[index] ?? 0)}`).join(', ')}`;
  const moveTo = (index: number | null, speak: boolean) => {
    setActive(index);
    if (speak) setAnnounce(index === null ? '' : readout(index));
  };

  const onPointer = (event: PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    moveTo(indexAt(event.clientX - box.left), false);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, () => number | null> = {
      ArrowRight: () => clamp((active ?? -1) + 1, 0, count - 1),
      ArrowLeft: () => clamp((active ?? count) - 1, 0, count - 1),
      Home: () => 0,
      End: () => count - 1,
      Escape: () => null,
    };
    const next = keys[event.key];
    if (!next) return;
    event.preventDefault();
    moveTo(next(), true);
  };

  // Thin crowded x labels on an even step, counting back from the latest so it always shows; then drop
  // any that would still touch a neighbor (the end labels align to the plot's edges, not their point).
  const longest = Math.max(1, ...labels.map(label => label.length));
  const spacing = kind === 'bar' ? slot : width / Math.max(1, count - 1);
  const every = Math.max(1, Math.ceil((longest * 7 + 16) / Math.max(1, spacing)));
  const anchorOf = (index: number) => kind === 'line' && count > 1 ? (index === 0 ? 'start' : index === count - 1 ? 'end' : 'middle') : 'middle';
  const shownTicks = new Set<number>();
  let edge = Infinity;
  for (let index = count - 1; index >= 0; index -= every) {
    const span = labels[index].length * 6.6;
    const anchor = anchorOf(index);
    const left = xOf(index) - (anchor === 'end' ? span : anchor === 'start' ? 0 : span / 2);
    if (left + span + 20 > edge) continue;
    shownTicks.add(index);
    edge = left;
  }

  const marks = width > 0 && count > 0 ? (kind === 'line'
    ? <LineMarks {...{ series, colors, area: !!area, curve: curve ?? 'smooth', xOf, yOf, height, id }} />
    : <BarMarks {...{ series, colors, stacked: !!isStacked, highlight, slot, xOf, yOf, height, format }} />) : null;

  const tipX = active === null ? 0 : xOf(active);
  const tipOnLeft = tipX > width / 2;

  return (
    <div className={withClassName(stylex.props(s.root), className)}>
      {series.length > 1 && !hideLegend && <Legend series={series} colors={colors} kind={kind} />}
      <div {...stylex.props(s.frame)}>
        <div aria-hidden="true" {...stylex.props(s.yAxis)} style={{ height }}>
          {scale.ticks.map(tick => <span key={`size-${tick}`} {...stylex.props(s.ySizer)}>{tickFormat.format(tick)}</span>)}
          {scale.ticks.map(tick => <span key={tick} {...stylex.props(s.yTick)} style={{ top: yOf(tick) }}>{tickFormat.format(tick)}</span>)}
        </div>
        <div ref={plotRef} {...stylex.props(s.plot)} style={{ height }}>
          {width > 0 && (
            <svg width={width} height={height} aria-hidden="true" {...stylex.props(s.svg)}>
              {scale.ticks.map(tick => {
                const y = Math.round(yOf(tick)) + (tick === 0 ? -0.5 : 0.5);
                return <line key={tick} x1={0} x2={width} y1={y} y2={y} {...stylex.props(s.gridLine, tick === 0 && s.baseline)} />;
              })}
              {kind === 'bar' && active !== null && (
                <rect x={slot * active + 2} width={Math.max(0, slot - 4)} y={0} height={height} rx={6} {...stylex.props(s.band)} />
              )}
              {kind === 'line' && active !== null && (
                <line x1={Math.round(tipX) + 0.5} x2={Math.round(tipX) + 0.5} y1={0} y2={height} {...stylex.props(s.crosshair)} />
              )}
              <g key={labels.join('|')}>{marks}</g>
              {kind === 'line' && active !== null && series.map((item, index) => (
                <circle key={item.id} cx={tipX} cy={yOf(item.values[active] ?? 0)} r={4} {...stylex.props(s.dot)} style={{ fill: colors[index], stroke: SURFACE }} />
              ))}
            </svg>
          )}
          <div
            tabIndex={0}
            role="group"
            aria-roledescription="chart"
            aria-label={`${ariaLabel}. Use the arrow keys to read each point.`}
            onPointerMove={onPointer}
            onPointerDown={onPointer}
            onPointerLeave={() => moveTo(null, false)}
            onKeyDown={onKeyDown}
            onFocus={event => { if (event.currentTarget.matches(':focus-visible') && active === null) moveTo(count - 1, true); }}
            onBlur={() => moveTo(null, false)}
            {...stylex.props(s.overlay, focusStyles.ringVisible)}
          />
          {active !== null && width > 0 && (
            <div aria-hidden="true" {...stylex.props(s.tooltip)} style={tipOnLeft ? { right: width - tipX + 12 } : { left: tipX + 12 }}>
              <div {...stylex.props(s.tipTitle)}>{labels[active]}</div>
              <div {...stylex.props(s.tipRows)}>
                {series.map((item, index) => (
                  <TipRow key={item.id} color={colors[index]} dashed={kind === 'line' && !!item.muted} value={format(item.values[active] ?? 0)} name={item.label} />
                ))}
              </div>
            </div>
          )}
        </div>
        <span />
        <div aria-hidden="true" {...stylex.props(s.xAxis)}>
          {width > 0 && labels.map((label, index) => shownTicks.has(index) && (
            <span key={label + index} {...stylex.props(s.xTick, anchorOf(index) === 'start' && s.xTickStart, anchorOf(index) === 'end' && s.xTickEnd)} style={{ left: xOf(index) }}>{label}</span>
          ))}
        </div>
      </div>
      <div {...stylex.props(s.sr)}><table>
        <caption>{ariaLabel}</caption>
        <thead><tr><td />{series.map(item => <th key={item.id} scope="col">{item.label}</th>)}</tr></thead>
        <tbody>
          {labels.map((label, index) => (
            <tr key={label + index}><th scope="row">{label}</th>{series.map(item => <td key={item.id}>{format(item.values[index] ?? 0)}</td>)}</tr>
          ))}
        </tbody>
      </table></div>
      <div aria-live="polite" {...stylex.props(s.sr)}>{announce}</div>
    </div>
  );
}

function LineMarks({ series, colors, area, curve, xOf, yOf, height, id }: {
  series: ChartSeries[]; colors: string[]; area: boolean; curve: 'smooth' | 'linear';
  xOf: (index: number) => number; yOf: (value: number) => number; height: number; id: string;
}) {
  const washes = series.filter(item => !item.muted).length;
  // Muted series draw first, so the lead line sits on top.
  const order = series.map((item, index) => ({ item, index })).sort((a, b) => Number(!!b.item.muted) - Number(!!a.item.muted));
  return (
    <g {...stylex.props(s.fadeIn)}>
      {area && order.filter(({ item }) => !item.muted).map(({ item, index }) => {
        const points = item.values.map((value, at) => [xOf(at), yOf(value)] as const);
        const gradient = `${id}-wash-${index}`.replace(/:/g, '');
        return (
          <g key={`area-${item.id}`}>
            <defs>
              <linearGradient id={gradient} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" style={{ stopColor: colors[index], stopOpacity: washes > 1 ? 0.08 : 0.14 }} />
                <stop offset="1" style={{ stopColor: colors[index], stopOpacity: 0 }} />
              </linearGradient>
            </defs>
            <path d={`${pathFor(points, curve)} L${points[points.length - 1][0]},${height} L${points[0][0]},${height} Z`} style={{ fill: `url(#${gradient})` }} />
          </g>
        );
      })}
      {order.map(({ item, index }) => {
        const points = item.values.map((value, at) => [xOf(at), yOf(value)] as const);
        return <path key={item.id} d={pathFor(points, curve)} {...stylex.props(s.line, item.muted && s.dashed)} style={{ stroke: colors[index] }} />;
      })}
      {order.filter(({ item }) => !item.muted).map(({ item, index }) => {
        const last = item.values.length - 1;
        return <circle key={`end-${item.id}`} cx={xOf(last)} cy={yOf(item.values[last] ?? 0)} r={4} {...stylex.props(s.dot)} style={{ fill: colors[index], stroke: SURFACE }} />;
      })}
    </g>
  );
}

function BarMarks({ series, colors, stacked, highlight, slot, xOf, yOf, height, format }: {
  series: ChartSeries[]; colors: string[]; stacked: boolean; highlight?: number; slot: number;
  xOf: (index: number) => number; yOf: (value: number) => number; height: number; format: (value: number) => string;
}) {
  const groups = stacked ? 1 : series.length;
  // Bars stay 24px or thinner; whatever is left of the slot is air. Side-by-side bars keep a 2px gap.
  const barWidth = Math.max(2, Math.min(24, (slot * (groups > 1 ? 0.72 : 0.6) - (groups - 1) * 2) / groups));
  const groupWidth = barWidth * groups + (groups - 1) * 2;
  const leads = highlight !== undefined && series.length === 1 && !series[0].color;
  const count = series[0]?.values.length ?? 0;
  const bars: ReactNode[] = [];
  for (let index = 0; index < count; index += 1) {
    const left = xOf(index) - groupWidth / 2;
    if (stacked) {
      const top = series.reduce((last, item, at) => (item.values[index] ?? 0) > 0 ? at : last, -1);
      let sum = 0;
      series.forEach((item, at) => {
        const value = item.values[index] ?? 0;
        if (value <= 0) return;
        const bottom = yOf(sum) - (sum > 0 ? 2 : 0);
        sum += value;
        const d = barPath(left, yOf(sum), barWidth, bottom, at === top ? 4 : 0);
        if (d) bars.push(<path key={`${item.id}-${index}`} d={d} style={{ fill: colors[at] }} />);
      });
    } else {
      series.forEach((item, at) => {
        const fill = leads && index !== highlight ? MUTED_FILL : colors[at];
        const d = barPath(left + at * (barWidth + 2), yOf(item.values[index] ?? 0), barWidth, height, 4);
        if (d) bars.push(<path key={`${item.id}-${index}`} d={d} style={{ fill }} />);
      });
    }
  }
  const label = leads && highlight !== undefined && highlight < count ? (
    <text x={xOf(highlight)} y={yOf(series[0].values[highlight] ?? 0) - 8} textAnchor="middle" {...stylex.props(s.valueLabel)}>
      {format(series[0].values[highlight] ?? 0)}
    </text>
  ) : null;
  return <><g {...stylex.props(s.growIn)}>{bars}</g>{label && <g {...stylex.props(s.fadeIn)}>{label}</g>}</>;
}

function Legend({ series, colors, kind }: { series: ChartSeries[]; colors: string[]; kind: 'line' | 'bar' }) {
  return (
    <ul {...stylex.props(s.legend)}>
      {series.map((item, index) => (
        <li key={item.id} {...stylex.props(s.legendItem)}>
          {kind === 'line'
            ? <span aria-hidden="true" {...stylex.props(s.keyLine)} style={keyStyle(colors[index], !!item.muted)} />
            : <span aria-hidden="true" {...stylex.props(s.keyBox)} style={{ backgroundColor: colors[index] }} />}
          {item.label}
        </li>
      ))}
    </ul>
  );
}

function TipRow({ color, dashed, value, name }: { color: string; dashed: boolean; value: string; name: string }) {
  return (
    <>
      <span aria-hidden="true" {...stylex.props(s.keyLine)} style={keyStyle(color, dashed)} />
      <span {...stylex.props(s.tipValue)}>{value}</span>
      <span {...stylex.props(s.tipName)}>{name}</span>
    </>
  );
}

const keyStyle = (color: string, dashed: boolean) => dashed
  ? { backgroundImage: `repeating-linear-gradient(90deg, ${color} 0 4px, transparent 4px 7px)` }
  : { backgroundColor: color };

export interface SparklineProps {
  /** The trend, oldest first. Twelve points read best. */
  values: number[];
  /** Describes the trend. Without it the sparkline is decorative and hidden from assistive technology. */
  'aria-label'?: string;
  /** Height in px. */
  height?: number;
  className?: string;
}

/** A small trend line: the history steps back in gray, the latest point is an accent dot. No axes. */
export function Sparkline({ values, height = 32, className, ...props }: SparklineProps) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const id = useId().replace(/:/g, '');
  const label = props['aria-label'];
  const min = Math.min(...values);
  const span = Math.max(...values) - min || 1;
  const inset = 5; // the end dot's radius and ring stay inside the box
  const points = values.map((value, index) => [
    values.length <= 1 ? width / 2 : inset + (index * (width - inset * 2)) / (values.length - 1),
    inset + (1 - (value - min) / span) * (height - inset * 2),
  ] as const);
  const line = width > 0 && points.length > 1 ? pathFor(points, 'smooth') : '';
  const last = points[points.length - 1];
  return (
    <div ref={ref} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}
      className={withClassName(stylex.props(s.spark), className)} style={{ height }}>
      {line && (
        <svg width={width} height={height} {...stylex.props(s.svg, s.fadeIn)}>
          <defs>
            <linearGradient id={`${id}-wash`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" style={{ stopColor: ACCENT, stopOpacity: 0.1 }} />
              <stop offset="1" style={{ stopColor: ACCENT, stopOpacity: 0 }} />
            </linearGradient>
          </defs>
          <path d={`${line} L${last[0]},${height} L${points[0][0]},${height} Z`} style={{ fill: `url(#${id}-wash)` }} />
          <path d={line} {...stylex.props(s.line, s.sparkLine)} style={{ stroke: MUTED_LINE }} />
          <circle cx={last[0]} cy={last[1]} r={3} {...stylex.props(s.dot)} style={{ fill: ACCENT, stroke: SURFACE }} />
        </svg>
      )}
    </div>
  );
}

function resolveColors(series: ChartSeries[], kind: 'line' | 'bar') {
  const leads = series.filter(item => !item.muted && !item.color).length;
  let slot = 0;
  return series.map(item => {
    if (item.color) return item.color;
    if (item.muted) return kind === 'bar' ? MUTED_FILL : MUTED_LINE;
    if (leads === 1) return ACCENT;
    const color = SLOTS[slot] ?? MUTED_LINE;
    slot += 1;
    return color;
  });
}

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    setWidth(element.getBoundingClientRect().width);
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return [ref, width] as const;
}

/** Four even intervals on a round step, from zero to at least `peak`. */
function niceScale(peak: number) {
  const step = niceStep(peak / 4);
  return { max: step * 4, ticks: [0, 1, 2, 3, 4].map(index => index * step) };
}

/** A round step of at least `raw`: 1, 1.5, 2, 2.5, 3, 4, 5 or 8 times a power of ten. */
function niceStep(raw: number) {
  const power = 10 ** Math.floor(Math.log10(raw || 1));
  return ([1, 1.5, 2, 2.5, 3, 4, 5, 8, 10].find(multiple => multiple * power >= raw) ?? 10) * power;
}

/** A path through the points. `smooth` uses monotone tangents, so the curve never overshoots a value. */
function pathFor(points: ReadonlyArray<readonly [number, number]>, curve: 'smooth' | 'linear') {
  if (points.length === 0) return '';
  if (curve === 'linear' || points.length < 3) return points.map(([x, y], index) => `${index ? 'L' : 'M'}${x},${y}`).join(' ');
  const slopes = points.slice(1).map(([x, y], index) => (y - points[index][1]) / (x - points[index][0] || 1));
  const tangents = points.map((_, index) => {
    if (index === 0) return slopes[0];
    if (index === points.length - 1) return slopes[slopes.length - 1];
    const before = slopes[index - 1];
    const after = slopes[index];
    if (before * after <= 0) return 0;
    // Steffen's limiter: never steeper than either neighbor, or than half their mean.
    return 2 * Math.sign(before) * Math.min(Math.abs(before), Math.abs(after), Math.abs(before + after) / 4);
  });
  let d = `M${points[0][0]},${points[0][1]}`;
  for (let index = 0; index < points.length - 1; index += 1) {
    const [x0, y0] = points[index];
    const [x1, y1] = points[index + 1];
    const third = (x1 - x0) / 3;
    d += ` C${x0 + third},${y0 + tangents[index] * third} ${x1 - third},${y1 - tangents[index + 1] * third} ${x1},${y1}`;
  }
  return d;
}

/** A bar with rounded corners at its data end and square corners on the baseline. */
function barPath(x: number, top: number, width: number, bottom: number, radius: number) {
  const height = bottom - top;
  if (height <= 0.5) return '';
  const r = Math.min(radius, width / 2, height);
  if (r <= 0) return `M${x},${bottom}V${top}H${x + width}V${bottom}Z`;
  return `M${x},${bottom}V${top + r}A${r},${r} 0 0 1 ${x + r},${top}H${x + width - r}A${r},${r} 0 0 1 ${x + width},${top + r}V${bottom}Z`;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
