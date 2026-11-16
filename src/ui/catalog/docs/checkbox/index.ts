import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import WithDescription from './with-description';
import withDescriptionCode from './with-description.tsx?raw';
import States from './states';
import statesCode from './states.tsx?raw';
import Sizes from './sizes';
import sizesCode from './sizes.tsx?raw';
import Disabled from './disabled';
import disabledCode from './disabled.tsx?raw';
import ReadOnly from './read-only';
import readOnlyCode from './read-only.tsx?raw';
import Invalid from './invalid';
import invalidCode from './invalid.tsx?raw';
import Card from './card';
import cardCode from './card.tsx?raw';
import Controlled from './controlled';
import controlledCode from './controlled.tsx?raw';
import FormIntegration from './form-integration';
import formIntegrationCode from './form-integration.tsx?raw';

export default defineDoc({
  id: 'checkbox',
  title: 'Checkbox',
  category: 'Forms',
  description: 'Turn an independent option on or off.',
  source: [
    'components/checkbox.tsx',
    'components/internal/choice.tsx',
    'components/internal/class-name.ts',
    'components/internal/control.ts',
    'components/internal/size.ts',
    'components/internal/spring.ts',
    'components/internal/states.ts',
    'tokens.stylex.ts',
  ],
  exports: ['Checkbox'],
  usage: `import { Checkbox } from '@/ui/components';

<Checkbox label="Email me when a deployment fails" />`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode },
    {
      id: 'with-description',
      title: 'With description',
      description: 'Help text sits under the label in `fg-muted`, and the indicator stays on the first line.',
      Component: WithDescription,
      code: withDescriptionCode,
    },
    {
      id: 'states',
      title: 'States',
      description: 'Unchecked, checked and indeterminate. The dash marks a parent whose children are partly on.',
      Component: States,
      code: statesCode,
    },
    {
      id: 'sizes',
      title: 'Sizes',
      description: 'Indicators of 16, 18 and 20 px with 13, 14 and 15 px labels. Every size keeps the 32 px row.',
      Component: Sizes,
      code: sizesCode,
    },
    {
      id: 'disabled',
      title: 'Disabled',
      description: 'The ring, fill and label swap to the disabled tokens; nothing fades.',
      Component: Disabled,
      code: disabledCode,
    },
    {
      id: 'read-only',
      title: 'Read-only',
      description: 'The value shows and stays focusable but cannot change. An unchecked box rests on `bg-subtle`.',
      Component: ReadOnly,
      code: readOnlyCode,
    },
    {
      id: 'invalid',
      title: 'Invalid',
      description: 'The ring turns `border-error` and the message sits under the label, linked with `aria-describedby`.',
      Component: Invalid,
      code: invalidCode,
    },
    {
      id: 'card',
      title: 'Card',
      description: '`variant="card"` puts the row in a bordered tile; the edge turns `accent-moderate` when checked.',
      Component: Card,
      code: cardCode,
    },
    {
      id: 'controlled',
      title: 'Controlled',
      description: 'Drive the state with `isSelected` and `onChange` to derive other UI from it.',
      Component: Controlled,
      code: controlledCode,
    },
    {
      id: 'form-integration',
      title: 'Form integration',
      description: 'A checked box submits its `value` under its `name`. A required box shows its message on submit.',
      Component: FormIntegration,
      code: formIntegrationCode,
      minHeight: 260,
    },
  ],
  api: [
    {
      name: 'Checkbox',
      description: 'A labeled checkbox row. It also takes React Aria\'s `isSelected`, `defaultSelected`, `onChange`, `value`, `name`, `form`, `isDisabled`, `isReadOnly`, `isRequired`, `isInvalid`, `isIndeterminate`, `validate`, `inputRef` and `autoFocus`. Inside a CheckboxGroup, a checkbox with a `value` joins the group.',
      extends: 'React Aria CheckboxFieldProps',
      props: [
        { name: 'label', type: 'ReactNode', description: 'The visible label. Without one, pass `aria-label`.' },
        { name: 'description', type: 'ReactNode', description: 'Help text under the label. The error message replaces it while the checkbox is invalid.' },
        { name: 'errorMessage', type: 'ReactNode | ((validation: ValidationResult) => ReactNode)', description: 'Shown under the row while the checkbox is invalid. Without it, the browser\'s validation message shows.' },
        { name: 'size', type: "'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large'", default: "'md'", description: 'Indicator and text size; rows stay 32 px tall. Legacy names are aliases. Inside a group, the group\'s size applies.' },
        { name: 'variant', type: "'default' | 'card'", default: "'default'", description: '`card` puts the row in a bordered tile. Inside a group, the group\'s variant applies.' },
        { name: 'hideLabel', type: 'boolean', default: 'false', description: 'Hides the label visually and keeps it as the accessible name.' },
        { name: 'className', type: 'string', description: 'Added to the outermost element.' },
        { name: 'style', type: 'CSSProperties', description: 'Inline styles for the outermost element.' },
        { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'The outermost element. Use `inputRef` for the input.' },
        { name: 'error', type: 'ReactNode', description: 'Deprecated: use `isInvalid` with `errorMessage`. Setting it also marks the checkbox invalid.' },
        { name: 'checked', type: 'boolean', description: 'Deprecated alias of `isSelected`.' },
        { name: 'defaultChecked', type: 'boolean', description: 'Deprecated alias of `defaultSelected`.' },
        { name: 'disabled', type: 'boolean', description: 'Deprecated alias of `isDisabled`.' },
        { name: 'indeterminate', type: 'boolean', description: 'Deprecated alias of `isIndeterminate`.' },
        { name: 'required', type: 'boolean', description: 'Deprecated alias of `isRequired`.' },
        { name: 'readOnly', type: 'boolean', description: 'Deprecated alias of `isReadOnly`.' },
      ],
    },
  ],
  accessibility: [
    'Renders a native checkbox inside a `label`, so clicking the label toggles it and the label is its accessible name.',
    'Space toggles the focused checkbox. The 2 px focus ring shows on the indicator only for keyboard focus.',
    'An indeterminate checkbox reports `aria-checked="mixed"` until it is toggled.',
    'The description and the error message are linked with `aria-describedby`; the error replaces the description, so only one is read.',
    'A checkbox without a visible label needs `aria-label`. `hideLabel` keeps the label for assistive technology.',
    'The check draws with a spring and the press scales to .9; reduced motion skips both.',
  ],
});
