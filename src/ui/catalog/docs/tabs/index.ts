import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Sizes from './sizes';
import sizesCode from './sizes.tsx?raw';
import WithIcons from './with-icons';
import withIconsCode from './with-icons.tsx?raw';
import Underline from './underline';
import underlineCode from './underline.tsx?raw';
import Vertical from './vertical';
import verticalCode from './vertical.tsx?raw';
import UnderlineVertical from './underline-vertical';
import underlineVerticalCode from './underline-vertical.tsx?raw';
import Disabled from './disabled';
import disabledCode from './disabled.tsx?raw';
import Controlled from './controlled';
import controlledCode from './controlled.tsx?raw';
import Composition from './composition';
import compositionCode from './composition.tsx?raw';
import ExpandingTabsExample from './expanding-tabs';
import expandingTabsCode from './expanding-tabs.tsx?raw';

const partProps = [
  { name: 'className', type: 'string', description: 'A class added to the element.' },
  { name: 'style', type: 'CSSProperties', description: 'Inline styles on the element.' },
  { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'A ref to the element.' },
];

export default defineDoc({
  id: 'tabs',
  title: 'Tabs',
  category: 'Navigation',
  description: 'Move between related panels on one page.',
  source: [
    'components/tabs.tsx',
    'components/Icon.tsx',
    'components/internal/class-name.ts',
    'components/internal/size.ts',
    'components/internal/spring.ts',
    'components/internal/states.ts',
    'components/internal/surface.ts',
    'tokens.stylex.ts',
  ],
  exports: ['Tabs', 'TabList', 'Tab', 'TabPanel', 'ExpandingTabs'],
  usage: `import { Tabs } from '@/ui/components';

<Tabs
  label="Project"
  items={[
    { id: 'overview', label: 'Overview', content: 'Milestones and owners.' },
    { id: 'activity', label: 'Activity', content: 'Recent changes.' },
  ]}
/>`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode },
    {
      id: 'sizes',
      title: 'Sizes',
      description: '`size` sets the tab height on the control scale: `sm` 32, `md` 40 (the default) and `lg` 44.',
      Component: Sizes,
      code: sizesCode,
      minHeight: 240,
    },
    {
      id: 'with-icons',
      title: 'With icons',
      description: 'An item can carry an `icon` before its label, 8px apart.',
      Component: WithIcons,
      code: withIconsCode,
    },
    {
      id: 'underline',
      title: 'Underline',
      description: '`variant="underline"` drops the track: a hairline separates the tabs from the panel and a line marks the selected tab.',
      Component: Underline,
      code: underlineCode,
    },
    {
      id: 'vertical',
      title: 'Vertical',
      description: 'With `orientation="vertical"` the tabs stack beside the panel and the arrow keys move up and down.',
      Component: Vertical,
      code: verticalCode,
    },
    {
      id: 'underline-vertical',
      title: 'Underline, vertical',
      description: 'The underline variant in a column: the line moves to the edge that faces the panel.',
      Component: UnderlineVertical,
      code: underlineVerticalCode,
    },
    {
      id: 'disabled',
      title: 'Disabled tab',
      description: 'Set `disabled` on an item, or pass `disabledKeys`, to keep a tab visible but out of reach.',
      Component: Disabled,
      code: disabledCode,
    },
    {
      id: 'controlled',
      title: 'Controlled',
      description: 'Pass `selectedKey` and `onSelectionChange` to move between tabs from elsewhere, such as a step button.',
      Component: Controlled,
      code: controlledCode,
      minHeight: 240,
    },
    {
      id: 'composition',
      title: 'Composition',
      description: 'Leave out `items` and compose `TabList`, `Tab` and `TabPanel` to put any content in a tab or panel.',
      Component: Composition,
      code: compositionCode,
    },
    {
      id: 'expanding-tabs',
      title: 'Expanding tabs',
      description: 'Compact icon tabs for app navigation: the selected tab expands to show its label, and counts sit on the icon.',
      Component: ExpandingTabsExample,
      code: expandingTabsCode,
    },
  ],
  api: [
    {
      name: 'Tabs',
      description: 'The root. Pass `items` for tabs and panels from data, or compose the parts as children.',
      extends: 'React Aria TabsProps',
      props: [
        { name: 'label', type: 'string', description: 'Names the tab list when you pass `items`. With children, put `aria-label` on TabList.' },
        { name: 'items', type: 'TabItem[]', description: 'Tabs and panels from data: `{ id, label, content, icon?, disabled?, badge? }`.' },
        { name: 'children', type: 'ReactNode', description: 'A TabList and TabPanels, when `items` is left out.' },
        { name: 'variant', type: "'tile' | 'underline'", default: "'tile'", description: '`tile`: tabs on a `bg-muted` track with a raised tile. `underline`: a hairline and a 2px line under the selected tab.' },
        { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Tab height on the control scale. `small`, `medium` and `large` are accepted as aliases.' },
        { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Tabs in a row above the panel, or in a column beside it.' },
        { name: 'selectedKey', type: 'string', description: 'The selected tab (controlled).' },
        { name: 'defaultSelectedKey', type: 'string', description: 'The tab selected at first (uncontrolled). Defaults to the first enabled tab.' },
        { name: 'onSelectionChange', type: '(key: string) => void', description: 'Called with the id of the tab the user selects.' },
        ...partProps,
      ],
    },
    {
      name: 'TabList',
      description: 'The row or column of tabs. Name it with `aria-label`.',
      extends: 'React Aria TabListProps',
      props: partProps,
    },
    {
      name: 'Tab',
      description: 'One tab. Its `id` matches the `id` of its TabPanel.',
      extends: 'React Aria TabProps',
      props: [
        { name: 'id', type: 'Key', required: true, description: 'Identifies the tab and links it to its panel.' },
        { name: 'icon', type: 'ReactNode', description: 'An icon before the label, sized to the tabs: 16 at `sm` and `md`, 18 at `lg`.' },
        { name: 'children', type: 'ReactNode', description: 'The label.' },
        ...partProps,
      ],
    },
    {
      name: 'TabPanel',
      description: 'The content shown while the tab with the same `id` is selected.',
      extends: 'React Aria TabPanelProps',
      props: [
        { name: 'id', type: 'Key', required: true, description: 'The id of the tab this panel belongs to.' },
        ...partProps,
      ],
    },
    {
      name: 'ExpandingTabs',
      description: 'Compact icon tabs whose selected tab expands to show its label.',
      props: [
        { name: 'label', type: 'string', required: true, description: 'Names the tab list for assistive tech.' },
        { name: 'items', type: 'TabItem[]', required: true, description: 'The tabs, each with an `icon`; `badge` adds a count or a dot.' },
        { name: 'selectedKey', type: 'string', description: 'The selected tab (controlled).' },
        { name: 'defaultSelectedKey', type: 'string', description: 'The tab selected at first (uncontrolled).' },
        { name: 'onSelectionChange', type: '(key: string) => void', description: 'Called with the id of the tab the user selects.' },
        { name: 'showLabels', type: 'boolean', default: 'true', description: 'Shows the selected tab\'s label beside its icon.' },
        ...partProps,
      ],
    },
  ],
  accessibility: [
    'Renders a `tablist` of `tab`s, each linked to its `tabpanel` with `aria-controls` and `aria-labelledby`.',
    'Tab moves focus to the selected tab and then into the panel; the arrow keys move between tabs, and Home and End jump to the ends.',
    'Name the tab list with `label` or `aria-label`. ExpandingTabs tabs are named by their label even while it is hidden, and counts are read with it.',
    'Disabled tabs are skipped by the arrow keys.',
    'The tile and the underline slide to the selected tab; with reduced motion they move instantly.',
  ],
});
