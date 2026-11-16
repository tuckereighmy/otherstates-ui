'use client';

import * as stylex from '@stylexjs/stylex';
import type { CSSProperties, ReactNode, Ref } from 'react';
import {
  FieldError, Label, RadioButton, RadioField, RadioGroup as AriaRadioGroup,
  type RadioFieldProps, type RadioGroupProps as AriaRadioGroupProps, type ValidationResult,
} from 'react-aria-components';
import { withClassName } from './internal/class-name';
import {
  ChoiceContent, ChoiceGroupContext, ChoiceGroupHelp, choiceGroupStyles, choiceRowClassName, joinIds, normalizeChoiceSize,
  useChoiceField, useChoiceGroup, type ChoiceOption, type ChoiceSize, type ChoiceSizeProp, type ChoiceVariant,
} from './internal/choice';

// One choice from a set (DESIGN_SPEC 1.11): label, options and help text 8px apart, rows 4px apart
// (16 when horizontal). The ring is the same 1.5px border-control inset ring as Checkbox.

const s = stylex.create({
  item: { display: 'grid', minWidth: 0 },
});

export type RadioGroupOption = Omit<ChoiceOption, 'label'> & {
  label: ReactNode;
  /** Help text under the option's label. */
  description?: ReactNode;
};

export type RadioGroupProps = Omit<AriaRadioGroupProps, 'children' | 'className' | 'style'> & {
  /** The group's visible label. Without one, pass `aria-label`. */
  label?: ReactNode;
  /** The options, rendered in order. Or pass Radio children. */
  options?: readonly RadioGroupOption[];
  /** Radio elements, for custom layouts. They render after `options`. */
  children?: ReactNode;
  /** Help text under the options. The error message replaces it while the group is invalid. */
  description?: ReactNode;
  /** Shown under the options while the group is invalid. A function receives the validation result. */
  errorMessage?: ReactNode | ((validation: ValidationResult) => ReactNode);
  /** @deprecated Use `isInvalid` with `errorMessage`. Setting it also marks the group invalid. */
  error?: ReactNode;
  /** Indicator and text size of every option. */
  size?: ChoiceSizeProp;
  /** `card` puts each option in a bordered tile. */
  variant?: ChoiceVariant;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLDivElement>;
  /** @deprecated Use `isDisabled`. */
  disabled?: boolean;
  /** @deprecated Use `isRequired`. */
  required?: boolean;
};

export type RadioProps = Omit<RadioFieldProps, 'children' | 'className' | 'style'> & {
  /** The visible label. Without one, pass `aria-label`. */
  label?: ReactNode;
  /** Help text under the label. */
  description?: ReactNode;
  /** Hides the label visually and keeps it as the accessible name. */
  hideLabel?: boolean;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLDivElement>;
  /** @deprecated Use `isDisabled`. */
  disabled?: boolean;
};

/** One option of a RadioGroup. It takes the group's size and variant. */
export function Radio({ label, description, hideLabel = false, className, style, ref, disabled, isDisabled, ...props }: RadioProps) {
  const group = useChoiceGroup();
  const size = group?.size ?? 'md';
  const variant = group?.variant ?? 'default';
  return (
    <RadioField {...props} ref={ref} style={style} isDisabled={isDisabled ?? disabled} className={withClassName(stylex.props(s.item), className)}>
      <RadioButton className={choiceRowClassName({ kind: 'radio', size, variant })}>
        {state => (
          <ChoiceContent
            kind="radio" state={state} size={size} variant={variant} label={label} description={description}
            hideLabel={hideLabel} persistentDescription
          />
        )}
      </RadioButton>
    </RadioField>
  );
}

export function RadioGroup({
  label, options, children, description, errorMessage, error, size, variant = 'default', className, style, ref,
  orientation = 'vertical', disabled, required, isDisabled, isRequired, isReadOnly, isInvalid,
  'aria-labelledby': labelledBy, 'aria-describedby': describedBy, ...props
}: RadioGroupProps) {
  const field = useChoiceField();
  const sz: ChoiceSize = normalizeChoiceSize(size);
  const card = variant === 'card';
  const horizontal = orientation === 'horizontal';
  const message = errorMessage ?? error;
  const invalid = isInvalid ?? (error != null && error !== false && error !== '' ? true : undefined) ?? (field?.invalid ? true : undefined);

  return (
    <AriaRadioGroup
      {...props}
      ref={ref}
      style={style}
      className={withClassName(stylex.props(choiceGroupStyles.root), className)}
      orientation={orientation}
      isInvalid={invalid}
      isDisabled={isDisabled ?? disabled ?? field?.disabled}
      isReadOnly={isReadOnly ?? field?.readOnly}
      isRequired={isRequired ?? required ?? field?.required}
      aria-labelledby={labelledBy ?? (label == null && props['aria-label'] == null ? field?.labelId : undefined)}
      aria-describedby={joinIds(describedBy, field?.descriptionId)}
    >
      {({ isDisabled: off, isRequired: needed }) => <>
        {label != null && (
          <Label {...stylex.props(choiceGroupStyles.label, off && choiceGroupStyles.labelDisabled)}>
            {label}{needed && <span aria-hidden="true" {...stylex.props(choiceGroupStyles.required, off && choiceGroupStyles.labelDisabled)}> *</span>}
          </Label>
        )}
        <ChoiceGroupContext.Provider value={{ size: sz, variant }}>
          <div {...stylex.props(
            choiceGroupStyles.list,
            horizontal && choiceGroupStyles.horizontal,
            card && choiceGroupStyles.cards,
            card && horizontal && choiceGroupStyles.cardsHorizontal,
          )}>
            {options?.map(option => (
              <Radio
                key={option.value}
                value={option.value}
                label={option.label}
                description={option.description}
                isDisabled={option.disabled}
                className={card && horizontal ? stylex.props(choiceGroupStyles.cardItem).className : undefined}
              />
            ))}
            {children}
          </div>
        </ChoiceGroupContext.Provider>
        {description != null && <ChoiceGroupHelp disabled={off} hasErrorMessage={message != null}>{description}</ChoiceGroupHelp>}
        <FieldError {...stylex.props(choiceGroupStyles.help, choiceGroupStyles.error)}>{message}</FieldError>
      </>}
    </AriaRadioGroup>
  );
}
