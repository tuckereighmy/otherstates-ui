import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import WithEndIcon from './with-end-icon';
import withEndIconCode from './with-end-icon.tsx?raw';
import WithStartText from './with-start-text';
import withStartTextCode from './with-start-text.tsx?raw';
import WithEndText from './with-end-text';
import withEndTextCode from './with-end-text.tsx?raw';
import WithStartAndEndText from './with-start-and-end-text';
import withStartAndEndTextCode from './with-start-and-end-text.tsx?raw';
import AttachedAddons from './attached-addons';
import attachedAddonsCode from './attached-addons.tsx?raw';
import WithTooltip from './with-tooltip';
import withTooltipCode from './with-tooltip.tsx?raw';
import WithIconButton from './with-icon-button';
import withIconButtonCode from './with-icon-button.tsx?raw';
import WithButton from './with-button';
import withButtonCode from './with-button.tsx?raw';
import WithBadge from './with-badge';
import withBadgeCode from './with-badge.tsx?raw';
import WithKeyboardShortcut from './with-keyboard-shortcut';
import withKeyboardShortcutCode from './with-keyboard-shortcut.tsx?raw';
import WithInnerLabel from './with-inner-label';
import withInnerLabelCode from './with-inner-label.tsx?raw';
import Sizes from './sizes';
import sizesCode from './sizes.tsx?raw';
import Disabled from './disabled';
import disabledCode from './disabled.tsx?raw';
import Invalid from './invalid';
import invalidCode from './invalid.tsx?raw';
import Loading from './loading';
import loadingCode from './loading.tsx?raw';
import WithNumberInput from './with-number-input';
import withNumberInputCode from './with-number-input.tsx?raw';
import WithTextarea from './with-textarea';
import withTextareaCode from './with-textarea.tsx?raw';

export default defineDoc({
  id: 'input-group',
  title: 'Input Group',
  category: 'Forms',
  description: 'Add icons, text, buttons or a label to an input or textarea, inside one field shell.',
  source: [
    'components/input-group.tsx',
    'components/Icon.tsx',
    'components/internal/class-name.ts',
    'components/internal/control.ts',
    'components/internal/field-styles.ts',
    'components/internal/size.ts',
    'components/internal/states.ts',
    'tokens.stylex.ts',
  ],
  exports: ['InputGroup', 'InputGroupAddon', 'InputGroupText', 'InputGroupButton'],
  usage: `import { Icon, Input, InputGroup, InputGroupAddon } from '@/ui/components';

<InputGroup>
  <InputGroupAddon>
    <Icon name="search" />
  </InputGroupAddon>
  <Input aria-label="Search projects" placeholder="Search projects" />
</InputGroup>`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode },
    {
      id: 'with-end-icon',
      title: 'With end icon',
      description: 'Place an addon with `align="end"` after the input.',
      Component: WithEndIcon,
      code: withEndIconCode,
    },
    {
      id: 'with-start-text',
      title: 'With start text',
      description: '`InputGroupText` sets a prefix in the group\'s type size, in `fg-muted`.',
      Component: WithStartText,
      code: withStartTextCode,
    },
    {
      id: 'with-end-text',
      title: 'With end text',
      description: 'A unit after the value keeps the number itself clean.',
      Component: WithEndText,
      code: withEndTextCode,
    },
    {
      id: 'with-start-and-end-text',
      title: 'With start and end text',
      description: 'Addons on both sides; the value text sits 8 px from each.',
      Component: WithStartAndEndText,
      code: withStartAndEndTextCode,
    },
    {
      id: 'attached-addons',
      title: 'Attached addons',
      description: '`start` and `end` attach text on its own fill behind a hairline, for fixed parts of the value.',
      Component: AttachedAddons,
      code: attachedAddonsCode,
      stage: 'canvas',
    },
    {
      id: 'with-tooltip',
      title: 'With tooltip',
      description: 'An icon button in the addon can carry a Tooltip that explains the field.',
      Component: WithTooltip,
      code: withTooltipCode,
      minHeight: 240,
    },
    {
      id: 'with-icon-button',
      title: 'With icon button',
      description: 'A read-only group keeps its buttons usable: here, copy the link.',
      Component: WithIconButton,
      code: withIconButtonCode,
      stage: 'canvas',
    },
    {
      id: 'with-button',
      title: 'With button',
      description: '`InputGroupButton` is 32 px tall at md and sits 4 px inside the edge.',
      Component: WithButton,
      code: withButtonCode,
    },
    {
      id: 'with-badge',
      title: 'With badge',
      description: 'A Badge in the end addon marks the state of the value.',
      Component: WithBadge,
      code: withBadgeCode,
    },
    {
      id: 'with-keyboard-shortcut',
      title: 'With keyboard shortcut',
      description: 'A Kbd hints at the shortcut; press / anywhere on the page to focus the search.',
      Component: WithKeyboardShortcut,
      code: withKeyboardShortcutCode,
    },
    {
      id: 'with-inner-label',
      title: 'With inner label',
      description: 'A `block-start` addon puts the label inside the shell, above the value.',
      Component: WithInnerLabel,
      code: withInnerLabelCode,
    },
    {
      id: 'sizes',
      title: 'Sizes',
      description: 'The group sets the size of the input, the text, the icons and the buttons inside it.',
      Component: Sizes,
      code: sizesCode,
      minHeight: 340,
    },
    {
      id: 'disabled',
      title: 'Disabled',
      description: 'A disabled group disables the input and its buttons, and the addons go `fg-disabled`.',
      Component: Disabled,
      code: disabledCode,
    },
    {
      id: 'invalid',
      title: 'Invalid',
      description: 'Inside a Field with an error, the whole group takes the `border-error` edge.',
      Component: Invalid,
      code: invalidCode,
    },
    {
      id: 'loading',
      title: 'Loading',
      description: '`isLoading` puts a spinner in the trailing slot and sets `aria-busy`; typing still works.',
      Component: Loading,
      code: loadingCode,
    },
    {
      id: 'with-number-input',
      title: 'With number input',
      description: 'Buttons placed straight in the group step a numeric input.',
      Component: WithNumberInput,
      code: withNumberInputCode,
    },
    {
      id: 'with-textarea',
      title: 'With textarea',
      description: 'With a Textarea, the group grows with the text; a `block-end` addon holds the actions.',
      Component: WithTextarea,
      code: withTextareaCode,
      minHeight: 260,
    },
  ],
  api: [
    {
      name: 'InputGroup',
      description: 'One bordered shell around an Input or a Textarea and its addons. It owns the height, the focus edge and the states.',
      extends: '<div> attributes',
      props: [
        { name: 'start', type: 'ReactNode', description: 'Content attached at the start, on a `bg-subtle` fill behind a hairline.' },
        { name: 'end', type: 'ReactNode', description: 'Content attached at the end, on a `bg-subtle` fill behind a hairline.' },
        { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'small' | 'medium' | 'large'", default: "'md'", description: 'Height and type of the group and everything in it: 24, 32, 40, 44 or 48 px. `small`, `medium` and `large` are aliases.' },
        { name: 'isInvalid', type: 'boolean', description: 'Shows the invalid edge and sets `aria-invalid` on the control inside. Inside a Field, the Field\'s error sets it.' },
        { name: 'invalid', type: 'boolean', description: 'Deprecated alias of `isInvalid`.' },
        { name: 'isDisabled', type: 'boolean', default: 'false', description: 'Disables the control and the buttons inside. Inside a Field, the Field sets it.' },
        { name: 'isReadOnly', type: 'boolean', default: 'false', description: 'Makes the control inside read-only; buttons stay usable. Inside a Field, the Field sets it.' },
        { name: 'isLoading', type: 'boolean', default: 'false', description: 'Shows a spinner in the trailing slot and sets `aria-busy`.' },
        { name: 'children', type: 'ReactNode', description: 'One Input or Textarea, with InputGroupAddon and InputGroupButton parts around it in reading order.' },
      ],
    },
    {
      name: 'InputGroupAddon',
      description: 'Icons, text, buttons, a Kbd or a Badge beside the control, with no fill of their own. An `Icon` without a size takes the group\'s icon size.',
      extends: '<div> attributes',
      props: [
        { name: 'align', type: "'start' | 'end' | 'block-start' | 'block-end'", default: "'start'", description: '`start` and `end` sit beside the control (place them before or after it); `block-start` and `block-end` take a full row above or below it.' },
      ],
    },
    {
      name: 'InputGroupText',
      description: 'A prefix, suffix or unit in the group\'s type size, in `fg-muted`.',
      extends: '<span> attributes',
      props: [],
    },
    {
      name: 'InputGroupButton',
      description: 'A compact button inside the group: 32 px at md, 4 px inside the edge, radius 6. An `Icon` child without a size renders at 16.',
      extends: 'React Aria ButtonProps',
      props: [
        { name: 'iconOnly', type: 'boolean', default: 'false', description: 'A square button for a single icon. Give it an `aria-label`.' },
        { name: 'variant', type: "'ghost' | 'secondary'", default: "'ghost'", description: '`ghost` is transparent with a hover fill; `secondary` has a neutral fill.' },
        { name: 'className', type: 'string', description: 'Added to the button\'s own classes.' },
        { name: 'style', type: 'CSSProperties', description: 'Inline styles for the button.' },
        { name: 'ref', type: 'Ref<HTMLButtonElement>', description: 'The `<button>` element.' },
      ],
    },
  ],
  accessibility: [
    'The group is a plain container: the Input or Textarea inside keeps its own role, and needs a label from a Field, a `Label` or `aria-label`.',
    'Addon text is visible but not part of the accessible name; when a prefix or unit matters, put it in the label or the description too.',
    'Icon-only buttons need an `aria-label`. Buttons are reached with Tab and pressed with Enter or Space; a focused button draws its ring inside the shell, and the shell keeps its focus edge for the input or textarea.',
    'Clicking an addon or the empty part of the shell focuses the control, so the whole shell is one target.',
    '`isLoading` sets `aria-busy` on the group; the spinner is decorative and stops spinning under reduced motion.',
  ],
});
