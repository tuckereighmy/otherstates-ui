import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import WithToggleButtons from './with-toggle-buttons';
import withToggleButtonsCode from './with-toggle-buttons.tsx?raw';
import WithLink from './with-link';
import withLinkCode from './with-link.tsx?raw';
import Sizes from './sizes';
import sizesCode from './sizes.tsx?raw';
import Vertical from './vertical';
import verticalCode from './vertical.tsx?raw';
import Disabled from './disabled';
import disabledCode from './disabled.tsx?raw';
import ToolPaletteExample from './tool-palette';
import toolPaletteCode from './tool-palette.tsx?raw';

const toolProps = [
  { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", description: 'Overrides the toolbar size for this tool.' },
  { name: 'iconOnly', type: 'boolean', description: 'Draws the tool square with no inline padding. Defaults to true when the only child is an element such as an Icon.' },
  { name: 'className', type: 'string', description: 'A class added to the tool.' },
];

export default defineDoc({
  id: 'toolbar',
  title: 'Toolbar',
  category: 'Navigation',
  description: 'Group frequent actions in a keyboard-friendly row.',
  source: [
    'components/toolbar.tsx',
    'components/internal/class-name.ts',
    'components/internal/overlay.tsx',
    'components/internal/size.ts',
    'components/internal/states.ts',
    'components/internal/surface.ts',
    'tokens.stylex.ts',
  ],
  exports: ['Toolbar', 'ToolbarGroup', 'ToolbarButton', 'ToolbarToggleButton', 'ToolbarLink', 'ToolbarSeparator', 'ToolPalette'],
  usage: `import { Icon, Toolbar, ToolbarButton, ToolbarSeparator } from '@/ui/components';

<Toolbar aria-label="Document">
  <ToolbarButton aria-label="Undo">
    <Icon name="undo" size={16} />
  </ToolbarButton>
  <ToolbarSeparator />
  <ToolbarButton>Share</ToolbarButton>
</Toolbar>`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode },
    {
      id: 'with-toggle-buttons',
      title: 'With toggle buttons',
      description: '`ToolbarToggleButton` stays on or off and fills when it is on; plain `ToolbarButton`s run an action.',
      Component: WithToggleButtons,
      code: withToggleButtonsCode,
    },
    {
      id: 'with-link',
      title: 'With links',
      description: '`ToolbarLink` navigates. With `aria-current` it is drawn as the current location.',
      Component: WithLink,
      code: withLinkCode,
    },
    {
      id: 'sizes',
      title: 'Sizes',
      description: '`size` sets the height of every tool: `sm` 32, `md` 40 (the default) and `lg` 44.',
      Component: Sizes,
      code: sizesCode,
    },
    {
      id: 'vertical',
      title: 'Vertical',
      description: 'With `orientation="vertical"` the tools stack, the separator turns horizontal and the arrow keys move up and down.',
      Component: Vertical,
      code: verticalCode,
      minHeight: 280,
    },
    {
      id: 'disabled',
      title: 'Disabled',
      description: 'A disabled tool keeps its place, takes the disabled text color and is skipped by the arrow keys.',
      Component: Disabled,
      code: disabledCode,
    },
    {
      id: 'tool-palette',
      title: 'Tool palette',
      description: 'A composed tool rail for a drawing canvas. The corner of the shape tool opens more shapes.',
      Component: ToolPaletteExample,
      code: toolPaletteCode,
      minHeight: 240,
    },
  ],
  api: [
    {
      name: 'Toolbar',
      description: 'A raised group shell that holds tools and moves focus between them with the arrow keys.',
      extends: 'React Aria ToolbarProps',
      props: [
        { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Height of the tools inside on the control scale. `small`, `medium` and `large` are accepted as aliases.' },
        { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'The direction of the tools and of arrow-key navigation.' },
        { name: 'className', type: 'string', description: 'A class added to the toolbar element.' },
      ],
    },
    {
      name: 'ToolbarButton',
      description: 'A tool that runs an action. Set `aria-pressed` for a toggle you manage yourself.',
      extends: 'React Aria ButtonProps',
      props: toolProps,
    },
    {
      name: 'ToolbarToggleButton',
      description: 'A tool that stays on or off, drawn as a toggled object when on.',
      extends: 'React Aria ToggleButtonProps',
      props: toolProps,
    },
    {
      name: 'ToolbarLink',
      description: 'A tool that navigates. With `aria-current` it is drawn as the current location.',
      extends: 'React Aria LinkProps',
      props: toolProps,
    },
    {
      name: 'ToolbarGroup',
      description: 'A `role="group"` run of tools inside the toolbar. Name it with `aria-label`.',
      extends: '<div> attributes',
      props: [
        { name: 'orientation', type: "'horizontal' | 'vertical'", description: 'Overrides the direction inherited from the toolbar.' },
      ],
    },
    {
      name: 'ToolbarSeparator',
      description: 'A hairline between runs of tools. It turns horizontal in a vertical toolbar.',
      props: [
        { name: 'orientation', type: "'horizontal' | 'vertical'", description: 'Overrides the direction, which defaults to across the toolbar.' },
        { name: 'className', type: 'string', description: 'A class added to the separator.' },
        { name: 'style', type: 'CSSProperties', description: 'Inline styles merged after the computed length.' },
      ],
    },
    {
      name: 'ToolPalette',
      description: 'A composed tool rail for a drawing canvas with a flyout of shapes.',
      props: [
        { name: 'value', type: 'PaletteTool', description: 'The active tool (controlled).' },
        { name: 'defaultValue', type: 'PaletteTool', default: "'move'", description: 'The tool active at first (uncontrolled).' },
        { name: 'onChange', type: '(tool: PaletteTool) => void', description: 'Called with the tool the user picks.' },
        { name: 'label', type: 'string', default: "'Canvas tools'", description: 'Names the toolbar for assistive tech.' },
        { name: 'className', type: 'string', description: 'A class added to the rail.' },
        { name: 'style', type: 'CSSProperties', description: 'Inline styles on the rail.' },
      ],
    },
  ],
  accessibility: [
    'Renders `role="toolbar"`: Tab moves focus into the toolbar and out again, and the arrow keys move between tools.',
    'Name the toolbar and each `ToolbarGroup` with `aria-label`, and give every icon-only tool an `aria-label`.',
    'Toggle tools expose `aria-pressed`; a `ToolbarLink` with `aria-current` announces the current location.',
    'Separators are exposed as `role="separator"` with the right orientation.',
    'In ToolPalette the corner button is its own tool named "More shapes", so the flyout opens from the keyboard too.',
  ],
});
