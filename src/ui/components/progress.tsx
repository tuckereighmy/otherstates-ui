'use client';

import * as stylex from '@stylexjs/stylex';
import { useRef, useState, type ComponentPropsWithRef, type CSSProperties, type ReactNode, type Ref } from 'react';
import { ProgressBar as AriaProgressBar } from 'react-aria-components';
import { tokens as t } from '../tokens.stylex';
import { withClassName } from './internal/class-name';
import { focusStyles } from './internal/states';

const reduce = '@media (prefers-reduced-motion: reduce)';
const canHover = '@media (hover: hover)';

// ---------------------------------------------------------------------------------------------
// Progress: a determinate or indeterminate bar or ring on the bg-muted track.

const sweep = stylex.keyframes({ from: { transform: 'translateX(-100%)' }, to: { transform: 'translateX(250%)' } });
const spin = stylex.keyframes({ to: { transform: 'rotate(360deg)' } });

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-2'], width: '100%', minWidth: 0 },
  header: { display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', columnGap: t['--os-space-3'], rowGap: 0 },
  label: {
    color: t['--os-color-fg-base'], fontSize: t['--os-font-size-sm'], fontWeight: t['--os-font-weight-medium'], lineHeight: t['--os-line-height-md'],
    letterSpacing: t['--os-tracking-tight'],
  },
  value: {
    marginInlineStart: 'auto', color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-sm'], fontWeight: t['--os-font-weight-regular'],
    lineHeight: t['--os-line-height-md'], letterSpacing: t['--os-tracking-tight'], fontVariantNumeric: 'tabular-nums',
  },
  track: { position: 'relative', width: '100%', borderRadius: t['--os-radius-full'], overflow: 'hidden', backgroundColor: t['--os-color-bg-muted'] },
  fill: {
    height: '100%', borderRadius: t['--os-radius-full'], backgroundColor: t['--os-color-accent-moderate'],
    transitionProperty: 'width', transitionDuration: { default: t['--os-motion-slow'], [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  width: (width: string) => ({ width }),
  indeterminate: {
    width: '40%', transitionProperty: 'none',
    transform: { default: 'translateX(-100%)', [reduce]: 'translateX(75%)' },
    animationName: { default: sweep, [reduce]: 'none' }, animationDuration: `calc(${t['--os-motion-spin']} * 2)`,
    animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite',
  },
  brand: { backgroundImage: t['--os-gradient-progress'] },
  success: { backgroundColor: t['--os-color-fg-success'] },
  warning: { backgroundColor: t['--os-color-fg-warning'] },
  error: { backgroundColor: t['--os-color-fg-error'] },
  circleRoot: { display: 'inline-grid', justifyItems: 'center', gap: t['--os-space-2'], width: 'auto' },
  circle: { position: 'relative', display: 'inline-grid', placeItems: 'center', flexShrink: 0 },
  svg: { position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' },
  ring: { stroke: t['--os-color-bg-muted'] },
  ringFill: {
    stroke: t['--os-color-accent-moderate'], strokeLinecap: 'round', transformOrigin: '50% 50%', transform: 'rotate(-90deg)',
    transitionProperty: 'stroke-dasharray', transitionDuration: { default: t['--os-motion-slow'], [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  ringSpin: {
    transitionProperty: 'none',
    animationName: { default: spin, [reduce]: 'none' }, animationDuration: t['--os-motion-spin'],
    animationTimingFunction: 'linear', animationIterationCount: 'infinite',
  },
  ringSuccess: { stroke: t['--os-color-fg-success'] },
  ringWarning: { stroke: t['--os-color-fg-warning'] },
  ringError: { stroke: t['--os-color-fg-error'] },
  // The ring's figure is a numeric display (spec 1.4), like ScrubStepper and OtpField: 20/24 500 at -0.02em,
  // tabular. sm rings drop to 14/20.
  center: {
    position: 'relative', color: t['--os-color-fg-base'],
    // os-allow raw-type: spec 1.4 numeric display 20px (ScrubStepper, OtpField, Progress ring); the type scale has no 20px token
    fontSize: 20,
    fontWeight: t['--os-font-weight-medium'],
    lineHeight: t['--os-line-height-lg'], letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums',
  },
  centerSmall: { fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'], letterSpacing: t['--os-tracking-tight'] },
});

/** Bar track heights; md is the 6px track. */
const trackSizes = stylex.create({ sm: { height: 4 }, md: { height: 6 }, lg: { height: 8 } });
/** Ring diameters; md is the 120px ring. */
const circleSizes = stylex.create({ sm: { width: 64, height: 64 }, md: { width: 120, height: 120 }, lg: { width: 160, height: 160 } });
const ringGeometry = { sm: { box: 64, stroke: 4 }, md: { box: 120, stroke: 6 }, lg: { box: 160, stroke: 8 } } as const;
type ProgressSize = keyof typeof ringGeometry;
const sizeAliases: Record<string, ProgressSize> = { small: 'sm', medium: 'md', large: 'lg' };

export type ProgressProps = Omit<ComponentPropsWithRef<typeof AriaProgressBar>, 'children' | 'className' | 'style' | 'render' | 'valueLabel'> & {
  /** Names the task. It always names the progress bar; `showLabel` also shows it. */
  label: string;
  /** A bar, or a ring. */
  variant?: 'bar' | 'circular';
  /** Shows the label above the bar, or under the ring. */
  showLabel?: boolean;
  /** Shows the formatted value: at the end of the header for a bar, in the center of a ring. */
  showValue?: boolean;
  /** Replaces the formatted value, for example "3 of 8 files". A string is also read out by screen readers. */
  valueLabel?: ReactNode;
  /** Bar height (4, 6 or 8 px) or ring diameter (64, 120 or 160 px). `small`, `medium` and `large` are aliases. */
  size?: 'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large';
  /** The fill. `brand` is the product gradient (bars only; a ring falls back to `accent`). */
  tone?: 'accent' | 'brand' | 'success' | 'warning' | 'error';
  className?: string;
  style?: CSSProperties;
};

export function Progress({
  label, variant = 'bar', showLabel = false, showValue = false, valueLabel, size: sizeProp = 'md', tone = 'accent', className, style, ...props
}: ProgressProps) {
  const size: ProgressSize = sizeAliases[sizeProp] ?? (sizeProp as ProgressSize);
  const circular = variant === 'circular';
  const root = stylex.props(s.root, circular && s.circleRoot);
  return <AriaProgressBar {...props} valueLabel={typeof valueLabel === 'string' ? valueLabel : undefined}
    aria-label={props['aria-label'] ?? label} style={style} className={withClassName(root, className)}>
    {({ percentage = 0, valueText, isIndeterminate }) => {
      const text = isIndeterminate ? null : valueLabel ?? valueText;
      const labelNode = showLabel && <span {...stylex.props(s.label)}>{label}</span>;
      if (circular) {
        const { box, stroke } = ringGeometry[size] ?? ringGeometry.md;
        const radius = (box - stroke) / 2;
        return <>
          <div aria-hidden="true" {...stylex.props(s.circle, circleSizes[size])}>
            <svg viewBox={`0 0 ${box} ${box}`} {...stylex.props(s.svg)}>
              <circle cx={box / 2} cy={box / 2} r={radius} fill="none" strokeWidth={stroke} {...stylex.props(s.ring)} />
              <circle cx={box / 2} cy={box / 2} r={radius} fill="none" strokeWidth={stroke} pathLength={100}
                strokeDasharray={isIndeterminate ? '25 100' : `${percentage} 100`}
                {...stylex.props(
                  s.ringFill, isIndeterminate && s.ringSpin,
                  tone === 'success' && s.ringSuccess, tone === 'warning' && s.ringWarning, tone === 'error' && s.ringError,
                )} />
            </svg>
            {showValue && text != null && <span {...stylex.props(s.center, size === 'sm' && s.centerSmall)}>{text}</span>}
          </div>
          {labelNode && <div aria-hidden="true">{labelNode}</div>}
        </>;
      }
      return <>
        {(labelNode || (showValue && text != null)) && <div aria-hidden="true" {...stylex.props(s.header)}>
          {labelNode}
          {showValue && text != null && <span {...stylex.props(s.value)}>{text}</span>}
        </div>}
        <div aria-hidden="true" {...stylex.props(s.track, trackSizes[size])}>
          <div {...stylex.props(
            s.fill, isIndeterminate ? s.indeterminate : s.width(`${percentage}%`),
            tone === 'brand' && s.brand, tone === 'success' && s.success, tone === 'warning' && s.warning, tone === 'error' && s.error,
          )} />
        </div>
      </>;
    }}
  </AriaProgressBar>;
}

// ---------------------------------------------------------------------------------------------
// TaskChecklist: an xl card up to 320 wide with an 8px gradient bar and 36px rows 2px apart.
// Its geometry sits on the spacing scale: the rows are inset 12 and padded 8, so their text lands on the
// card's 20px padding line; colors, focus, states and motion tokens follow the spec.

const countUp = stylex.keyframes({ from: { translate: '0 100%', opacity: 0 }, to: { translate: '0 0', opacity: 1 } });
const countDown = stylex.keyframes({ from: { translate: '0 -100%', opacity: 0 }, to: { translate: '0 0', opacity: 1 } });
const checkPop = stylex.keyframes({ '0%': { scale: '.8' }, '100%': { scale: '1' } });
const shine = stylex.keyframes({ from: { backgroundPosition: '120% 0' }, to: { backgroundPosition: '-120% 0' } });
const spray = stylex.keyframes({ '0%': { opacity: 0, transform: 'translate(0,0) scale(1)' }, '12%': { opacity: 1 }, '100%': { opacity: 0, transform: 'translate(var(--particle-x),var(--particle-y)) scale(.2)' } });

const checklist = stylex.create({
  root: {
    boxSizing: 'border-box', width: '100%', maxWidth: 320,
    paddingTop: t['--os-space-5'], paddingInline: t['--os-space-3'], paddingBottom: t['--os-space-3'],
    borderRadius: t['--os-radius-xl'], backgroundColor: t['--os-color-bg-surface'], color: t['--os-color-fg-base'], fontFamily: t['--os-font-family'],
  },
  head: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: t['--os-space-3'], paddingInline: t['--os-space-2'] },
  title: {
    margin: 0, fontSize: t['--os-font-size-body'], lineHeight: t['--os-line-height-lg'], fontWeight: t['--os-font-weight-medium'],
    letterSpacing: t['--os-tracking-tight'],
  },
  count: {
    position: 'relative', fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'], letterSpacing: t['--os-tracking-tight'],
    color: t['--os-color-fg-muted'], fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap',
  },
  countDone: { color: 'transparent' },
  roll: { display: 'inline-block', overflow: 'hidden', lineHeight: t['--os-line-height-md'], verticalAlign: 'bottom' },
  rollIn: {
    display: 'inline-block', animationName: { default: countUp, [reduce]: 'none' }, animationDuration: t['--os-motion-layout'],
    animationTimingFunction: t['--os-ease-settle'], animationFillMode: 'both',
  },
  rollDown: { animationName: { default: countDown, [reduce]: 'none' } },
  done: { position: 'absolute', insetInlineEnd: 0, top: '50%', translate: '0 -50%', color: t['--os-color-fg-base'] },
  track: { position: 'relative', marginTop: t['--os-space-4'], marginInline: t['--os-space-2'], marginBottom: t['--os-space-3'] },
  bar: { position: 'relative', height: 8, overflow: 'hidden', borderRadius: t['--os-radius-full'], backgroundColor: t['--os-color-bg-muted'] },
  fill: {
    position: 'absolute', inset: 0, borderRadius: 'inherit', backgroundImage: t['--os-gradient-progress'],
    transitionProperty: 'clip-path', transitionDuration: { default: t['--os-motion-slow'], [reduce]: '1ms' }, transitionTimingFunction: t['--os-ease-settle'],
  },
  fillValue: (value: number) => ({ clipPath: `inset(0 ${100 - value}% 0 0 round ${t['--os-radius-full']})` }),
  shine: {
    position: 'absolute', inset: 0,
    backgroundImage: `linear-gradient(90deg, transparent 30%, color-mix(in srgb, ${t['--os-color-fg-static-light']} 55%, transparent) 50%, transparent 70%)`,
    backgroundSize: '220% 100%', backgroundRepeat: 'no-repeat',
    animationName: { default: shine, [reduce]: 'none' }, animationDuration: t['--os-motion-slow'], animationTimingFunction: t['--os-ease-settle'], animationFillMode: 'both',
  },
  list: { display: 'grid', gap: t['--os-space-0-5'], margin: 0, padding: 0, listStyle: 'none' },
  step: {
    position: 'relative', display: 'flex', alignItems: 'center', gap: t['--os-space-3'], width: '100%', padding: t['--os-space-2'],
    // Nesting rule: max(sm, the card's xl radius minus its 12px inset), 8 at the standard ladder.
    borderRadius: `max(${t['--os-radius-sm']}, calc(${t['--os-radius-xl']} - ${t['--os-space-3']}))`,
    backgroundColor: {
      default: 'transparent',
      ':hover:not(:disabled)': { default: null, [canHover]: t['--os-color-bg-interactive-primary'] },
      ':active:not(:disabled)': t['--os-color-bg-interactive-secondary'],
    },
    color: 'inherit', fontFamily: 'inherit', fontSize: t['--os-font-size-sm'], fontWeight: t['--os-font-weight-regular'], lineHeight: t['--os-line-height-md'],
    letterSpacing: t['--os-tracking-tight'], textAlign: 'start', cursor: { default: 'pointer', ':disabled': 'default' },
    transitionProperty: 'background-color', transitionDuration: { default: t['--os-motion-hover'], [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  stepDisabled: { color: t['--os-color-fg-disabled'] },
  check: {
    display: 'grid', placeItems: 'center', flexShrink: 0, width: 20, height: 20, borderRadius: t['--os-radius-full'],
    color: t['--os-color-accent-on-accent'], boxShadow: `inset 0 0 0 1.5px ${t['--os-color-border-control']}`,
    transitionProperty: 'background-color, box-shadow', transitionDuration: { default: t['--os-motion-popup'], [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  checkDisabled: { boxShadow: `inset 0 0 0 1.5px ${t['--os-color-border-disabled']}` },
  checked: {
    backgroundColor: t['--os-color-accent-moderate'], boxShadow: `inset 0 0 0 1.5px ${t['--os-color-accent-moderate']}`,
    animationName: { default: checkPop, [reduce]: 'none' }, animationDuration: t['--os-motion-layout'], animationTimingFunction: t['--os-ease-spring'],
  },
  checkedDisabled: { backgroundColor: t['--os-color-bg-disabled'], boxShadow: `inset 0 0 0 1.5px ${t['--os-color-border-disabled']}`, color: t['--os-color-fg-disabled'] },
  checkPath: {
    strokeDasharray: 1, strokeDashoffset: 1, transitionProperty: 'stroke-dashoffset',
    transitionDuration: { default: t['--os-motion-press'], [reduce]: '0ms' }, transitionTimingFunction: t['--os-ease-exit'],
  },
  checkDrawn: {
    strokeDashoffset: 0, transitionDuration: { default: t['--os-motion-popup'], [reduce]: '1ms' }, transitionTimingFunction: t['--os-ease-settle'],
    transitionDelay: { default: t['--os-motion-press'], [reduce]: '0ms' },
  },
  label: {
    flexGrow: 1, flexShrink: 1, flexBasis: 0, minWidth: 0, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden',
    transitionProperty: 'color', transitionDuration: { default: t['--os-motion-hover'], [reduce]: '0ms' }, transitionTimingFunction: t['--os-ease-settle'],
  },
  labelChecked: { color: t['--os-color-fg-muted'] },
  strike: {
    backgroundImage: 'linear-gradient(currentColor,currentColor)', backgroundPosition: '0 58%', backgroundSize: '0% 1.5px', backgroundRepeat: 'no-repeat',
    transitionProperty: 'background-size', transitionDuration: { default: t['--os-motion-layout'], [reduce]: '1ms' }, transitionTimingFunction: t['--os-ease-settle'],
  },
  struck: { backgroundSize: '100% 1.5px', transitionDelay: { default: t['--os-motion-hover'], [reduce]: '0ms' } },
  // Centered on the check: the row's 8px padding plus half the 20px check.
  particles: { position: 'absolute', pointerEvents: 'none', left: `calc(${t['--os-space-2']} + 10px)`, top: '50%', display: { default: 'block', [reduce]: 'none' } },
  particle: (x: number, y: number, delay: number) => ({
    '--particle-x': `${x}px`, '--particle-y': `${y}px`, position: 'absolute', left: -1.5, top: -1.5, width: 3, height: 3, borderRadius: t['--os-radius-full'],
    backgroundColor: t['--os-color-fg-base'], opacity: 0, animationName: spray, animationDuration: t['--os-motion-slow'],
    animationTimingFunction: t['--os-ease-settle'], animationDelay: `${delay}ms`, animationFillMode: 'both',
  }),
});

export type TaskChecklistProps = {
  /** The heading of the card; it also names the list and the bar. */
  title: string;
  /** The steps, in order. A disabled step cannot be checked or unchecked. */
  items: { id: string; label: string; disabled?: boolean }[];
  /** The checked step ids (controlled). */
  checkedKeys?: readonly string[];
  /** The checked step ids when uncontrolled. */
  defaultCheckedKeys?: readonly string[];
  onCheckedChange?: (keys: string[]) => void;
  /** Sprays a few particles from a step as it is checked. Off under reduced motion. */
  sparks?: boolean;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLElement>;
};

export function TaskChecklist({ title, items, checkedKeys, defaultCheckedKeys = [], onCheckedChange, sparks = true, className, style, ref }: TaskChecklistProps) {
  const [internal, setInternal] = useState([...defaultCheckedKeys]);
  const previousCount = useRef(defaultCheckedKeys.length);
  const down = useRef(false);
  const [burst, setBurst] = useState<{ key: string; time: number } | null>(null);
  const keys = checkedKeys ?? internal, count = items.filter(item => keys.includes(item.id)).length, all = items.length > 0 && count === items.length;
  if (previousCount.current !== count) { down.current = count < previousCount.current; previousCount.current = count; }
  const change = (id: string) => {
    const next = keys.includes(id) ? keys.filter(key => key !== id) : [...keys, id];
    if (checkedKeys === undefined) setInternal(next);
    onCheckedChange?.([...next]);
    if (next.includes(id)) setBurst({ key: id, time: Date.now() });
  };
  return <section ref={ref} style={style} className={withClassName(stylex.props(checklist.root), className)} aria-label={title}>
    <div {...stylex.props(checklist.head)}>
      <h3 {...stylex.props(checklist.title)}>{title}</h3>
      <span aria-hidden="true" {...stylex.props(checklist.count, all && checklist.countDone)}>
        <span {...stylex.props(checklist.roll)}><span key={count} {...stylex.props(checklist.rollIn, down.current && checklist.rollDown)}>{count}</span></span>/{items.length}
        {all && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...stylex.props(checklist.done)}><path d="m5 12 4 4L19 6" pathLength="1" {...stylex.props(checklist.checkPath, checklist.checkDrawn)} /></svg>}
      </span>
    </div>
    <div {...stylex.props(checklist.track)}>
      <div role="progressbar" aria-label={title} aria-valuemin={0} aria-valuemax={items.length} aria-valuenow={count} {...stylex.props(checklist.bar)}>
        <span {...stylex.props(checklist.fill, checklist.fillValue(items.length ? count / items.length * 100 : 0))}><span key={count} {...stylex.props(checklist.shine)} /></span>
      </div>
    </div>
    <ul {...stylex.props(checklist.list)}>{items.map((item, index) => {
      const checked = keys.includes(item.id);
      const off = !!item.disabled;
      return <li key={item.id}>
        <button type="button" role="checkbox" aria-checked={checked} disabled={off} onClick={() => change(item.id)}
          {...stylex.props(checklist.step, focusStyles.ringInsetVisible, off && checklist.stepDisabled)}>
          <span {...stylex.props(checklist.check, off && checklist.checkDisabled, checked && checklist.checked, checked && off && checklist.checkedDisabled)}>
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path pathLength="1" d="m5 12 4 4L19 6" {...stylex.props(checklist.checkPath, checked && checklist.checkDrawn)} /></svg>
          </span>
          <span {...stylex.props(checklist.label, checked && !off && checklist.labelChecked)}><span {...stylex.props(checklist.strike, checked && checklist.struck)}>{item.label}</span></span>
          {sparks && burst && (all || burst.key === item.id) && <span key={`${burst.time}-${item.id}`} aria-hidden="true" {...stylex.props(checklist.particles)}>
            {Array.from({ length: 8 }, (_, i) => <i key={i} {...stylex.props(checklist.particle(Math.cos(i * Math.PI / 4) * 24, Math.sin(i * Math.PI / 4) * 24, all ? index * 70 : 0))} />)}
          </span>}
        </button>
      </li>;
    })}</ul>
  </section>;
}
