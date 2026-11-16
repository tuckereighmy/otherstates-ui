# Segmented Control

Switch between a short row of related choices, views or pages.

Category: Forms · Exports: `SegmentedControl`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { SegmentedControl } from '@/ui/components';

<SegmentedControl
  label="View"
  defaultValue="list"
  options={[
    { value: 'list', label: 'List' },
    { value: 'board', label: 'Board' },
  ]}
/>
```

## SegmentedControl

A radio group drawn as segments on a track, or a row of links when every option has an `href`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` |  | Names the group for assistive tech. It is shown above the control with `withSurface`. |
| `options` (required) | `SegmentedOption[]` |  | The segments: `{ value, label, icon?, hideLabel?, href?, disabled? }`. |
| `value` | `string` |  | The selected value (controlled). In navigation mode, the current page. |
| `defaultValue` | `string` |  | The value selected at first (uncontrolled). Defaults to the first enabled option. |
| `onChange` | `(value: string) => void` |  | Called with the value of the segment the user picks. |
| `appearance` | `'connected' \| 'elastic'` | `'connected'` | `connected`: segments on a `bg-muted` track with a raised tile. `elastic`: separate 32 px chips with a spring. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'sm'` | Segment height on the control scale; the track adds 4px around the segments. Ignored by `elastic`. |
| `isDisabled` | `boolean` | `false` | Disables every segment. |
| `disabled` | `boolean` |  | Deprecated alias of `isDisabled`. |
| `name` | `string` |  | The form field name for the selected value. |
| `form` | `string` |  | The id of a `<form>` to submit with when the control sits outside it. |
| `withSurface` | `boolean` | `false` | Wraps the control in a panel with its label shown. |
| `wobble` | `number` | `67` | How much the `elastic` chips stretch, from 0 to 100. |
| `className` | `string` |  | A class added to the outermost element. |
| `style` | `CSSProperties` |  | Inline styles on the outermost element. |
| `ref` | `Ref<HTMLDivElement>` |  | A ref to the outermost element. |

## Accessibility

- By default the control is a `radiogroup`: Tab focuses the selected segment, and the arrow keys move and select.
- In navigation mode it is a `<nav>` of links: each link is its own tab stop, and the current one has `aria-current="page"`.
- `label` names the group or the navigation landmark; icon-only segments use their `label` as the accessible name.
- Disabled segments are skipped by the arrow keys and are not announced as selectable.
- The tile slides and settles without overshoot, and the `elastic` chips stretch on a spring; with reduced motion both move instantly.

## Examples

### Default

`src/ui/catalog/docs/segmented-control/default.tsx`

```tsx
import { SegmentedControl } from '../../../components';

const views = [
  { value: 'list', label: 'List' },
  { value: 'board', label: 'Board' },
  { value: 'timeline', label: 'Timeline' },
];

export default function SegmentedControlDefault() {
  return <SegmentedControl label="View" defaultValue="board" options={views} />;
}
```

### Sizes

`size` sets the segment height on the control scale: `xs` 24, `sm` 32 (the default) and `md` 40, each inside a 4px track.

`src/ui/catalog/docs/segmented-control/sizes.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { SegmentedControl } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const ranges = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

const s = stylex.create({
  stack: { display: 'grid', justifyItems: 'center', gap: t['--os-space-4'] },
});

export default function SegmentedControlSizes() {
  return (
    <div {...stylex.props(s.stack)}>
      <SegmentedControl size="xs" label="Range, small" defaultValue="week" options={ranges} />
      <SegmentedControl size="sm" label="Range, default" defaultValue="week" options={ranges} />
      <SegmentedControl size="md" label="Range, large" defaultValue="week" options={ranges} />
    </div>
  );
}
```

### Navigation

Give every option an `href` and the control becomes a row of links, with `aria-current` on the current page.

`src/ui/catalog/docs/segmented-control/navigation.tsx`

```tsx
import { SegmentedControl } from '../../../components';

const sections = [
  { value: 'overview', label: 'Overview', href: '#' },
  { value: 'invoices', label: 'Invoices', href: '#' },
  { value: 'payouts', label: 'Payouts', href: '#' },
];

export default function SegmentedControlNavigation() {
  return <SegmentedControl label="Billing" defaultValue="invoices" options={sections} />;
}
```

### Navigation sizes

Links take the same sizes as the radio group.

`src/ui/catalog/docs/segmented-control/navigation-sizes.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { SegmentedControl } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const sections = [
  { value: 'activity', label: 'Activity', href: '#' },
  { value: 'members', label: 'Members', href: '#' },
  { value: 'settings', label: 'Settings', href: '#' },
];

const s = stylex.create({
  stack: { display: 'grid', justifyItems: 'center', gap: t['--os-space-4'] },
});

export default function SegmentedControlNavigationSizes() {
  return (
    <div {...stylex.props(s.stack)}>
      <SegmentedControl size="xs" label="Team, small" defaultValue="activity" options={sections} />
      <SegmentedControl size="md" label="Team, large" defaultValue="activity" options={sections} />
    </div>
  );
}
```

### With icons

An option can carry an `icon` before its label.

`src/ui/catalog/docs/segmented-control/with-icons.tsx`

```tsx
import { Icon, SegmentedControl } from '../../../components';

const themes = [
  { value: 'light', label: 'Light', icon: <Icon name="sun" size={16} /> },
  { value: 'dark', label: 'Dark', icon: <Icon name="moon" size={16} /> },
  { value: 'system', label: 'System', icon: <Icon name="monitor" size={16} /> },
];

export default function SegmentedControlWithIcons() {
  return <SegmentedControl label="Theme" defaultValue="system" options={themes} />;
}
```

### Icon only

With `hideLabel` a segment shows only its icon and turns square; the label stays its accessible name.

`src/ui/catalog/docs/segmented-control/icon-only.tsx`

```tsx
import { Icon, SegmentedControl } from '../../../components';

const layouts = [
  { value: 'list', label: 'List', icon: <Icon name="list" size={16} />, hideLabel: true },
  { value: 'grid', label: 'Grid', icon: <Icon name="grid" size={16} />, hideLabel: true },
];

export default function SegmentedControlIconOnly() {
  return <SegmentedControl label="Layout" defaultValue="grid" options={layouts} />;
}
```

### Disabled

Disable one option with `disabled`, or the whole control with `isDisabled`.

`src/ui/catalog/docs/segmented-control/disabled.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { SegmentedControl } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const plans = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'lifetime', label: 'Lifetime', disabled: true },
];

const s = stylex.create({
  stack: { display: 'grid', justifyItems: 'center', gap: t['--os-space-4'] },
});

export default function SegmentedControlDisabled() {
  return (
    <div {...stylex.props(s.stack)}>
      <SegmentedControl label="Billing period" defaultValue="monthly" options={plans} />
      <SegmentedControl label="Billing period, locked" defaultValue="yearly" options={plans} isDisabled />
    </div>
  );
}
```

### Controlled

Pass `value` and `onChange` to own the selection.

`src/ui/catalog/docs/segmented-control/controlled.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { SegmentedControl } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const statuses = [
  { value: 'open', label: 'Open' },
  { value: 'paid', label: 'Paid' },
  { value: 'overdue', label: 'Overdue' },
];

const s = stylex.create({
  stack: { display: 'grid', justifyItems: 'center', gap: t['--os-space-3'] },
  note: { margin: 0, color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-sm'] },
});

export default function SegmentedControlControlled() {
  const [status, setStatus] = useState('overdue');
  return (
    <div {...stylex.props(s.stack)}>
      <SegmentedControl label="Invoice status" value={status} onChange={setStatus} options={statuses} />
      <p {...stylex.props(s.note)}>Showing {status} invoices</p>
    </div>
  );
}
```

### In a form

With `name`, the selected value is submitted with the form like a radio group.

`src/ui/catalog/docs/segmented-control/in-a-form.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState, type FormEvent } from 'react';
import { Button, SegmentedControl } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const regions = [
  { value: 'eu', label: 'Europe' },
  { value: 'us', label: 'Americas' },
  { value: 'apac', label: 'Asia Pacific' },
];

const s = stylex.create({
  form: { display: 'grid', justifyItems: 'start', gap: t['--os-space-4'] },
  note: { margin: 0, color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-sm'] },
});

export default function SegmentedControlInAForm() {
  const [saved, setSaved] = useState<string | null>(null);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaved(String(new FormData(event.currentTarget).get('region')));
  };
  return (
    <form onSubmit={submit} {...stylex.props(s.form)}>
      <SegmentedControl label="Data region" name="region" defaultValue="eu" options={regions} />
      <Button type="submit">Save region</Button>
      <p {...stylex.props(s.note)}>{saved ? `Saved: ${saved}` : 'Not saved yet'}</p>
    </form>
  );
}
```

### With surface

`withSurface` wraps the control in a labeled panel.

`src/ui/catalog/docs/segmented-control/with-surface.tsx`

```tsx
import { SegmentedControl } from '../../../components';

const quality = [
  { value: 'auto', label: 'Auto' },
  { value: 'high', label: 'High' },
  { value: 'saver', label: 'Data saver' },
];

export default function SegmentedControlWithSurface() {
  return <SegmentedControl label="Video quality" withSurface defaultValue="auto" options={quality} />;
}
```

### Elastic

`appearance="elastic"` draws separate chips that stretch and settle on a spring as the selection moves.

`src/ui/catalog/docs/segmented-control/elastic.tsx`

```tsx
import { SegmentedControl } from '../../../components';

const speeds = ['0.5×', '1×', '1.25×', '1.5×', '2×'];

export default function SegmentedControlElastic() {
  return (
    <SegmentedControl
      label="Playback speed"
      appearance="elastic"
      withSurface
      defaultValue="1×"
      options={speeds.map(speed => ({ value: speed, label: speed }))}
    />
  );
}
```
