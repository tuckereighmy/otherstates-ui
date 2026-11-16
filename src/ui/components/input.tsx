'use client';

import * as stylex from '@stylexjs/stylex';
import { cloneElement, isValidElement, useContext, useId, useLayoutEffect, useRef, useState, type ComponentPropsWithRef, type ReactElement, type ReactNode } from 'react';
import { tokens as t } from '../tokens.stylex';
import { Icon, type IconProps } from './Icon';
import { withClassName } from './internal/class-name';
import { controlShellSizeStyles, controlStyles, FieldContext, InputGroupContext } from './internal/control';
import { FieldGroupContext, fieldShellSizeStyles, fieldStyles } from './internal/field-styles';
import { fieldInputSizeStyles, normalizeSize, radiusStyles, sizeScale, type ControlSizeProp } from './internal/size';

const reduce = '@media (prefers-reduced-motion: reduce)';
const canHover = '@media (hover: hover)';
const forced = '@media (forced-colors: active)';

// ---------------------------------------------------------------------------------------------
// Input: the native <input>. Standalone it is its own bordered shell (spec 1.2, 1.5, 1.8); inside
// an InputGroup it is the group's inner control and the group owns the edge.

const inputStyles = stylex.create({
  /**
   * The edge ring replaces the outline on a text-entry shell. Forced colors drop the box-shadow
   * half of the edge, so there the focused input gets the 2px outline back.
   */
  standalone: {
    outlineStyle: { default: 'none', [forced]: { default: 'none', ':focus': 'solid' } },
    outlineWidth: 2, outlineOffset: 2, outlineColor: t['--os-color-focus-ring'],
  },
  inner: { flexGrow: 1, flexShrink: 1, flexBasis: 0 },
  trackingXs: { letterSpacing: 0 },
  placeholderDisabled: { '::placeholder': { color: t['--os-color-fg-disabled'] } },
  /** type="file": the picker button reads as the action, the file name as the value. */
  file: {
    color: t['--os-color-fg-muted'], cursor: 'pointer',
    '::file-selector-button': {
      marginInlineEnd: t['--os-space-3'], paddingBlock: 0, paddingInline: 0, borderWidth: 0, borderStyle: 'none',
      backgroundColor: 'transparent', color: t['--os-color-fg-base'], fontFamily: 'inherit',
      fontSize: 'inherit', fontWeight: t['--os-font-weight-medium'], letterSpacing: 'inherit', cursor: 'pointer',
    },
  },
  fileDisabled: { cursor: 'default', '::file-selector-button': { color: t['--os-color-fg-disabled'], cursor: 'default' } },
});

export type InputProps = Omit<ComponentPropsWithRef<'input'>, 'size'> & {
  /** Height and text size (spec 1.2). Legacy `small | medium | large` map to `sm | md | lg`. Inside an InputGroup the group's size wins. */
  size?: ControlSizeProp;
  /** Shows the invalid edge and sets `aria-invalid`. Inside a Field, the Field's error sets it. */
  isInvalid?: boolean;
  /** Disables the input. Alias: `disabled`. */
  isDisabled?: boolean;
  /** Makes the value selectable but not editable. Alias: `readOnly`. */
  isReadOnly?: boolean;
  /** Marks the input as required. Alias: `required`. */
  isRequired?: boolean;
  /** The native `size` attribute: the visible width in characters. */
  htmlSize?: number;
};

const isTruthyAria = (value: InputProps['aria-invalid']) => value !== undefined && value !== false && value !== 'false';

export function Input({
  id, className, size, isInvalid, isDisabled, isReadOnly, isRequired, disabled, readOnly, required, htmlSize, type,
  'aria-invalid': ariaInvalid, 'aria-describedby': ariaDescribedBy, ...props
}: InputProps) {
  const field = useContext(FieldContext);
  const group = useContext(FieldGroupContext);
  const grouped = useContext(InputGroupContext) || group !== null;
  const sz = normalizeSize(group?.size ?? size);
  const invalid = isInvalid ?? (ariaInvalid !== undefined ? isTruthyAria(ariaInvalid) : !!(field?.invalid || group?.invalid));
  const isOff = isDisabled ?? disabled ?? (field?.disabled || group?.disabled || false);
  const isLocked = isReadOnly ?? readOnly ?? (field?.readOnly || group?.readOnly || false);
  const describedBy = [ariaDescribedBy, field?.descriptionId].filter(Boolean).join(' ') || undefined;
  const file = type === 'file';

  const sx = grouped
    ? stylex.props(
      controlStyles.input, fieldInputSizeStyles[sz], controlStyles.inputInner, inputStyles.inner,
      sz === 'xs' && inputStyles.trackingXs, file && inputStyles.file,
      isOff && inputStyles.placeholderDisabled, isOff && file && inputStyles.fileDisabled,
    )
    : stylex.props(
      controlStyles.input, fieldInputSizeStyles[sz], controlStyles.shell, controlShellSizeStyles[sz], radiusStyles[sz],
      inputStyles.standalone, sz === 'xs' && inputStyles.trackingXs, file && inputStyles.file,
      isLocked && controlStyles.readOnly, invalid && controlStyles.invalid,
      isOff && controlStyles.disabled, isOff && inputStyles.placeholderDisabled, isOff && file && inputStyles.fileDisabled,
    );

  return <input {...props} {...sx} className={withClassName(sx, className)} type={type} size={htmlSize}
    id={field?.id ?? id} aria-describedby={describedBy}
    aria-invalid={isInvalid !== undefined ? (isInvalid || undefined) : ariaInvalid ?? (invalid || undefined)}
    disabled={isOff} readOnly={isLocked} required={isRequired ?? required ?? field?.required} />;
}

// ---------------------------------------------------------------------------------------------
// TextField: label, Input-shaped shell, help or error line in one component. The default is the
// xl field (48); `size` picks another. `floating` puts the label inside the shell; `floating="notch"`
// draws its own stroke and lifts the label into a notch. Both are xl fields: 48 tall, value and label
// at the xl field inset (16).

/** An `<Icon>` with no size of its own takes the field's icon size (spec 1.15). */
function sizedIcon(node: ReactNode, px: number): ReactNode {
  return isValidElement(node) && node.type === Icon && (node.props as IconProps).size === undefined
    ? cloneElement(node as ReactElement<IconProps>, { size: px })
    : node;
}

const labelHop = stylex.keyframes({ '0%, 100%': { transform: 'translateY(0)' }, '38%': { transform: 'translateY(-3px)' } });

// Notch field geometry (spec 1.2 xl): 48 tall, value and label 16 from the outer edge (the drawn 1px stroke
// stands in for the border), the label raised to 12px (16 x .75) in a notch 4px wider than it on each side.
const NOTCH_HEIGHT = 48;
const NOTCH_INSET = 16;
const NOTCH_RAISED_SCALE = .75;
const NOTCH_PAD = 4;

const s = stylex.create({
  root: { minWidth: 0 },
  label: { color: t['--os-color-fg-base'] },
  /** Forced colors drop the box-shadow half of the edge ring; the focused shell gets the 2px outline instead. */
  shellForced: {
    outlineStyle: { default: 'none', [forced]: { default: 'none', ':focus-within': 'solid' } },
    outlineWidth: 2, outlineOffset: 2, outlineColor: t['--os-color-focus-ring'],
  },
  /** The raised label is 12px text: no tracking (spec 1.4). */
  raisedLabel: { letterSpacing: 0 },
  input: {
    alignSelf: 'stretch', width: '100%', minWidth: 0, borderWidth: 0, borderStyle: 'none', outlineStyle: 'none',
    backgroundColor: 'transparent', color: 'inherit', paddingBlock: 0, paddingInline: 0, font: 'inherit', letterSpacing: 'inherit',
    '::placeholder': { color: t['--os-color-fg-muted'], opacity: 1 },
  },
  inputDisabled: { cursor: 'default', '::placeholder': { color: t['--os-color-fg-disabled'] } },
  icon: { display: 'flex', alignItems: 'center', flexShrink: 0, color: t['--os-color-fg-muted'] },
  iconDisabled: { color: t['--os-color-fg-disabled'] },
  floatingStack: { position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', flexGrow: 1, minWidth: 0, alignSelf: 'stretch' },
  restingLabel: {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)', fontSize: t['--os-font-size-body'], lineHeight: 1,
    color: t['--os-color-fg-muted'], whiteSpace: 'nowrap', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', pointerEvents: 'none',
  },
  restingDisabled: { color: t['--os-color-fg-disabled'] },
  floatingInput: { alignSelf: 'auto', minHeight: 16, lineHeight: 1 },
  // The notch field: the xl shell's 48px height, the control radius (spec 1.3; the drawn stroke clamps it
  // to 24, a pill), a drawn stroke with a notch for the label.
  notchShell: {
    padding: 0, paddingInline: 0, borderWidth: 0, borderStyle: 'none', borderRadius: t['--os-radius-control'],
    backgroundColor: 'transparent', boxShadow: 'none', cursor: 'text',
    '--os-notch-stroke': { default: t['--os-color-border-subtle'], ':hover': { default: null, [canHover]: t['--os-color-border-muted'] } },
  },
  notchInput: {
    position: 'absolute', inset: 0, height: '100%', width: '100%', borderRadius: 'inherit', paddingBlock: 0, paddingInline: t['--os-space-4'],
    fontSize: t['--os-font-size-body'], lineHeight: t['--os-line-height-lg'], letterSpacing: t['--os-tracking-tight'],
  },
  notchShellDisabled: { color: t['--os-color-fg-disabled'], cursor: 'default' },
  notchOutline: { position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' },
  notchPath: {
    fill: 'none', stroke: 'var(--os-notch-stroke)', strokeWidth: 1, strokeLinecap: 'butt',
    transitionProperty: 'stroke, stroke-width', transitionDuration: { default: t['--os-motion-hover'], [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  /** The edge ring of a text-entry shell, drawn: a 2px edge in the focus-ring color (spec 1.8). */
  notchPathFocused: { stroke: t['--os-color-focus-ring'], strokeWidth: 2 },
  notchPathError: { stroke: t['--os-color-border-error'] },
  notchPathDisabled: { stroke: t['--os-color-border-disabled'] },
  notchPathReadOnly: { stroke: t['--os-color-border-subtle'] },
  notchGap: {
    strokeDasharray: '1 2', strokeDashoffset: 0, transitionProperty: 'stroke, stroke-width, stroke-dashoffset',
    transitionDuration: { default: `${t['--os-motion-hover']}, ${t['--os-motion-hover']}, ${t['--os-motion-layout']}`, [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  notchGapOpen: { strokeDashoffset: -1 },
  notchLabel: {
    position: 'absolute', insetInlineStart: t['--os-space-4'], top: '50%', fontSize: t['--os-font-size-body'], fontWeight: t['--os-font-weight-regular'], lineHeight: 1,
    letterSpacing: t['--os-tracking-tight'], whiteSpace: 'pre', color: t['--os-color-fg-muted'], transformOrigin: 'left center',
    transform: 'translateY(-50%)', cursor: 'text', userSelect: 'none', transitionProperty: 'transform, color',
    transitionDuration: { default: `${t['--os-motion-layout']}, ${t['--os-motion-hover']}`, [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  // Raised: the label's center moves from the middle of the 48px shell (24) onto the top edge, at 12px (16 x .75).
  notchLabelRaised: { transform: 'translateY(-50%) translateY(-24px) scale(.75)' },
  notchLabelFocused: { color: t['--os-color-fg-base'] },
  notchLetter: { display: 'inline-block' },
  notchLetterHop: {
    animationName: { default: labelHop, [reduce]: 'none' }, animationDuration: t['--os-motion-layout'],
    animationTimingFunction: t['--os-ease-settle'], animationFillMode: 'both',
  },
});

export type TextFieldProps = Omit<ComponentPropsWithRef<'input'>, 'size'> & {
  /** Names the field. Shown above the shell, or inside it when `floating` is set. */
  label: string;
  /** Help text under the field. The error message replaces it while the field is invalid. */
  description?: ReactNode;
  /** @deprecated Use `description`. */
  hint?: ReactNode;
  /** Shown under the field, in place of the description, while the field is invalid. */
  errorMessage?: ReactNode;
  /** @deprecated Use `errorMessage`. */
  error?: ReactNode;
  /** Shows the invalid edge. Defaults to true when an error message is given. */
  isInvalid?: boolean;
  /** Disables the field and dims its label. Alias: `disabled`. */
  isDisabled?: boolean;
  /** Keeps the value selectable but not editable. Alias: `readOnly`. */
  isReadOnly?: boolean;
  /** Marks the field as required and adds ` *` to the label. Alias: `required`. */
  isRequired?: boolean;
  /** Height and text size (spec 1.2). Default `xl` (48). The floating and notch fields are always xl. */
  size?: ControlSizeProp;
  /** An icon before the value, in `fg-muted`. An `<Icon>` without a size takes the field's icon size. */
  leadingIcon?: ReactNode;
  /** An icon after the value, in `fg-muted`. An `<Icon>` without a size takes the field's icon size. */
  trailingIcon?: ReactNode;
  /** `true` floats the label inside the shell; `'notch'` draws its own stroke, which opens around the raised label. */
  floating?: boolean | 'notch';
};

export function TextField({
  id, label, description, hint, errorMessage, error, isInvalid, isDisabled, isReadOnly, isRequired, disabled, readOnly, required,
  size, leadingIcon, trailingIcon, floating, placeholder, value, defaultValue, onChange, onFocus, onBlur, className, style,
  'aria-describedby': ariaDescribedBy, ...props
}: TextFieldProps) {
  const generated = useId();
  const [focused, setFocused] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);
  const notchLabelRef = useRef<HTMLLabelElement>(null);
  const [notchSize, setNotchSize] = useState({ width: 280, labelWidth: 40, radius: 20 });
  const notch = floating === 'notch';
  const [uncontrolled, setUncontrolled] = useState(() => String(defaultValue ?? ''));
  const inputId = id ?? generated;
  // The floating and notch fields are always xl; their icons take the xl icon size too.
  const sz = floating ? 'xl' : normalizeSize(size, 'xl');
  const errorText = errorMessage ?? error;
  const invalid = isInvalid ?? (errorText != null && errorText !== false && errorText !== '');
  const isOff = isDisabled ?? disabled ?? false;
  const isLocked = isReadOnly ?? readOnly ?? false;
  const isNeeded = isRequired ?? required ?? false;
  const message = invalid && errorText ? errorText : description ?? hint;
  const messageId = message ? `${inputId}-message` : undefined;
  const raised = !!floating && (focused || String(value ?? uncontrolled).length > 0);
  const mark = isNeeded ? <span aria-hidden="true" {...stylex.props(fieldStyles.required)}> *</span> : null;

  const measureNotch = () => {
    const shell = shellRef.current; const labelElement = notchLabelRef.current;
    if (!notch || !shell || !labelElement) return;
    const next = { width: shell.getBoundingClientRect().width, labelWidth: labelElement.offsetWidth, radius: parseFloat(getComputedStyle(shell).borderTopLeftRadius) || 0 };
    setNotchSize(previous => Math.abs(previous.width - next.width) < .05 && previous.labelWidth === next.labelWidth && previous.radius === next.radius ? previous : next);
  };
  useLayoutEffect(measureNotch);
  useLayoutEffect(() => {
    if (!notch || !shellRef.current) return;
    const observer = new ResizeObserver(measureNotch);
    observer.observe(shellRef.current);
    return () => observer.disconnect();
  }, [notch, label]);

  const notchRadius = Math.min(notchSize.radius, NOTCH_HEIGHT / 2, notchSize.width / 2);
  const arc = Math.max(0, notchRadius - .75);
  const notchStart = NOTCH_INSET - NOTCH_PAD;
  const notchEnd = Math.min(notchSize.width - notchRadius, Math.max(notchRadius, NOTCH_INSET + notchSize.labelWidth * NOTCH_RAISED_SCALE + NOTCH_PAD));
  // On corners rounder than the notch start (Round: a 24px cap) the notch cuts into the top-left arc, so the
  // stroke ends on the curve instead of running flat past it; the closed notch redraws that piece of arc.
  const notchCut = notchStart < notchRadius;
  const notchCutY = notchCut ? notchRadius - Math.sqrt(Math.max(0, arc * arc - (notchRadius - notchStart) ** 2)) : .75;
  const notchBorderPath = `M${notchEnd},.75 H${notchSize.width - notchRadius} A${arc},${arc} 0 0 1 ${notchSize.width - .75},${notchRadius} V${NOTCH_HEIGHT - notchRadius} A${arc},${arc} 0 0 1 ${notchSize.width - notchRadius},${NOTCH_HEIGHT - .75} H${notchRadius} A${arc},${arc} 0 0 1 .75,${NOTCH_HEIGHT - notchRadius} V${notchRadius} `
    + (notchCut ? `A${arc},${arc} 0 0 1 ${notchStart},${notchCutY}` : `A${arc},${arc} 0 0 1 ${notchRadius},.75 H${notchStart}`);
  const notchGapPath = notchCut
    ? `M${notchStart},${notchCutY} A${arc},${arc} 0 0 1 ${notchRadius},.75 H${notchEnd}`
    : `M${notchStart},.75 H${notchEnd}`;
  const pathState = [focused && s.notchPathFocused, isLocked && !focused && s.notchPathReadOnly, invalid && s.notchPathError, isOff && s.notchPathDisabled];

  const input = <input {...props} {...stylex.props(s.input, !!floating && !notch && s.floatingInput, notch && s.notchInput, isOff && s.inputDisabled)}
    id={inputId} disabled={isOff} readOnly={isLocked} required={isNeeded || undefined}
    aria-label={props['aria-label'] ?? (notch ? label : undefined)}
    placeholder={floating && !raised ? undefined : placeholder} value={value} defaultValue={defaultValue}
    aria-invalid={invalid || undefined} aria-describedby={[ariaDescribedBy, messageId].filter(Boolean).join(' ') || undefined}
    onChange={event => { if (value === undefined) setUncontrolled(event.currentTarget.value); onChange?.(event); }}
    onFocus={event => { setFocused(true); onFocus?.(event); }} onBlur={event => { setFocused(false); onBlur?.(event); }} />;

  const rootSx = stylex.props(fieldStyles.root, s.root);
  const shellSx = notch
    ? stylex.props(fieldStyles.shell, s.notchShell, s.shellForced, isOff && s.notchShellDisabled)
    : stylex.props(
      fieldStyles.shell, !floating && fieldShellSizeStyles[sz], s.shellForced,
      isLocked && fieldStyles.readOnly, invalid && fieldStyles.invalid, isOff && fieldStyles.disabled,
    );

  return <div {...rootSx} className={withClassName(rootSx, className)} style={style}>
    {!floating && <label htmlFor={inputId} {...stylex.props(fieldStyles.label, s.label, isOff && fieldStyles.labelDisabled)}>{label}{mark}</label>}
    <div ref={shellRef} data-notch-field={notch || undefined} {...shellSx}>
      {leadingIcon && <span {...stylex.props(s.icon, isOff && s.iconDisabled)}>{sizedIcon(leadingIcon, sizeScale[sz].icon)}</span>}
      {notch ? <>
        <svg aria-hidden="true" viewBox={`0 0 ${notchSize.width} ${NOTCH_HEIGHT}`} {...stylex.props(s.notchOutline)}>
          <path d={notchBorderPath} vectorEffect="non-scaling-stroke" {...stylex.props(s.notchPath, ...pathState)} />
          <path d={notchGapPath} pathLength="1" vectorEffect="non-scaling-stroke" {...stylex.props(s.notchPath, s.notchGap, raised && s.notchGapOpen, ...pathState)} />
        </svg>
        {input}
        <label ref={notchLabelRef} htmlFor={inputId} {...stylex.props(s.notchLabel, raised && s.notchLabelRaised, focused && s.notchLabelFocused, isOff && s.restingDisabled)}>
          {[...label].map((letter, index) => <span key={`${index}-${focused}`} {...stylex.props(s.notchLetter, focused && s.notchLetterHop)} style={focused ? { animationDelay: `${index * 24}ms` } : undefined}>{letter}</span>)}
          {mark}
        </label>
      </> : floating ? <div {...stylex.props(s.floatingStack)}>
        <label htmlFor={inputId} {...stylex.props(raised ? [fieldStyles.smallLabel, s.raisedLabel] : s.restingLabel, isOff && s.restingDisabled)}>{label}{mark}</label>
        {input}
      </div> : input}
      {trailingIcon && <span {...stylex.props(s.icon, isOff && s.iconDisabled)}>{sizedIcon(trailingIcon, sizeScale[sz].icon)}</span>}
    </div>
    {message && <p id={messageId} {...stylex.props(invalid && errorText ? fieldStyles.error : [fieldStyles.help, isOff && fieldStyles.labelDisabled])}>{message}</p>}
  </div>;
}
