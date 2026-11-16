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
import WithLabel from './with-label';
import withLabelCode from './with-label.tsx?raw';
import FieldIntegration from './field-integration';
import fieldIntegrationCode from './field-integration.tsx?raw';
import AutoResize from './auto-resize';
import autoResizeCode from './auto-resize.tsx?raw';
import CharacterCount from './character-count';
import characterCountCode from './character-count.tsx?raw';
import FormIntegration from './form-integration';
import formIntegrationCode from './form-integration.tsx?raw';

export default defineDoc({
  id: 'textarea',
  title: 'Textarea',
  category: 'Forms',
  description: 'Write and edit multiple lines of text.',
  source: [
    'components/textarea.tsx',
    'components/internal/class-name.ts',
    'components/internal/control.ts',
    'components/internal/field-styles.ts',
    'components/internal/size.ts',
    'tokens.stylex.ts',
  ],
  exports: ['Textarea'],
  usage: `import { Textarea } from '@/ui/components';

<Textarea label="Release notes" placeholder="What changed in this version?" />`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode },
    {
      id: 'sizes',
      title: 'Sizes',
      description: 'Text and insets follow the input of the same size; the minimum height is two control heights.',
      Component: Sizes,
      code: sizesCode,
      minHeight: 420,
    },
    {
      id: 'disabled',
      title: 'Disabled',
      description: 'Colors swap to the disabled tokens, the label dims, and resizing turns off.',
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
      description: 'The text stays focusable and selectable on a `bg-subtle` shell.',
      Component: ReadOnly,
      code: readOnlyCode,
      stage: 'canvas',
    },
    {
      id: 'with-label',
      title: 'With label',
      description: '`label`, `description` and `isRequired` render the label, help text and required marker.',
      Component: WithLabel,
      code: withLabelCode,
    },
    {
      id: 'field-integration',
      title: 'Field integration',
      description: 'Without a `label`, a Textarea inside a Field takes the field\'s id, label, help text and state.',
      Component: FieldIntegration,
      code: fieldIntegrationCode,
    },
    {
      id: 'auto-resize',
      title: 'Auto-resize',
      description: '`minRows` and `maxRows` make the height follow the text between those line counts.',
      Component: AutoResize,
      code: autoResizeCode,
    },
    {
      id: 'character-count',
      title: 'Character count',
      description: '`showCount` adds a live count at the end of the help line, measured against `maxLength`.',
      Component: CharacterCount,
      code: characterCountCode,
    },
    {
      id: 'form-integration',
      title: 'Form integration',
      description: 'Inside a Form, a required Field shows the browser message under the textarea on submit.',
      Component: FormIntegration,
      code: formIntegrationCode,
      minHeight: 300,
    },
  ],
  api: [
    {
      name: 'Textarea',
      description: 'A native `<textarea>` in a text-entry shell, with an optional label, help text and character count.',
      extends: '<textarea> attributes',
      props: [
        { name: 'label', type: 'ReactNode', description: 'A label above the textarea. Leave it out inside a Field or an InputGroup, and name the textarea there.' },
        { name: 'description', type: 'ReactNode', description: 'Help text under the textarea. The error message replaces it while the textarea is invalid.' },
        { name: 'hint', type: 'ReactNode', description: 'Deprecated alias of `description`.' },
        { name: 'errorMessage', type: 'ReactNode', description: 'Shown under the textarea in place of the description; marks it invalid while set.' },
        { name: 'error', type: 'ReactNode', description: 'Deprecated alias of `errorMessage`.' },
        { name: 'isInvalid', type: 'boolean', description: 'Shows the invalid edge and sets `aria-invalid`. Defaults to true while an error message is set.' },
        { name: 'isDisabled', type: 'boolean', default: 'false', description: 'Disables the textarea, dims its label and turns off resizing. `disabled` is an alias.' },
        { name: 'isReadOnly', type: 'boolean', default: 'false', description: 'Keeps the text selectable but not editable. `readOnly` is an alias.' },
        { name: 'isRequired', type: 'boolean', default: 'false', description: 'Makes the textarea required and adds ` *` to the label. `required` is an alias.' },
        { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'small' | 'medium' | 'large'", default: "'md'", description: 'Text size and insets; the minimum height is 48, 64, 80, 88 or 96 px. Inside an InputGroup the group\'s size wins.' },
        { name: 'minRows', type: 'number', description: 'Turns on auto-resize: the textarea is never shorter than this many lines.' },
        { name: 'maxRows', type: 'number', description: 'Turns on auto-resize: the textarea grows to this many lines, then scrolls.' },
        { name: 'showCount', type: 'boolean', default: 'false', description: 'Shows the character count under the textarea, against `maxLength` when it is set.' },
        { name: 'className', type: 'string', description: 'Added to the root element when a label, help text or count renders around the textarea; otherwise to the `<textarea>`.' },
        { name: 'style', type: 'CSSProperties', description: 'Applied to the same element as `className`.' },
      ],
    },
  ],
  accessibility: [
    'Renders a native `<textarea>`. Name it with `label`, a surrounding Field, or `aria-label`; a placeholder is not a label.',
    '`aria-describedby` points at the help or error text and the character count; `aria-invalid` is set while the textarea is invalid.',
    'Every focus draws a 2 px edge in the focus-ring color; forced-colors mode gets the system outline instead.',
    'Enter adds a new line and Tab moves focus out, as in any native textarea.',
    '`isReadOnly` keeps the textarea in the tab order with selectable text; `isDisabled` takes it out of the tab order.',
  ],
});
