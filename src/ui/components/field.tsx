'use client';

import * as stylex from '@stylexjs/stylex';
import {
  createContext, useCallback, useContext, useEffect, useId, useLayoutEffect, useMemo, useRef, useState,
  type ComponentPropsWithRef, type MouseEvent, type ReactNode,
} from 'react';
import { FormValidationContext } from 'react-aria-components';
import { tokens as t } from '../tokens.stylex';
import { withClassName } from './internal/class-name';
import { controlStyles, FieldContext, FieldsetContext, type FieldContextValue, type FieldValidityState } from './internal/control';
import { disabledStyles } from './internal/states';
import { Label, type LabelProps } from './label';

export type { FieldValidityState } from './internal/control';

// One field system (DESIGN_SPEC 1.11): a label, the control, then one message slot. Label → control 8,
// control → message 8. The error replaces the description, so the control is described by one
// message at a time (1.8 Invalid). Native constraints (required, type, pattern, minLength…) are read
// from the control and shown after it has been edited and blurred, or when its form is submitted.

const s = stylex.create({
  horizontal: {
    gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)', rowGap: t['--os-space-2'], columnGap: t['--os-space-4'], alignItems: 'baseline',
  },
  body: { display: 'grid', gap: t['--os-space-2'], minWidth: 0, gridColumnStart: 2 },
  // The label is as wide as its text, like a native label, so the empty row beside it is not a click target.
  label: { justifySelf: 'start', maxWidth: '100%' },
  // Under a single checkbox or switch the message lines up with the choice's label text.
  inset: (px: number) => ({ paddingInlineStart: px }),
});

const hasContent = (node: unknown) => node != null && node !== false && node !== '';

type FormControl = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
const isFormControl = (node: unknown): node is FormControl =>
  node instanceof HTMLInputElement || node instanceof HTMLTextAreaElement || node instanceof HTMLSelectElement;

const validityKeys = [
  'badInput', 'customError', 'patternMismatch', 'rangeOverflow', 'rangeUnderflow', 'stepMismatch',
  'tooLong', 'tooShort', 'typeMismatch', 'valueMissing', 'valid',
] as const;
type NativeValidity = { details: ValidityState; messages: string[] };
const validNative: NativeValidity = {
  details: Object.fromEntries(validityKeys.map(key => [key, key === 'valid'])) as unknown as ValidityState,
  messages: [],
};

function readNative(control: FormControl, previous: NativeValidity): NativeValidity {
  const { validity } = control;
  const messages = validity.valid || !control.validationMessage ? [] : [control.validationMessage];
  const same = validityKeys.every(key => previous.details[key] === validity[key])
    && previous.messages.join('\n') === messages.join('\n');
  if (same) return previous;
  return { details: Object.fromEntries(validityKeys.map(key => [key, validity[key]])) as unknown as ValidityState, messages };
}

// `label` and `description` count mounted parts, `error` counts visible error lines, and the `custom*`
// counts track parts placed by hand: the Field's own description or error line steps aside for them.
/**
 * The inline offset of a single choice's label text from the Field's start edge, so the Field's
 * message can sit under the text rather than under the indicator. 0 for card rows (a bordered row
 * holds its own text) and for choices whose label is visually hidden.
 */
function measureChoiceInset(control: HTMLInputElement, root: HTMLElement) {
  const row = control.closest('label');
  if (!row || !root.contains(row) || parseFloat(getComputedStyle(row).borderTopWidth) > 0) return 0;
  const walker = document.createTreeWalker(row, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!node.textContent?.trim() || node.parentElement?.closest('[aria-hidden="true"]')) continue;
    const range = document.createRange();
    range.selectNodeContents(node);
    const text = range.getBoundingClientRect();
    if (text.width <= 1) continue;
    const box = root.getBoundingClientRect();
    return Math.max(0, Math.round(getComputedStyle(root).direction === 'rtl' ? box.right - text.right : text.left - box.left));
  }
  return 0;
}

type FieldPart = 'label' | 'description' | 'error' | 'customDescription' | 'customError';
// How FieldLabel points at the control: a `<label for>` for text controls; a span for anything a
// `<label>` cannot target (groups, sliders), which those controls name through `aria-labelledby`;
// `focus` is a span that moves focus on click, for button triggers a `<label>` would activate.
type LabelMode = 'for' | 'focus' | 'group';
type FieldParts = {
  register: (part: FieldPart) => () => void;
  errorVisible: boolean;
  customDescription: boolean;
  customError: boolean;
  optional: boolean;
  serverErrors: string[] | null;
  message: FieldProps['errorMessage'];
  labelMode: LabelMode;
  choiceInset: number;
};
const FieldPartsContext = createContext<FieldParts | null>(null);

/** Props a Field passes to a render-prop child. Spread them onto the control. */
export type FieldControlProps = Pick<ComponentPropsWithRef<'input'>, 'id' | 'aria-describedby' | 'aria-invalid' | 'disabled' | 'required' | 'readOnly'>;

export type FieldProps = Omit<ComponentPropsWithRef<'div'>, 'children' | 'id'> & {
  /** The id of the control. Generated when omitted. */
  id?: string;
  /** The visible label: a `<label>` for text controls, a span that groups and pickers name themselves with. */
  label?: ReactNode;
  /** Help text under the control. The error replaces it while the field is invalid. */
  description?: ReactNode;
  /**
   * The error message. A node marks the field invalid while it is set. A function is called with
   * the validity state and shows only while the field is invalid.
   */
  errorMessage?: ReactNode | ((validity: FieldValidityState) => ReactNode);
  /** @deprecated Use `errorMessage`. */
  error?: ReactNode;
  /** Marks the field invalid, with or without a message. Overrides native and server validity. */
  isInvalid?: boolean;
  /** Appends " *" to the label and makes the control required. */
  isRequired?: boolean;
  /** @deprecated Use `isRequired`. */
  required?: boolean;
  /** Appends "(optional)" to the label. */
  isOptional?: boolean;
  /** Disables the control and dims the label and message. A disabled Fieldset sets it too. */
  isDisabled?: boolean;
  /** @deprecated Use `isDisabled`. */
  disabled?: boolean;
  /** Makes the control read-only. */
  isReadOnly?: boolean;
  /** `horizontal` puts the label in a column beside the control. */
  orientation?: 'vertical' | 'horizontal';
  /** The control, or a function that receives the props to spread onto it. */
  children?: ReactNode | ((control: FieldControlProps) => ReactNode);
};

export function Field({
  id, label, description, errorMessage, error, isInvalid, isRequired, required, isOptional,
  isDisabled, disabled, isReadOnly, orientation = 'vertical', children, className, ref, ...props
}: FieldProps) {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  const fieldset = useContext(FieldsetContext);
  const fieldRequired = isRequired ?? required ?? false;
  const fieldDisabled = !!fieldset?.disabled || (isDisabled ?? disabled ?? false);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const setRoot = useCallback((node: HTMLDivElement | null) => {
    rootRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  }, [ref]);

  const [native, setNative] = useState(validNative);
  const [touched, setTouched] = useState(false);
  const dirty = useRef(false);
  const [controlName, setControlName] = useState<string | null>(null);
  const formErrors = useContext(FormValidationContext);
  const formErrorsRef = useRef(formErrors);
  formErrorsRef.current = formErrors;
  const [clearedErrors, setClearedErrors] = useState<object | null>(null);

  const getControl = useCallback(() => {
    const node = document.getElementById(controlId);
    return isFormControl(node) && rootRef.current?.contains(node) ? node : null;
  }, [controlId]);

  const [labelMode, setLabelMode] = useState<LabelMode>('for');
  const [choiceInset, setChoiceInset] = useState(0);

  useLayoutEffect(() => {
    const control = getControl();
    setControlName(control?.getAttribute('name') || null);
    setNative(previous => control ? readNative(control, previous) : validNative);
    const root = rootRef.current;
    const target = document.getElementById(controlId);
    const inside = !!target && !!root?.contains(target);
    const labelable = !!control && !(control instanceof HTMLInputElement && control.type === 'hidden');
    const focusable = inside && target instanceof HTMLElement && !(target instanceof HTMLInputElement)
      && (target instanceof HTMLButtonElement || target.tabIndex >= 0);
    setLabelMode(labelable ? 'for' : focusable ? 'focus' : 'group');
    const choice = control instanceof HTMLInputElement && (control.type === 'checkbox' || control.type === 'radio');
    setChoiceInset(choice && root && !hasLabel ? measureChoiceInset(control, root) : 0);
  });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const isControl = (target: EventTarget | null): target is FormControl => isFormControl(target) && target.id === controlId;
    const onInvalid = (event: Event) => {
      if (!isControl(event.target)) return;
      const control = event.target;
      event.preventDefault();
      setTouched(true);
      setNative(previous => readNative(control, previous));
      const first = control.form && Array.from(control.form.elements).find(item => isFormControl(item) && item.willValidate && !item.validity.valid);
      if (first === control) control.focus();
    };
    const onEdit = (event: Event) => {
      if (!isControl(event.target)) return;
      const control = event.target;
      dirty.current = true;
      // Deferred: this listener runs before React's own onChange (React listens at the app root), so updating
      // state here re-rendered a controlled input with its old value and the keystroke was lost.
      window.setTimeout(() => {
        setNative(previous => readNative(control, previous));
        setClearedErrors(formErrorsRef.current);
      });
    };
    const onBlur = (event: Event) => {
      if (isControl(event.target) && dirty.current) setTouched(true);
    };
    const onFormEvent = (event: Event) => {
      const control = getControl();
      if (!control?.form || control.form !== event.target) return;
      if (event.type === 'submit') { setTouched(true); return; }
      dirty.current = false;
      setTouched(false);
      setClearedErrors(null);
      setTimeout(() => setNative(previous => readNative(control, previous)));
    };
    root.addEventListener('invalid', onInvalid, true);
    root.addEventListener('input', onEdit);
    root.addEventListener('change', onEdit);
    root.addEventListener('focusout', onBlur);
    document.addEventListener('submit', onFormEvent, true);
    document.addEventListener('reset', onFormEvent, true);
    return () => {
      root.removeEventListener('invalid', onInvalid, true);
      root.removeEventListener('input', onEdit);
      root.removeEventListener('change', onEdit);
      root.removeEventListener('focusout', onBlur);
      document.removeEventListener('submit', onFormEvent, true);
      document.removeEventListener('reset', onFormEvent, true);
    };
  }, [controlId, getControl]);

  const serverError = controlName ? formErrors?.[controlName] : undefined;
  const serverMessages = serverError == null ? [] : (Array.isArray(serverError) ? serverError : [serverError]).filter(Boolean);
  const serverActive = serverMessages.length > 0 && clearedErrors !== formErrors;
  const message = errorMessage ?? error;
  const hasStaticError = typeof message !== 'function' && hasContent(message);
  const invalid = isInvalid ?? (hasStaticError || serverActive || (touched && !native.details.valid));

  const [parts, setParts] = useState<Record<FieldPart, number>>({ label: 0, description: 0, error: 0, customDescription: 0, customError: 0 });
  const register = useCallback((part: FieldPart) => {
    setParts(previous => ({ ...previous, [part]: previous[part] + 1 }));
    return () => setParts(previous => ({ ...previous, [part]: previous[part] - 1 }));
  }, []);
  const errorVisible = parts.error > 0;
  const customDescription = parts.customDescription > 0;
  const customError = parts.customError > 0;
  const serverKey = serverActive ? serverMessages.join('\n') : '';
  const partsValue = useMemo<FieldParts>(() => ({
    register, errorVisible, customDescription, customError, optional: !!isOptional,
    serverErrors: serverKey ? serverKey.split('\n') : null, message, labelMode, choiceInset,
  }), [register, errorVisible, customDescription, customError, isOptional, serverKey, message, labelMode, choiceInset]);

  const validation = useMemo<FieldValidityState>(() => ({
    isInvalid: invalid,
    validationErrors: serverKey ? serverKey.split('\n') : native.messages,
    validationDetails: native.details,
    isTouched: touched,
  }), [invalid, serverKey, native, touched]);

  // The label and description props are known on the first render; parts placed as children register.
  const hasLabel = hasContent(label) || parts.label > 0;
  const hasDescription = hasContent(description) || parts.description > 0;
  const context = useMemo<FieldContextValue>(() => ({
    id: controlId,
    descriptionId: errorVisible ? `${controlId}-error` : hasDescription ? `${controlId}-description` : undefined,
    invalid,
    required: fieldRequired,
    disabled: fieldDisabled,
    readOnly: isReadOnly,
    labelId: hasLabel ? `${controlId}-label` : undefined,
    validation,
  }), [controlId, errorVisible, hasDescription, hasLabel, invalid, fieldRequired, fieldDisabled, isReadOnly, validation]);

  const control = typeof children === 'function' ? children({
    id: controlId, 'aria-describedby': context.descriptionId, 'aria-invalid': invalid || undefined,
    required: fieldRequired || undefined, disabled: fieldDisabled || undefined, readOnly: isReadOnly || undefined,
  }) : children;
  const messages = <>
    {hasContent(description) && <DescriptionLine auto>{description}</DescriptionLine>}
    <ErrorLine auto>{message}</ErrorLine>
  </>;
  const horizontal = orientation === 'horizontal';
  const sx = stylex.props(controlStyles.stack, horizontal && s.horizontal);

  return <FieldContext.Provider value={context}>
    <FieldPartsContext.Provider value={partsValue}>
      <div {...props} ref={setRoot} className={withClassName(sx, className)} data-orientation={orientation}>
        {hasContent(label) && <FieldLabel>{label}</FieldLabel>}
        {horizontal ? <div {...stylex.props(s.body)}>{control}{messages}</div> : <>{control}{messages}</>}
      </div>
    </FieldPartsContext.Provider>
  </FieldContext.Provider>;
}

export type FieldLabelProps = LabelProps;

/**
 * The label of the surrounding Field: names its control and shows its required, optional and
 * disabled states. A `<label for>` for text controls; a span that the control points at with
 * `aria-labelledby` for groups, sliders and button triggers (clicking it focuses a trigger
 * without opening it).
 */
export function FieldLabel({ className, onClick, ...props }: FieldLabelProps) {
  const field = useContext(FieldContext);
  const parts = useContext(FieldPartsContext);
  const register = parts?.register;
  useLayoutEffect(() => register?.('label'), [register]);
  const mode = field ? parts?.labelMode ?? 'for' : 'for';
  const focusControl = (event: MouseEvent<HTMLLabelElement>) => {
    onClick?.(event);
    if (mode !== 'focus' || event.defaultPrevented || !field || field.disabled) return;
    const target = document.getElementById(field.id);
    if (target instanceof HTMLElement) target.focus();
  };
  return <Label
    id={field ? `${field.id}-label` : undefined}
    htmlFor={mode === 'for' ? field?.id : undefined}
    elementType={mode === 'for' ? 'label' : 'span'}
    isRequired={field?.required}
    isOptional={parts?.optional}
    isDisabled={field?.disabled}
    onClick={onClick || mode === 'focus' ? focusControl : undefined}
    {...props}
    className={withClassName(stylex.props(field && s.label), className)}
  />;
}

export type FieldDescriptionProps = ComponentPropsWithRef<'div'>;

function DescriptionLine({ auto, className, style, ...props }: FieldDescriptionProps & { auto: boolean }) {
  const field = useContext(FieldContext);
  const parts = useContext(FieldPartsContext);
  const register = parts?.register;
  useLayoutEffect(() => register?.('description'), [register]);
  useLayoutEffect(() => auto ? undefined : register?.('customDescription'), [auto, register]);
  if (parts?.errorVisible || (auto && parts?.customDescription)) return null;
  const inset = parts?.choiceInset ?? 0;
  const sx = stylex.props(controlStyles.description, field?.disabled && disabledStyles.label, inset > 0 && s.inset(inset));
  return <div
    id={field ? `${field.id}-description` : undefined}
    {...props}
    className={withClassName(sx, className)}
    style={sx.style || style ? { ...sx.style, ...style } : undefined}
  />;
}

/**
 * Help text for the surrounding Field's control. Hidden while the field shows an error. Placed by
 * hand, it takes the place of the Field's `description`.
 */
export function FieldDescription(props: FieldDescriptionProps) {
  return <DescriptionLine {...props} auto={false} />;
}

export type FieldErrorProps = Omit<ComponentPropsWithRef<'div'>, 'children'> & {
  /** The message, or a function of the validity state. Defaults to the Field's `errorMessage`, then the server or browser message. */
  children?: ReactNode | ((validity: FieldValidityState) => ReactNode);
};

function ErrorLine({ auto, children, className, style, ...props }: FieldErrorProps & { auto: boolean }) {
  const field = useContext(FieldContext);
  const parts = useContext(FieldPartsContext);
  const validation = field?.validation;
  const register = parts?.register;
  useLayoutEffect(() => auto ? undefined : register?.('customError'), [auto, register]);
  const source = auto || children !== undefined ? children : parts?.message;
  const content = parts?.serverErrors?.join(' ')
    ?? (typeof source === 'function' ? (validation ? source(validation) : null) : source)
    ?? (validation?.validationErrors.length ? validation.validationErrors.join(' ') : null);
  const stepAside = auto && !!parts?.customError;
  const visible = !stepAside && (field ? field.invalid : true) && content != null && content !== false && content !== '';
  useLayoutEffect(() => {
    if (visible) return register?.('error');
  }, [visible, register]);
  if (!visible) return null;
  const inset = parts?.choiceInset ?? 0;
  const sx = stylex.props(controlStyles.description, controlStyles.error, inset > 0 && s.inset(inset));
  return <div
    id={field ? `${field.id}-error` : undefined}
    {...props}
    className={withClassName(sx, className)}
    style={sx.style || style ? { ...sx.style, ...style } : undefined}
  >{content}</div>;
}

/**
 * The error line of the surrounding Field. Shows only while the field is invalid, in place of the
 * description. Placed by hand, it replaces the Field's own error line.
 */
export function FieldError(props: FieldErrorProps) {
  return <ErrorLine {...props} auto={false} />;
}

export type FieldValidityProps = {
  /** Renders from the validity state of the surrounding Field's control. Updates as the user types. */
  children: (validity: FieldValidityState) => ReactNode;
};

/** Renders anything from the surrounding Field's validity: live hints, rule lists, custom errors. */
export function FieldValidity({ children }: FieldValidityProps) {
  const field = useContext(FieldContext);
  const validation = field?.validation ?? { isInvalid: false, validationErrors: [], validationDetails: validNative.details, isTouched: false };
  return <>{children(validation)}</>;
}
