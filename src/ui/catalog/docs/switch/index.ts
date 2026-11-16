import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import WithDescription from './with-description';
import withDescriptionCode from './with-description.tsx?raw';
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
import SettingsRows from './settings-rows';
import settingsRowsCode from './settings-rows.tsx?raw';
import Controlled from './controlled';
import controlledCode from './controlled.tsx?raw';
import FormIntegration from './form-integration';
import formIntegrationCode from './form-integration.tsx?raw';
import Stretch from './stretch';
import stretchCode from './stretch.tsx?raw';
import StretchSizes from './stretch-sizes';
import stretchSizesCode from './stretch-sizes.tsx?raw';

export default defineDoc({
  id: 'switch',
  title: 'Switch',
  category: 'Forms',
  description: 'Turn a setting on or off immediately.',
  source: [
    'components/switch.tsx',
    'components/internal/choice.tsx',
    'components/internal/class-name.ts',
    'components/internal/control.ts',
    'components/internal/size.ts',
    'components/internal/spring.ts',
    'components/internal/states.ts',
    'tokens.stylex.ts',
  ],
  exports: ['Switch', 'StretchSwitch'],
  usage: `import { Switch } from '@/ui/components';

<Switch label="Notifications" />`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode },
    {
      id: 'with-description',
      title: 'With description',
      description: 'Help text sits under the label in `fg-muted`.',
      Component: WithDescription,
      code: withDescriptionCode,
    },
    {
      id: 'sizes',
      title: 'Sizes',
      description: 'Tracks of 32 x 20, 40 x 24 and 48 x 28 px with 13, 14 and 15 px labels. Every size keeps the 32 px row.',
      Component: Sizes,
      code: sizesCode,
    },
    {
      id: 'disabled',
      title: 'Disabled',
      description: 'The track, thumb and label swap to the disabled tokens; nothing fades.',
      Component: Disabled,
      code: disabledCode,
    },
    {
      id: 'read-only',
      title: 'Read-only',
      description: 'The state shows and stays focusable but cannot change.',
      Component: ReadOnly,
      code: readOnlyCode,
    },
    {
      id: 'invalid',
      title: 'Invalid',
      description: 'The track takes a `border-error` ring and the message sits under the label.',
      Component: Invalid,
      code: invalidCode,
    },
    {
      id: 'card',
      title: 'Card',
      description: '`variant="card"` puts the row in a bordered tile with the switch at the end, settings-style.',
      Component: Card,
      code: cardCode,
      minHeight: 260,
    },
    {
      id: 'settings-rows',
      title: 'Settings rows',
      description: '`variant="row"` puts the switch at the end of a full-width row with no tile. Stack rows in a list and divide them with hairlines, as on a settings page.',
      Component: SettingsRows,
      code: settingsRowsCode,
    },
    {
      id: 'controlled',
      title: 'Controlled',
      description: 'Drive the state with `isSelected` and `onChange`.',
      Component: Controlled,
      code: controlledCode,
    },
    {
      id: 'form-integration',
      title: 'Form integration',
      description: 'A switch that is on submits its `value` under its `name`; one that is off submits nothing.',
      Component: FormIntegration,
      code: formIntegrationCode,
      minHeight: 260,
    },
    {
      id: 'stretch',
      title: 'Stretch',
      description: '`appearance="stretch"` is the 96 x 48 switch whose thumb stretches with its real velocity. Drag it or press Space.',
      Component: Stretch,
      code: stretchCode,
    },
    {
      id: 'stretch-sizes',
      title: 'Stretch sizes',
      description: 'The stretch switch at `sm` 64 x 32 and `md` 80 x 40; without a size it is `lg`, 96 x 48. Every size pads its thumb 4 px.',
      Component: StretchSizes,
      code: stretchSizesCode,
      minHeight: 260,
    },
  ],
  api: [
    {
      name: 'Switch',
      description: 'A labeled switch row. It also takes React Aria\'s `isSelected`, `defaultSelected`, `onChange`, `value`, `name`, `form`, `isDisabled`, `isReadOnly`, `isRequired`, `isInvalid`, `validate`, `inputRef` and `autoFocus`.',
      extends: 'React Aria SwitchFieldProps',
      props: [
        { name: 'label', type: 'ReactNode', description: 'The visible label. Without one, pass `aria-label`.' },
        { name: 'description', type: 'ReactNode', description: 'Help text under the label. The error message replaces it while the switch is invalid.' },
        { name: 'errorMessage', type: 'ReactNode | ((validation: ValidationResult) => ReactNode)', description: 'Shown under the row while the switch is invalid.' },
        { name: 'size', type: "'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large'", default: "'md'", description: 'Compact tracks of 32 x 20, 40 x 24 or 48 x 28 px; rows stay 32 px tall. For `stretch`, see StretchSwitch.' },
        { name: 'variant', type: "'default' | 'card' | 'row'", default: "'default'", description: '`card` puts the row in a bordered tile with the switch at the end; `row` puts it at the end of a full-width row with no tile, for settings lists. Compact only.' },
        { name: 'appearance', type: "'compact' | 'stretch'", default: "'compact'", description: '`stretch` renders StretchSwitch.' },
        { name: 'hideLabel', type: 'boolean', default: 'false', description: 'Hides the label visually and keeps it as the accessible name.' },
        { name: 'speed', type: 'number', default: '50', description: 'Stretch appearance only: spring speed, 0 to 100.' },
        { name: 'stretch', type: 'number', default: '36', description: 'Stretch appearance only: how far the thumb stretches with velocity, 0 to 100.' },
        { name: 'className', type: 'string', description: 'Added to the outermost element.' },
        { name: 'style', type: 'CSSProperties', description: 'Inline styles for the outermost element.' },
        { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'The outermost element. Use `inputRef` for the input.' },
        { name: 'error', type: 'ReactNode', description: 'Deprecated: use `isInvalid` with `errorMessage`. Setting it also marks the switch invalid.' },
        { name: 'checked', type: 'boolean', description: 'Deprecated alias of `isSelected`.' },
        { name: 'defaultChecked', type: 'boolean', description: 'Deprecated alias of `defaultSelected`.' },
        { name: 'disabled', type: 'boolean', description: 'Deprecated alias of `isDisabled`.' },
        { name: 'readOnly', type: 'boolean', description: 'Deprecated alias of `isReadOnly`.' },
        { name: 'required', type: 'boolean', description: 'Deprecated alias of `isRequired`.' },
      ],
    },
    {
      name: 'StretchSwitch',
      description: 'The switch whose thumb stretches with its velocity. `Switch appearance="stretch"` renders it.',
      props: [
        { name: 'label', type: 'ReactNode', description: 'The visible label. Without one, pass `aria-label`.' },
        { name: 'description', type: 'ReactNode', description: 'Help text under the label. The error message replaces it while the switch is invalid.' },
        { name: 'errorMessage', type: 'ReactNode | ((validation: ValidationResult) => ReactNode)', description: 'Shown under the row while the switch is invalid. A required switch shows the browser message on submit without it.' },
        { name: 'isSelected', type: 'boolean', description: 'Whether the switch is on (controlled).' },
        { name: 'defaultSelected', type: 'boolean', default: 'false', description: 'Whether the switch starts on (uncontrolled).' },
        { name: 'onChange', type: '(isSelected: boolean) => void', description: 'Called when the switch turns on or off.' },
        { name: 'name', type: 'string', description: 'Submits the switch with its form under this name.' },
        { name: 'value', type: 'string', default: "'on'", description: 'The value submitted when the switch is on.' },
        { name: 'form', type: 'string', description: 'The id of a `<form>` to submit with.' },
        { name: 'id', type: 'string', description: 'The id of the switch button. Generated when omitted.' },
        { name: 'isDisabled', type: 'boolean', default: 'false', description: 'Fades the track (a composite visual) and turns the label `fg-disabled`.' },
        { name: 'isReadOnly', type: 'boolean', default: 'false', description: 'Keeps the switch focusable but stops it changing; sets `aria-readonly`.' },
        { name: 'isRequired', type: 'boolean', default: 'false', description: 'Requires the switch to be on to submit the form.' },
        { name: 'isInvalid', type: 'boolean', description: 'Draws the `border-error` ring and shows `errorMessage`.' },
        { name: 'autoFocus', type: 'boolean', description: 'Focuses the switch on mount.' },
        { name: 'size', type: "'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large'", default: "'lg'", description: '`sm` 64 x 32, `md` 80 x 40, `lg` 96 x 48 (the default), on the control heights.' },
        { name: 'hideLabel', type: 'boolean', default: 'false', description: 'Hides the label visually and keeps it as the accessible name.' },
        { name: 'speed', type: 'number', default: '50', description: 'Spring speed, 0 to 100.' },
        { name: 'stretch', type: 'number', default: '36', description: 'How far the thumb stretches with velocity, 0 to 100.' },
        { name: 'aria-label', type: 'string', description: 'The accessible name when there is no visible label.' },
        { name: 'aria-describedby', type: 'string', description: 'Extra ids that describe the switch.' },
        { name: 'onFocus', type: '(event: FocusEvent<HTMLButtonElement>) => void', description: 'Called when the switch takes focus.' },
        { name: 'onBlur', type: '(event: FocusEvent<HTMLButtonElement>) => void', description: 'Called when the switch loses focus.' },
        { name: 'className', type: 'string', description: 'Added to the outermost element.' },
        { name: 'style', type: 'CSSProperties', description: 'Inline styles for the outermost element.' },
        { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'The outermost element.' },
        { name: 'error', type: 'ReactNode', description: 'Deprecated: use `isInvalid` with `errorMessage`.' },
        { name: 'checked', type: 'boolean', description: 'Deprecated alias of `isSelected`.' },
        { name: 'defaultChecked', type: 'boolean', description: 'Deprecated alias of `defaultSelected`.' },
        { name: 'disabled', type: 'boolean', description: 'Deprecated alias of `isDisabled`.' },
        { name: 'readOnly', type: 'boolean', description: 'Deprecated alias of `isReadOnly`.' },
        { name: 'required', type: 'boolean', description: 'Deprecated alias of `isRequired`.' },
      ],
    },
  ],
  accessibility: [
    'The compact switch is a native checkbox with `role="switch"` inside a `label`; the stretch switch is a `button` with `role="switch"` and `aria-checked`.',
    'Space toggles the focused switch, and Enter toggles the stretch one. The 2 px focus ring shows only for keyboard focus.',
    'The description and the error message are linked with `aria-describedby`; the error replaces the description.',
    'A switch without a visible label needs `aria-label`. `hideLabel` keeps the label for assistive technology.',
    'Under reduced motion the thumb moves without travel, stretch or press scale.',
  ],
});
