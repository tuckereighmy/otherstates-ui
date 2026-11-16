'use client';

import * as stylex from '@stylexjs/stylex';
import { useCallback, useContext, useEffect, useId, useLayoutEffect, useRef, useState, type ComponentPropsWithRef, type ReactNode } from 'react';
import { tokens as t } from '../tokens.stylex';
import { withClassName } from './internal/class-name';
import { controlStyles, FieldContext } from './internal/control';
import { FieldGroupContext, fieldStyles as field } from './internal/field-styles';
import { fieldInputSizeStyles, normalizeSize, sizeScale, type ControlSizeProp } from './internal/size';

// A text-entry shell (spec 1.2, 1.5, 1.8): border-subtle at rest, border-muted on hover, the edge
// ring on focus. Insets follow the single-line field of the same size, so md is 14/20 text with
// 10 / 14 insets and an 80px minimum height (two md control heights).

// Insets and type are the single-line field's of the same size (`fieldInputSizeStyles`, spec 1.2): inline
// padding = inset - 1, block padding = (height - 2 - line) / 2, so the first line sits where an Input's value
// does; value text at 400, 16px on coarse pointers. Min height = 2 x the control height (md 80).
const sizes = stylex.create({
  xs: { minHeight: `calc(2 * ${t['--os-size-xs']})`, letterSpacing: 0 },
  sm: { minHeight: `calc(2 * ${t['--os-size-sm']})` },
  md: { minHeight: `calc(2 * ${t['--os-size-md']})` },
  lg: { minHeight: `calc(2 * ${t['--os-size-lg']})` },
  xl: { minHeight: `calc(2 * ${t['--os-size-xl']})` },
});

const s = stylex.create({
  textarea: {
    display: 'block', width: '100%', minWidth: 0, margin: 0, fontFamily: 'inherit', fontWeight: t['--os-font-weight-regular'],
    letterSpacing: t['--os-tracking-tight'], resize: 'vertical',
    // The edge ring replaces the outline. Forced colors drop its box-shadow half, so there the
    // focused textarea gets the 2px outline back.
    outlineStyle: { default: 'none', '@media (forced-colors: active)': { default: 'none', ':focus': 'solid' } },
    outlineWidth: 2, outlineOffset: 2, outlineColor: t['--os-color-focus-ring'],
    '::placeholder': { color: t['--os-color-fg-muted'], opacity: 1 },
  },
  // The shell caps the control radius at lg so a tall field never becomes a stadium (spec 1.3).
  shellRadius: { borderRadius: `min(${t['--os-radius-control']}, ${t['--os-radius-lg']})` },
  xsRadius: { borderRadius: `min(calc(${t['--os-radius-control']} - ${t['--os-radius-md']} + ${t['--os-radius-sm']}), ${t['--os-radius-lg']})` },
  /** Inside an InputGroup: the group owns the edge, the fill and the focus ring. */
  inner: {
    flexGrow: 1, flexShrink: 1, flexBasis: '100%', borderWidth: 0, borderStyle: 'none', borderRadius: 0,
    backgroundColor: 'transparent', color: 'inherit', boxShadow: 'none', outlineStyle: 'none',
  },
  /** Auto-resize: the height follows the content between minRows and maxRows. */
  auto: { resize: 'none', overflowY: 'hidden' },
  autoMin: { minHeight: 0 },
  disabled: { resize: 'none', cursor: 'default', '::placeholder': { color: t['--os-color-fg-disabled'] } },
  label: { color: t['--os-color-fg-base'] },
});

export type TextareaProps = ComponentPropsWithRef<'textarea'> & {
  /** Renders a label above the textarea. Leave it out inside a Field or an InputGroup, and name the textarea another way. */
  label?: ReactNode;
  /** Help text under the textarea. The error message replaces it while the textarea is invalid. */
  description?: ReactNode;
  /** @deprecated Use `description`. */
  hint?: ReactNode;
  /** Shown under the textarea, in place of the description, while it is invalid. */
  errorMessage?: ReactNode;
  /** @deprecated Use `errorMessage`. */
  error?: ReactNode;
  /** Shows the invalid edge and sets `aria-invalid`. Defaults to true when an error message is given. */
  isInvalid?: boolean;
  /** Disables the textarea and dims its label. Alias: `disabled`. */
  isDisabled?: boolean;
  /** Keeps the text selectable but not editable. Alias: `readOnly`. */
  isReadOnly?: boolean;
  /** Marks the textarea as required and adds ` *` to the label. Alias: `required`. */
  isRequired?: boolean;
  /** Text size and insets (spec 1.2). Legacy `small | medium | large` map to `sm | md | lg`. Inside an InputGroup the group's size wins. */
  size?: ControlSizeProp;
  /** Turns on auto-resize: the textarea is never shorter than this many lines. */
  minRows?: number;
  /** Turns on auto-resize: the textarea grows up to this many lines, then scrolls. */
  maxRows?: number;
  /** Shows the character count under the textarea, against `maxLength` when it is set. */
  showCount?: boolean;
};

export function Textarea({
  label, description, hint, errorMessage, error, isInvalid, isDisabled, isReadOnly, isRequired, disabled, readOnly, required,
  size, minRows, maxRows, showCount, id, className, style, ref, rows, value, defaultValue, maxLength, onChange,
  'aria-describedby': ariaDescribedBy, 'aria-invalid': ariaInvalid, ...props
}: TextareaProps) {
  const fieldContext = useContext(FieldContext);
  const group = useContext(FieldGroupContext);
  const generatedId = useId();
  const inputId = fieldContext?.id ?? id ?? generatedId;
  const sz = normalizeSize(group?.size ?? size);
  const errorText = errorMessage ?? error;
  const hasError = errorText != null && errorText !== false && errorText !== '';
  const invalid = isInvalid ?? (ariaInvalid !== undefined ? ariaInvalid !== false && ariaInvalid !== 'false' : !!(fieldContext?.invalid || group?.invalid || hasError));
  const isOff = isDisabled ?? disabled ?? (fieldContext?.disabled || group?.disabled || false);
  const isLocked = isReadOnly ?? readOnly ?? (fieldContext?.readOnly || group?.readOnly || false);
  const isNeeded = isRequired ?? required ?? fieldContext?.required ?? false;
  const autoResize = minRows !== undefined || maxRows !== undefined;
  const bare = group !== null;
  const message = bare ? undefined : invalid && hasError ? errorText : description ?? hint;
  const messageId = message ? `${inputId}-message` : undefined;
  const counted = showCount && !bare;
  const countId = counted ? `${inputId}-count` : undefined;

  const [typed, setTyped] = useState(() => String(defaultValue ?? '').length);
  const length = value !== undefined ? String(value).length : typed;

  const node = useRef<HTMLTextAreaElement | null>(null);
  const setNode = useCallback((element: HTMLTextAreaElement | null) => {
    node.current = element;
    if (typeof ref === 'function') ref(element);
    else if (ref) ref.current = element;
  }, [ref]);

  const fit = useCallback(() => {
    const element = node.current;
    if (!element || !autoResize) return;
    const computed = getComputedStyle(element);
    const line = parseFloat(computed.lineHeight) || sizeScale[sz].lineHeight;
    const edges = parseFloat(computed.borderTopWidth) + parseFloat(computed.borderBottomWidth);
    const chrome = parseFloat(computed.paddingTop) + parseFloat(computed.paddingBottom) + edges;
    const max = maxRows ? maxRows * line + chrome : Infinity;
    element.style.height = 'auto';
    const content = element.scrollHeight + edges;
    const min = minRows ? minRows * line + chrome : 0;
    element.style.height = `${Math.min(Math.max(content, min), max)}px`;
    element.style.overflowY = content > max ? 'auto' : 'hidden';
  }, [autoResize, minRows, maxRows, sz]);

  useLayoutEffect(fit);

  useEffect(() => {
    const element = node.current;
    if (!element) return;
    let width = element.offsetWidth;
    const observer = autoResize ? new ResizeObserver(() => { if (element.offsetWidth !== width) { width = element.offsetWidth; fit(); } }) : null;
    observer?.observe(element);
    const form = element.form;
    const onReset = () => requestAnimationFrame(() => { setTyped(element.value.length); fit(); });
    form?.addEventListener('reset', onReset);
    return () => { observer?.disconnect(); form?.removeEventListener('reset', onReset); };
  }, [autoResize, fit]);

  useLayoutEffect(() => group?.registerMultiline?.(), [group?.registerMultiline]);

  const textareaSx = stylex.props(
    s.textarea, fieldInputSizeStyles[sz], sizes[sz],
    bare ? s.inner : [controlStyles.shell, sz === 'xs' ? s.xsRadius : s.shellRadius, isLocked && controlStyles.readOnly, invalid && controlStyles.invalid, isOff && controlStyles.disabled],
    autoResize && s.auto, autoResize && minRows !== undefined && s.autoMin, isOff && s.disabled,
  );
  const wrapped = !bare && (label != null || message != null || counted);

  const textarea = <textarea
    {...props}
    {...textareaSx}
    className={wrapped ? textareaSx.className : withClassName(textareaSx, className)}
    style={wrapped ? undefined : style}
    ref={setNode}
    id={inputId}
    rows={autoResize ? 1 : rows}
    value={value}
    defaultValue={defaultValue}
    maxLength={maxLength}
    disabled={isOff}
    readOnly={isLocked}
    required={isNeeded || undefined}
    aria-invalid={invalid || undefined}
    aria-describedby={[ariaDescribedBy, fieldContext?.descriptionId, messageId, countId].filter(Boolean).join(' ') || undefined}
    onChange={event => { if (value === undefined) setTyped(event.currentTarget.value.length); onChange?.(event); fit(); }}
  />;

  if (!wrapped) return textarea;

  const rootSx = stylex.props(field.root);
  return <div {...rootSx} className={withClassName(rootSx, className)} style={style}>
    {label != null && <label htmlFor={inputId} {...stylex.props(field.label, s.label, isOff && field.labelDisabled)}>
      {label}{isNeeded && <span aria-hidden="true" {...stylex.props(field.required)}> *</span>}
    </label>}
    {textarea}
    {(message != null || counted) && <div {...stylex.props(field.messageRow)}>
      {message != null && <p id={messageId} {...stylex.props(invalid && hasError ? field.error : [field.help, isOff && field.labelDisabled])}>{message}</p>}
      {counted && <span id={countId} {...stylex.props(field.count, isOff && field.labelDisabled)}>{maxLength !== undefined ? `${length}/${maxLength}` : `${length} characters`}</span>}
    </div>}
  </div>;
}
