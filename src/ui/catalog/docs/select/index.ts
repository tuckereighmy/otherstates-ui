import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import FieldAppearance from './field-appearance';
import fieldAppearanceCode from './field-appearance.tsx?raw';
import Sizes from './sizes';
import sizesCode from './sizes.tsx?raw';
import InField from './in-field';
import inFieldCode from './in-field.tsx?raw';
import WithIcon from './with-icon';
import withIconCode from './with-icon.tsx?raw';
import OptionsWithIcons from './options-with-icons';
import optionsWithIconsCode from './options-with-icons.tsx?raw';
import Groups from './groups';
import groupsCode from './groups.tsx?raw';
import Multiple from './multiple';
import multipleCode from './multiple.tsx?raw';
import Controlled from './controlled';
import controlledCode from './controlled.tsx?raw';
import Disabled from './disabled';
import disabledCode from './disabled.tsx?raw';
import Invalid from './invalid';
import invalidCode from './invalid.tsx?raw';
import ReadOnly from './read-only';
import readOnlyCode from './read-only.tsx?raw';
import FormExample from './form';
import formCode from './form.tsx?raw';
import Searchable from './searchable';
import searchableCode from './searchable.tsx?raw';

export default defineDoc({
  id: 'select',
  title: 'Select',
  category: 'Forms',
  description: 'Choose one value, or several, from a fixed list.',
  source: [
    'components/select.tsx',
    'components/Icon.tsx',
    'components/internal/class-name.ts',
    'components/internal/control.ts',
    'components/internal/field-styles.ts',
    'components/internal/overlay.tsx',
    'components/internal/size.ts',
    'components/internal/spring.ts',
    'components/internal/states.ts',
    'components/internal/suggestion-input.tsx',
    'tokens.stylex.ts',
  ],
  exports: ['Select', 'SelectOption', 'SelectSection', 'SelectProps', 'SelectAppearance'],
  usage: `import { Select } from '@/ui/components';

<Select
  label="Sort by"
  options={[
    { id: 'newest', label: 'Newest' },
    { id: 'oldest', label: 'Oldest' },
  ]}
  defaultValue="newest"
/>`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode, minHeight: 360 },
    {
      id: 'field-appearance',
      title: 'Field appearance',
      description: 'A bordered field that opens its list below the trigger, so it lines up with inputs in a form.',
      Component: FieldAppearance, code: fieldAppearanceCode, minHeight: 440,
    },
    {
      id: 'sizes',
      title: 'Sizes',
      description: 'The field appearance follows the control sizes; md (40) is the default. The `morph` appearance is always md (40 px).',
      Component: Sizes, code: sizesCode, minHeight: 260,
    },
    {
      id: 'in-field',
      title: 'With label and description',
      description: 'Inside a Field the Select takes its label, description and error from the Field and uses the field appearance.',
      Component: InField, code: inFieldCode, minHeight: 400,
    },
    {
      id: 'with-icon',
      title: 'With icon',
      description: '`startAddon` puts an icon before the value in the field appearance.',
      Component: WithIcon, code: withIconCode, minHeight: 440,
    },
    {
      id: 'options-with-icons',
      title: 'Options with icons',
      description: 'An option `icon` shows in the list and next to the chosen value.',
      Component: OptionsWithIcons, code: optionsWithIconsCode, minHeight: 360,
    },
    {
      id: 'groups',
      title: 'Groups',
      description: 'Sections group options under a label, with a hairline between groups.',
      Component: Groups, code: groupsCode, minHeight: 600,
    },
    {
      id: 'multiple',
      title: 'Multiple selection',
      description: 'With `selectionMode="multiple"` the list stays open and the trigger lists the chosen options.',
      Component: Multiple, code: multipleCode, minHeight: 520,
    },
    {
      id: 'controlled',
      title: 'Controlled',
      description: 'Pass `value` and `onChange`, then look up the full option object by its id.',
      Component: Controlled, code: controlledCode, minHeight: 400,
    },
    {
      id: 'disabled',
      title: 'Disabled',
      description: 'A disabled Select swaps to the disabled colors; single options can be disabled too.',
      Component: Disabled, code: disabledCode, minHeight: 420,
    },
    {
      id: 'invalid',
      title: 'Invalid',
      description: 'An error message marks the Select invalid and replaces the description.',
      Component: Invalid, code: invalidCode, minHeight: 300,
    },
    {
      id: 'read-only',
      title: 'Read-only',
      description: 'The value stays readable and focusable but can’t be changed; the chevron is hidden.',
      Component: ReadOnly, code: readOnlyCode, minHeight: 280,
    },
    {
      id: 'form',
      title: 'Form integration',
      description: 'With a `name` the value is submitted with the form, and `isRequired` blocks an empty submit.',
      Component: FormExample, code: formCode, minHeight: 400,
    },
    {
      id: 'searchable',
      title: 'Searchable',
      description: 'For long lists, a Combobox with the input inside the popup keeps the select-like trigger.',
      Component: Searchable, code: searchableCode, minHeight: 720,
    },
  ],
  api: [
    {
      name: 'Select',
      description: 'A labeled control for choosing from a fixed list. Single selection takes `string | null` values; multiple selection takes `string[]`.',
      props: [
        { name: 'label', type: 'string', description: 'The visible label. Optional inside a Field that has one, or with `aria-label`.' },
        { name: 'options', type: 'readonly (SelectOption | SelectSection)[]', required: true, description: 'The options, or labeled sections of options.' },
        { name: 'appearance', type: "'morph' | 'field'", default: "'morph'", description: '`morph` is the pill that opens in place around the chosen row; `field` is a bordered field with a list popup. Defaults to `field` inside a Field, with sections or with multiple selection.' },
        { name: 'selectionMode', type: "'single' | 'multiple'", default: "'single'", description: 'Whether one option or several can be chosen. Multiple selection always uses the field appearance.' },
        { name: 'value', type: 'string | null | string[]', description: 'The chosen option id (controlled); an array of ids with multiple selection.' },
        { name: 'defaultValue', type: 'string | null | string[]', description: 'The initially chosen option id (uncontrolled); an array of ids with multiple selection.' },
        { name: 'onChange', type: '(value: string | null) => void | (value: string[]) => void', description: 'Called with the new id, or the new ids with multiple selection.' },
        { name: 'placeholder', type: 'string', default: "'Select an option'", description: 'Shown in `fg-muted` while nothing is chosen.' },
        { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'small' | 'medium' | 'large'", default: "'md'", description: 'Height of the field appearance. Legacy names map to `sm`, `md` and `lg`. The `morph` appearance is always md (40 px).' },
        { name: 'hideLabel', type: 'boolean', default: 'false', description: 'Keeps the label for assistive tech only.' },
        { name: 'description', type: 'ReactNode', description: 'Help text under the control. The error replaces it.' },
        { name: 'errorMessage', type: 'ReactNode', description: 'The error line. It replaces the description and marks the control invalid.' },
        { name: 'isInvalid', type: 'boolean', description: 'Marks the control invalid, with or without a message.' },
        { name: 'isDisabled', type: 'boolean', default: 'false', description: 'Disables the control and dims its label.' },
        { name: 'isRequired', type: 'boolean', default: 'false', description: 'Adds ` *` to the label and requires a value on submit.' },
        { name: 'isReadOnly', type: 'boolean', default: 'false', description: 'Shows the value without letting it change.' },
        { name: 'disabledKeys', type: 'Iterable<string>', description: 'Option ids that can’t be chosen, in addition to options with `disabled`.' },
        { name: 'startAddon', type: 'ReactNode', description: 'Content before the value in the field appearance, usually a 16 px Icon.' },
        { name: 'floating', type: 'boolean', default: 'false', description: 'Morph only: shows the label inside the closed pill, above the value.' },
        { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Removes the 256 px max width of `morph` so it fills its container.' },
        { name: 'name', type: 'string', description: 'The name the value is submitted under.' },
        { name: 'form', type: 'string', description: 'The id of a form to belong to, when the Select sits outside it.' },
        { name: 'id', type: 'string', description: 'The id of the trigger. Inside a Field, the Field sets it.' },
        { name: 'autoFocus', type: 'boolean', description: 'Focuses the trigger on mount.' },
        { name: 'onOpenChange', type: '(isOpen: boolean) => void', description: 'Called when the list opens or closes.' },
        { name: 'aria-label', type: 'string', description: 'Names the control when there is no visible label.' },
        { name: 'aria-labelledby', type: 'string', description: 'Names the control from another element.' },
        { name: 'aria-describedby', type: 'string', description: 'Adds descriptions to the control.' },
        { name: 'className', type: 'string', description: 'Class names for the outermost element.' },
        { name: 'style', type: 'CSSProperties', description: 'Inline styles for the outermost element.' },
        { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'The outermost element.' },
        { name: 'hint', type: 'ReactNode', description: 'Deprecated alias of `description`.' },
        { name: 'error', type: 'ReactNode', description: 'Deprecated alias of `errorMessage`.' },
        { name: 'disabled', type: 'boolean', description: 'Deprecated alias of `isDisabled`.' },
        { name: 'required', type: 'boolean', description: 'Deprecated alias of `isRequired`.' },
      ],
    },
    {
      name: 'SelectOption',
      description: 'One option in `options`.',
      props: [
        { name: 'id', type: 'string', required: true, description: 'The value the option stands for.' },
        { name: 'label', type: 'string', required: true, description: 'The text shown in the list and in the trigger.' },
        { name: 'icon', type: 'ReactNode', description: 'A 16 px icon before the label.' },
        { name: 'disabled', type: 'boolean', description: 'Shows the option but stops it being chosen.' },
      ],
    },
    {
      name: 'SelectSection',
      description: 'A labeled group of options. The `morph` appearance lists the options of every section in order.',
      props: [
        { name: 'id', type: 'string', required: true, description: 'A unique key for the section.' },
        { name: 'label', type: 'string', description: 'The group label above the options.' },
        { name: 'options', type: 'readonly SelectOption[]', required: true, description: 'The options in the group.' },
      ],
    },
  ],
  accessibility: [
    'The `morph` appearance is a `combobox` button that controls a `listbox`. Focus stays on the button and the highlighted option is announced through `aria-activedescendant`.',
    'Enter, Space and the arrow keys open the list; the arrows, Home and End move; Enter or Space chooses; Escape closes. Typing letters jumps to a matching option.',
    'The field appearance is a React Aria Select: focus moves into the list while it is open and returns to the trigger when it closes.',
    'Give every Select a `label`, hide it with `hideLabel`, or place it in a Field. The description or error is linked with `aria-describedby`.',
    'A hidden native select carries `name`, so the value is submitted with the form and `isRequired` uses native validation.',
    'With reduced motion the `morph` appearance opens without the spring and the popup fades in over 120 ms.',
  ],
});
