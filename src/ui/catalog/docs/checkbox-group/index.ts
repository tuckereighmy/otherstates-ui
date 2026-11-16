import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import WithDescription from './with-description';
import withDescriptionCode from './with-description.tsx?raw';
import Horizontal from './horizontal';
import horizontalCode from './horizontal.tsx?raw';
import DisabledItem from './disabled-item';
import disabledItemCode from './disabled-item.tsx?raw';
import Parent from './parent';
import parentCode from './parent.tsx?raw';
import Nested from './nested';
import nestedCode from './nested.tsx?raw';
import Invalid from './invalid';
import invalidCode from './invalid.tsx?raw';
import ReadOnly from './read-only';
import readOnlyCode from './read-only.tsx?raw';
import Card from './card';
import cardCode from './card.tsx?raw';
import Controlled from './controlled';
import controlledCode from './controlled.tsx?raw';
import FormIntegration from './form-integration';
import formIntegrationCode from './form-integration.tsx?raw';

export default defineDoc({
  id: 'checkbox-group',
  title: 'Checkbox Group',
  category: 'Forms',
  description: 'Collect several choices under one shared label.',
  source: [
    'components/checkbox-group.tsx',
    'components/checkbox.tsx',
    'components/internal/choice.tsx',
    'components/internal/class-name.ts',
    'components/internal/control.ts',
    'components/internal/size.ts',
    'components/internal/spring.ts',
    'components/internal/states.ts',
    'tokens.stylex.ts',
  ],
  exports: ['CheckboxGroup'],
  usage: `import { CheckboxGroup } from '@/ui/components';

<CheckboxGroup
  label="Notify me by"
  defaultValue={['email']}
  options={[
    { id: 'email', label: 'Email' },
    { id: 'push', label: 'Push notifications' },
  ]}
/>`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode },
    {
      id: 'with-description',
      title: 'With description',
      description: 'Each option can carry help text, and the group takes its own under the list.',
      Component: WithDescription,
      code: withDescriptionCode,
    },
    {
      id: 'horizontal',
      title: 'Horizontal',
      description: 'Short options sit in a row 16 px apart and wrap on narrow screens.',
      Component: Horizontal,
      code: horizontalCode,
    },
    {
      id: 'disabled-item',
      title: 'With disabled item',
      description: 'Disable one option with `disabled`, or the whole group with `isDisabled`.',
      Component: DisabledItem,
      code: disabledItemCode,
    },
    {
      id: 'parent',
      title: 'Parent checkbox',
      description: '`selectAllLabel` adds a parent that turns every enabled option on or off and shows a dash when only some are on.',
      Component: Parent,
      code: parentCode,
    },
    {
      id: 'nested',
      title: 'Nested parent checkbox',
      description: 'Compose deeper trees from Checkbox children: a checkbox without a `value` stays out of the group and acts as a parent.',
      Component: Nested,
      code: nestedCode,
      minHeight: 280,
    },
    {
      id: 'invalid',
      title: 'Invalid',
      description: 'Every ring turns `border-error`, and the message replaces the group\'s help text.',
      Component: Invalid,
      code: invalidCode,
    },
    {
      id: 'read-only',
      title: 'Read-only',
      description: 'The selection shows and stays focusable but cannot change.',
      Component: ReadOnly,
      code: readOnlyCode,
    },
    {
      id: 'card',
      title: 'Card',
      description: '`variant="card"` puts each option in a bordered tile, 8 px apart.',
      Component: Card,
      code: cardCode,
      minHeight: 320,
    },
    {
      id: 'controlled',
      title: 'Controlled',
      description: 'Drive the selection with `value` and `onChange`.',
      Component: Controlled,
      code: controlledCode,
    },
    {
      id: 'form-integration',
      title: 'Form integration',
      description: 'Each checked option submits its id under the group\'s `name`. A required group shows its message on submit.',
      Component: FormIntegration,
      code: formIntegrationCode,
      minHeight: 280,
    },
  ],
  api: [
    {
      name: 'CheckboxGroup',
      description: 'A labeled list of checkboxes with one value array. It also takes React Aria\'s `value`, `defaultValue`, `onChange`, `name`, `form`, `isDisabled`, `isReadOnly`, `isRequired`, `isInvalid` and `validate`.',
      extends: 'React Aria CheckboxGroupProps',
      props: [
        { name: 'label', type: 'ReactNode', description: 'The group\'s visible label. Without one, pass `aria-label`.' },
        { name: 'options', type: 'readonly CheckboxGroupOption[]', description: 'The options in order: `{ id, label, description?, disabled?, indeterminate? }`. Or pass Checkbox children.' },
        { name: 'children', type: 'ReactNode', description: 'Checkbox elements for custom layouts, rendered after `options`. A checkbox with a `value` joins the group.' },
        { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'vertical'", description: 'Stacks the options 4 px apart, or puts them in a wrapping row 16 px apart.' },
        { name: 'description', type: 'ReactNode', description: 'Help text under the options. The error message replaces it while the group is invalid.' },
        { name: 'errorMessage', type: 'ReactNode | ((validation: ValidationResult) => ReactNode)', description: 'Shown under the options while the group is invalid.' },
        { name: 'size', type: "'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large'", default: "'md'", description: 'Indicator and text size of every option.' },
        { name: 'variant', type: "'default' | 'card'", default: "'default'", description: '`card` puts each option in a bordered tile.' },
        { name: 'selectAllLabel', type: 'ReactNode', description: 'Adds a parent checkbox that turns every enabled option on or off. Works with `options`.' },
        { name: 'className', type: 'string', description: 'Added to the outermost element.' },
        { name: 'style', type: 'CSSProperties', description: 'Inline styles for the outermost element.' },
        { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'The outermost element.' },
        { name: 'error', type: 'ReactNode', description: 'Deprecated: use `isInvalid` with `errorMessage`. Setting it also marks the group invalid.' },
      ],
    },
  ],
  accessibility: [
    'Renders a `group` named by its label, with a native checkbox per option.',
    'Tab moves between options and Space toggles the focused one.',
    'The parent checkbox reports `aria-checked="mixed"` while only some options are on.',
    'The help text and the error message are linked to the group with `aria-describedby`; the error replaces the help text.',
    'Without a visible `label`, give the group an `aria-label`.',
  ],
});
