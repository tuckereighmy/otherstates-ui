'use client';

import * as stylex from '@stylexjs/stylex';
import { useContext, useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type Ref } from 'react';
import { tokens as t } from '../tokens.stylex';
import { Icon } from './Icon';
import { withClassName } from './internal/class-name';
import { FieldContext } from './internal/control';
import { fieldStyles as field } from './internal/field-styles';
import { useReducedMotion } from './internal/platform';

// OtpField cells sit on the control scale: md cells are 40 x 48 (control xl), 8 apart; sm cells 32 x 40
// (control md), 6 apart (the size's gap, spec 1.2). Radius control + 2 (sm: control), so cells follow the
// corner ladder and are pills at Round. A verified code merges the cells into one capsule on a spring;
// a wrong one shakes. Colors, edges, focus, states and motion tokens follow the spec: cells are
// borderless shells with an inset hairline, the active cell wears the edge ring (1.8).

const reduce = '@media (prefers-reduced-motion: reduce)';
const canHover = '@media (hover: hover)';
const ring = t['--os-color-focus-ring'];

const digitIn = stylex.keyframes({
  from: { opacity: 0, transform: 'translateY(45%) scale(.86)', filter: 'blur(3px)' },
  to: { opacity: 1, transform: 'none', filter: 'blur(0px)' },
});
const caretBreathe = stylex.keyframes({ from: { opacity: 1 }, to: { opacity: .25 } });

const styles = stylex.create({
  hidden: { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)', whiteSpace: 'nowrap' },
  root: { maxWidth: '100%' },
  /** The cell row takes the natural width of its cells and shrinks with a narrow container; messages may run wider. */
  rowWidth: (width: number) => ({ width, maxWidth: '100%' }),
  row: {
    position: 'relative', minWidth: 0,
    // The hairline every cell wears at rest; hover steps it to border-muted (spec 1.8, field shells).
    '--os-otp-edge': { default: t['--os-color-border-subtle'], ':hover': { default: null, [canHover]: t['--os-color-border-muted'] } },
  },
  rowInvalid: { '--os-otp-edge': t['--os-color-border-error'] },
  rowDisabled: { '--os-otp-edge': t['--os-color-border-disabled'] },
  layer: { position: 'absolute', inset: 0, pointerEvents: 'none' },
  goo: (filter: string) => ({ filter }),
  cell: { position: 'absolute', top: 0, backgroundColor: t['--os-color-bg-surface'], pointerEvents: 'none' },
  cellDisabled: { backgroundColor: t['--os-color-bg-disabled'] },
  edge: {
    position: 'absolute', top: 0, pointerEvents: 'none',
    // os-allow raw-shadow: spec 2.2 OtpField, the borderless cell's 1px inset hairline in --os-otp-edge (a token per state)
    boxShadow: 'inset 0 0 0 1px var(--os-otp-edge)',
    transitionProperty: 'box-shadow', transitionDuration: { default: t['--os-motion-hover'], [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  edgeActive: { boxShadow: `inset 0 0 0 2px ${ring}` },
  edgeActiveInvalid: { boxShadow: `inset 0 0 0 2px ${t['--os-color-border-error']}` },
  edgeSelected: { boxShadow: `inset 0 0 0 2px color-mix(in srgb, ${ring} 40%, transparent)` },
  place: (width: string, left: string) => ({ width, left }),
  motion: (transform: string, borderRadius: string) => ({ transform, borderRadius }),
  fade: (opacity: number) => ({ opacity }),
  pill: { position: 'absolute', insetBlock: 0, left: '50%', borderRadius: t['--os-radius-full'], backgroundColor: t['--os-color-bg-surface'], pointerEvents: 'none' },
  pillEdge: { backgroundColor: 'transparent', boxShadow: `inset 0 0 0 1px ${t['--os-color-border-subtle']}` },
  pillMotion: (width: number, scaleY: number) => ({ width, maxWidth: '100%', transform: `translateX(-50%) scaleY(${scaleY})` }),
  // The numeric display (spec 1.4): 20px 500 at -0.02em, tabular; line height 1 in a fixed-height cell.
  slot: {
    display: 'grid', placeItems: 'center', position: 'absolute', top: 0, pointerEvents: 'none', color: t['--os-color-fg-base'],
    // os-allow raw-type: spec 1.4 numeric display 20px (ScrubStepper, OtpField, Progress ring); the type scale has no 20px token
    fontSize: 20,
    fontWeight: t['--os-font-weight-medium'], fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em', lineHeight: 1,
    transitionProperty: 'color', transitionDuration: { default: t['--os-motion-hover'], [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  slotSmall: { fontSize: t['--os-font-size-body'], letterSpacing: t['--os-tracking-tight'] },
  slotMotion: (transform: string, opacity: number) => ({ transform, opacity }),
  digitExit: (progress: number) => ({ translate: `0 ${progress * 8}px`, opacity: 1 - progress }),
  digit: {
    animationName: { default: digitIn, [reduce]: 'none' }, animationDuration: t['--os-motion-popup'],
    animationTimingFunction: t['--os-ease-settle'],
  },
  hint: { color: t['--os-color-fg-muted'] },
  caret: {
    width: 2, height: 18, borderRadius: t['--os-radius-full'], backgroundColor: t['--os-color-fg-base'],
    animationName: { default: caretBreathe, [reduce]: 'none' }, animationDuration: t['--os-motion-slow'],
    animationTimingFunction: 'ease-in-out', animationDirection: 'alternate', animationIterationCount: 'infinite',
  },
  caretSmall: { height: 16 },
  // The dash between groups: `dashWidth` (below) wide, centered in the break.
  separator: { position: 'absolute', top: '50%', width: 8, height: 2, marginTop: -1, borderRadius: t['--os-radius-full'], backgroundColor: t['--os-color-fg-muted'], pointerEvents: 'none' },
  separatorDisabled: { backgroundColor: t['--os-color-fg-disabled'] },
  separatorLeft: (left: string) => ({ left }),
  invalidDigit: { color: t['--os-color-fg-error'] },
  disabledDigit: { color: t['--os-color-fg-disabled'] },
  verified: {
    position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: t['--os-space-2'],
    fontSize: t['--os-font-size-sm'], fontWeight: t['--os-font-weight-regular'], lineHeight: t['--os-line-height-md'], letterSpacing: t['--os-tracking-tight'],
    color: t['--os-color-fg-base'], pointerEvents: 'none',
  },
  verifiedMotion: (progress: number) => ({ opacity: progress, transform: `scale(${.92 + progress * .08})` }),
  verifiedInput: { cursor: 'pointer' },
  input: {
    position: 'absolute', inset: 0, width: '100%', minWidth: 0, height: '100%', margin: 0, opacity: 0,
    // 16px so iOS does not zoom when the (invisible) input takes focus.
    fontSize: t['--os-font-size-body'], cursor: { default: 'text', ':disabled': 'default' },
  },
});

/** Cell heights on the control scale: sm 40 (md), md 48 (xl). */
const heights = stylex.create({ sm: { height: t['--os-size-md'] }, md: { height: t['--os-size-xl'] } });

/**
 * Cell geometry per size (px, for the layout math). md: 40 x 48, 8 apart; sm: 32 x 40, 6 apart.
 * Radius (spec 1.3): control + 2 (sm: control), pills at Round.
 */
const geometry = {
  sm: { width: 32, height: 40, gap: 6, radius: t['--os-radius-control'] },
  md: { width: 40, height: 48, gap: 8, radius: `calc(${t['--os-radius-control']} + 2px)` },
} as const;
type OtpSize = keyof typeof geometry;
/** `lg` was the 40 x 48 cell, which md now is: it and `large` render md. `small` and `medium` are aliases of sm and md. */
const sizeAliases: Record<string, OtpSize> = { small: 'sm', medium: 'md', lg: 'md', large: 'md' };
/** The separator dash between groups is 8 wide, with one cell gap on each side of it. */
const dashWidth = 8;

export type OtpFieldProps = {
  /** Names the field. Omit it inside a `Field`, which supplies the label. */
  label?: string;
  /** How many characters the code has. */
  length?: number;
  /** The code (controlled). */
  value?: string;
  /** The starting code when uncontrolled. */
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Which characters a cell accepts: digits, or letters and digits. */
  type?: 'numeric' | 'alphanumeric';
  /** Rewrites typed or pasted text before the characters are filtered by `type`, for example to uppercase it. */
  normalize?: (value: string) => string;
  /** One hint character per cell, shown in empty cells. */
  placeholder?: string;
  /** Splits the cells into groups of this many, with a separator between groups. */
  groupSize?: number;
  /** Cell size: `sm` 32 x 40, `md` 40 x 48. `small` and `medium` are aliases; `lg` and `large` are deprecated aliases of `md`. */
  size?: 'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large';
  id?: string;
  name?: string;
  /** The id of the form the code belongs to. */
  form?: string;
  isRequired?: boolean;
  /** @deprecated Use `isRequired`. */
  required?: boolean;
  /** Help text under the cells. The error message replaces it while the field is invalid. */
  description?: ReactNode;
  /** @deprecated Use `description`. */
  hint?: string;
  /** Draws the cells in the error color. Set by default while `errorMessage` is set. */
  isInvalid?: boolean;
  /** Shown under the cells while the field is invalid. */
  errorMessage?: ReactNode;
  /** @deprecated Use `errorMessage`. */
  error?: string;
  isDisabled?: boolean;
  /** @deprecated Use `isDisabled`. */
  disabled?: boolean;
  /** Shows a dot for every character and uses a password input. */
  masked?: boolean;
  hideLabel?: boolean;
  autoFocus?: boolean;
  /** Called with a complete code. Returning true merges the cells into a verified pill; false shakes and clears them. */
  validate?: (code: string) => boolean | Promise<boolean>;
  /** Called once each time the code becomes complete. */
  onComplete?: (code: string) => void;
  /** Called after `validate` accepts a code. */
  onVerified?: (code: string) => void;
  verifiedLabel?: string;
  rejectedLabel?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLDivElement>;
};

type PinPhase = 'typing' | 'checking' | 'verified' | 'rejected';
const clampUnit = (value: number) => Math.max(0, Math.min(1, value));
const easeWindow = (start: number, end: number, value: number) => {
  const unit = clampUnit((value - start) / (end - start));
  return unit * unit * (3 - 2 * unit);
};

/** Drives the merge spring and the shake clock. Animation sleeps as soon as its springs settle. */
function usePinMotion(digits: string, length: number, phase: PinPhase) {
  const reduced = useReducedMotion();
  const spring = useRef({ position: 0, velocity: 0 });
  const phaseClock = useRef({ phase, began: 0 });
  const previousDigits = useRef('');
  const previousLength = useRef(length);
  const entrances = useRef<number[]>([]);
  const [frame, setFrame] = useState({ progress: 0, time: 0, elapsed: 0, phase });

  useEffect(() => {
    const began = performance.now();
    if (previousLength.current !== length) {
      spring.current = { position: 0, velocity: 0 };
      entrances.current = [];
      previousDigits.current = '';
      previousLength.current = length;
    }
    if (digits.length > previousDigits.current.length) {
      for (let index = previousDigits.current.length; index < digits.length; index++) entrances.current[index] = began + (index - previousDigits.current.length) * 45;
    }
    previousDigits.current = digits;
    if (phaseClock.current.phase !== phase) phaseClock.current = { phase, began };
    const target = phase === 'verified' ? 1 : 0;
    const damping = 1 - 2 * .42 * Math.sqrt(.075);
    let previousTime = 0;
    let request = 0;
    const tick = (time: number) => {
      const elapsed = time - phaseClock.current.began;
      const step = previousTime ? Math.min(2.5, Math.max(0, (time - previousTime) / 16.67)) : 1;
      previousTime = time;
      const point = spring.current;
      if (reduced) { point.position = target; point.velocity = 0; }
      else {
        point.velocity = (point.velocity + (target - point.position) * .075 * step) * Math.pow(damping, step);
        point.position += point.velocity * step;
        if (Math.abs(target - point.position) < .0008 && Math.abs(point.velocity) < .0008) { point.position = target; point.velocity = 0; }
      }
      setFrame({ progress: point.position, time, elapsed, phase });
      const hasEntrance = entrances.current.some(at => time < at + 260);
      const needsFrames = point.position !== target || point.velocity !== 0 || phase === 'checking' || (phase === 'rejected' && elapsed < 620 + length * 45 + 160) || hasEntrance;
      if (!reduced && needsFrames) request = requestAnimationFrame(tick);
    };
    tick(began);
    return () => cancelAnimationFrame(request);
  }, [digits, length, phase, reduced]);

  return { ...frame, elapsed: frame.phase === phase ? frame.elapsed : 0, entrances: entrances.current, reduced };
}

export function OtpField({
  label, length: lengthProp = 6, value, defaultValue = '', onChange, type = 'numeric', normalize, placeholder, groupSize, size: sizeProp = 'md',
  id, name, form, isRequired, required, description, hint, isInvalid, errorMessage, error, isDisabled, disabled: disabledProp,
  masked = false, hideLabel, autoFocus, validate, onComplete, onVerified, verifiedLabel = 'Verified', rejectedLabel = 'Code not accepted. Try again.',
  'aria-label': ariaLabel, 'aria-describedby': ariaDescribedBy, className, style, ref,
}: OtpFieldProps) {
  const fieldContext = useContext(FieldContext);
  const inField = fieldContext !== null && label == null;
  const length = Math.max(1, Math.round(lengthProp));
  const size: OtpSize = sizeAliases[sizeProp] ?? (sizeProp as OtpSize);
  const shape = geometry[size] ?? geometry.md;
  const generatedId = useId();
  const inputId = id ?? (inField ? fieldContext.id : generatedId);
  const disabled = isDisabled ?? disabledProp ?? (inField ? !!fieldContext.disabled : false);
  const message = errorMessage ?? error;
  const hasMessage = message != null && message !== '' && message !== false;
  const invalid = isInvalid ?? (hasMessage || (inField && fieldContext.invalid));
  const help = description ?? hint;
  const shownMessage = inField ? null : invalid && hasMessage ? message : help;
  const messageId = shownMessage != null && shownMessage !== '' ? `${inputId}-message` : undefined;

  const clean = (text: string) => {
    const rewritten = normalize ? normalize(text) : text;
    return rewritten.replace(type === 'alphanumeric' ? /[^A-Za-z0-9]/g : /[^0-9]/g, '').slice(0, length);
  };
  const [internal, setInternal] = useState(() => clean(defaultValue));
  const digits = clean(value ?? internal);
  const setCode = (next: string) => {
    if (value === undefined) setInternal(next);
    onChange?.(next);
  };

  const [focused, setFocused] = useState(false);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [phase, setPhase] = useState<PinPhase>('typing');
  const motion = usePinMotion(digits, length, phase);
  const [announcement, setAnnouncement] = useState('');
  const callbacks = useRef({ validate, onComplete, onVerified, setCode });
  callbacks.current = { validate, onComplete, onVerified, setCode };
  const inputRef = useRef<HTMLInputElement>(null);
  const completed = useRef('');
  const filterId = `code-goo-${generatedId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const verified = phase === 'verified';
  const validationEnabled = !!validate;

  // The input's DOM value is kept in sync here instead of through a controlled `value` prop: a state
  // update that an ancestor makes in a native input listener (Field does) would otherwise re-render
  // the input with the old value before React's own onChange runs, and the keystroke would be lost.
  useLayoutEffect(() => {
    const input = inputRef.current;
    if (input && input.value !== digits) input.value = digits;
  }, [digits]);

  useEffect(() => {
    if (digits.length !== length || disabled) {
      completed.current = '';
      setPhase('typing');
      return;
    }
    if (completed.current !== digits) { completed.current = digits; callbacks.current.onComplete?.(digits); }
    if (!validationEnabled) return;
    let canceled = false;
    let feedbackTimer: ReturnType<typeof setTimeout> | undefined;
    let resetTimer: ReturnType<typeof setTimeout> | undefined;
    setPhase('checking');
    setAnnouncement('Checking code');
    const started = performance.now();
    const decide = (accepted: boolean) => {
      if (canceled) return;
      const checkDelay = motion.reduced ? 0 : Math.max(0, 420 - (performance.now() - started));
      feedbackTimer = setTimeout(() => {
        if (canceled) return;
        if (accepted) {
          setPhase('verified'); setAnnouncement(verifiedLabel); callbacks.current.onVerified?.(digits); inputRef.current?.blur();
        } else {
          setPhase('rejected'); setAnnouncement(rejectedLabel);
          resetTimer = setTimeout(() => {
            if (!canceled) { callbacks.current.setCode(''); setPhase('typing'); setSelection({ start: 0, end: 0 }); }
          }, 620 + length * 45 + 160);
        }
      }, checkDelay);
    };
    Promise.resolve().then(() => callbacks.current.validate?.(digits)).then(accepted => decide(!!accepted), () => decide(false));
    return () => { canceled = true; clearTimeout(feedbackTimer); clearTimeout(resetTimer); };
  }, [digits, length, disabled, validationEnabled, verifiedLabel, rejectedLabel]);

  // Native form reset restores the starting code of an uncontrolled field.
  useEffect(() => {
    const owner = inputRef.current?.form;
    if (!owner || value !== undefined) return;
    const reset = () => queueMicrotask(() => { setInternal(clean(defaultValue)); setPhase('typing'); completed.current = ''; });
    owner.addEventListener('reset', reset);
    return () => owner.removeEventListener('reset', reset);
  }, [form, defaultValue, value === undefined]);

  function resetVerified() {
    if (!verified) return;
    setPhase('typing'); setAnnouncement(''); completed.current = ''; setCode('');
    setSelection({ start: 0, end: 0 });
  }

  function trackSelection(input: HTMLInputElement) {
    const start = input.selectionStart ?? digits.length;
    const end = input.selectionEnd ?? start;
    setSelection({ start, end });
  }

  function moveCaret(input: HTMLInputElement, offset: number) {
    setSelection({ start: offset, end: offset });
    requestAnimationFrame(() => {
      if (input.ownerDocument.activeElement === input) input.setSelectionRange(offset, offset);
    });
  }

  // Geometry: fluid cells (they shrink with a narrow container), fixed gaps, wider gaps at group breaks.
  const { gap } = shape;
  const separatorGap = gap * 2 + dashWidth;
  const groupOf = (index: number) => groupSize && groupSize > 0 ? Math.floor(index / groupSize) : 0;
  const breaks = groupOf(length - 1);
  const fixed = (length - 1 - breaks) * gap + breaks * separatorGap;
  const naturalWidth = length * shape.width + fixed;
  const cellWidth = `calc((100% - ${fixed}px) / ${length})`;
  const offsetOf = (index: number) => (index - groupOf(index)) * gap + groupOf(index) * separatorGap;
  const leftOf = (index: number) => `calc(${index} * (100% - ${fixed}px) / ${length} + ${offsetOf(index)}px)`;

  const progress = clampUnit(motion.progress);
  const stretch = Math.max(-.12, motion.progress - 1);
  const capsuleWidth = 128 * easeWindow(.3, 1, progress) * (1 + stretch * .9);
  const capsuleScaleY = 1 - stretch * .55;
  const labelProgress = easeWindow(.72, 1, progress);
  const markProgress = 1 - easeWindow(0, .45, progress);
  const shakeFor = (index: number) => phase === 'rejected' && !motion.reduced && motion.elapsed < 620
    ? 5 * Math.exp(-motion.elapsed / 190) * Math.sin(motion.elapsed / 1000 * Math.PI * 20 + index * .55) : 0;
  const cellScale = (index: number) => {
    if (motion.reduced) return 1;
    if (phase === 'checking') {
      const wave = motion.time % 900 / 900 * (length + 2) - index;
      return 1 - .07 * (wave > 0 && wave < 2 ? Math.sin(wave / 2 * Math.PI) : 0);
    }
    const age = (motion.time - (motion.entrances[index] ?? -Infinity)) / 260;
    return age > 0 && age < 1 ? 1 + .04 * Math.sin(Math.PI * age) : 1;
  };
  /** Moves a cell toward the center as the code merges into the verified pill. */
  const travel = (index: number) => {
    const pitch = ((length - 1) / 2 - index) * progress;
    const shift = (breaks / 2 - groupOf(index)) * (separatorGap - gap) * progress + shakeFor(index);
    return `translateX(calc(${pitch} * (100% + ${gap}px) + ${shift}px))`;
  };
  const roundness = easeWindow(.15, .7, progress);
  const cellRadius = `calc(${shape.radius} * ${1 - roundness} + ${shape.height / 2}px * ${roundness})`;
  const activeAt = (index: number) => !disabled && focused && phase === 'typing' && (selection.start === selection.end
    ? index === Math.min(selection.start, length - 1)
    : index >= selection.start && index < selection.end);
  const ranged = selection.start !== selection.end;
  const cells = Array.from({ length }, (_, index) => index);

  return <div ref={ref} style={style} className={withClassName(stylex.props(field.root, styles.root), className)}>
    {label != null && <label htmlFor={inputId} {...stylex.props(field.label, disabled && field.labelDisabled, hideLabel && styles.hidden)}>{label}</label>}
    <div data-pin-input="" data-phase={phase} {...stylex.props(styles.row, styles.rowWidth(naturalWidth), heights[size], invalid && styles.rowInvalid, disabled && styles.rowDisabled)}>
      <div aria-hidden="true" {...stylex.props(styles.layer, styles.goo(`url(#${filterId})`))}>
        {cells.map(index => <span key={index} {...stylex.props(
          styles.cell, heights[size], styles.place(cellWidth, leftOf(index)),
          styles.motion(`${travel(index)} scale(${cellScale(index)})`, cellRadius), disabled && styles.cellDisabled,
        )} />)}
        {motion.progress > 0 && <span {...stylex.props(styles.pill, styles.pillMotion(capsuleWidth, capsuleScaleY))} />}
      </div>
      <div aria-hidden="true" {...stylex.props(styles.layer, styles.fade(markProgress))}>
        {cells.map(index => {
          const active = activeAt(index);
          return <span key={index} {...stylex.props(
            styles.edge, heights[size], styles.place(cellWidth, leftOf(index)),
            styles.motion(`${travel(index)} scale(${cellScale(index)})`, cellRadius),
            active && (ranged ? styles.edgeSelected : invalid ? styles.edgeActiveInvalid : styles.edgeActive),
          )} />;
        })}
        {cells.filter(index => index > 0 && groupOf(index) !== groupOf(index - 1)).map(index => <span key={`break-${index}`}
          {...stylex.props(styles.separator, styles.separatorLeft(`calc(${leftOf(index)} - ${(separatorGap + dashWidth) / 2}px)`), disabled && styles.separatorDisabled)} />)}
      </div>
      {motion.progress > 0 && <span aria-hidden="true" {...stylex.props(styles.pill, styles.pillEdge, styles.pillMotion(capsuleWidth, capsuleScaleY), styles.fade(labelProgress))} />}
      {cells.map(index => {
        const filled = index < digits.length;
        const drain = phase === 'rejected' && !motion.reduced ? easeWindow(0, 1, (motion.elapsed - 300 - (length - 1 - index) * 45) / 220) : 0;
        const active = activeAt(index);
        const hintChar = placeholder?.[index];
        return <span key={index} aria-hidden="true" {...stylex.props(
          styles.slot, heights[size], size === 'sm' && styles.slotSmall, styles.place(cellWidth, leftOf(index)),
          styles.slotMotion(travel(index), markProgress),
          (invalid || phase === 'rejected') && styles.invalidDigit, disabled && styles.disabledDigit,
        )}>{filled
          ? <span key={digits[index]} {...stylex.props(styles.digit, styles.digitExit(drain))}>{masked ? '•' : digits[index]}</span>
          : active && !ranged ? <span {...stylex.props(styles.caret, size === 'sm' && styles.caretSmall)} />
          : hintChar ? <span {...stylex.props(!disabled && styles.hint)}>{hintChar}</span> : null}</span>;
      })}
      <span aria-hidden="true" {...stylex.props(styles.verified, styles.verifiedMotion(labelProgress))}><Icon name="check" size={16} />{verifiedLabel}</span>
      <input
        {...stylex.props(styles.input, verified && styles.verifiedInput)}
        ref={inputRef}
        aria-label={verified ? `${verifiedLabel}. Press to enter a new code` : ariaLabel}
        aria-busy={phase === 'checking' || undefined}
        id={inputId}
        name={name}
        form={form}
        type={masked ? 'password' : 'text'}
        inputMode={type === 'alphanumeric' ? 'text' : 'numeric'}
        autoComplete="one-time-code"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        autoFocus={autoFocus}
        pattern={type === 'alphanumeric' ? `[A-Za-z0-9]{${length}}` : `[0-9]{${length}}`}
        maxLength={length}
        required={isRequired ?? required ?? (inField ? fieldContext.required : undefined)}
        disabled={disabled}
        readOnly={phase === 'checking' || phase === 'rejected'}
        defaultValue={digits}
        aria-invalid={invalid || phase === 'rejected' ? true : undefined}
        aria-describedby={[ariaDescribedBy, inField ? fieldContext.descriptionId : undefined, messageId].filter(Boolean).join(' ') || undefined}
        onFocus={event => {
          setFocused(true);
          trackSelection(event.currentTarget);
        }}
        onBlur={() => setFocused(false)}
        onSelect={event => trackSelection(event.currentTarget)}
        onClick={event => {
          const input = event.currentTarget;
          if (verified) { resetVerified(); moveCaret(input, 0); return; }
          if (event.detail !== 1 || event.shiftKey || input.selectionStart !== input.selectionEnd) return;
          const bounds = input.getBoundingClientRect();
          const fraction = (event.clientX - bounds.left) / bounds.width;
          const rtl = getComputedStyle(input).direction === 'rtl';
          const cell = Math.floor((rtl ? 1 - fraction : fraction) * length);
          const offset = Math.max(0, Math.min(cell, digits.length));
          input.setSelectionRange(offset, offset);
          trackSelection(input);
        }}
        onKeyDown={event => {
          if (!verified) return;
          const typed = event.key.length === 1 ? clean(event.key) : '';
          if (typed) { event.preventDefault(); resetVerified(); setCode(typed); moveCaret(event.currentTarget, 1); }
          else if (['Backspace', 'Delete', 'Enter', ' '].includes(event.key)) { event.preventDefault(); resetVerified(); moveCaret(event.currentTarget, 0); }
        }}
        onChange={event => {
          const input = event.currentTarget;
          const next = clean(input.value);
          const beforeCaret = input.value.slice(0, input.selectionStart ?? input.value.length);
          if (next === input.value) trackSelection(input);
          else { input.value = next; moveCaret(input, clean(beforeCaret).length); }
          setCode(next);
        }}
        onPaste={event => {
          event.preventDefault();
          if (phase === 'checking' || phase === 'rejected') return;
          const pasted = clean(event.clipboardData.getData('text'));
          if (!pasted) return;
          const input = event.currentTarget;
          const start = verified ? 0 : input.selectionStart ?? digits.length;
          const end = verified ? digits.length : input.selectionEnd ?? start;
          if (verified) resetVerified();
          const next = clean(digits.slice(0, start) + pasted + digits.slice(end));
          input.value = next;
          setCode(next);
          moveCaret(input, Math.min(start + pasted.length, next.length));
        }}
      />
    </div>
    <svg aria-hidden="true" width="0" height="0" {...stylex.props(styles.hidden)}><defs><filter id={filterId} x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB"><feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/><feColorMatrix in="blur" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 24 -12"/></filter></defs></svg>
    <span role="status" {...stylex.props(styles.hidden)}>{announcement}</span>
    {messageId && <p id={messageId} {...stylex.props(invalid && hasMessage ? field.error : field.help, disabled && !invalid && field.labelDisabled)}>{shownMessage}</p>}
  </div>;
}
