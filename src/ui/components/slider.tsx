'use client';

import * as stylex from '@stylexjs/stylex';
import { useContext, useEffect, useId, useRef, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode, type Ref } from 'react';
import { Label, Slider as AriaSlider, SliderFill, SliderOutput, SliderThumb, SliderTrack } from 'react-aria-components';
import { tokens as t } from '../tokens.stylex';
import { withClassName } from './internal/class-name';
import { controlStyles, FieldContext } from './internal/control';
import { fieldStyles } from './internal/field-styles';
import { focusStyles } from './internal/states';

// Two appearances. `rail` is the form slider: a 4px rail, a round knob, the value beside the label.
// `ticks` is a 48px bar field on the control scale with a 24px thumb; a fast drag sends a ripple through
// the bars it passes. Its geometry, colors, focus and motion follow the spec.

const reduce = '@media (prefers-reduced-motion: reduce)';
const coarse = '@media (pointer: coarse)';

const slider = stylex.create({
  root: { display: 'grid', gap: t['--os-space-2'], width: '100%', minWidth: 0 },
  rootVertical: { display: 'inline-flex', flexDirection: 'column', alignItems: 'center', width: 'auto', height: 200 },
  labelRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: t['--os-space-2'], minWidth: 0 },
  labelRowVertical: { flexDirection: 'column', gap: t['--os-space-1'] },
  label: { color: t['--os-color-fg-base'] },
  labelDisabled: { color: t['--os-color-fg-disabled'] },
  value: {
    color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-sm'], fontWeight: t['--os-font-weight-regular'], lineHeight: t['--os-line-height-md'],
    letterSpacing: t['--os-tracking-tight'], fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap',
  },
  valueDisabled: { color: t['--os-color-fg-disabled'] },
  track: { position: 'relative', width: '100%', cursor: 'pointer', touchAction: 'none' },
  trackVertical: { height: 'auto', alignSelf: 'stretch' },
  /** The vertical track's wrapper fills the root's height, so the rail stretches with it. */
  trackWrapVertical: { display: 'flex', justifyContent: 'center', flexGrow: 1, minHeight: 0 },
  trackDisabled: { cursor: 'default' },
  rail: { position: 'absolute', borderRadius: t['--os-radius-full'], backgroundColor: t['--os-color-accent-subtle'] },
  fill: { backgroundColor: t['--os-color-accent-moderate'], borderRadius: t['--os-radius-full'], pointerEvents: 'none' },
  knob: {
    position: 'absolute', top: '50%', left: '50%', borderRadius: t['--os-radius-full'], backgroundColor: t['--os-color-accent-moderate'], cursor: 'grab',
    scale: '1',
    transitionProperty: 'background-color, scale',
    transitionDuration: { default: `${t['--os-motion-hover']}, ${t['--os-motion-press']}`, [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
    // Hit area (spec 1.14): 24px under a fine pointer, 44px under a coarse one; the knob keeps its size.
    '::after': {
      content: '""', position: 'absolute', insetBlockStart: '50%', insetInlineStart: '50%', transform: 'translate(-50%, -50%)',
      width: { default: 24, [coarse]: 44 }, height: { default: 24, [coarse]: 44 },
    },
  },
  knobHover: { backgroundColor: t['--os-color-accent-bold'] },
  knobPressed: { backgroundColor: t['--os-color-accent-strong'], cursor: 'grabbing', zIndex: 2, scale: { default: '.9', [reduce]: '1' } },
  knobFocus: { zIndex: 1 },
  disabledRail: { backgroundColor: t['--os-color-bg-disabled'] },
  disabledFill: { backgroundColor: t['--os-color-border-disabled'] },
  disabledKnob: { backgroundColor: t['--os-color-fg-disabled'], cursor: 'default', scale: '1' },
  // Mark labels (12/16) sit 4 below the hit band: the root's 8 gap less 4.
  marks: { position: 'relative', height: t['--os-line-height-xs'], marginBlockStart: `calc(-1 * ${t['--os-space-1']})` },
  mark: {
    position: 'absolute', top: 0, color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-xs'], lineHeight: t['--os-line-height-xs'],
    fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap',
  },
  markAt: (percent: number) => ({ left: `${percent}%`, transform: `translateX(-${percent}%)` }),
  markDisabled: { color: t['--os-color-fg-disabled'] },
  // The `ticks` appearance.
  tickRoot: { padding: t['--os-space-4'], boxSizing: 'border-box' },
  tickRow: { display: 'flex', alignItems: 'center', gap: t['--os-space-4'], minWidth: 0 },
  tickTrack: { height: t['--os-size-xl'], flexGrow: 1, flexShrink: 1, flexBasis: 0, minWidth: 0, cursor: 'ew-resize', borderRadius: t['--os-radius-sm'] },
  tickValue: { minWidth: '3ch', flexShrink: 0 },
  hiddenLabel: { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)', whiteSpace: 'nowrap' },
  tickField: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%', position: 'absolute', inset: 0, pointerEvents: 'none' },
  tick: {
    width: 3, flexShrink: 0, borderRadius: t['--os-radius-full'], backgroundColor: t['--os-color-border-control'], height: 20,
    transformOrigin: '50% 50%', transitionProperty: 'background-color',
    transitionDuration: { default: t['--os-motion-hover'], [reduce]: '0ms' }, transitionTimingFunction: t['--os-ease-settle'],
  },
  tickOn: { backgroundColor: t['--os-color-accent-moderate'] },
  tickThumb: { width: 24, height: t['--os-size-xl'], borderRadius: t['--os-radius-sm'], backgroundColor: 'transparent', cursor: 'ew-resize', scale: '1' },
  tickThumbDisabled: { backgroundColor: 'transparent', cursor: 'default' },
  tickDisabled: { opacity: .4 },
});

/** Rail geometry per size: the track (hit band) height, the rail thickness, the knob diameter. */
const railSizes = stylex.create({
  sm: { height: 24 }, md: { height: 32 }, lg: { height: 40 },
});
const railSizesVertical = stylex.create({
  sm: { width: 24 }, md: { width: 32 }, lg: { width: 40 },
});
// The rail is centered on the hit band by a half-thickness translate.
const railBars = stylex.create({
  sm: { insetInline: 0, top: '50%', height: 4, translate: '0 -50%' },
  md: { insetInline: 0, top: '50%', height: 4, translate: '0 -50%' },
  lg: { insetInline: 0, top: '50%', height: 6, translate: '0 -50%' },
});
const railBarsVertical = stylex.create({
  sm: { insetBlock: 0, left: '50%', width: 4, translate: '-50% 0' },
  md: { insetBlock: 0, left: '50%', width: 4, translate: '-50% 0' },
  lg: { insetBlock: 0, left: '50%', width: 6, translate: '-50% 0' },
});
const knobSizes = stylex.create({
  sm: { width: 16, height: 16 }, md: { width: 18, height: 18 }, lg: { width: 20, height: 20 },
});

type RailSize = 'sm' | 'md' | 'lg';
const sizeAliases: Record<string, RailSize> = { small: 'sm', medium: 'md', large: 'lg' };

export type SliderMark = number | { value: number; label?: ReactNode };

export type SliderProps<T extends number | [number, number]> = {
  /** Names the slider. Omit it inside a `Field`, which supplies the label. */
  label?: string;
  /** The value (controlled). Pass a `[start, end]` pair for a range slider. */
  value?: T;
  /** The starting value when uncontrolled. */
  defaultValue?: T;
  /** Fires on every change while dragging or stepping. */
  onChange?: (value: T) => void;
  /** Fires once a drag or key press ends. */
  onChangeEnd?: (value: T) => void;
  minValue?: number;
  maxValue?: number;
  step?: number;
  /** Formats the value text, for example as a percentage or a currency. */
  formatOptions?: Intl.NumberFormatOptions;
  /** `ticks` is always horizontal. */
  orientation?: 'horizontal' | 'vertical';
  /** `rail` is the form slider. `ticks` is the 48px bar field with a ripple on drag. */
  appearance?: 'rail' | 'ticks';
  /** Rail thickness, knob and hit band. `ticks` keeps its 48px field. `small`, `medium` and `large` are aliases. */
  size?: 'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large';
  isDisabled?: boolean;
  /** @deprecated Use `isDisabled`. */
  disabled?: boolean;
  /** Hides the label row visually. The label still names the slider. */
  hideLabel?: boolean;
  /** Shows the formatted value. */
  showValue?: boolean;
  /** Help text under the slider. */
  description?: ReactNode;
  /** Labeled stops under the rail, at their values. */
  marks?: SliderMark[];
  /** Submits the value with a form under this name. A range submits two values under the same name. */
  name?: string;
  /** The id of the form the value belongs to. */
  form?: string;
  /** Accessible names of the two thumbs of a range. */
  thumbLabels?: [string, string];
  /** `ticks` only: how many bars to draw (12 to 64). */
  bars?: number;
  /** `ticks` only: how strongly a fast drag lifts the bars it passes. 0 turns the ripple off. */
  ripple?: number;
  id?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLDivElement>;
};

export function Slider<T extends number | [number, number]>({
  label, value, defaultValue, onChange, onChangeEnd, minValue = 0, maxValue = 100, step = 1, formatOptions,
  orientation = 'horizontal', appearance = 'rail', size: sizeProp = 'md', isDisabled, disabled: disabledProp,
  hideLabel = false, showValue = true, description, marks, name, form, thumbLabels = ['Minimum', 'Maximum'],
  bars = 36, ripple = 60, id, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, 'aria-describedby': ariaDescribedBy,
  className, style, ref,
}: SliderProps<T>) {
  const field = useContext(FieldContext);
  const inField = field !== null && label == null;
  const generatedId = useId();
  const descriptionId = description != null && !inField ? `${id ?? generatedId}-description` : undefined;
  const describedBy = [ariaDescribedBy, inField ? field.descriptionId : undefined, descriptionId].filter(Boolean).join(' ') || undefined;
  const disabled = isDisabled ?? disabledProp ?? (inField ? !!field.disabled : false);
  const range = Array.isArray(value ?? defaultValue);
  const ticks = appearance === 'ticks';
  const vertical = !ticks && orientation === 'vertical';
  const size: RailSize = sizeAliases[sizeProp] ?? (sizeProp as RailSize);
  const count = Math.min(64, Math.max(12, Math.round(bars)));
  const barElements = useRef<Array<HTMLSpanElement | null>>([]);
  const energy = useRef<number[]>([]);
  const motion = useRef({ frame: 0, previous: 0, lastX: 0, time: 0, fraction: 0, dragging: false });
  useEffect(() => () => cancelAnimationFrame(motion.current.frame), []);
  useEffect(() => { energy.current = Array(count).fill(0); }, [count]);
  function decay() {
    if (motion.current.frame) return;
    motion.current.previous = performance.now();
    const frame = (now: number) => {
      const dt = Math.min(.05, (now - motion.current.previous) / 1000);
      motion.current.previous = now;
      let active = false;
      energy.current.forEach((stored, index) => {
        const remaining = stored * Math.exp(-dt * 6.5);
        energy.current[index] = remaining < .002 ? 0 : remaining;
        active ||= energy.current[index] > 0;
        const element = barElements.current[index];
        if (element) element.style.transform = `scaleY(${1 + energy.current[index] * 1.6})`;
      });
      motion.current.frame = active ? requestAnimationFrame(frame) : 0;
    };
    motion.current.frame = requestAnimationFrame(frame);
  }
  function rippleMove(event: ReactPointerEvent<HTMLDivElement>, start = false) {
    if (!ticks || disabled) return;
    const state = motion.current;
    const bounds = event.currentTarget.getBoundingClientRect();
    const fraction = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    const now = performance.now();
    if (start) { state.dragging = true; state.lastX = event.clientX; state.time = now; state.fraction = fraction; return; }
    if (!state.dragging || event.buttons === 0) { state.dragging = false; return; }
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const speed = Math.abs(event.clientX - state.lastX) / Math.max(.001, (now - state.time) / 1000);
      const impulse = (1 - Math.exp(-speed / 900)) * Math.max(0, ripple) / 60;
      const from = Math.round(Math.min(state.fraction, fraction) * (count - 1));
      const to = Math.round(Math.max(state.fraction, fraction) * (count - 1));
      for (let index = from; index <= to; index++) energy.current[index] = Math.max(energy.current[index] ?? 0, impulse);
      decay();
    }
    state.lastX = event.clientX; state.time = now; state.fraction = fraction;
  }

  const output = showValue && <SliderOutput {...stylex.props(slider.value, ticks && slider.tickValue, disabled && slider.valueDisabled)}>
    {({ state }) => state.values.map((_, index) => state.getThumbValueLabel(index)).join(' – ')}
  </SliderOutput>;
  const span = maxValue - minValue || 1;
  const markList = (marks ?? []).map(mark => typeof mark === 'number' ? { value: mark, label: mark as ReactNode } : mark);
  const sliderProps = stylex.props(slider.root, vertical && slider.rootVertical, ticks && slider.tickRoot);

  return <AriaSlider<T>
    ref={ref} id={id} style={style} className={withClassName(sliderProps, className)}
    value={value} defaultValue={defaultValue} onChange={onChange} onChangeEnd={onChangeEnd}
    minValue={minValue} maxValue={maxValue} step={step} formatOptions={formatOptions} orientation={vertical ? 'vertical' : 'horizontal'}
    isDisabled={disabled} aria-label={ariaLabel}
    aria-labelledby={ariaLabelledBy ?? (inField && ariaLabel == null ? field.labelId : undefined)}
    aria-describedby={describedBy}>
    {(label != null || (!ticks && output)) && <div {...stylex.props(slider.labelRow, vertical && slider.labelRowVertical, hideLabel && slider.hiddenLabel)}>
      {label != null && <Label {...stylex.props(fieldStyles.label, slider.label, disabled && slider.labelDisabled)}>{label}</Label>}
      {!ticks && output}
    </div>}
    <div {...stylex.props(ticks && slider.tickRow, vertical && slider.trackWrapVertical)}>
      <SliderTrack {...stylex.props(
        slider.track, vertical ? railSizesVertical[size] : railSizes[size], vertical && slider.trackVertical,
        ticks && slider.tickTrack, disabled && slider.trackDisabled,
      )}
        onPointerDownCapture={event => rippleMove(event, true)} onPointerMove={event => rippleMove(event)}
        onPointerUp={() => { motion.current.dragging = false; }} onPointerCancel={() => { motion.current.dragging = false; }}>
        {({ state }) => <>
          {ticks ? <div aria-hidden="true" {...stylex.props(slider.tickField, disabled && slider.tickDisabled)}>
            {Array.from({ length: count }, (_, index) => {
              const fraction = index / (count - 1);
              const low = range ? state.getThumbPercent(0) : 0;
              const high = state.getThumbPercent(range ? 1 : 0);
              return <span ref={element => { barElements.current[index] = element; }} key={index} {...stylex.props(slider.tick, fraction >= low && fraction <= high && slider.tickOn)} />;
            })}
          </div> : <div {...stylex.props(slider.rail, vertical ? railBarsVertical[size] : railBars[size], disabled && slider.disabledRail)}>
            <SliderFill {...stylex.props(slider.fill, disabled && slider.disabledFill)} />
          </div>}
          {(range ? [0, 1] : [0]).map(index => <SliderThumb key={index} index={index} name={name} form={form}
            aria-label={range ? thumbLabels[index] : undefined}
            className={({ isHovered, isFocusVisible, isDragging, isDisabled: thumbDisabled }) => stylex.props(
              slider.knob, knobSizes[size],
              isHovered && !ticks && slider.knobHover, isDragging && !ticks && slider.knobPressed,
              isFocusVisible && slider.knobFocus, isFocusVisible && focusStyles.ring,
              thumbDisabled && slider.disabledKnob, ticks && slider.tickThumb, ticks && thumbDisabled && slider.tickThumbDisabled,
            ).className ?? ''} />)}
        </>}
      </SliderTrack>
      {ticks && output}
    </div>
    {!ticks && !vertical && markList.length > 0 && <div aria-hidden="true" {...stylex.props(slider.marks)}>
      {markList.map(mark => <span key={mark.value} {...stylex.props(
        slider.mark, slider.markAt(Math.max(0, Math.min(100, (mark.value - minValue) / span * 100))), disabled && slider.markDisabled,
      )}>{mark.label ?? mark.value}</span>)}
    </div>}
    {descriptionId && <p id={descriptionId} {...stylex.props(controlStyles.description)}>{description}</p>}
  </AriaSlider>;
}
