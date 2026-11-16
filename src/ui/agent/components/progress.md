# Progress

Show how far along a task is.

Category: Feedback · Exports: `Progress`, `TaskChecklist`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { Progress } from '@/ui/components';

<Progress label="Uploading files" value={64} />
```

## Progress

A determinate or indeterminate bar or ring.

Extends: React Aria ProgressBarProps

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` |  | Names the task. It always names the progress bar; `showLabel` also shows it. |
| `variant` | `'bar' \| 'circular'` | `'bar'` | A bar, or a ring. |
| `showLabel` | `boolean` | `false` | Shows the label above the bar, or under the ring. |
| `showValue` | `boolean` | `false` | Shows the formatted value: at the end of the header for a bar, in the center of a ring. |
| `valueLabel` | `ReactNode` |  | Replaces the formatted value, for example "3 of 8 files". A string is also read out by screen readers. |
| `size` | `undefined` | `'md'` | Bar height (4, 6 or 8 px) or ring diameter (64, 120 or 160 px). |
| `tone` | `'accent' \| 'brand' \| 'success' \| 'warning' \| 'error'` | `'accent'` | The fill. `brand` is the product gradient on bars; a ring falls back to `accent`. |
| `className` | `string` |  | A class for the outer element. |
| `style` | `CSSProperties` |  | Inline styles for the outer element. |

## TaskChecklist

A checklist card with a count, a gradient bar and checkable steps.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` (required) | `string` |  | The heading of the card; it also names the list and the bar. |
| `items` (required) | `{ id: string; label: string; disabled?: boolean }[]` |  | The steps, in order. A disabled step cannot be checked or unchecked. |
| `checkedKeys` | `readonly string[]` |  | The checked step ids (controlled). |
| `defaultCheckedKeys` | `readonly string[]` | `[]` | The checked step ids when uncontrolled. |
| `onCheckedChange` | `(keys: string[]) => void` |  | Fires with the checked ids after each toggle. |
| `sparks` | `boolean` | `true` | Sprays a few particles from a step as it is checked. Off under reduced motion. |
| `className` | `string` |  | A class for the card. |
| `style` | `CSSProperties` |  | Inline styles for the card. |
| `ref` | `Ref<HTMLElement>` |  | The card element. |

## Accessibility

- Renders `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax` and a formatted `aria-valuetext`; an indeterminate bar leaves out `aria-valuenow`.
- The label names the bar through `aria-label`, so it reaches screen readers even when it is not shown.
- TaskChecklist steps are buttons with `role="checkbox"` and `aria-checked`; Space and Enter toggle them, and the focus ring sits inside each row.
- Under reduced motion, fills change without a transition, the indeterminate segment rests in the middle of the track, and the ring stops spinning.

## Examples

### Default

`src/ui/catalog/docs/progress/default.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Progress } from '../../../components';

const s = stylex.create({
  root: { width: 300, maxWidth: '100%' },
});

export default function ProgressDefault() {
  return (
    <div {...stylex.props(s.root)}>
      <Progress label="Uploading files" value={64} />
    </div>
  );
}
```

### With label and value

`showLabel` and `showValue` put the label and the value above the bar.

`src/ui/catalog/docs/progress/with-label-and-value.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Progress } from '../../../components';

const s = stylex.create({
  root: { width: 300, maxWidth: '100%' },
});

export default function ProgressWithLabelAndValue() {
  return (
    <div {...stylex.props(s.root)}>
      <Progress label="Uploading files" value={64} showLabel showValue />
    </div>
  );
}
```

### With formatted value

`formatOptions` formats the value; `valueLabel` replaces it with your own text.

`src/ui/catalog/docs/progress/formatted-value.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Progress } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-5'], width: 300, maxWidth: '100%' },
});

export default function ProgressFormattedValue() {
  return (
    <div {...stylex.props(s.root)}>
      <Progress
        label="Downloading backup"
        value={48}
        maxValue={120}
        formatOptions={{ style: 'unit', unit: 'megabyte', maximumFractionDigits: 0 }}
        showLabel
        showValue
      />
      <Progress label="Importing invoices" value={3} maxValue={8} valueLabel="3 of 8 files" showLabel showValue />
    </div>
  );
}
```

### Indeterminate

`isIndeterminate` sweeps a segment along the track when the length of a task is unknown.

`src/ui/catalog/docs/progress/indeterminate.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Progress } from '../../../components';

const s = stylex.create({
  root: { width: 300, maxWidth: '100%' },
});

export default function ProgressIndeterminate() {
  return (
    <div {...stylex.props(s.root)}>
      <Progress label="Preparing the export" isIndeterminate showLabel />
    </div>
  );
}
```

### Sizes

Track heights of 4, 6 and 8 px.

`src/ui/catalog/docs/progress/sizes.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Progress } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-5'], width: 300, maxWidth: '100%' },
});

export default function ProgressSizes() {
  return (
    <div {...stylex.props(s.root)}>
      <Progress label="Small" size="sm" value={40} showLabel />
      <Progress label="Medium" value={60} showLabel />
      <Progress label="Large" size="lg" value={80} showLabel />
    </div>
  );
}
```

### Tones

`brand` is the product gradient; the status tones carry meaning.

`src/ui/catalog/docs/progress/tones.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Progress } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-5'], width: 300, maxWidth: '100%' },
});

export default function ProgressTones() {
  return (
    <div {...stylex.props(s.root)}>
      <Progress label="Onboarding" value={70} tone="brand" showLabel showValue />
      <Progress label="Tests passed" value={100} tone="success" showLabel showValue />
      <Progress label="Build minutes used" value={86} tone="warning" showLabel showValue />
      <Progress label="Failed uploads" value={20} tone="error" showLabel showValue />
    </div>
  );
}
```

### Circular

`variant="circular"` draws a ring, with the value in the center.

`src/ui/catalog/docs/progress/circular.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Progress } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: t['--os-space-8'] },
});

export default function ProgressCircular() {
  return (
    <div {...stylex.props(s.root)}>
      <Progress variant="circular" label="Profile complete" value={75} showValue />
      <Progress variant="circular" size="sm" label="Syncing" isIndeterminate />
    </div>
  );
}
```

### Controlled

Update `value` as the task moves; the fill eases to each new value.

`src/ui/catalog/docs/progress/controlled.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, Progress } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', justifyItems: 'start', gap: t['--os-space-4'], width: 300, maxWidth: '100%' },
});

export default function ProgressControlled() {
  const [done, setDone] = useState(2);

  return (
    <div {...stylex.props(s.root)}>
      <Progress label="Deploying services" value={done} maxValue={5} valueLabel={`${done} of 5 services`} showLabel showValue />
      <Button appearance="tertiary" size="sm" onClick={() => setDone(current => (current === 5 ? 0 : current + 1))}>
        {done === 5 ? 'Start again' : 'Deploy next'}
      </Button>
    </div>
  );
}
```

### Task checklist

A checklist card: each checked step fills the bar and is struck through.

`src/ui/catalog/docs/progress/task-checklist.tsx`

```tsx
import { TaskChecklist } from '../../../components';

export default function ProgressTaskChecklist() {
  return (
    <TaskChecklist
      title="Set up your workspace"
      defaultCheckedKeys={['name']}
      items={[
        { id: 'name', label: 'Name your workspace' },
        { id: 'invite', label: 'Invite your team' },
        { id: 'project', label: 'Create a first project' },
        { id: 'calendar', label: 'Connect a calendar' },
        { id: 'alerts', label: 'Choose your notifications' },
      ]}
    />
  );
}
```
