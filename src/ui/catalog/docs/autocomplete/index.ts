import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Sizes from './sizes';
import sizesCode from './sizes.tsx?raw';
import InlineComplete from './inline-complete';
import inlineCompleteCode from './inline-complete.tsx?raw';
import AutoHighlight from './auto-highlight';
import autoHighlightCode from './auto-highlight.tsx?raw';
import ClearButton from './clear-button';
import clearButtonCode from './clear-button.tsx?raw';
import TriggerAndClear from './trigger-and-clear';
import triggerAndClearCode from './trigger-and-clear.tsx?raw';
import StartAddon from './start-addon';
import startAddonCode from './start-addon.tsx?raw';
import Groups from './groups';
import groupsCode from './groups.tsx?raw';
import Limit from './limit';
import limitCode from './limit.tsx?raw';
import Async from './async';
import asyncCode from './async.tsx?raw';
import Disabled from './disabled';
import disabledCode from './disabled.tsx?raw';
import Invalid from './invalid';
import invalidCode from './invalid.tsx?raw';
import ReadOnly from './read-only';
import readOnlyCode from './read-only.tsx?raw';
import FormExample from './form';
import formCode from './form.tsx?raw';

export default defineDoc({
  id: 'autocomplete',
  title: 'Autocomplete',
  category: 'Forms',
  description: 'A text field that suggests matches while someone types, and still accepts any text.',
  source: [
    'components/autocomplete.tsx',
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
  exports: ['Autocomplete', 'AutocompleteProps'],
  usage: `import { Autocomplete } from '@/ui/components';

<Autocomplete
  label="Office"
  placeholder="Search cities"
  options={[
    { id: 'lisbon', label: 'Lisbon' },
    { id: 'oslo', label: 'Oslo' },
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
      id: 'inline-complete',
      title: 'Inline completion',
      description: 'The rest of the first match is filled in and selected as you type, so Tab or the arrow keys accept it.',
      Component: InlineComplete, code: inlineCompleteCode, minHeight: 400,
    },
    {
      id: 'auto-highlight',
      title: 'Auto highlight',
      description: 'The first match is highlighted while typing, so Enter picks it.',
      Component: AutoHighlight, code: autoHighlightCode, minHeight: 520,
    },
    {
      id: 'clear-button',
      title: 'With clear button',
      description: '`isClearable` shows a clear button while the field has text.',
      Component: ClearButton, code: clearButtonCode, minHeight: 320,
    },
    {
      id: 'trigger-and-clear',
      title: 'With trigger and clear buttons',
      description: '`showTrigger` adds the chevron that opens every suggestion; it sits after the clear button.',
      Component: TriggerAndClear, code: triggerAndClearCode, minHeight: 400,
    },
    {
      id: 'start-addon',
      title: 'With start addon',
      description: '`startAddon` puts an icon at the start of the field.',
      Component: StartAddon, code: startAddonCode, minHeight: 400,
    },
    {
      id: 'groups',
      title: 'Groups',
      description: 'Sections group suggestions under a label; empty groups drop out while filtering.',
      Component: Groups, code: groupsCode, minHeight: 600,
    },
    {
      id: 'limit',
      title: 'Limit results',
      description: '`limit` caps the number of suggestions shown at once.',
      Component: Limit, code: limitCode, minHeight: 440,
    },
    {
      id: 'async',
      title: 'Async search',
      description: 'Own `inputValue`, fetch matches, and set `isLoading` while they arrive.',
      Component: Async, code: asyncCode, minHeight: 520,
    },
    {
      id: 'disabled',
      title: 'Disabled',
      description: 'A disabled Autocomplete swaps to the disabled colors and can’t take focus.',
      Component: Disabled, code: disabledCode, minHeight: 200,
    },
    {
      id: 'invalid',
      title: 'Invalid',
      description: 'An error message replaces the description while the field is invalid.',
      Component: Invalid, code: invalidCode, minHeight: 220,
    },
    {
      id: 'read-only',
      title: 'Read-only',
      description: 'The text stays readable and selectable but can’t be changed.',
      Component: ReadOnly, code: readOnlyCode, minHeight: 200,
    },
    {
      id: 'form',
      title: 'Form integration',
      description: 'With a `name` the typed or chosen text is submitted with the form.',
      Component: FormExample, code: formCode, minHeight: 400,
    },
  ],
  api: [
    {
      name: 'Autocomplete',
      description: 'A text field with suggestions. The value is the text; a suggestion fills it in.',
      extends: 'React Aria ComboBoxProps (single selection, without items, children, allowsCustomValue)',
      props: [
        { name: 'label', type: 'string', description: 'The visible label. Optional inside a Field that has one, or with `aria-label`.' },
        { name: 'options', type: 'readonly CatalogEntry[]', required: true, description: 'Suggestions, or labeled sections of suggestions.' },
        { name: 'placeholder', type: 'string', description: 'Shown in the empty input.' },
        { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'small' | 'medium' | 'large'", default: "'md'", description: 'Height and text size. Legacy names map to `sm`, `md` and `lg`.' },
        { name: 'hideLabel', type: 'boolean', default: 'false', description: 'Keeps the label for assistive tech only.' },
        { name: 'description', type: 'ReactNode', description: 'Help text under the field. The error replaces it.' },
        { name: 'errorMessage', type: 'ReactNode', description: 'The error line. It replaces the description and turns the field invalid.' },
        { name: 'limit', type: 'number', description: 'Shows at most this many matches.' },
        { name: 'inlineComplete', type: 'boolean', default: 'false', description: 'Completes the input with the first option that starts with the typed text, selecting the added part.' },
        { name: 'autoHighlight', type: 'boolean', default: 'false', description: 'Highlights the first match while typing, so Enter picks it.' },
        { name: 'startAddon', type: 'ReactNode', description: 'Content at the start of the shell, usually a 16 px Icon.' },
        { name: 'isClearable', type: 'boolean', default: 'false', description: 'Shows a clear button while the field has text.' },
        { name: 'showTrigger', type: 'boolean', default: 'false', description: 'Shows the chevron button that opens every suggestion.' },
        { name: 'isLoading', type: 'boolean', default: 'false', description: 'Shows a spinner in the trailing slot, and a loading row while the list is empty.' },
        { name: 'loadingMessage', type: 'ReactNode', default: "'Loading…'", description: 'The text of the loading row.' },
        { name: 'emptyMessage', type: 'ReactNode', default: "'No matching options'", description: 'Shown when nothing matches.' },
        { name: 'className', type: 'string', description: 'Class names for the outermost element.' },
        { name: 'style', type: 'CSSProperties', description: 'Inline styles for the outermost element.' },
        { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'The outermost element.' },
        { name: 'error', type: 'ReactNode', description: 'Deprecated alias of `errorMessage`.' },
      ],
    },
  ],
  accessibility: [
    'The input has the `combobox` role and controls a `listbox` of suggestions. Focus stays in the input; the highlighted suggestion is announced through `aria-activedescendant`.',
    'Arrow keys open and move through the suggestions, Enter fills in the highlighted one, and Escape closes the list. Any typed text is a valid value.',
    'Inline completion selects only the added text, so typing on replaces it and Backspace removes it.',
    'The clear and chevron buttons are left out of the tab order; the clear button is labeled "Clear".',
    'Give every Autocomplete a `label`, hide it with `hideLabel`, or place it in a Field. The description or error is linked with `aria-describedby`.',
    'With reduced motion the popup fades in and out over 120 ms, without the scale and offset.',
  ],
});
