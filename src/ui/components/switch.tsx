'use client';

import * as stylex from '@stylexjs/stylex';
import {
  useEffect, useId, useRef, useState, type CSSProperties, type FocusEvent, type PointerEvent, type ReactNode, type Ref,
} from 'react';
import { FieldError, SwitchButton, SwitchField, type SwitchFieldProps, type ValidationResult } from 'react-aria-components';
import { tokens as t } from '../tokens.stylex';
import { withClassName } from './internal/class-name';
import {
  ChoiceContent, choiceErrorProps, choiceRowClassName, joinIds, normalizeChoiceSize, useChoiceField,
  type ChoiceSize, type ChoiceSizeProp, type ChoiceVariant,
} from './internal/choice';
import { advanceChoiceSpring } from './internal/spring';
import { disabledStyles, focusStyles } from './internal/states';

// Switch (DESIGN_SPEC 1.8, 2.2): the compact switch is a 32px choice row with an accent-muted track
// that steps to accent-dim on hover and to accent-moderate when on. The stretch switch's thumb deforms
// with its actual velocity; its geometry sits on the control scale (96 x 48 at its default size, 4px
// track padding).

const reduce = '@media (prefers-reduced-motion: reduce)';
const coarse = '@media (pointer: coarse)';

const s = stylex.create({
  root: { display: 'inline-grid', maxWidth: '100%', minWidth: 0 },
  row: {
    display: 'flex', alignItems: 'center', gap: t['--os-space-3'], minWidth: 0,
    color: t['--os-color-fg-base'], fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'],
    letterSpacing: t['--os-tracking-tight'],
  },
  track: {
    position: 'relative', display: 'block', flexShrink: 0, padding: 0, borderWidth: 0, color: 'inherit',
    borderRadius: t['--os-radius-full'], backgroundColor: t['--os-color-bg-muted'], cursor: 'pointer', touchAction: 'none',
    transitionProperty: 'background-color, box-shadow',
    transitionDuration: { default: t['--os-motion-hover'], [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
    WebkitTapHighlightColor: 'transparent',
    // 44px hit area on coarse pointers (spec 1.14); the visual size does not change.
    '::after': {
      content: '""', position: 'absolute', insetInlineStart: '50%', insetBlockStart: '50%',
      width: { default: '100%', [coarse]: 'max(100%, 44px)' }, height: { default: '100%', [coarse]: 'max(100%, 44px)' },
      transform: 'translate(-50%, -50%)',
    },
  },
  on: { backgroundColor: t['--os-color-accent-moderate'] },
  invalid: { boxShadow: `inset 0 0 0 1.5px ${t['--os-color-border-error']}` },
  inert: { cursor: 'default' },
  thumb: {
    position: 'absolute', insetInlineStart: 0, borderRadius: t['--os-radius-full'], pointerEvents: 'none', transformOrigin: '50% 50%',
    // The off thumb is one neutral step darker than the bg-muted track (lighter in dark).
    backgroundColor: t['--os-color-accent-dim'],
    transitionProperty: 'background-color',
    transitionDuration: { default: t['--os-motion-hover'], [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  thumbOn: { backgroundColor: t['--os-color-accent-on-accent'] },
  text: { display: 'flex', flexDirection: 'column', minWidth: 0 },
  label: { cursor: 'pointer', minWidth: 0, overflowWrap: 'anywhere' },
  labelInert: { cursor: 'default' },
  required: { color: t['--os-color-fg-muted'] },
  description: {
    color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-md'],
    letterSpacing: t['--os-tracking-tight'], overflowWrap: 'anywhere',
  },
  disabledText: { color: t['--os-color-fg-disabled'] },
  error: {
    marginBlockStart: t['--os-space-2'], color: t['--os-color-fg-error'], fontSize: t['--os-font-size-caption'],
    lineHeight: t['--os-line-height-md'], letterSpacing: t['--os-tracking-tight'],
  },
  hidden: { position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, borderWidth: 0, overflow: 'hidden', clipPath: 'inset(50%)', whiteSpace: 'nowrap' },
});

/**
 * Stretch geometry per size, on the control scale (heights 32 / 40 / 48): the track is twice as wide as it is
 * tall, padded 4 like every track, and the thumb travels one track height.
 */
const stretchGeometry: Record<ChoiceSize, { width: number; height: number; pad: number; thumb: number }> = {
  sm: { width: 64, height: 32, pad: 4, thumb: 24 },
  md: { width: 80, height: 40, pad: 4, thumb: 32 },
  lg: { width: 96, height: 48, pad: 4, thumb: 40 },
};

const trackSizes = stylex.create({
  sm: { width: 64, height: t['--os-size-sm'] },
  md: { width: 80, height: t['--os-size-md'] },
  lg: { width: 96, height: t['--os-size-xl'] },
});

const thumbSizes = stylex.create({
  sm: { top: t['--os-space-1'], width: 24, height: 24 },
  md: { top: t['--os-space-1'], width: 32, height: 32 },
  lg: { top: t['--os-space-1'], width: 40, height: 40 },
});

/** The error line starts under the label: the track width plus the 12px row gap. */
const errorIndent = stylex.create({
  sm: { paddingInlineStart: `calc(64px + ${t['--os-space-3']})` },
  md: { paddingInlineStart: `calc(80px + ${t['--os-space-3']})` },
  lg: { paddingInlineStart: `calc(96px + ${t['--os-space-3']})` },
});

export type StretchSwitchProps = {
  /** The visible label. Without one, pass `aria-label`. */
  label?: ReactNode;
  /** Help text under the label. The error message replaces it while the switch is invalid. */
  description?: ReactNode;
  /** Shown under the row while the switch is invalid. A function receives the validation result. */
  errorMessage?: ReactNode | ((validation: ValidationResult) => ReactNode);
  /** @deprecated Use `isInvalid` with `errorMessage`. Setting it also marks the switch invalid. */
  error?: ReactNode;
  name?: string;
  /** The value submitted with the form when the switch is on. Default `"on"`. */
  value?: string;
  /** The id of a `<form>` to submit with. */
  form?: string;
  id?: string;
  isSelected?: boolean;
  defaultSelected?: boolean;
  onChange?: (isSelected: boolean) => void;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  isInvalid?: boolean;
  autoFocus?: boolean;
  /** `sm` 64 x 32, `md` 80 x 40, `lg` 96 x 48 (the default). */
  size?: ChoiceSizeProp;
  hideLabel?: boolean;
  /** Spring speed, 0 to 100. */
  speed?: number;
  /** How far the thumb stretches with velocity, 0 to 100. */
  stretch?: number;
  'aria-label'?: string;
  'aria-describedby'?: string;
  onFocus?: (event: FocusEvent<HTMLButtonElement>) => void;
  onBlur?: (event: FocusEvent<HTMLButtonElement>) => void;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLDivElement>;
  /** @deprecated Use `isSelected`. */
  checked?: boolean;
  /** @deprecated Use `defaultSelected`. */
  defaultChecked?: boolean;
  /** @deprecated Use `isDisabled`. */
  disabled?: boolean;
  /** @deprecated Use `isReadOnly`. */
  readOnly?: boolean;
  /** @deprecated Use `isRequired`. */
  required?: boolean;
};

/** A switch whose area-preserving thumb deformation is driven by actual velocity. */
export function StretchSwitch({
  label, description, errorMessage, error, name, value, form, id: idProp, isSelected, defaultSelected, onChange,
  isDisabled, isReadOnly, isRequired, isInvalid, autoFocus, size, hideLabel = false, speed = 50, stretch = 36,
  'aria-label': ariaLabel, 'aria-describedby': describedBy, onFocus, onBlur, className, style, ref,
  checked, defaultChecked, disabled: disabledProp, readOnly, required,
}: StretchSwitchProps) {
  const generated = useId();
  const id = idProp ?? generated;
  const sz = normalizeChoiceSize(size, 'lg');
  const disabled = isDisabled ?? disabledProp ?? false;
  const locked = isReadOnly ?? readOnly ?? false;
  const needed = isRequired ?? required ?? false;
  const initial = defaultSelected ?? defaultChecked ?? false;
  const [internal, setInternal] = useState(initial);
  const selected = isSelected ?? checked ?? internal;
  const selectedRef = useRef(selected);
  selectedRef.current = selected;
  const [nativeError, setNativeError] = useState<string | null>(null);
  const element = useRef<HTMLButtonElement>(null);
  const thumb = useRef<HTMLSpanElement>(null);
  const native = useRef<HTMLInputElement>(null);
  const settings = useRef({ speed, stretch, disabled, locked, geometry: stretchGeometry[sz] });
  settings.current = { speed, stretch, disabled, locked, geometry: stretchGeometry[sz] };
  const state = useRef({ x: selected ? 51 : 5, previousX: selected ? 51 : 5, velocity: 0, filtered: 0, filterVelocity: 0, swell: 1, swellVelocity: 0, hot: false, frame: 0, time: 0, pointerTime: 0, drag: null as null | { id: number; grab: number; startAt: number; moved: boolean; initial: boolean }, reduced: false, rtl: false });
  const inert = disabled || locked;
  const errorText = errorMessage ?? error;
  const invalid = isInvalid ?? ((error != null && error !== false && error !== '') || nativeError !== null);
  const validation: ValidationResult = { isInvalid: invalid, validationErrors: nativeError ? [nativeError] : [], validationDetails: native.current?.validity ?? ({ valid: !invalid } as ValidityState) };
  const errorContent = invalid ? (typeof errorText === 'function' ? errorText(validation) : errorText ?? nativeError) : null;
  const showError = errorContent != null && errorContent !== false && errorContent !== '';
  const showDescription = description != null && description !== false && !showError;
  const errorId = `${id}-error`;
  const descriptionId = `${id}-description`;

  function change(next: boolean) {
    if (settings.current.disabled || settings.current.locked || next === selectedRef.current) return;
    selectedRef.current = next;
    setInternal(next);
    setNativeError(null);
    onChange?.(next);
  }
  function paint() {
    const m = state.current;
    const g = settings.current.geometry;
    const length = m.reduced ? 1 : 1 + Math.min(.4, Math.abs(m.filtered) / 600) * Math.max(0, Math.min(100, settings.current.stretch)) / 100;
    const swell = m.reduced ? 1 : m.swell;
    // Physics runs in one fixed 92 px space (thumb 5 to 51) for every size; paint maps it onto this size's travel.
    const offset = g.pad + (m.x - 5) * (g.width - 2 * g.pad - g.thumb) / 46;
    if (thumb.current) thumb.current.style.transform = `translateX(${m.rtl ? -offset : offset}px) scale(${length * swell}, ${swell / length})`;
  }
  function animate() {
    const m = state.current;
    if (m.frame) return;
    m.time = performance.now();
    const tick = (now: number) => {
      const dt = Math.max(.001, Math.min(.05, (now - m.time) / 1000));
      m.time = now;
      const target = selectedRef.current ? 51 : 5;
      if (m.reduced) {
        if (!m.drag) m.x = target;
        m.velocity = m.filtered = m.filterVelocity = m.swellVelocity = 0;
        m.swell = 1; paint(); m.frame = 0; return;
      }
      if (!m.drag) {
        const next = advanceChoiceSpring({ position: m.x, velocity: m.velocity }, target, (170 + (Math.max(0, Math.min(100, settings.current.speed)) - 50) * 1.1) / .9, 21.5 / .9, dt, 8);
        m.x = next.position; m.velocity = next.velocity;
      }
      const actualVelocity = (m.x - m.previousX) / dt;
      m.previousX = m.x;
      const eased = advanceChoiceSpring({ position: m.filtered, velocity: m.filterVelocity }, actualVelocity, 380 / .6, 34 / .6, dt, 8);
      m.filtered = eased.position; m.filterVelocity = eased.velocity;
      const hover = advanceChoiceSpring({ position: m.swell, velocity: m.swellVelocity }, m.hot ? 1.035 : 1, 380 / .6, 34 / .6, dt, 8);
      m.swell = hover.position; m.swellVelocity = hover.velocity;
      paint();
      const moving = !!m.drag || Math.abs(m.x - target) > .0001 || Math.abs(m.velocity) > .001 || Math.abs(m.filtered) > .001 || Math.abs(m.filterVelocity) > .001 || Math.abs(m.swell - (m.hot ? 1.035 : 1)) > .0001 || Math.abs(m.swellVelocity) > .001;
      if (moving) m.frame = requestAnimationFrame(tick);
      else { m.x = target; m.swell = m.hot ? 1.035 : 1; m.filtered = 0; paint(); m.frame = 0; }
    };
    m.frame = requestAnimationFrame(tick);
  }
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { state.current.reduced = media.matches; animate(); };
    state.current.rtl = !!element.current && getComputedStyle(element.current).direction === 'rtl';
    update();
    media.addEventListener('change', update);
    return () => { cancelAnimationFrame(state.current.frame); state.current.frame = 0; media.removeEventListener('change', update); };
  }, []);
  useEffect(() => { if (inert) { state.current.drag = null; state.current.hot = false; } animate(); }, [selected, speed, stretch, inert, sz]);
  useEffect(() => { if (selected) setNativeError(null); }, [selected]);
  useEffect(() => {
    const owner = native.current?.form;
    if (!owner) return;
    let mounted = true;
    const reset = (event: Event) => queueMicrotask(() => { if (!mounted || event.defaultPrevented) return; state.current.drag = null; setNativeError(null); setInternal(initial); onChange?.(initial); });
    owner.addEventListener('reset', reset);
    return () => { mounted = false; owner.removeEventListener('reset', reset); };
  }, [initial, onChange]);
  function move(event: PointerEvent<HTMLButtonElement>) {
    const m = state.current;
    if (!m.drag || m.drag.id !== event.pointerId || inert) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const at = (m.rtl ? bounds.right - event.clientX : event.clientX - bounds.left) * 92 / bounds.width;
    const next = Math.max(5, Math.min(51, at - m.drag.grab));
    if (Math.abs(at - m.drag.startAt) > .4) m.drag.moved = true;
    const now = performance.now();
    m.velocity = (next - m.x) / Math.max(.001, (now - m.pointerTime) / 1000);
    m.pointerTime = now;
    m.x = next;
    change(next > 28); paint(); animate();
  }
  function release(event: PointerEvent<HTMLButtonElement>, canceled = false) {
    const m = state.current; const drag = m.drag;
    if (!drag || drag.id !== event.pointerId) return;
    m.drag = null;
    if (canceled) change(drag.initial);
    else if (!drag.moved) change(!selectedRef.current);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    animate();
  }
  return <div ref={ref} style={style} className={withClassName(stylex.props(s.root), className)}>
    <div {...stylex.props(s.row)}>
      <input
        ref={native} type="checkbox" name={name} value={value} form={form} checked={selected} required={needed} readOnly disabled={disabled}
        tabIndex={-1} aria-hidden="true" {...stylex.props(s.hidden)}
        onInvalid={event => { event.preventDefault(); setNativeError(event.currentTarget.validationMessage || null); element.current?.focus(); }}
      />
      <button ref={element} id={id} type="button" role="switch" aria-checked={selected} disabled={disabled} autoFocus={autoFocus}
        aria-label={ariaLabel} aria-labelledby={label != null && ariaLabel == null ? `${id}-label` : undefined}
        aria-describedby={joinIds(describedBy, showError ? errorId : showDescription && descriptionId)}
        aria-readonly={locked || undefined} aria-required={needed || undefined} aria-invalid={invalid || undefined}
        onFocus={onFocus} onBlur={onBlur}
        onPointerEnter={() => { if (inert) return; state.current.hot = true; animate(); }} onPointerLeave={() => { state.current.hot = false; animate(); }}
        onPointerDown={event => {
          const m = state.current;
          if (inert || event.button !== 0 || !event.isPrimary || m.drag) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (!bounds.width) return;
          m.rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
          const at = (m.rtl ? bounds.right - event.clientX : event.clientX - bounds.left) * 92 / bounds.width;
          event.currentTarget.focus();
          m.pointerTime = performance.now();
          m.drag = { id: event.pointerId, grab: at - m.x, startAt: at, moved: false, initial: selectedRef.current };
          event.currentTarget.setPointerCapture(event.pointerId);
          animate();
        }}
        onPointerMove={move} onPointerUp={event => release(event)} onPointerCancel={event => release(event, true)} onLostPointerCapture={event => release(event, true)}
        onClick={event => { if (event.detail === 0) { change(!selectedRef.current); animate(); } }}
        {...stylex.props(s.track, trackSizes[sz], focusStyles.ringVisible, selected && s.on, invalid && !disabled && s.invalid, locked && s.inert, disabled && disabledStyles.composite)}>
        <span ref={thumb} aria-hidden="true" {...stylex.props(s.thumb, thumbSizes[sz], selected && s.thumbOn)}/>
      </button>
      {label != null && (
        <span {...stylex.props(s.text, hideLabel && s.hidden)}>
          <label id={`${id}-label`} htmlFor={id} onClick={event => { event.preventDefault(); change(!selectedRef.current); animate(); }}
            {...stylex.props(s.label, inert && s.labelInert, disabled && s.disabledText)}>
            {label}{needed && <span aria-hidden="true" {...stylex.props(s.required, disabled && s.disabledText)}> *</span>}
          </label>
          {showDescription && <span id={descriptionId} {...stylex.props(s.description, disabled && s.disabledText)}>{description}</span>}
        </span>
      )}
    </div>
    {showError && <div id={errorId} {...stylex.props(s.error, !hideLabel && label != null && errorIndent[sz])}>{errorContent}</div>}
  </div>;
}

export type SwitchProps = Omit<SwitchFieldProps, 'children' | 'className' | 'style'> & {
  /** The visible label. Without one, pass `aria-label`. */
  label?: ReactNode;
  /** Help text under the label. The error message replaces it while the switch is invalid. */
  description?: ReactNode;
  /** Shown under the row while the switch is invalid. A function receives the validation result. */
  errorMessage?: ReactNode | ((validation: ValidationResult) => ReactNode);
  /** @deprecated Use `isInvalid` with `errorMessage`. Setting it also marks the switch invalid. */
  error?: ReactNode;
  /** Track and text size. Compact: `sm` 32 x 20, `md` 40 x 24, `lg` 48 x 28. Stretch: see StretchSwitch. */
  size?: ChoiceSizeProp;
  /** `card` puts the row in a bordered tile with the switch at the end; `row` puts the switch at the end of a
   * full-width row with no tile, for settings lists. Compact only. */
  variant?: ChoiceVariant;
  /** `stretch` is the 96 x 48 switch whose thumb stretches with velocity. */
  appearance?: 'compact' | 'stretch';
  hideLabel?: boolean;
  /** Stretch appearance only: spring speed, 0 to 100. */
  speed?: number;
  /** Stretch appearance only: how far the thumb stretches, 0 to 100. */
  stretch?: number;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLDivElement>;
  /** @deprecated Use `isSelected`. */
  checked?: boolean;
  /** @deprecated Use `defaultSelected`. */
  defaultChecked?: boolean;
  /** @deprecated Use `isDisabled`. */
  disabled?: boolean;
  /** @deprecated Use `isReadOnly`. */
  readOnly?: boolean;
  /** @deprecated Use `isRequired`. */
  required?: boolean;
};

const fieldStyles = stylex.create({
  root: { display: 'grid', minWidth: 0 },
});

export function Switch({
  label, description, errorMessage, error, size, variant, appearance = 'compact', hideLabel = false, speed, stretch,
  className, style, ref, checked, defaultChecked, disabled, readOnly, required,
  isSelected, defaultSelected, isDisabled, isReadOnly, isRequired, isInvalid, id, 'aria-describedby': describedBy, ...props
}: SwitchProps) {
  const field = useChoiceField();
  const message = errorMessage ?? error;
  const invalid = isInvalid ?? (error != null && error !== false && error !== '' ? true : undefined) ?? (field?.invalid ? true : undefined);
  const selected = isSelected ?? checked;
  const initial = defaultSelected ?? defaultChecked;
  const off = isDisabled ?? disabled ?? field?.disabled;
  const locked = isReadOnly ?? readOnly ?? field?.readOnly;
  const needed = isRequired ?? required ?? field?.required;
  const describedBy_ = joinIds(describedBy, field?.descriptionId);
  const controlId = id ?? field?.id;

  if (appearance === 'stretch') {
    return <StretchSwitch
      label={label} description={description} errorMessage={message} name={props.name} value={props.value} form={props.form}
      id={controlId} isSelected={selected} defaultSelected={initial} onChange={props.onChange} isDisabled={off} isReadOnly={locked}
      isRequired={needed} isInvalid={invalid} autoFocus={props.autoFocus} size={size} hideLabel={hideLabel} speed={speed} stretch={stretch}
      aria-label={props['aria-label']} aria-describedby={describedBy_} className={className} style={style} ref={ref}
    />;
  }

  const sz = normalizeChoiceSize(size);
  const look = variant ?? 'default';
  return (
    <SwitchField
      {...props}
      ref={ref}
      style={style}
      className={withClassName(stylex.props(fieldStyles.root), className)}
      id={controlId}
      isSelected={selected}
      defaultSelected={initial}
      isDisabled={off}
      isReadOnly={locked}
      isRequired={needed}
      isInvalid={invalid}
      aria-describedby={describedBy_}
    >
      <SwitchButton className={choiceRowClassName({ kind: 'switch', size: sz, variant: look, standalone: true })}>
        {state => (
          <ChoiceContent
            kind="switch" state={state} size={sz} variant={look} label={label} description={description}
            hideLabel={hideLabel} required={state.isRequired} hasErrorMessage={message != null}
          />
        )}
      </SwitchButton>
      <FieldError {...choiceErrorProps({ kind: 'switch', size: sz, variant: look, hideLabel })}>{message}</FieldError>
    </SwitchField>
  );
}
