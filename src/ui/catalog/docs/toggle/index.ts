import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Outline from './outline';
import outlineCode from './outline.tsx?raw';
import WithIcon from './with-icon';
import withIconCode from './with-icon.tsx?raw';
import Sizes from './sizes';
import sizesCode from './sizes.tsx?raw';
import Disabled from './disabled';
import disabledCode from './disabled.tsx?raw';
import IconGroup from './icon-group';
import iconGroupCode from './icon-group.tsx?raw';
import Controlled from './controlled';
import controlledCode from './controlled.tsx?raw';

export default defineDoc({
  id: 'toggle',
  title: 'Toggle',
  category: 'Forms',
  description: 'A button that turns one option on or off.',
  source: ['components/toggle.tsx', 'components/Icon.tsx', 'components/internal/size.ts', 'components/internal/states.ts', 'tokens.stylex.ts'],
  exports: ['Toggle', 'ToggleButton'],
  usage: `import { Toggle } from '@/ui/components';

<Toggle defaultSelected>Pin note</Toggle>`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode },
    {
      id: 'outline',
      title: 'Outline',
      description: '`variant="outline"` adds a hairline, so the toggle reads as a control while it is off.',
      Component: Outline,
      code: outlineCode,
    },
    {
      id: 'with-icon',
      title: 'With icon',
      description: 'An `Icon` without a size takes the toggle\'s icon size. When on, the toggle fills with the accent.',
      Component: WithIcon,
      code: withIconCode,
    },
    {
      id: 'sizes',
      title: 'Sizes',
      description: 'Heights of 24, 32, 40, 44 and 48 px. `md` is the default and lines up with buttons and fields.',
      Component: Sizes,
      code: sizesCode,
    },
    {
      id: 'disabled',
      title: 'Disabled',
      description: 'Off toggles stay transparent with disabled text; on toggles take the disabled fill.',
      Component: Disabled,
      code: disabledCode,
    },
    {
      id: 'icon-group',
      title: 'Icon group',
      description: 'Square icon-only toggles side by side, each with an `aria-label`. For one tab stop and arrow keys, use ToggleGroup.',
      Component: IconGroup,
      code: iconGroupCode,
    },
    {
      id: 'controlled',
      title: 'Controlled',
      description: '`isSelected` and `onChange` keep the state in your component.',
      Component: Controlled,
      code: controlledCode,
    },
  ],
  api: [
    {
      name: 'Toggle',
      description: 'A rectangular button that stays pressed while it is on. `ToggleButton` is a deprecated alias.',
      extends: 'React Aria ToggleButtonProps',
      props: [
        {
          name: 'size',
          type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'small' | 'medium' | 'large'",
          default: "'md'",
          description: 'Height, padding, radius, text and icon size from the control scale. `small`, `medium` and `large` are aliases of `sm`, `md` and `lg`.',
        },
        { name: 'variant', type: "'ghost' | 'outline'", default: "'ghost'", description: '`ghost` is transparent while off; `outline` adds a hairline.' },
        { name: 'iconOnly', type: 'boolean', default: 'false', description: 'Makes the toggle square for a single icon child. Give it an `aria-label`.' },
      ],
    },
  ],
  accessibility: [
    'Renders a `button` with `aria-pressed`, which reflects the on state. Space and Enter toggle it.',
    'Keep the label the same in both states: `aria-pressed` already says whether it is on.',
    'An icon-only toggle needs an `aria-label`. Wrap related toggles in an element with `role="group"` and a label.',
    'The focus ring shows for keyboard focus only, 2px outside the edge.',
    'An invisible hit area extends the target to at least 24px, and 44px on touch screens. With reduced motion, the press scale is off.',
  ],
});
