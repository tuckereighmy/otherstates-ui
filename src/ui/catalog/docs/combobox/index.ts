import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Sizes from './sizes';
import sizesCode from './sizes.tsx?raw';
import InField from './in-field';
import inFieldCode from './in-field.tsx?raw';
import AutoHighlight from './auto-highlight';
import autoHighlightCode from './auto-highlight.tsx?raw';
import ClearButton from './clear-button';
import clearButtonCode from './clear-button.tsx?raw';
import Groups from './groups';
import groupsCode from './groups.tsx?raw';
import Multiple from './multiple';
import multipleCode from './multiple.tsx?raw';
import StartAddon from './start-addon';
import startAddonCode from './start-addon.tsx?raw';
import PopupInput from './popup-input';
import popupInputCode from './popup-input.tsx?raw';
import Controlled from './controlled';
import controlledCode from './controlled.tsx?raw';
import Loading from './loading';
import loadingCode from './loading.tsx?raw';
import Disabled from './disabled';
import disabledCode from './disabled.tsx?raw';
import Invalid from './invalid';
import invalidCode from './invalid.tsx?raw';
import ReadOnly from './read-only';
import readOnlyCode from './read-only.tsx?raw';
import FormExample from './form';
import formCode from './form.tsx?raw';

const optionProps = [
  { name: 'id', type: 'string', required: true, description: 'The key of the option, submitted with the form.' },
  { name: 'label', type: 'string', required: true, description: 'The text shown in the list, matched while typing.' },
  { name: 'icon', type: 'ReactNode', description: 'A 16 px icon before the label.' },
  { name: 'disabled', type: 'boolean', description: 'Shows the option but stops it being chosen.' },
];

export default defineDoc({
  id: 'combobox',
  title: 'Combobox',
  category: 'Forms',
  description: 'Type to filter a list of options, then choose one or several.',
  source: [
    'components/combobox.tsx',
    'components/Icon.tsx',
    'components/internal/class-name.ts',
    'components/internal/control.ts',
    'components/internal/field-styles.ts',
    'components/internal/overlay.tsx',
    'components/internal/size.ts',
    'components/internal/states.ts',
    'components/internal/suggestion-input.tsx',
    'tokens.stylex.ts',
  ],
  exports: ['Combobox', 'ComboboxProps', 'CatalogOption', 'CatalogSection', 'CatalogEntry'],
  usage: `import { Combobox } from '@/ui/components';

<Combobox
  label="Assignee"
  placeholder="Choose a teammate"
  options={[
    { id: 'amara', label: 'Amara' },
    { id: 'jonas', label: 'Jonas' },
  ]}
/>`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode, minHeight: 520 },
    {
      id: 'sizes',
      title: 'Sizes',
      description: 'The control sizes from 24 to 48 px; md (40) is the default and lines up with Input and Button.',
      Component: Sizes, code: sizesCode, minHeight: 260,
    },
    {
      id: 'in-field',
      title: 'With label and description',
      description: 'Inside a Field the Combobox takes its label, description, required marker and error from the Field.',
      Component: InField, code: inFieldCode, minHeight: 440,
    },
    {
      id: 'auto-highlight',
      title: 'Auto highlight',
      description: 'The first match is highlighted while typing, so Enter picks it.',
      Component: AutoHighlight, code: autoHighlightCode, minHeight: 720,
    },
    {
      id: 'clear-button',
      title: 'With clear button',
      description: '`isClearable` shows a clear button while the field has text or a value.',
      Component: ClearButton, code: clearButtonCode, minHeight: 440,
    },
    {
      id: 'groups',
      title: 'Groups',
      description: 'Sections group options under a label; empty groups drop out while filtering.',
      Component: Groups, code: groupsCode, minHeight: 600,
    },
    {
      id: 'multiple',
      title: 'Multiple selection',
      description: 'Chosen options become chips before the input; Backspace in the empty input removes the last one.',
      Component: Multiple, code: multipleCode, minHeight: 520,
    },
    {
      id: 'start-addon',
      title: 'With start addon',
      description: '`startAddon` puts an icon at the start of the field, with single or multiple selection.',
      Component: StartAddon, code: startAddonCode, minHeight: 560,
    },
    {
      id: 'popup-input',
      title: 'Input inside the popup',
      description: 'With `inputPlacement="popup"` the trigger is a select-like button and the search field sits at the top of the list.',
      Component: PopupInput, code: popupInputCode, minHeight: 720,
    },
    {
      id: 'controlled',
      title: 'Controlled',
      description: 'Pass `value` and `onChange` to own the selected key.',
      Component: Controlled, code: controlledCode, minHeight: 400,
    },
    {
      id: 'loading',
      title: 'Loading',
      description: 'While `isLoading` is set a spinner sits in the trailing slot and the empty list shows a loading row.',
      Component: Loading, code: loadingCode, minHeight: 280,
    },
    {
      id: 'disabled',
      title: 'Disabled',
      description: 'A disabled Combobox swaps to the disabled colors; single options can be disabled too.',
      Component: Disabled, code: disabledCode, minHeight: 360,
    },
    {
      id: 'invalid',
      title: 'Invalid',
      description: 'An error message marks the field invalid and replaces the description.',
      Component: Invalid, code: invalidCode, minHeight: 240,
    },
    {
      id: 'read-only',
      title: 'Read-only',
      description: 'The value stays readable and focusable but can’t be changed; the chevron is hidden.',
      Component: ReadOnly, code: readOnlyCode, minHeight: 220,
    },
    {
      id: 'form',
      title: 'Form integration',
      description: 'With a `name` the chosen key is submitted with the form; multiple selection submits one entry per key.',
      Component: FormExample, code: formCode, minHeight: 520,
    },
  ],
  api: [
    {
      name: 'Combobox',
      description: 'A text field with a list of options. Typing filters the list; the value must be one of the options.',
      extends: 'React Aria ComboBoxProps (without items, children, allowsCustomValue)',
      props: [
        { name: 'label', type: 'string', description: 'The visible label. Optional inside a Field that has one, or with `aria-label`.' },
        { name: 'options', type: 'readonly CatalogEntry[]', required: true, description: 'Options, or labeled sections of options.' },
        { name: 'placeholder', type: 'string', description: 'Shown in the empty input.' },
        { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'small' | 'medium' | 'large'", default: "'md'", description: 'Height and text size. Legacy names map to `sm`, `md` and `lg`.' },
        { name: 'hideLabel', type: 'boolean', default: 'false', description: 'Keeps the label for assistive tech only.' },
        { name: 'description', type: 'ReactNode', description: 'Help text under the field. The error replaces it.' },
        { name: 'errorMessage', type: 'ReactNode', description: 'The error line. It replaces the description and turns the field invalid.' },
        { name: 'startAddon', type: 'ReactNode', description: 'Content at the start of the shell, usually a 16 px Icon.' },
        { name: 'isClearable', type: 'boolean', default: 'false', description: 'Shows a clear button while the field has text or a value.' },
        { name: 'isLoading', type: 'boolean', default: 'false', description: 'Shows a spinner in the trailing slot, and a loading row while the list is empty.' },
        { name: 'loadingMessage', type: 'ReactNode', default: "'Loading…'", description: 'The text of the loading row.' },
        { name: 'emptyMessage', type: 'ReactNode', default: "'No matching options'", description: 'Shown when nothing matches.' },
        { name: 'showTrigger', type: 'boolean', default: 'true', description: 'Shows the chevron button that opens the full list.' },
        { name: 'autoHighlight', type: 'boolean', default: 'false', description: 'Highlights the first matching option while typing, so Enter picks it.' },
        { name: 'inputPlacement', type: "'field' | 'popup'", default: "'field'", description: '`popup` moves the input into the popup and renders a select-like button as the trigger.' },
        { name: 'searchPlaceholder', type: 'string', default: "'Search…'", description: 'Placeholder of the search input when `inputPlacement="popup"`.' },
        { name: 'className', type: 'string', description: 'Class names for the outermost element.' },
        { name: 'style', type: 'CSSProperties', description: 'Inline styles for the outermost element.' },
        { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'The outermost element.' },
        { name: 'error', type: 'ReactNode', description: 'Deprecated alias of `errorMessage`.' },
      ],
    },
    { name: 'CatalogOption', description: 'One option in `options`.', props: optionProps },
    {
      name: 'CatalogSection',
      description: 'A labeled group of options, separated from the next group by a hairline.',
      props: [
        { name: 'id', type: 'string', required: true, description: 'A unique key for the section.' },
        { name: 'label', type: 'string', description: 'The group label above the options.' },
        { name: 'options', type: 'readonly CatalogOption[]', required: true, description: 'The options in the group.' },
      ],
    },
  ],
  accessibility: [
    'The input has the `combobox` role and controls a `listbox` popup. Focus stays in the input; the highlighted option is announced through `aria-activedescendant`.',
    'Arrow keys open the list and move through it, Enter picks the highlighted option and Escape closes the list, then clears unconfirmed text.',
    'With multiple selection, Backspace in the empty input removes the last chip. The chip and clear buttons are left out of the tab order; the list and Backspace do the same job from the keyboard.',
    'Give every Combobox a `label`, hide it with `hideLabel`, or place it in a Field. The description or error is linked with `aria-describedby`.',
    'With `inputPlacement="popup"` the trigger is a button. Opening it moves focus to the search field; Escape clears the search, a second Escape closes the list and returns focus to the trigger.',
    'With reduced motion the popup fades in and out over 120 ms, without the scale and offset.',
  ],
});
