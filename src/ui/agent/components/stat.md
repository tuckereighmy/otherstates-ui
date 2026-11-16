# Stat

Show one number that matters, with the change, limit or trend that gives it meaning.

Category: Feedback · Exports: `Stat`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { Stat } from '@/ui/components';

<Stat label="Spend today" value="$18.40" unit="of $40" limit={{ value: 18.4, max: 40 }} />
```

## Stat

One dashboard number: a label, the figure, and what gives it meaning.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `ReactNode` |  | What it counts: "Waiting on you". |
| `value` (required) | `string` |  | The figure as it should read: "4", "$18.40", "94%". It changes through RollingNumber. |
| `unit` | `ReactNode` |  | Text after the figure: "of $40", "runs". |
| `change` | `{ label: ReactNode; direction: 'up' \| 'down' \| 'flat'; good?: boolean; against?: string }` |  | The change since the last period, green when good and red when not. Up is good unless `good` says otherwise. |
| `caption` | `ReactNode` |  | One quiet line in the foot. |
| `trend` | `number[]` |  | Oldest first, drawn as a sparkline. |
| `trendLabel` | `string` |  | Describes the trend for assistive tech. |
| `limit` | `{ value: number; max: number }` |  | Use of a limit as a thin bar: amber past 80%, red at 100%. |
| `tone` | `'neutral' \| 'warning' \| 'error' \| 'success'` | `'neutral'` | A dot before the label for a number that needs attention. |
| `onPress` | `() => void` |  | Makes the whole stat a button that opens the work behind the number. |
| `variant` | `'filled' \| 'outline'` | `'filled'` | `filled` on a bg-subtle section, `outline` on canvas. |

## Accessibility

- The figure is read once as text; the counting animation is hidden from assistive tech.
- With `onPress` the stat is one native button whose name is its whole content, so "Running, 4 runs, 1 queued" is read together.
- The change is written in words and with an arrow, so it never relies on green and red alone. Use `against` to say what it is compared with.
- The limit bar is decorative: write the limit in `unit` or `caption` too.

## Examples

### Default

`src/ui/catalog/docs/stat/default.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Stat } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'grid', gap: t['--os-space-4'], gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', width: '100%' },
});

export default function StatDefault() {
  return (
    <div {...stylex.props(s.row)}>
      <Stat label="Waiting on you" value="3" unit="decisions" tone="warning" caption="Longest wait 22m" />
      <Stat label="Finished today" value="38" change={{ label: '12%', direction: 'up', against: 'than yesterday' }} trend={[22, 25, 24, 28, 30, 27, 31, 33, 29, 34, 36, 38]} />
      <Stat label="Spend today" value="$18.40" unit="of $40.00" limit={{ value: 18.4, max: 40 }} caption="Resets at midnight" />
    </div>
  );
}
```

### Opens the work

With `onPress` the whole stat is a button, and an arrow shows it leads somewhere. Point the number at the list it counts.

`src/ui/catalog/docs/stat/pressable.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Stat } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'grid', gap: t['--os-space-4'], gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', width: '100%' },
  note: { margin: 0, color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-sm'] },
});

export default function StatPressable() {
  const [opened, setOpened] = useState('nothing yet');
  return (
    <div {...stylex.props(s.row)}>
      <Stat label="Running" value="4" unit="runs" caption="1 queued" onPress={() => setOpened('the running runs')} />
      <Stat label="Failed today" value="2" change={{ label: '1', direction: 'up', good: false, against: 'than yesterday' }} onPress={() => setOpened('the failed runs')} />
      <p {...stylex.props(s.note)} role="status">Opened: {opened}</p>
    </div>
  );
}
```

### Near a limit

The limit bar turns amber past 80% and red at 100%. Say what happens next in the caption.

`src/ui/catalog/docs/stat/limit.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Stat } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'grid', gap: t['--os-space-4'], gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', width: '100%' },
});

export default function StatLimit() {
  return (
    <div {...stylex.props(s.row)}>
      <Stat label="Spend today" value="$34.10" unit="of $40.00" limit={{ value: 34.1, max: 40 }} caption="Runs pause at $40" />
      <Stat label="Seats" value="25" unit="of 25" limit={{ value: 25, max: 25 }} tone="error" caption="Invite more from Billing" />
    </div>
  );
}
```
