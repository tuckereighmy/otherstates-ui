'use client';

import * as stylex from '@stylexjs/stylex';
import { useContext, type CSSProperties, type ReactNode, type Ref } from 'react';
import {
  CheckboxButton, CheckboxField, CheckboxGroupStateContext, FieldError,
  type CheckboxFieldProps, type ValidationResult,
} from 'react-aria-components';
import { withClassName } from './internal/class-name';
import {
  ChoiceContent, choiceErrorProps, choiceRowClassName, joinIds, normalizeChoiceSize, useChoiceField, useChoiceGroup,
  type ChoiceSizeProp, type ChoiceVariant,
} from './internal/choice';

// A checkbox row (DESIGN_SPEC 1.8, 1.11): a 32px row, the indicator 12px before the label, an optional
// description under the label and an error line that replaces it. Inside a CheckboxGroup a checkbox
// with a `value` joins the group; one without a `value` stays independent (a "select all" parent).

const s = stylex.create({
  root: { display: 'grid', minWidth: 0 },
});

export type CheckboxProps = Omit<CheckboxFieldProps, 'children' | 'className' | 'style'> & {
  /** The visible label. Without one, pass `aria-label`. */
  label?: ReactNode;
  /** Help text under the label. The error message replaces it while the checkbox is invalid. */
  description?: ReactNode;
  /** Shown under the row while the checkbox is invalid. A function receives the validation result. */
  errorMessage?: ReactNode | ((validation: ValidationResult) => ReactNode);
  /** @deprecated Use `isInvalid` with `errorMessage`. Setting it also marks the checkbox invalid. */
  error?: ReactNode;
  /** Indicator and text size. Rows stay 32px tall. Inside a group the group's size applies. */
  size?: ChoiceSizeProp;
  /** `card` puts the row in a bordered tile. Inside a group the group's variant applies. */
  variant?: ChoiceVariant;
  /** Hides the label visually and keeps it as the accessible name. */
  hideLabel?: boolean;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLDivElement>;
  /** @deprecated Use `isSelected`. */
  checked?: boolean;
  /** @deprecated Use `defaultSelected`. */
  defaultChecked?: boolean;
  /** @deprecated Use `isDisabled`. */
  disabled?: boolean;
  /** @deprecated Use `isIndeterminate`. */
  indeterminate?: boolean;
  /** @deprecated Use `isRequired`. */
  required?: boolean;
  /** @deprecated Use `isReadOnly`. */
  readOnly?: boolean;
};

export function Checkbox({
  label, description, errorMessage, error, size, variant, hideLabel = false, className, style, ref,
  checked, defaultChecked, disabled, indeterminate, required, readOnly,
  isSelected, defaultSelected, isDisabled, isIndeterminate, isRequired, isReadOnly, isInvalid,
  value, id, 'aria-describedby': describedBy, ...props
}: CheckboxProps) {
  const group = useChoiceGroup();
  const groupState = useContext(CheckboxGroupStateContext);
  const field = useChoiceField();
  const groupItem = groupState !== null && value !== undefined;
  const standalone = groupState === null && group === null;
  const inField = standalone && field !== null;
  const sz = normalizeChoiceSize(size ?? group?.size);
  const look = variant ?? group?.variant ?? 'default';
  const message = errorMessage ?? error;
  const invalid = isInvalid ?? (error != null && error !== false && error !== '' ? true : undefined) ?? (inField && field.invalid ? true : undefined);
  const required_ = isRequired ?? required ?? (inField ? field.required : undefined);

  const checkbox = (
    <CheckboxField
      {...props}
      ref={ref}
      style={style}
      className={withClassName(stylex.props(s.root), className)}
      id={id ?? (inField ? field.id : undefined)}
      value={value}
      isSelected={isSelected ?? checked}
      defaultSelected={defaultSelected ?? defaultChecked}
      isDisabled={isDisabled ?? disabled ?? (inField ? field.disabled : undefined)}
      isIndeterminate={isIndeterminate ?? indeterminate}
      isRequired={required_}
      isReadOnly={isReadOnly ?? readOnly ?? (inField ? field.readOnly : undefined)}
      isInvalid={invalid}
      aria-describedby={joinIds(describedBy, inField && field.descriptionId)}
    >
      <CheckboxButton className={choiceRowClassName({ kind: 'checkbox', size: sz, variant: look, standalone })}>
        {state => (
          <ChoiceContent
            kind="checkbox" state={state} size={sz} variant={look} label={label} description={description}
            hideLabel={hideLabel} required={!groupItem && state.isRequired} hasErrorMessage={message != null}
            persistentDescription={groupItem}
          />
        )}
      </CheckboxButton>
      {!groupItem && <FieldError {...choiceErrorProps({ kind: 'checkbox', size: sz, variant: look, hideLabel })}>{message}</FieldError>}
    </CheckboxField>
  );

  // Without a value, a checkbox inside a group stays independent of the group's value.
  if (groupState !== null && !groupItem) return <CheckboxGroupStateContext.Provider value={null}>{checkbox}</CheckboxGroupStateContext.Provider>;
  return checkbox;
}
