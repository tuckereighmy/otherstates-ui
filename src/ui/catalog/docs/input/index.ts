import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Sizes from './sizes';
import sizesCode from './sizes.tsx?raw';
import Disabled from './disabled';
import disabledCode from './disabled.tsx?raw';
import Invalid from './invalid';
import invalidCode from './invalid.tsx?raw';
import ReadOnly from './read-only';
import readOnlyCode from './read-only.tsx?raw';
import File from './file';
import fileCode from './file.tsx?raw';
import WithLabel from './with-label';
import withLabelCode from './with-label.tsx?raw';
import WithButton from './with-button';
import withButtonCode from './with-button.tsx?raw';
import Controlled from './controlled';
import controlledCode from './controlled.tsx?raw';
import FormIntegration from './form-integration';
import formIntegrationCode from './form-integration.tsx?raw';
import TextFieldExample from './text-field';
import textFieldCode from './text-field.tsx?raw';
import FloatingLabel from './floating-label';
import floatingLabelCode from './floating-label.tsx?raw';
import NotchField from './notch-field';
import notchFieldCode from './notch-field.tsx?raw';

export default defineDoc({
  id: 'input',
  title: 'Input',
  category: 'Forms',
  description: 'Enter a single line of text.',
  source: [
    'components/input.tsx',
    'components/Icon.tsx',
    'components/internal/class-name.ts',
    'components/internal/control.ts',
    'components/internal/field-styles.ts',
    'components/internal/size.ts',
    'tokens.stylex.ts',
  ],
  exports: ['Input', 'TextField'],
  usage: `import { Field, Input } from '@/ui/components';

<Field label="Project name">
  <Input placeholder="Untitled project" />
</Field>`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode },
    {
      id: 'sizes',
      title: 'Sizes',
      description: 'Five heights from 24 to 48 px; md (40) is the default and lines up with Button.',
      Component: Sizes,
      code: sizesCode,
      minHeight: 340,
    },
    {
      id: 'disabled',
      title: 'Disabled',
      description: 'A disabled Field disables the input and dims its label and help text.',
      Component: Disabled,
      code: disabledCode,
    },
    {
      id: 'invalid',
      title: 'Invalid',
      description: 'The error message replaces the help text, and the edge turns `border-error`.',
      Component: Invalid,
      code: invalidCode,
    },
    {
      id: 'read-only',
      title: 'Read-only',
      description: 'The value stays focusable and selectable on a `bg-subtle` shell.',
      Component: ReadOnly,
      code: readOnlyCode,
      stage: 'canvas',
    },
    {
      id: 'file',
      title: 'File',
      description: '`type="file"` keeps the field shell; the picker button reads as the action.',
      Component: File,
      code: fileCode,
    },
    {
      id: 'with-label',
      title: 'With label',
      description: 'Outside a Field, pair the input with a `Label` through a shared id.',
      Component: WithLabel,
      code: withLabelCode,
    },
    {
      id: 'with-button',
      title: 'With button',
      description: 'An md input and an md Button share the 40 px height, so they sit on one line.',
      Component: WithButton,
      code: withButtonCode,
    },
    {
      id: 'controlled',
      title: 'Controlled',
      description: 'Drive the value with `value` and `onChange` to derive other UI from it.',
      Component: Controlled,
      code: controlledCode,
    },
    {
      id: 'form-integration',
      title: 'Form integration',
      description: 'Inside a Form, a required Field shows the browser message under the input on submit.',
      Component: FormIntegration,
      code: formIntegrationCode,
      minHeight: 260,
    },
    {
      id: 'text-field',
      title: 'Text field',
      description: '`TextField` bundles the label, a 48 px shell, an optional icon and the help or error line.',
      Component: TextFieldExample,
      code: textFieldCode,
    },
    {
      id: 'floating-label',
      title: 'Floating label',
      description: 'With `floating`, the label sits inside the shell and moves up once the field has focus or a value.',
      Component: FloatingLabel,
      code: floatingLabelCode,
    },
    {
      id: 'notch-field',
      title: 'Notch field',
      description: 'The `floating="notch"` field is 48 px like every xl field; it draws its own stroke and lifts the label into a notch on focus.',
      Component: NotchField,
      code: notchFieldCode,
    },
  ],
  api: [
    {
      name: 'Input',
      description: 'A native `<input>`. On its own it is a bordered field; inside an InputGroup the group draws the edge.',
      extends: '<input> attributes',
      props: [
        { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'small' | 'medium' | 'large'", default: "'md'", description: 'Height and text size: 24, 32, 40, 44 or 48 px. `small`, `medium` and `large` are aliases of `sm`, `md` and `lg`. Inside an InputGroup the group\'s size wins.' },
        { name: 'isInvalid', type: 'boolean', description: 'Shows the invalid edge and sets `aria-invalid`. Inside a Field, the Field\'s error sets it.' },
        { name: 'isDisabled', type: 'boolean', default: 'false', description: 'Disables the input. `disabled` is an alias; inside a Field, the Field sets it.' },
        { name: 'isReadOnly', type: 'boolean', default: 'false', description: 'Keeps the value selectable but not editable. `readOnly` is an alias; inside a Field, the Field sets it.' },
        { name: 'isRequired', type: 'boolean', default: 'false', description: 'Marks the input required for native validation. `required` is an alias.' },
        { name: 'htmlSize', type: 'number', description: 'The native `size` attribute: the visible width in characters.' },
      ],
    },
    {
      name: 'TextField',
      description: 'A label, an input shell and a help or error line in one component. `ref` and the input attributes go to the `<input>`.',
      extends: '<input> attributes',
      props: [
        { name: 'label', type: 'string', required: true, description: 'Names the field. Shown above the shell, or inside it with `floating`.' },
        { name: 'description', type: 'ReactNode', description: 'Help text under the field. The error message replaces it while the field is invalid.' },
        { name: 'hint', type: 'ReactNode', description: 'Deprecated alias of `description`.' },
        { name: 'errorMessage', type: 'ReactNode', description: 'Shown under the field in place of the description; marks the field invalid while set.' },
        { name: 'error', type: 'ReactNode', description: 'Deprecated alias of `errorMessage`.' },
        { name: 'isInvalid', type: 'boolean', description: 'Shows the invalid edge. Defaults to true while an error message is set.' },
        { name: 'isDisabled', type: 'boolean', default: 'false', description: 'Disables the field and dims its label. `disabled` is an alias.' },
        { name: 'isReadOnly', type: 'boolean', default: 'false', description: 'Keeps the value selectable but not editable. `readOnly` is an alias.' },
        { name: 'isRequired', type: 'boolean', default: 'false', description: 'Makes the input required and adds ` *` to the label. `required` is an alias.' },
        { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'small' | 'medium' | 'large'", default: "'xl'", description: 'Height and text size of the shell. The floating and notch fields are always `xl` (48 px).' },
        { name: 'leadingIcon', type: 'ReactNode', description: 'An icon before the value, in `fg-muted`. An `Icon` without a size takes the field\'s icon size.' },
        { name: 'trailingIcon', type: 'ReactNode', description: 'An icon after the value, in `fg-muted`. An `Icon` without a size takes the field\'s icon size.' },
        { name: 'floating', type: "boolean | 'notch'", default: 'false', description: '`true` floats the label inside the shell; `\'notch\'` is the 48 px notch field, whose stroke opens around the raised label.' },
        { name: 'className', type: 'string', description: 'Added to the root element, not to the `<input>`.' },
        { name: 'style', type: 'CSSProperties', description: 'Applied to the root element, not to the `<input>`.' },
      ],
    },
  ],
  accessibility: [
    'Renders a native `<input>`. Give it a visible label through a Field, a `Label` with `htmlFor`, or `TextField`; use `aria-label` only when no visible label fits. A placeholder is not a label.',
    'Inside a Field the input takes the field\'s id, `aria-describedby` points at the help or error text, and `aria-invalid` is set while the field is invalid.',
    'Every focus, by keyboard or pointer, draws a 2 px edge in the focus-ring color; forced-colors mode gets the system outline instead.',
    '`isReadOnly` keeps the input in the tab order with a selectable value; `isDisabled` takes it out of the tab order.',
    'On touch screens the value renders at 16 px, so iOS does not zoom the page when the input takes focus.',
    'The notch field animates its label and stroke; with reduced motion the label moves without animation.',
  ],
});
