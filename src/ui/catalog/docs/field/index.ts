import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Required from './required';
import requiredCode from './required.tsx?raw';
import Optional from './optional';
import optionalCode from './optional.tsx?raw';
import Disabled from './disabled';
import disabledCode from './disabled.tsx?raw';
import ReadOnly from './read-only';
import readOnlyCode from './read-only.tsx?raw';
import WithError from './with-error';
import withErrorCode from './with-error.tsx?raw';
import WithValidity from './with-validity';
import withValidityCode from './with-validity.tsx?raw';
import Horizontal from './horizontal';
import horizontalCode from './horizontal.tsx?raw';
import Parts from './parts';
import partsCode from './parts.tsx?raw';
import InputGroupField from './input-group';
import inputGroupCode from './input-group.tsx?raw';
import TextareaField from './textarea';
import textareaCode from './textarea.tsx?raw';
import NumberFieldField from './number-field';
import numberFieldCode from './number-field.tsx?raw';
import SelectField from './select';
import selectCode from './select.tsx?raw';
import ComboboxField from './combobox';
import comboboxCode from './combobox.tsx?raw';
import ComboboxMultipleField from './combobox-multiple';
import comboboxMultipleCode from './combobox-multiple.tsx?raw';
import AutocompleteField from './autocomplete';
import autocompleteCode from './autocomplete.tsx?raw';
import CheckboxField from './checkbox';
import checkboxCode from './checkbox.tsx?raw';
import CheckboxGroupField from './checkbox-group';
import checkboxGroupCode from './checkbox-group.tsx?raw';
import RadioGroupField from './radio-group';
import radioGroupCode from './radio-group.tsx?raw';
import SwitchField from './switch';
import switchCode from './switch.tsx?raw';
import SliderField from './slider';
import sliderCode from './slider.tsx?raw';
import CompleteForm from './complete-form';
import completeFormCode from './complete-form.tsx?raw';

export default defineDoc({
  id: 'field',
  title: 'Field',
  category: 'Forms',
  description: 'Label a control, describe it, and show its validation message.',
  source: [
    'components/field.tsx',
    'components/label.tsx',
    'components/internal/class-name.ts',
    'components/internal/control.ts',
    'components/internal/states.ts',
    'tokens.stylex.ts',
  ],
  exports: ['Field', 'FieldLabel', 'FieldDescription', 'FieldError', 'FieldValidity'],
  usage: `import { Field, Input } from '@/ui/components';

<Field label="Work email" description="Use the address your team signs in with.">
  <Input type="email" name="email" />
</Field>`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode },
    {
      id: 'required',
      title: 'Required',
      description: '`isRequired` adds a muted asterisk and makes the control required; the message shows once it is left empty after an edit, or on submit.',
      Component: Required,
      code: requiredCode,
    },
    {
      id: 'optional',
      title: 'Optional',
      description: 'When most fields are required, mark the rest with `isOptional` instead.',
      Component: Optional,
      code: optionalCode,
    },
    {
      id: 'disabled',
      title: 'Disabled',
      description: '`isDisabled` disables the control and dims its label and description.',
      Component: Disabled,
      code: disabledCode,
    },
    {
      id: 'read-only',
      title: 'Read-only',
      description: '`isReadOnly` keeps the value focusable and selectable on a bg-subtle shell.',
      Component: ReadOnly,
      code: readOnlyCode,
      stage: 'canvas',
    },
    {
      id: 'with-error',
      title: 'With error',
      description: 'A message in `errorMessage` marks the field invalid and takes the place of the description.',
      Component: WithError,
      code: withErrorCode,
    },
    {
      id: 'with-validity',
      title: 'With validity',
      description: 'Native constraints drive the validity; a function in `errorMessage` turns it into words, and `FieldValidity` renders a live hint as you type.',
      Component: WithValidity,
      code: withValidityCode,
    },
    {
      id: 'horizontal',
      title: 'Horizontal',
      description: '`orientation="horizontal"` puts the label in a column beside the control, for settings pages.',
      Component: Horizontal,
      code: horizontalCode,
      align: 'stretch',
    },
    {
      id: 'parts',
      title: 'Composed from parts',
      description: 'Place `FieldLabel`, `FieldDescription` and `FieldError` yourself to change the order; the error takes the description\'s place, and the ids and states still come from the Field.',
      Component: Parts,
      code: partsCode,
    },
    {
      id: 'input-group',
      title: 'Input group',
      description: 'An InputGroup reads the Field like an Input does: the label points at its input and the edge follows the Field state.',
      Component: InputGroupField,
      code: inputGroupCode,
      stage: 'canvas',
    },
    {
      id: 'textarea',
      title: 'Textarea field',
      description: 'A Textarea inside a Field leaves the label and help text to it.',
      Component: TextareaField,
      code: textareaCode,
    },
    {
      id: 'select',
      title: 'Select field',
      description: 'Inside a Field, a Select takes the field appearance and its label from the Field.',
      Component: SelectField,
      code: selectCode,
      minHeight: 320,
    },
    {
      id: 'combobox',
      title: 'Combobox field',
      description: 'The Field label names the combobox input, and `isRequired` reaches it through the context.',
      Component: ComboboxField,
      code: comboboxCode,
      minHeight: 400,
    },
    {
      id: 'combobox-multiple',
      title: 'Combobox multiple field',
      description: 'A multiple-selection Combobox in a Field keeps one label and one message line for all its chips.',
      Component: ComboboxMultipleField,
      code: comboboxMultipleCode,
      minHeight: 380,
    },
    {
      id: 'autocomplete',
      title: 'Autocomplete field',
      description: 'An Autocomplete reads the Field the same way: its suggestions open under the shell as you type.',
      Component: AutocompleteField,
      code: autocompleteCode,
      minHeight: 380,
    },
    {
      id: 'checkbox',
      title: 'Checkbox field',
      description: 'A Field without a label gives a single Checkbox a linked description line, aligned with the checkbox label.',
      Component: CheckboxField,
      code: checkboxCode,
    },
    {
      id: 'checkbox-group',
      title: 'Checkbox group field',
      description: 'The Field label names the whole group and its description sits under the last option.',
      Component: CheckboxGroupField,
      code: checkboxGroupCode,
    },
    {
      id: 'radio-group',
      title: 'Radio group field',
      description: 'A RadioGroup without its own `label` is named and described by the Field.',
      Component: RadioGroupField,
      code: radioGroupCode,
    },
    {
      id: 'switch',
      title: 'Switch field',
      description: 'Like a single Checkbox, a Switch keeps its own label and takes its help text from the Field.',
      Component: SwitchField,
      code: switchCode,
    },
    {
      id: 'slider',
      title: 'Slider field',
      description: 'A Slider without its own `label` is named by the Field label and described by its help text.',
      Component: SliderField,
      code: sliderCode,
    },
    {
      id: 'number-field',
      title: 'Number field',
      description: 'A NumberField without its own `label` takes the label, help text and state from the Field.',
      Component: NumberFieldField,
      code: numberFieldCode,
    },
    {
      id: 'complete-form',
      title: 'Complete form',
      description: 'Fields in a Form: submit it empty to see every message at once and land on the first invalid control.',
      Component: CompleteForm,
      code: completeFormCode,
      align: 'start',
      minHeight: 420,
    },
  ],
  api: [
    {
      name: 'Field',
      description: 'A column of label, control and one message line, wired together through context.',
      extends: '<div> attributes',
      props: [
        { name: 'label', type: 'ReactNode', description: 'The visible label: a `<label>` that points at a text control, or a span that groups, sliders and pickers are named by.' },
        { name: 'description', type: 'ReactNode', description: 'Help text under the control, linked with `aria-describedby`. The error replaces it.' },
        { name: 'errorMessage', type: 'ReactNode | ((validity: FieldValidityState) => ReactNode)', description: 'A node marks the field invalid while it is set; a function is called with the validity and shows only while the field is invalid.' },
        { name: 'isInvalid', type: 'boolean', description: 'Forces the invalid state, with or without a message. Overrides native and server validity.' },
        { name: 'isRequired', type: 'boolean', default: 'false', description: 'Adds ` *` to the label and makes the control required.' },
        { name: 'isOptional', type: 'boolean', default: 'false', description: 'Adds "(optional)" to the label. Use it when most fields in the form are required.' },
        { name: 'isDisabled', type: 'boolean', default: 'false', description: 'Disables the control and dims the label and message. A disabled Fieldset sets it for every Field inside.' },
        { name: 'isReadOnly', type: 'boolean', default: 'false', description: 'Makes the control read-only through the field context.' },
        { name: 'orientation', type: "'vertical' | 'horizontal'", default: "'vertical'", description: '`horizontal` puts the label in a column beside the control and its message.' },
        { name: 'id', type: 'string', description: 'The id of the control. Generated when omitted.' },
        { name: 'children', type: 'ReactNode | ((control: FieldControlProps) => ReactNode)', description: 'The control, or a function that receives `id`, `aria-describedby`, `aria-invalid`, `required`, `disabled` and `readOnly` to spread onto a native element.' },
        { name: 'error', type: 'ReactNode', description: 'Deprecated alias of `errorMessage`.' },
        { name: 'required', type: 'boolean', description: 'Deprecated alias of `isRequired`.' },
        { name: 'disabled', type: 'boolean', description: 'Deprecated alias of `isDisabled`.' },
      ],
    },
    {
      name: 'FieldLabel',
      description: 'The label of the surrounding Field, for when you place it yourself. It names the control and shows the required, optional and disabled states: a `<label>` for text controls, a span named through `aria-labelledby` for groups, sliders and pickers.',
      extends: 'LabelProps',
      props: [],
    },
    {
      name: 'FieldDescription',
      description: 'Help text for the surrounding Field. It is linked to the control, hides while the error shows, and takes the place of the Field `description` when you place it yourself.',
      extends: '<div> attributes',
      props: [],
    },
    {
      name: 'FieldError',
      description: 'The error line of the surrounding Field. A Field renders one for you; place your own to move it, and the built-in one steps aside.',
      extends: '<div> attributes',
      props: [
        { name: 'children', type: 'ReactNode | ((validity: FieldValidityState) => ReactNode)', description: 'The message, or a function of the validity. Defaults to the Field `errorMessage`, then the browser message. A server error from the Form always wins.' },
      ],
    },
    {
      name: 'FieldValidity',
      description: 'Renders anything from the validity of the surrounding Field: live hints, rule lists or custom errors.',
      props: [
        { name: 'children', type: '(validity: FieldValidityState) => ReactNode', required: true, description: 'Called on every change with `isInvalid`, `isTouched`, `validationDetails` and `validationErrors`.' },
      ],
    },
  ],
  accessibility: [
    'For text controls the label is a `<label>` whose `for` matches the control, so clicking it focuses the control. Groups, sliders and pickers are named by the label through `aria-labelledby`; clicking it focuses a picker without opening it.',
    'The description, or the error in its place, is linked with `aria-describedby`; only one is announced at a time.',
    'An invalid field sets `aria-invalid` on the control. Messages appear after the control is edited and left, or when the form is submitted, never on the first keystroke.',
    'On submit, the browser bubble is replaced by the Field message and focus moves to the first invalid control.',
    'The required asterisk is hidden from assistive tech; the control carries `required` instead, which screen readers announce.',
  ],
});
