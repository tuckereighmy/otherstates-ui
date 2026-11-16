# Tabs

Move between related panels on one page.

Category: Navigation · Exports: `Tabs`, `TabList`, `Tab`, `TabPanel`, `ExpandingTabs`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { Tabs } from '@/ui/components';

<Tabs
  label="Project"
  items={[
    { id: 'overview', label: 'Overview', content: 'Milestones and owners.' },
    { id: 'activity', label: 'Activity', content: 'Recent changes.' },
  ]}
/>
```

## Tabs

The root. Pass `items` for tabs and panels from data, or compose the parts as children.

Extends: React Aria TabsProps

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` |  | Names the tab list when you pass `items`. With children, put `aria-label` on TabList. |
| `items` | `TabItem[]` |  | Tabs and panels from data: `{ id, label, content, icon?, disabled?, badge? }`. |
| `children` | `ReactNode` |  | A TabList and TabPanels, when `items` is left out. |
| `variant` | `'tile' \| 'underline'` | `'tile'` | `tile`: tabs on a `bg-muted` track with a raised tile. `underline`: a hairline and a 2px line under the selected tab. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Tab height on the control scale. `small`, `medium` and `large` are accepted as aliases. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Tabs in a row above the panel, or in a column beside it. |
| `selectedKey` | `string` |  | The selected tab (controlled). |
| `defaultSelectedKey` | `string` |  | The tab selected at first (uncontrolled). Defaults to the first enabled tab. |
| `onSelectionChange` | `(key: string) => void` |  | Called with the id of the tab the user selects. |

## TabList

The row or column of tabs. Name it with `aria-label`.

Extends: React Aria TabListProps

## Tab

One tab. Its `id` matches the `id` of its TabPanel.

Extends: React Aria TabProps

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `id` (required) | `Key` |  | Identifies the tab and links it to its panel. |
| `icon` | `ReactNode` |  | An icon before the label, sized to the tabs: 16 at `sm` and `md`, 18 at `lg`. |
| `children` | `ReactNode` |  | The label. |

## TabPanel

The content shown while the tab with the same `id` is selected.

Extends: React Aria TabPanelProps

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `id` (required) | `Key` |  | The id of the tab this panel belongs to. |

## ExpandingTabs

Compact icon tabs whose selected tab expands to show its label.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` |  | Names the tab list for assistive tech. |
| `items` (required) | `TabItem[]` |  | The tabs, each with an `icon`; `badge` adds a count or a dot. |
| `selectedKey` | `string` |  | The selected tab (controlled). |
| `defaultSelectedKey` | `string` |  | The tab selected at first (uncontrolled). |
| `onSelectionChange` | `(key: string) => void` |  | Called with the id of the tab the user selects. |
| `showLabels` | `boolean` | `true` | Shows the selected tab's label beside its icon. |

## Accessibility

- Renders a `tablist` of `tab`s, each linked to its `tabpanel` with `aria-controls` and `aria-labelledby`.
- Tab moves focus to the selected tab and then into the panel; the arrow keys move between tabs, and Home and End jump to the ends.
- Name the tab list with `label` or `aria-label`. ExpandingTabs tabs are named by their label even while it is hidden, and counts are read with it.
- Disabled tabs are skipped by the arrow keys.
- The tile and the underline slide to the selected tab; with reduced motion they move instantly.

## Examples

### Default

`src/ui/catalog/docs/tabs/default.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Tabs } from '../../../components';

const items = [
  { id: 'overview', label: 'Overview', content: 'Four milestones, two of them on track for the March release.' },
  { id: 'activity', label: 'Activity', content: 'Mira closed three issues and opened a review this morning.' },
  { id: 'settings', label: 'Settings', content: 'Visibility, members and notification rules for this project.' },
];

const s = stylex.create({
  frame: { width: '100%', maxWidth: 480 },
});

export default function TabsDefault() {
  return (
    <div {...stylex.props(s.frame)}>
      <Tabs label="Project" items={items} />
    </div>
  );
}
```

### Sizes

`size` sets the tab height on the control scale: `sm` 32, `md` 40 (the default) and `lg` 44.

`src/ui/catalog/docs/tabs/sizes.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Tab, TabList, Tabs } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const sizes = [
  { size: 'sm', title: 'Small' },
  { size: 'md', title: 'Default' },
  { size: 'lg', title: 'Large' },
] as const;

const s = stylex.create({
  stack: { display: 'grid', justifyItems: 'center', gap: t['--os-space-4'] },
});

export default function TabsSizes() {
  return (
    <div {...stylex.props(s.stack)}>
      {sizes.map(({ size, title }) => (
        <Tabs key={size} size={size}>
          <TabList aria-label={`Report, ${title.toLowerCase()}`}>
            <Tab id="summary">Summary</Tab>
            <Tab id="details">Details</Tab>
            <Tab id="export">Export</Tab>
          </TabList>
        </Tabs>
      ))}
    </div>
  );
}
```

### With icons

An item can carry an `icon` before its label, 8px apart.

`src/ui/catalog/docs/tabs/with-icons.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Icon, Tabs } from '../../../components';

const items = [
  { id: 'files', label: 'Files', icon: <Icon name="folder" size={16} />, content: 'Twelve files, last changed by Omar an hour ago.' },
  { id: 'comments', label: 'Comments', icon: <Icon name="message" size={16} />, content: 'Two open threads waiting on a reply.' },
  { id: 'history', label: 'History', icon: <Icon name="clock" size={16} />, content: 'Every saved version from the past 30 days.' },
];

const s = stylex.create({
  frame: { width: '100%', maxWidth: 480 },
});

export default function TabsWithIcons() {
  return (
    <div {...stylex.props(s.frame)}>
      <Tabs label="Document" items={items} />
    </div>
  );
}
```

### Underline

`variant="underline"` drops the track: a hairline separates the tabs from the panel and a line marks the selected tab.

`src/ui/catalog/docs/tabs/underline.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Tabs } from '../../../components';

const items = [
  { id: 'general', label: 'General', content: 'Workspace name, address and default language.' },
  { id: 'members', label: 'Members', content: 'Eight people, two of them admins.' },
  { id: 'billing', label: 'Billing', content: 'Next invoice on the 1st, paid by card.' },
];

const s = stylex.create({
  frame: { width: '100%', maxWidth: 480 },
});

export default function TabsUnderline() {
  return (
    <div {...stylex.props(s.frame)}>
      <Tabs variant="underline" label="Workspace settings" items={items} />
    </div>
  );
}
```

### Vertical

With `orientation="vertical"` the tabs stack beside the panel and the arrow keys move up and down.

`src/ui/catalog/docs/tabs/vertical.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Tabs } from '../../../components';

const items = [
  { id: 'profile', label: 'Profile', content: 'Your name, photo and the time zone used for reminders.' },
  { id: 'security', label: 'Security', content: 'Password, passkeys and the devices that are signed in.' },
  { id: 'alerts', label: 'Alerts', content: 'Choose which updates reach you by email.' },
];

const s = stylex.create({
  frame: { width: '100%', maxWidth: 480 },
});

export default function TabsVertical() {
  return (
    <div {...stylex.props(s.frame)}>
      <Tabs orientation="vertical" label="Account" items={items} />
    </div>
  );
}
```

### Underline, vertical

The underline variant in a column: the line moves to the edge that faces the panel.

`src/ui/catalog/docs/tabs/underline-vertical.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Tabs } from '../../../components';

const items = [
  { id: 'build', label: 'Build', content: 'Install and compile took 48 seconds.' },
  { id: 'tests', label: 'Tests', content: '312 passed, none skipped.' },
  { id: 'deploy', label: 'Deploy', content: 'Live in two regions since 09:40.' },
];

const s = stylex.create({
  frame: { width: '100%', maxWidth: 480 },
});

export default function TabsUnderlineVertical() {
  return (
    <div {...stylex.props(s.frame)}>
      <Tabs variant="underline" orientation="vertical" label="Pipeline" items={items} />
    </div>
  );
}
```

### Disabled tab

Set `disabled` on an item, or pass `disabledKeys`, to keep a tab visible but out of reach.

`src/ui/catalog/docs/tabs/disabled.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Tabs } from '../../../components';

const items = [
  { id: 'draft', label: 'Draft', content: 'The invoice is still editable.' },
  { id: 'sent', label: 'Sent', content: 'Delivered to the client on Monday.' },
  { id: 'refunds', label: 'Refunds', content: 'No refunds yet.', disabled: true },
];

const s = stylex.create({
  frame: { width: '100%', maxWidth: 480 },
});

export default function TabsDisabled() {
  return (
    <div {...stylex.props(s.frame)}>
      <Tabs label="Invoice" items={items} />
    </div>
  );
}
```

### Controlled

Pass `selectedKey` and `onSelectionChange` to move between tabs from elsewhere, such as a step button.

`src/ui/catalog/docs/tabs/controlled.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, Tabs } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const items = [
  { id: 'details', label: 'Details', content: 'Name the deployment and pick a branch.' },
  { id: 'variables', label: 'Variables', content: 'Three variables are set for production.' },
  { id: 'review', label: 'Review', content: 'Everything is ready to ship.' },
];

const s = stylex.create({
  frame: { display: 'grid', justifyItems: 'start', gap: t['--os-space-2'], width: '100%', maxWidth: 480 },
});

export default function TabsControlled() {
  const [step, setStep] = useState('details');
  const next = items[items.findIndex(item => item.id === step) + 1];
  return (
    <div {...stylex.props(s.frame)}>
      <Tabs label="New deployment" items={items} selectedKey={step} onSelectionChange={setStep} />
      <Button size="sm" appearance="secondary" isDisabled={!next} onClick={() => next && setStep(next.id)}>
        Next step
      </Button>
    </div>
  );
}
```

### Composition

Leave out `items` and compose `TabList`, `Tab` and `TabPanel` to put any content in a tab or panel.

`src/ui/catalog/docs/tabs/composition.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Badge, Tab, TabList, TabPanel, Tabs } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  frame: { width: '100%', maxWidth: 480 },
  row: { display: 'flex', alignItems: 'center', gap: t['--os-space-2'] },
});

export default function TabsComposition() {
  return (
    <div {...stylex.props(s.frame)}>
      <Tabs defaultSelectedKey="open">
        <TabList aria-label="Issues">
          <Tab id="open">Open</Tab>
          <Tab id="closed">Closed</Tab>
        </TabList>
        <TabPanel id="open">
          <div {...stylex.props(s.row)}>
            Login page flickers on resize <Badge>New</Badge>
          </div>
        </TabPanel>
        <TabPanel id="closed">Export drops the last row (fixed in 2.4).</TabPanel>
      </Tabs>
    </div>
  );
}
```

### Expanding tabs

Compact icon tabs for app navigation: the selected tab expands to show its label, and counts sit on the icon.

`src/ui/catalog/docs/tabs/expanding-tabs.tsx`

```tsx
import { ExpandingTabs, Icon } from '../../../components';

const items = [
  { id: 'home', label: 'Home', icon: <Icon name="home" size={16} />, content: null },
  { id: 'search', label: 'Search', icon: <Icon name="search" size={16} />, content: null },
  { id: 'inbox', label: 'Inbox', icon: <Icon name="inbox" size={16} />, badge: 3, content: null },
  { id: 'saved', label: 'Saved', icon: <Icon name="bookmark" size={16} />, content: null },
];

export default function TabsExpandingTabs() {
  return <ExpandingTabs label="Workspace" items={items} />;
}
```
