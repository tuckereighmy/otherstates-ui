import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Sizes from './sizes';
import sizesCode from './sizes.tsx?raw';
import WithLabels from './with-labels';
import withLabelsCode from './with-labels.tsx?raw';
import Raised from './raised';
import raisedCode from './raised.tsx?raw';
import Vertical from './vertical';
import verticalCode from './vertical.tsx?raw';
import Disabled from './disabled';
import disabledCode from './disabled.tsx?raw';
import DisabledItem from './disabled-item';
import disabledItemCode from './disabled-item.tsx?raw';
import Controlled from './controlled';
import controlledCode from './controlled.tsx?raw';
import WithSeparator from './with-separator';
import withSeparatorCode from './with-separator.tsx?raw';
import WithTooltips from './with-tooltips';
import withTooltipsCode from './with-tooltips.tsx?raw';
import FormatTogglesExample from './format-toggles';
import formatTogglesCode from './format-toggles.tsx?raw';

export default defineDoc({
  id: 'toggle-group',
  title: 'Toggle Group',
  category: 'Forms',
  description: 'Keep several toggle buttons in one selection group.',
  source: [
    'components/toggle-group.tsx',
    'components/Icon.tsx',
    'components/internal/class-name.ts',
    'components/internal/size.ts',
    'components/internal/spring.ts',
    'components/internal/states.ts',
    'components/internal/surface.ts',
    'tokens.stylex.ts',
  ],
  exports: ['ToggleGroup', 'ToggleGroupItem', 'ToggleGroupSeparator', 'FormatToggles', 'FormatIcon'],
  usage: `import { Icon, ToggleGroup, ToggleGroupItem } from '@/ui/components';

<ToggleGroup aria-label="Text style" defaultSelectedKeys={['bold']}>
  <ToggleGroupItem id="bold" aria-label="Bold">
    <Icon name="bold" size={16} />
  </ToggleGroupItem>
  <ToggleGroupItem id="italic" aria-label="Italic">
    <Icon name="italic" size={16} />
  </ToggleGroupItem>
</ToggleGroup>`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode },
    {
      id: 'sizes',
      title: 'Sizes',
      description: '`size` sets the item height on the control scale: `xs` 24, `sm` 32 (the default) and `md` 40, each inside a 4px track.',
      Component: Sizes,
      code: sizesCode,
    },
    {
      id: 'with-labels',
      title: 'With labels',
      description: 'Items can hold an icon and a label. With `selectionMode="single"` and `disallowEmptySelection` one item is always on.',
      Component: WithLabels,
      code: withLabelsCode,
    },
    {
      id: 'raised',
      title: 'Raised and flush',
      description: '`raised` puts transparent items in a raised group shell and fills the items that are on; `flush` drops the shell.',
      Component: Raised,
      code: raisedCode,
    },
    {
      id: 'vertical',
      title: 'Vertical',
      description: 'With `orientation="vertical"` the items stack and the arrow keys move up and down.',
      Component: Vertical,
      code: verticalCode,
    },
    {
      id: 'disabled',
      title: 'Disabled',
      description: '`isDisabled` on the group turns every item off. The selected item keeps its tile so the state stays readable.',
      Component: Disabled,
      code: disabledCode,
    },
    {
      id: 'disabled-item',
      title: 'With a disabled item',
      description: 'Set `isDisabled` on one item to skip it; focus and the arrow keys pass over it.',
      Component: DisabledItem,
      code: disabledItemCode,
    },
    {
      id: 'controlled',
      title: 'Controlled',
      description: 'Pass `selectedKeys` and `onSelectionChange` to own the selection. Several items can be on at once by default.',
      Component: Controlled,
      code: controlledCode,
    },
    {
      id: 'with-separator',
      title: 'With separator',
      description: '`ToggleGroupSeparator` splits the items into runs; selected neighbors join only within a run.',
      Component: WithSeparator,
      code: withSeparatorCode,
    },
    {
      id: 'with-tooltips',
      title: 'With tooltips',
      description: 'Wrap an item in a Tooltip to name an icon-only toggle on hover and as the arrow keys move focus to it.',
      Component: WithTooltips,
      code: withTooltipsCode,
      minHeight: 240,
    },
    {
      id: 'format-toggles',
      title: 'Format toggles',
      description: 'A composed editor control: a toggle group for marks and a sliding alignment switch, with the words moving to their new places.',
      Component: FormatTogglesExample,
      code: formatTogglesCode,
      minHeight: 280,
    },
  ],
  api: [
    {
      name: 'ToggleGroup',
      description: 'A group of toggle buttons that share one selection.',
      extends: 'React Aria ToggleButtonGroupProps',
      props: [
        { name: 'variant', type: "'pills' | 'raised' | 'flush' | 'outline'", default: "'pills'", description: '`pills`: items on a `bg-muted` track with a raised tile. `raised`: transparent items in a raised group shell. `flush`: the same items with no shell. `outline` is the old name of `raised`.' },
        { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'sm'", description: 'Item height on the control scale; the track adds 4px around the items. `small`, `medium` and `large` are accepted as aliases.' },
        { name: 'selectionMode', type: "'single' | 'multiple'", default: "'multiple'", description: 'Whether one or several items can be on at once.' },
        { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'The direction of the items and of arrow-key navigation.' },
        { name: 'className', type: 'string', description: 'A class added to the group element.' },
      ],
    },
    {
      name: 'ToggleGroupItem',
      description: 'One toggle button in the group. Give it an `id`; icon-only items need an `aria-label`.',
      extends: 'React Aria ToggleButtonProps',
      props: [
        { name: 'id', type: 'Key', required: true, description: 'Identifies the item in `selectedKeys`.' },
        { name: 'iconOnly', type: 'boolean', description: 'Draws the item square with no inline padding. Defaults to true when the only child is an element such as an Icon.' },
        { name: 'className', type: 'string', description: 'A class added to the button.' },
      ],
    },
    {
      name: 'ToggleGroupSeparator',
      description: 'A decorative hairline between runs of items, hidden from assistive tech.',
      props: [
        { name: 'className', type: 'string', description: 'A class added to the separator.' },
        { name: 'style', type: 'CSSProperties', description: 'Inline styles merged after the computed length.' },
      ],
    },
    {
      name: 'FormatToggles',
      description: 'A composed text-formatting control with a live preview of the text.',
      props: [
        { name: 'text', type: 'string', required: true, description: 'The preview text the formatting applies to.' },
        { name: 'value', type: 'FormatValue', description: 'The marks and alignment (controlled): `{ marks: string[]; alignment }`.' },
        { name: 'defaultValue', type: 'FormatValue', default: "{ marks: ['bold'], alignment: 'left' }", description: 'The starting marks and alignment (uncontrolled).' },
        { name: 'onChange', type: '(value: FormatValue) => void', description: 'Called with the new marks and alignment.' },
        { name: 'label', type: 'string', default: "'Text formatting'", description: 'Names the region for assistive tech.' },
        { name: 'className', type: 'string', description: 'A class added to the root section.' },
        { name: 'style', type: 'CSSProperties', description: 'Inline styles on the root section.' },
      ],
    },
    {
      name: 'FormatIcon',
      description: 'A 16px formatting glyph drawn with Icon.',
      props: [
        { name: 'name', type: 'string', required: true, description: '`bold`, `italic`, `underline`, `left`, `center`, `right` or `justify`, or any Icon name.' },
      ],
    },
  ],
  accessibility: [
    'With `selectionMode="multiple"` the group is a `toolbar` of `aria-pressed` buttons; with `single` it is a `radiogroup` of radios.',
    'Tab moves focus into the group and out again; the arrow keys move between items, and Space or Enter toggles the focused one.',
    'Name the group with `aria-label` or `aria-labelledby`, and give every icon-only item an `aria-label`.',
    'Disabled items are skipped by the arrow keys. The separator is decorative and hidden from assistive tech.',
    'The selected tile springs into place; with reduced motion it only fades.',
  ],
});
