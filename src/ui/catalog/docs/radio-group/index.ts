import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import WithDescription from './with-description';
import withDescriptionCode from './with-description.tsx?raw';
import Horizontal from './horizontal';
import horizontalCode from './horizontal.tsx?raw';
import Sizes from './sizes';
import sizesCode from './sizes.tsx?raw';
import Disabled from './disabled';
import disabledCode from './disabled.tsx?raw';
import Invalid from './invalid';
import invalidCode from './invalid.tsx?raw';
import ReadOnly from './read-only';
import readOnlyCode from './read-only.tsx?raw';
import Card from './card';
import cardCode from './card.tsx?raw';
import CustomLayout from './custom-layout';
import customLayoutCode from './custom-layout.tsx?raw';
import Controlled from './controlled';
import controlledCode from './controlled.tsx?raw';
import FormIntegration from './form-integration';
import formIntegrationCode from './form-integration.tsx?raw';

export default defineDoc({
  id: 'radio-group',
  title: 'Radio Group',
  category: 'Forms',
  description: 'Choose exactly one option from a set.',
  source: [
    'components/radio-group.tsx',
    'components/internal/choice.tsx',
    'components/internal/class-name.ts',
    'components/internal/control.ts',
    'components/internal/size.ts',
    'components/internal/spring.ts',
    'components/internal/states.ts',
    'tokens.stylex.ts',
  ],
  exports: ['RadioGroup', 'Radio'],
  usage: `import { RadioGroup } from '@/ui/components';

<RadioGroup
  label="Send receipts by"
  defaultValue="email"
  options={[
    { value: 'email', label: 'Email' },
    { value: 'sms', label: 'Text message' },
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
      minHeight: 300,
    },
    {
      id: 'horizontal',
      title: 'Horizontal',
      description: '`orientation="horizontal"` puts short options in a row 16 px apart; the arrow keys follow it.',
      Component: Horizontal,
      code: horizontalCode,
    },
    {
      id: 'sizes',
      title: 'Sizes',
      description: 'Indicators of 16, 18 and 20 px with 13, 14 and 15 px labels, on the same 32 px rows.',
      Component: Sizes,
      code: sizesCode,
    },
    {
      id: 'disabled',
      title: 'Disabled',
      description: 'Disable one option with `disabled`, or the whole group with `isDisabled`.',
      Component: Disabled,
      code: disabledCode,
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
      description: 'The choice shows and stays focusable but cannot change.',
      Component: ReadOnly,
      code: readOnlyCode,
    },
    {
      id: 'card',
      title: 'Card',
      description: '`variant="card"` puts each option in a bordered tile; the chosen tile\'s edge turns `accent-moderate`.',
      Component: Card,
      code: cardCode,
      minHeight: 340,
    },
    {
      id: 'custom-layout',
      title: 'Custom layout',
      description: 'Pass `Radio` children to lay options out yourself; they keep the group\'s size, variant and keyboard behavior.',
      Component: CustomLayout,
      code: customLayoutCode,
      minHeight: 280,
    },
    {
      id: 'controlled',
      title: 'Controlled',
      description: 'Drive the choice with `value` and `onChange`.',
      Component: Controlled,
      code: controlledCode,
    },
    {
      id: 'form-integration',
      title: 'Form integration',
      description: 'The chosen option submits its value under the group\'s `name`. A required group shows its message on submit.',
      Component: FormIntegration,
      code: formIntegrationCode,
      minHeight: 280,
    },
  ],
  api: [
    {
      name: 'RadioGroup',
      description: 'A labeled set of radios with one value. It also takes React Aria\'s `value`, `defaultValue`, `onChange`, `name`, `form`, `orientation`, `isDisabled`, `isReadOnly`, `isRequired`, `isInvalid` and `validate`.',
      extends: 'React Aria RadioGroupProps',
      props: [
        { name: 'label', type: 'ReactNode', description: 'The group\'s visible label. Without one, pass `aria-label`.' },
        { name: 'options', type: 'readonly RadioGroupOption[]', description: 'The options in order: `{ value, label, description?, disabled? }`. Or pass Radio children.' },
        { name: 'children', type: 'ReactNode', description: 'Radio elements for custom layouts, rendered after `options`.' },
        { name: 'description', type: 'ReactNode', description: 'Help text under the options. The error message replaces it while the group is invalid.' },
        { name: 'errorMessage', type: 'ReactNode | ((validation: ValidationResult) => ReactNode)', description: 'Shown under the options while the group is invalid.' },
        { name: 'size', type: "'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large'", default: "'md'", description: 'Indicator and text size of every option.' },
        { name: 'variant', type: "'default' | 'card'", default: "'default'", description: '`card` puts each option in a bordered tile.' },
        { name: 'className', type: 'string', description: 'Added to the outermost element.' },
        { name: 'style', type: 'CSSProperties', description: 'Inline styles for the outermost element.' },
        { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'The outermost element.' },
        { name: 'error', type: 'ReactNode', description: 'Deprecated: use `isInvalid` with `errorMessage`. Setting it also marks the group invalid.' },
        { name: 'disabled', type: 'boolean', description: 'Deprecated alias of `isDisabled`.' },
        { name: 'required', type: 'boolean', description: 'Deprecated alias of `isRequired`.' },
      ],
    },
    {
      name: 'Radio',
      description: 'One option, for custom layouts inside a RadioGroup. It takes the group\'s size and variant, and React Aria\'s `value`, `isDisabled`, `inputRef` and `autoFocus`.',
      extends: 'React Aria RadioFieldProps',
      props: [
        { name: 'value', type: 'string', required: true, description: 'The value the group reports and submits when this option is chosen.' },
        { name: 'label', type: 'ReactNode', description: 'The visible label. Without one, pass `aria-label`.' },
        { name: 'description', type: 'ReactNode', description: 'Help text under the label.' },
        { name: 'hideLabel', type: 'boolean', default: 'false', description: 'Hides the label visually and keeps it as the accessible name.' },
        { name: 'className', type: 'string', description: 'Added to the outermost element.' },
        { name: 'style', type: 'CSSProperties', description: 'Inline styles for the outermost element.' },
        { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'The outermost element.' },
        { name: 'disabled', type: 'boolean', description: 'Deprecated alias of `isDisabled`.' },
      ],
    },
  ],
  accessibility: [
    'Renders a `radiogroup` named by its label, with a native radio input per option.',
    'Tab moves into the group to the chosen option; the arrow keys move and choose within it.',
    'The 2 px focus ring shows on the indicator only for keyboard focus.',
    'The help text and the error message are linked to the group with `aria-describedby`; the error replaces the help text.',
    'Without a visible `label`, give the group an `aria-label`.',
    'The press scales the indicator to .9; reduced motion skips it.',
  ],
});
