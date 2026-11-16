'use client';

import * as stylex from '@stylexjs/stylex';
import { useContext, useEffect, useId, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode, type Ref } from 'react';
import {
  Button as AriaButton, FieldError, Group as AriaGroup, Input as AriaInput, Label as AriaLabel,
  NumberField as AriaNumberField, Text,
  type NumberFieldProps as AriaNumberFieldProps, type NumberFieldState, type ValidationResult,
} from 'react-aria-components';
import { tokens as t } from '../tokens.stylex';
import { Icon } from './Icon';
import { withClassName } from './internal/class-name';
import { controlShellSizeStyles, controlStyles, FieldContext, fieldButtonSizeStyles } from './internal/control';
import { FieldGroupContext } from './internal/field-styles';
import { fieldInputSizeStyles, normalizeSize, radiusStyles, sizeScale, type ControlSizeProp } from './internal/size';
import { disabledStyles, focusStyles, readOnlyStyles } from './internal/states';

const ring = t['--os-color-focus-ring'];
const reduce = '@media (prefers-reduced-motion: reduce)';
const canHover = '@media (hover: hover)';
const coarse = '@media (pointer: coarse)';

// ---------------------------------------------------------------------------------------------
// ScrubStepper: a rail on the control scale, xl 48 (48px sides around a 56px value), `size="sm"` the
// 32px row. Tap a side to step, or hold it 260ms and drag to sweep the range; colors, focus, states and
// motion tokens follow the spec.

const s = stylex.create({
  root: { display: 'grid', justifyItems: 'start', gap: t['--os-space-2'], maxWidth: '100%' },
  hidden: { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)', whiteSpace: 'nowrap' },
  rail: {
    display: 'inline-flex', alignItems: 'center', position: 'relative', height: t['--os-size-xl'], maxWidth: '100%',
    borderRadius: t['--os-radius-control'], backgroundColor: t['--os-color-bg-surface'], color: t['--os-color-fg-base'],
    overflow: 'hidden', fontFamily: t['--os-font-family'],
    transitionProperty: 'transform, background-color, box-shadow',
    transitionDuration: { default: `${t['--os-motion-layout']}, ${t['--os-motion-hover']}, ${t['--os-motion-hover']}`, [reduce]: '0ms' },
    transitionTimingFunction: `${t['--os-ease-spring']}, ${t['--os-ease-settle']}, ${t['--os-ease-settle']}`,
  },
  railSmall: { height: t['--os-size-sm'] },
  // Pressed (spec 1.8): the control's .97 press scale over --os-motion-press, with the rail's tilt toward the pressed side.
  pressed: (direction: number) => ({ transform: { default: `perspective(320px) rotateY(${direction * 4}deg) scale(.97)`, [reduce]: 'none' } }),
  pressedTiming: { transitionDuration: { default: t['--os-motion-press'], [reduce]: '0ms' }, transitionTimingFunction: t['--os-ease-settle'] },
  sweeping: { transform: { default: 'scaleX(1.06)', [reduce]: 'none' } },
  side: {
    position: 'relative', zIndex: 2, display: 'grid', placeItems: 'center', flexShrink: 0, width: t['--os-size-xl'], height: t['--os-size-xl'], padding: 0,
    borderRadius: t['--os-radius-control'], touchAction: 'none',
    color: { default: 'inherit', ':disabled': t['--os-color-fg-disabled'] },
    cursor: { default: 'pointer', ':disabled': 'default' },
    backgroundColor: {
      default: 'transparent',
      ':hover:not(:disabled)': { default: null, [canHover]: t['--os-color-bg-interactive-primary'] },
      ':active:not(:disabled)': t['--os-color-bg-interactive-secondary'],
    },
    outlineStyle: { default: 'none', ':focus-visible': 'solid' }, outlineWidth: 2, outlineColor: ring, outlineOffset: -2,
    transitionProperty: 'background-color, color',
    transitionDuration: { default: t['--os-motion-hover'], [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  /** 32px sides; the coarse-pointer hit area (spec 1.14) grows them to 44 without changing the look. */
  sideSmall: {
    width: t['--os-size-sm'], height: t['--os-size-sm'],
    '::after': {
      content: { default: null, [coarse]: '""' },
      position: 'absolute', insetBlockStart: '50%', insetInlineStart: '50%',
      width: 44, height: 44, transform: 'translate(-50%, -50%)',
    },
  },
  sideHidden: { visibility: 'hidden' },
  // The numeric display (spec 1.4): 20/24 500 at -0.02em, tabular.
  value: {
    position: 'relative', zIndex: 2, minWidth: 56, textAlign: 'center',
    // os-allow raw-type: spec 1.4 numeric display 20px (ScrubStepper, OtpField, Progress ring); the type scale has no 20px token
    fontSize: 20,
    fontWeight: t['--os-font-weight-medium'],
    lineHeight: t['--os-line-height-lg'], fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em', userSelect: 'none',
    transitionProperty: 'transform',
    transitionDuration: { default: t['--os-motion-layout'], [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-spring'],
  },
  valueSmall: { minWidth: 44, fontSize: t['--os-font-size-body'], lineHeight: t['--os-line-height-lg'], letterSpacing: t['--os-tracking-tight'] },
  valueSweep: { transform: { default: 'scale(1.06)', [reduce]: 'none' } },
  fill: (progress: number) => ({ transform: `scaleX(${progress})` }),
  fillBase: {
    position: 'absolute', inset: 0, transformOrigin: 'left center', backgroundColor: t['--os-color-bg-muted'], opacity: 0,
    transitionProperty: 'opacity', transitionDuration: { default: t['--os-motion-popup'], [reduce]: '0ms' },
  },
  fillVisible: { opacity: 1 },
  railDisabled: { color: t['--os-color-fg-disabled'], backgroundColor: t['--os-color-bg-disabled'] },
  /** Read-only (spec 1.8): bg-subtle with a border-subtle edge, drawn inset because the rail has no border. */
  railReadOnly: { backgroundColor: t['--os-color-bg-subtle'], boxShadow: `inset 0 0 0 1px ${t['--os-color-border-subtle']}` },
  railInvalid: { boxShadow: `inset 0 0 0 1px ${t['--os-color-border-error']}` },
});

export interface ScrubStepperProps {
  /** Names the control. Visually hidden unless `hideLabel` is false. */
  label: string;
  /** The value (controlled). */
  value?: number;
  /** The starting value when uncontrolled. */
  defaultValue?: number;
  /** Fires on every change, including each value passed during a sweep. */
  onChange?: (value: number) => void;
  /** Fires once per step, and once when a sweep is released. */
  onCommit?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** `md` is the 48px rail (control xl); `sm` is the 32px row. `small` and `medium` are aliases. */
  size?: 'sm' | 'md' | 'small' | 'medium';
  isDisabled?: boolean;
  /** @deprecated Use `isDisabled`. */
  disabled?: boolean;
  /** Shows the value but hides the buttons and ignores gestures and keys. */
  isReadOnly?: boolean;
  /** Draws the invalid ring and links `errorMessage`. */
  isInvalid?: boolean;
  /** Shown under the rail while `isInvalid` is set. */
  errorMessage?: ReactNode;
  hideLabel?: boolean;
  /** Submits the value with a form under this name. */
  name?: string;
  /** The id of the form the value belongs to. */
  form?: string;
  id?: string;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLDivElement>;
}

type Gesture = { pointer: number; element: HTMLButtonElement; startX: number; startValue: number; lastValue: number; direction: number; sweeping: boolean; rtl: number };

/** Tap precisely; after a 260ms hold, horizontal travel sweeps the numeric range. */
export function ScrubStepper({
  label, value, defaultValue = 24, onChange, onCommit, min = 0, max = 100, step = 1, size = 'md', isDisabled, disabled: disabledProp,
  isReadOnly = false, isInvalid = false, errorMessage, hideLabel = true, name, form, id, className, style, ref,
}: ScrubStepperProps) {
  const disabled = isDisabled ?? disabledProp ?? false;
  const small = size === 'sm' || size === 'small';
  const generatedId = useId();
  const labelId = `${id ?? generatedId}-label`;
  const hintId = `${id ?? generatedId}-hint`;
  const errorId = `${id ?? generatedId}-error`;
  const showError = isInvalid && errorMessage != null;
  const maximum = Math.max(min, max);
  const increment = Math.abs(step) || 1;
  const normalize = (next: number) => {
    const bounded = Math.max(min, Math.min(maximum, Number.isFinite(next) ? next : min));
    return Number(Math.max(min, Math.min(maximum, min + Math.round((bounded - min) / increment) * increment)).toFixed(10));
  };
  const [internal, setInternal] = useState(() => normalize(defaultValue));
  const displayed = normalize(value ?? internal);
  const rail = useRef<HTMLDivElement>(null);
  const formInput = useRef<HTMLInputElement>(null);
  const gesture = useRef<Gesture | null>(null);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [mode, setMode] = useState<'idle' | 'pressed' | 'sweeping'>('idle');
  const [direction, setDirection] = useState(0);
  const callbacks = useRef({ onChange, onCommit });
  callbacks.current = { onChange, onCommit };
  const locked = disabled || isReadOnly;

  function update(next: number) {
    const normalized = normalize(next);
    if (value === undefined) setInternal(normalized);
    callbacks.current.onChange?.(normalized);
    return normalized;
  }

  function finish(commit: boolean) {
    clearTimeout(holdTimer.current);
    const active = gesture.current;
    gesture.current = null;
    setMode('idle');
    setDirection(0);
    if (!active) return;
    if (commit) {
      const next = active.sweeping ? active.lastValue : update(active.startValue + active.direction * increment);
      callbacks.current.onCommit?.(next);
    }
    if (active.element.hasPointerCapture(active.pointer)) active.element.releasePointerCapture(active.pointer);
  }

  useEffect(() => () => { clearTimeout(holdTimer.current); gesture.current = null; }, []);
  useEffect(() => { if (locked) finish(false); }, [locked]);
  useEffect(() => {
    const owner = formInput.current?.form;
    if (!owner) return;
    let mounted = true;
    const reset = (event: Event) => queueMicrotask(() => {
      if (!mounted || event.defaultPrevented) return;
      finish(false);
      const restored = normalize(defaultValue);
      if (value === undefined) setInternal(restored);
      callbacks.current.onChange?.(restored);
    });
    owner.addEventListener('reset', reset);
    return () => { mounted = false; owner.removeEventListener('reset', reset); };
  }, [form, name, defaultValue, min, maximum, increment, value === undefined]);

  function press(event: PointerEvent<HTMLButtonElement>, nextDirection: number) {
    if (locked || event.button !== 0 || !event.isPrimary || gesture.current) return;
    event.preventDefault();
    event.currentTarget.focus({ preventScroll: true });
    event.currentTarget.setPointerCapture(event.pointerId);
    gesture.current = {
      pointer: event.pointerId, element: event.currentTarget, startX: event.clientX, startValue: displayed, lastValue: displayed,
      direction: nextDirection, sweeping: false, rtl: getComputedStyle(event.currentTarget).direction === 'rtl' ? -1 : 1,
    };
    setDirection(nextDirection);
    setMode('pressed');
    holdTimer.current = setTimeout(() => {
      if (!gesture.current) return;
      gesture.current.sweeping = true;
      setMode('sweeping');
    }, 260);
  }

  function move(event: PointerEvent<HTMLButtonElement>) {
    const active = gesture.current;
    if (!active?.sweeping || active.pointer !== event.pointerId) return;
    const distance = (event.clientX - active.startX) * active.rtl;
    const width = rail.current?.offsetWidth || 150;
    const next = normalize(active.startValue + distance / width * (maximum - min));
    if (next !== active.lastValue) { active.lastValue = next; update(next); }
  }

  const sideStyles = stylex.props(s.side, small && s.sideSmall, isReadOnly && s.sideHidden);
  // Icons follow the control size (spec 1.2): sm 16, xl 20.
  const iconSize = small ? 16 : 20;

  return <div ref={ref} style={style} className={withClassName(stylex.props(s.root), className)}>
    <span id={labelId} {...stylex.props(hideLabel ? s.hidden : controlStyles.label, !hideLabel && disabled && disabledStyles.label)}>{label}</span>
    <span id={hintId} {...stylex.props(s.hidden)}>Tap to step, or hold either button and drag to sweep. Arrow keys also adjust the value.</span>
    <div id={id} ref={rail} role="spinbutton" tabIndex={disabled ? -1 : 0} aria-labelledby={labelId}
      aria-describedby={[hintId, showError ? errorId : null].filter(Boolean).join(' ')}
      aria-valuemin={min} aria-valuemax={maximum} aria-valuenow={displayed} aria-disabled={disabled || undefined}
      aria-readonly={isReadOnly || undefined} aria-invalid={isInvalid || undefined}
      data-scrub-stepper="" data-mode={mode}
      {...stylex.props(
        s.rail, small && s.railSmall, focusStyles.ringVisible,
        mode === 'pressed' && s.pressed(direction), mode === 'pressed' && s.pressedTiming, mode === 'sweeping' && s.sweeping,
        isReadOnly && s.railReadOnly, isInvalid && s.railInvalid, disabled && s.railDisabled,
      )}
      onKeyDown={event => {
        if (locked) return;
        if (event.key === 'Escape' && gesture.current) { event.preventDefault(); update(gesture.current.startValue); finish(false); return; }
        const deltas: Record<string, number> = { ArrowUp: increment, ArrowRight: increment, ArrowDown: -increment, ArrowLeft: -increment, PageUp: increment * 10, PageDown: -increment * 10 };
        const next = event.key === 'Home' ? min : event.key === 'End' ? maximum : event.key in deltas ? displayed + deltas[event.key] : undefined;
        if (next !== undefined) { event.preventDefault(); const changed = update(next); callbacks.current.onCommit?.(changed); }
      }}>
      <span aria-hidden="true" {...stylex.props(s.fillBase, s.fill(maximum === min ? 0 : (displayed - min) / (maximum - min)), mode === 'sweeping' && s.fillVisible)} />
      <button type="button" aria-label={`Decrease ${label}`} disabled={locked || (mode === 'idle' && displayed <= min)} {...sideStyles}
        onPointerDown={event => press(event, -1)} onPointerMove={move} onPointerUp={() => finish(true)} onPointerCancel={() => finish(false)} onLostPointerCapture={() => finish(false)}
        onClick={event => { if (event.detail === 0) { const changed = update(displayed - increment); callbacks.current.onCommit?.(changed); } }}>
        <Icon name="minus" size={iconSize} />
      </button>
      <span aria-hidden="true" {...stylex.props(s.value, small && s.valueSmall, mode === 'sweeping' && s.valueSweep)}>{displayed}</span>
      <button type="button" aria-label={`Increase ${label}`} disabled={locked || (mode === 'idle' && displayed >= maximum)} {...sideStyles}
        onPointerDown={event => press(event, 1)} onPointerMove={move} onPointerUp={() => finish(true)} onPointerCancel={() => finish(false)} onLostPointerCapture={() => finish(false)}
        onClick={event => { if (event.detail === 0) { const changed = update(displayed + increment); callbacks.current.onCommit?.(changed); } }}>
        <Icon name="plus" size={iconSize} />
      </button>
    </div>
    {showError && <span id={errorId} {...stylex.props(controlStyles.description, controlStyles.error)}>{errorMessage}</span>}
    {name && <input ref={formInput} type="hidden" name={name} form={form} value={displayed} disabled={disabled} />}
  </div>;
}

// ---------------------------------------------------------------------------------------------
// NumberField: a spec 1.2 text-entry shell with two inline stepper buttons.

const numberFieldStyles = stylex.create({
  numeric: { fontVariantNumeric: 'tabular-nums' },
  centered: { textAlign: 'center' },
  scrub: { cursor: 'ew-resize', touchAction: 'none', userSelect: 'none', width: 'fit-content' },
  /** Hit area (spec 1.14): at least 24px under a fine pointer and 44px under a coarse one; the look does not change. */
  stepper: {
    position: 'relative',
    '::after': {
      content: '""', position: 'absolute', insetBlockStart: '50%', insetInlineStart: '50%',
      width: { default: 'max(100%, 24px)', [coarse]: 'max(100%, 44px)' },
      height: { default: 'max(100%, 24px)', [coarse]: 'max(100%, 44px)' },
      transform: 'translate(-50%, -50%)',
    },
  },
  stepperPressed: { backgroundColor: t['--os-color-bg-interactive-secondary'] },
  /** Inside an InputGroup: no shell of its own; the group draws the edge and owns the height. */
  groupedRoot: { display: 'flex', flexGrow: 1, flexShrink: 1, flexBasis: 0, minWidth: 0, alignSelf: 'stretch' },
  groupedRow: { display: 'flex', alignItems: 'stretch', flexGrow: 1, minWidth: 0 },
});

export interface NumberFieldProps extends Omit<AriaNumberFieldProps, 'children' | 'className' | 'style'> {
  /** The visible label. Omit it inside a `Field`, which supplies the label, help text and error. */
  label?: ReactNode;
  /** Help text under the field. The error message replaces it while the field is invalid. */
  description?: ReactNode;
  /** Shown under the field while it is invalid. A function receives the validation result. */
  errorMessage?: ReactNode | ((validation: ValidationResult) => ReactNode);
  /** @deprecated Use `isInvalid` with `errorMessage`. Setting it also marks the field invalid. */
  error?: ReactNode;
  /** Height and type of the field (spec 1.2). `small`, `medium` and `large` are aliases of `sm`, `md` and `lg`. */
  size?: ControlSizeProp;
  /** Drag the label horizontally to change the value. */
  scrub?: boolean;
  /** Hides the decrement and increment buttons. The arrow keys still step. */
  hideStepper?: boolean;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLDivElement>;
}

function ScrubLabel({ state, step, children }: { state: NumberFieldState; step: number; children: ReactNode }) {
  const drag = useRef<{ pointer: number; x: number; value: number; direction: number } | null>(null);

  return <AriaLabel {...stylex.props(controlStyles.label, numberFieldStyles.scrub)} title="Drag to adjust"
    onPointerDown={event => {
      if (event.button !== 0 || !event.isPrimary) return;
      drag.current = {
        pointer: event.pointerId,
        x: event.clientX,
        value: Number.isFinite(state.numberValue) ? state.numberValue : state.minValue ?? 0,
        direction: getComputedStyle(event.currentTarget).direction === 'rtl' ? -1 : 1,
      };
      event.currentTarget.setPointerCapture(event.pointerId);
    }}
    onPointerMove={event => {
      const active = drag.current;
      if (!active || active.pointer !== event.pointerId) return;
      const delta = Math.trunc((event.clientX - active.x) * active.direction / 8);
      const value = active.value + delta * step;
      state.setNumberValue(Math.max(state.minValue ?? -Infinity, Math.min(state.maxValue ?? Infinity, value)));
    }}
    onLostPointerCapture={() => { drag.current = null; }}>
    {children}
  </AriaLabel>;
}

export function NumberField({
  label, description, errorMessage, error, size: sizeProp, scrub = false, hideStepper = false, isInvalid, isDisabled, isReadOnly, isRequired,
  step, id, className, style, ref, 'aria-describedby': describedBy, 'aria-labelledby': labelledBy, ...props
}: NumberFieldProps) {
  const field = useContext(FieldContext);
  const group = useContext(FieldGroupContext);
  const grouped = group !== null;
  const size = normalizeSize(group?.size ?? sizeProp);
  const inField = field !== null && label == null;
  const invalid = isInvalid ?? (error ? true : undefined) ?? (group?.invalid || (inField && field.invalid) ? true : undefined);

  return <AriaNumberField {...props} ref={ref} style={style} step={step} isInvalid={invalid}
    id={id ?? (inField ? field.id : undefined)}
    isDisabled={isDisabled ?? (group?.disabled || (inField && field.disabled) || undefined)}
    isReadOnly={isReadOnly ?? (group?.readOnly || (inField && field.readOnly) || undefined)}
    isRequired={isRequired ?? (inField ? field.required : undefined)}
    aria-labelledby={labelledBy ?? (inField && props['aria-label'] == null ? field.labelId : undefined)}
    aria-describedby={[describedBy, inField ? field.descriptionId : undefined].filter(Boolean).join(' ') || undefined}
    className={withClassName(stylex.props(grouped ? numberFieldStyles.groupedRoot : controlStyles.stack), className)}>
    {({ state, isDisabled: disabled, isReadOnly: readOnly, isInvalid: showsError }) => {
      const stepper = (slot: 'decrement' | 'increment') => <AriaButton slot={slot}
        className={({ isPressed, isFocusVisible }) => stylex.props(
          controlStyles.fieldButton, numberFieldStyles.stepper, fieldButtonSizeStyles[size],
          isPressed && numberFieldStyles.stepperPressed, isFocusVisible && focusStyles.ringInset,
          (readOnly || hideStepper) && readOnlyStyles.hidden,
        ).className ?? ''}>
        <Icon name={slot === 'decrement' ? 'minus' : 'plus'} size={sizeScale[size].icon} />
      </AriaButton>;
      const ownMessages = !inField && !grouped;
      return <>
        {label != null && (scrub && !disabled && !readOnly
          ? <ScrubLabel state={state} step={step ?? 1}>{label}</ScrubLabel>
          : <AriaLabel {...stylex.props(controlStyles.label, disabled && disabledStyles.label)}>{label}</AriaLabel>)}
        <AriaGroup {...(grouped ? stylex.props(numberFieldStyles.groupedRow) : stylex.props(
          controlStyles.shell, controlStyles.row, controlShellSizeStyles[size], radiusStyles[size],
          showsError && controlStyles.invalid, readOnly && controlStyles.readOnly, disabled && controlStyles.disabled,
        ))}>
          {stepper('decrement')}
          <AriaInput
            // Commit the keystroke during the capture phase. An ancestor that sets state in a native
            // bubbling `input` listener (Field does) would otherwise re-render this controlled input
            // with the old text before React's onChange runs, and the keystroke would be lost.
            onInputCapture={event => { const next = event.currentTarget.value; if (state.validate(next)) state.setInputValue(next); }}
            {...stylex.props(
              controlStyles.input, fieldInputSizeStyles[size], controlStyles.inputInner, numberFieldStyles.numeric,
              !readOnly && !hideStepper && numberFieldStyles.centered,
            )} />
          {stepper('increment')}
        </AriaGroup>
        {ownMessages && description != null && !showsError && <Text slot="description" {...stylex.props(controlStyles.description)}>{description}</Text>}
        {ownMessages && <FieldError {...stylex.props(controlStyles.description, controlStyles.error)}>{errorMessage ?? error}</FieldError>}
      </>;
    }}
  </AriaNumberField>;
}
