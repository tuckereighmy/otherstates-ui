import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import WithInput from './with-input';
import withInputCode from './with-input.tsx?raw';
import Sizes from './sizes';
import sizesCode from './sizes.tsx?raw';
import WithDisabledButton from './with-disabled-button';
import withDisabledButtonCode from './with-disabled-button.tsx?raw';
import WithFilledButtons from './with-filled-buttons';
import withFilledButtonsCode from './with-filled-buttons.tsx?raw';
import WithStartText from './with-start-text';
import withStartTextCode from './with-start-text.tsx?raw';
import WithEndText from './with-end-text';
import withEndTextCode from './with-end-text.tsx?raw';
import Vertical from './vertical';
import verticalCode from './vertical.tsx?raw';
import NestedGroups from './nested-groups';
import nestedGroupsCode from './nested-groups.tsx?raw';
import WithPopup from './with-popup';
import withPopupCode from './with-popup.tsx?raw';
import WithInputGroup from './with-input-group';
import withInputGroupCode from './with-input-group.tsx?raw';
import WithMenu from './with-menu';
import withMenuCode from './with-menu.tsx?raw';
import WithSelect from './with-select';
import withSelectCode from './with-select.tsx?raw';

export default defineDoc({
  id: 'group',
  title: 'Group',
  category: 'Layout',
  description: 'Visually join a set of related controls.',
  source: [
    'components/group.tsx',
    'components/internal/class-name.ts',
    'components/internal/size.ts',
    'components/internal/surface.ts',
    'tokens.stylex.ts',
  ],
  exports: ['Group', 'GroupSeparator', 'GroupText'],
  usage: `import { Button, Group } from '@/ui/components';

<Group aria-label="Edit history">
  <Button appearance="text">Undo</Button>
  <Button appearance="text">Redo</Button>
</Group>`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode },
    {
      id: 'with-input',
      title: 'With input',
      description: 'A field and its action in one shell. Every control keeps the shared control radius and the shell adds its 6 px padding, so the corners stay concentric: pills inside a pill by default, 10 inside 16 on the Standard corners.',
      Component: WithInput,
      code: withInputCode,
    },
    {
      id: 'sizes',
      title: 'Sizes',
      description: 'Match `size` to the controls inside, so `GroupText` and `GroupSeparator` take their height.',
      Component: Sizes,
      code: sizesCode,
    },
    {
      id: 'with-disabled-button',
      title: 'With disabled button',
      description: 'A disabled control keeps its place; only its colors change.',
      Component: WithDisabledButton,
      code: withDisabledButtonCode,
    },
    {
      id: 'with-filled-buttons',
      title: 'With filled buttons',
      description: 'Buttons keep their own appearance inside the shell.',
      Component: WithFilledButtons,
      code: withFilledButtonsCode,
    },
    {
      id: 'with-start-text',
      title: 'With start text',
      description: '`GroupText` with `htmlFor` renders a label that names the field beside it.',
      Component: WithStartText,
      code: withStartTextCode,
    },
    {
      id: 'with-end-text',
      title: 'With end text',
      description: 'A unit after the value.',
      Component: WithEndText,
      code: withEndTextCode,
    },
    {
      id: 'vertical',
      title: 'Vertical',
      description: 'With `orientation="vertical"` the controls stack and `GroupSeparator` turns horizontal.',
      Component: Vertical,
      code: verticalCode,
      minHeight: 240,
    },
    {
      id: 'nested-groups',
      title: 'Nested groups',
      description: 'Inner groups use `variant="flush"`, so only the outer shell is drawn.',
      Component: NestedGroups,
      code: nestedGroupsCode,
    },
    {
      id: 'with-popup',
      title: 'With popup',
      description: 'A popover trigger can sit in a group like any other button.',
      Component: WithPopup,
      code: withPopupCode,
      minHeight: 340,
    },
    {
      id: 'with-input-group',
      title: 'With input group',
      description: 'An `InputGroup` with a search icon, followed by its action.',
      Component: WithInputGroup,
      code: withInputGroupCode,
    },
    {
      id: 'with-menu',
      title: 'With menu',
      description: 'A split button: the main action and a menu of the others.',
      Component: WithMenu,
      code: withMenuCode,
      minHeight: 340,
    },
    {
      id: 'with-select',
      title: 'With select',
      description: 'Pick an option, then act on it.',
      Component: WithSelect,
      code: withSelectCode,
      minHeight: 340,
    },
  ],
  api: [
    {
      name: 'Group',
      description: 'A raised shell (bg-surface, `shadow-control`, radius 16, padding 6, gap 2) around related controls.',
      extends: '<div> attributes',
      props: [
        { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'The direction the controls run in.' },
        { name: 'variant', type: "'raised' | 'flush' | 'outline'", default: "'raised'", description: '`raised` draws the shell; `flush` drops it, for a group inside another. `outline` is a deprecated alias of `raised`.' },
        { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'The size of the controls inside, so `GroupText` and `GroupSeparator` match them. `small`, `medium` and `large` are aliases.' },
        { name: 'children', type: 'ReactNode', description: 'Buttons, fields, triggers, `GroupText`, `GroupSeparator` or flush groups.' },
      ],
    },
    {
      name: 'GroupSeparator',
      description: 'A `border-muted` hairline between sets of controls. It runs across the group, at half the control height.',
      extends: '<div> attributes',
      props: [],
    },
    {
      name: 'GroupText',
      description: 'Static text inside a group, such as a leading label, a unit or a count. It takes the height, padding and type of the group size.',
      extends: '<span> attributes',
      props: [
        { name: 'htmlFor', type: 'string', description: 'Renders a `<label>` for this control id, so the text names the field beside it.' },
        { name: 'ref', type: 'Ref<HTMLElement>', description: 'The rendered `<span>` or `<label>`.' },
      ],
    },
  ],
  accessibility: [
    'Renders `role="group"`. Name it with `aria-label` or `aria-labelledby`, so screen readers announce what the controls are for.',
    'Group only joins controls visually: each one keeps its own Tab stop and keyboard behavior. For one choice among options, use ToggleGroup, which adds selection semantics and arrow-key movement.',
    'A field inside a group still needs a name: an `aria-label`, or a `GroupText` with `htmlFor`.',
    '`GroupSeparator` renders `role="separator"` with the orientation across the group.',
    'Icon-only buttons need an `aria-label`.',
  ],
});
