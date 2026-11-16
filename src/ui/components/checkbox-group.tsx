'use client';

import * as stylex from '@stylexjs/stylex';
import { useContext, type CSSProperties, type ReactNode, type Ref } from 'react';
import {
  CheckboxGroup as AriaCheckboxGroup, CheckboxGroupStateContext, FieldError, Label as AriaLabel,
  type CheckboxGroupProps as AriaCheckboxGroupProps, type ValidationResult,
} from 'react-aria-components';
import { tokens as t } from '../tokens.stylex';
import { Checkbox } from './checkbox';
import { withClassName } from './internal/class-name';
import {
  ChoiceGroupContext, ChoiceGroupHelp, choiceGroupStyles, choiceIndentStyles, joinIds, normalizeChoiceSize, useChoiceField,
  type ChoiceSize, type ChoiceSizeProp, type ChoiceVariant,
} from './internal/choice';

// Several checkboxes under one label (DESIGN_SPEC 1.11): label, list and help text 8px apart, rows
// 4px apart (16 when horizontal). Every option renders the same indicator as Checkbox.

export interface CheckboxGroupOption {
  id: string;
  label: ReactNode;
  /** Help text under the option's label. */
  description?: ReactNode;
  disabled?: boolean;
  indeterminate?: boolean;
}

export interface CheckboxGroupProps extends Omit<AriaCheckboxGroupProps, 'children' | 'className' | 'style'> {
  /** The group's visible label. Without one, pass `aria-label`. */
  label?: ReactNode;
  /** The options, rendered in order. Or pass Checkbox children with a `value` each. */
  options?: readonly CheckboxGroupOption[];
  /** Checkbox elements, for custom layouts. They render after `options`. */
  children?: ReactNode;
  orientation?: 'horizontal' | 'vertical';
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
  /** Adds a parent checkbox above the options that turns every enabled option on or off. Works with `options`. */
  selectAllLabel?: ReactNode;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLDivElement>;
}

const s = stylex.create({
  // The parent row and the indented rows under it keep the choice-row pitch (4px gap, spec 1.11).
  nested: { display: 'flex', flexDirection: 'column', gap: t['--os-space-1'], minWidth: 0 },
});

function SelectAll({ label, options }: { label: ReactNode; options: readonly CheckboxGroupOption[] }) {
  const state = useContext(CheckboxGroupStateContext);
  if (!state) return null;
  const enabled = options.filter(option => !option.disabled).map(option => option.id);
  const on = enabled.filter(id => state.value.includes(id));
  const all = enabled.length > 0 && on.length === enabled.length;
  return (
    <Checkbox
      label={label}
      isSelected={all}
      isIndeterminate={on.length > 0 && !all}
      isDisabled={state.isDisabled || enabled.length === 0}
      isReadOnly={state.isReadOnly}
      onChange={next => state.setValue(next
        ? [...state.value, ...enabled.filter(id => !state.value.includes(id))]
        : state.value.filter(id => !enabled.includes(id)))}
    />
  );
}

export function CheckboxGroup({
  label, options, children, orientation = 'vertical', description, errorMessage, error, size, variant = 'default',
  selectAllLabel, className, style, ref, isInvalid, isDisabled, isReadOnly, isRequired,
  'aria-labelledby': labelledBy, 'aria-describedby': describedBy, ...props
}: CheckboxGroupProps) {
  const field = useChoiceField();
  const sz: ChoiceSize = normalizeChoiceSize(size);
  const card = variant === 'card';
  const horizontal = orientation === 'horizontal';
  const message = errorMessage ?? error;
  const invalid = isInvalid ?? (error != null && error !== false && error !== '' ? true : undefined) ?? (field?.invalid ? true : undefined);
  const parent = selectAllLabel != null && options !== undefined;
  const list = (indent: boolean) => stylex.props(
    choiceGroupStyles.list,
    horizontal && choiceGroupStyles.horizontal,
    card && choiceGroupStyles.cards,
    card && horizontal && choiceGroupStyles.cardsHorizontal,
    indent && choiceIndentStyles[sz],
  );
  const rows = <>
    {options?.map(option => (
      <Checkbox
        key={option.id}
        value={option.id}
        label={option.label}
        description={option.description}
        isDisabled={option.disabled}
        isIndeterminate={option.indeterminate}
        className={card && horizontal ? stylex.props(choiceGroupStyles.cardItem).className : undefined}
      />
    ))}
    {children}
  </>;

  return (
    <AriaCheckboxGroup
      {...props}
      ref={ref}
      style={style}
      className={withClassName(stylex.props(choiceGroupStyles.root), className)}
      isInvalid={invalid}
      isDisabled={isDisabled ?? field?.disabled}
      isReadOnly={isReadOnly ?? field?.readOnly}
      isRequired={isRequired ?? field?.required}
      aria-labelledby={labelledBy ?? (label == null && props['aria-label'] == null ? field?.labelId : undefined)}
      aria-describedby={joinIds(describedBy, field?.descriptionId)}
    >
      {({ isDisabled: off, isRequired: needed }) => <>
        {label != null && (
          <AriaLabel {...stylex.props(choiceGroupStyles.label, off && choiceGroupStyles.labelDisabled)}>
            {label}{needed && <span aria-hidden="true" {...stylex.props(choiceGroupStyles.required, off && choiceGroupStyles.labelDisabled)}> *</span>}
          </AriaLabel>
        )}
        <ChoiceGroupContext.Provider value={{ size: sz, variant }}>
          {parent ? (
            <div {...stylex.props(s.nested)}>
              <SelectAll label={selectAllLabel} options={options} />
              <div {...list(true)}>{rows}</div>
            </div>
          ) : <div {...list(false)}>{rows}</div>}
        </ChoiceGroupContext.Provider>
        {description != null && <ChoiceGroupHelp disabled={off} hasErrorMessage={message != null}>{description}</ChoiceGroupHelp>}
        <FieldError {...stylex.props(choiceGroupStyles.help, choiceGroupStyles.error)}>{message}</FieldError>
      </>}
    </AriaCheckboxGroup>
  );
}
