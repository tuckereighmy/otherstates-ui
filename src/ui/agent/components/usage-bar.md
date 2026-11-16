# Usage bar

Split one budget into its parts: a context window, a run's cost or a rate limit.

Category: Agents · Exports: `UsageBar`, `UsageSegment`, `formatTokens`, `formatCost`, `formatDuration`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { UsageBar } from '@/ui/components';

<UsageBar label="Context window" max={200000} segments={[
  { id: 'system', label: 'System prompt', value: 4200 },
  { id: 'chat', label: 'Conversation', value: 98400 },
]} />
```

## UsageBar

A bar split into the parts of one budget, with a legend.

Extends: <div> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` |  | Names the budget. Shown above the bar unless `hideLabel`. |
| `hideLabel` | `boolean` | `false` | Hides the label visually; it still names the group. |
| `segments` (required) | `UsageSegment[]` |  | Each part: `id`, `label`, `value`, and optional `color` (1 to 5 or muted), `detail` and `pending` (how much of `value` is about to be freed, drawn hatched). |
| `max` | `number` |  | The whole budget. Default: the sum of the segments. |
| `format` | `(value: number) => string` | `formatTokens` | Turns numbers into text for the header and legend. |
| `valueLabel` | `ReactNode` |  | Replaces the header value ("175.6k of 200k"). |
| `legend` | `'list' \| 'chips' \| 'none'` | `'list'` | A row per part, wash chips for cards, or no key. |
| `hideHeader` | `boolean` | `false` | Hides the label and value row, for a card that shows its own figure. |
| `active` | `string \| null` |  | The part held by pointing (controlled). |
| `onActiveChange` | `(id: string \| null) => void` |  | Called when pointing holds a part or lets go. |
| `restLabel` | `ReactNode` |  | Adds a legend row for what is left ("Free"). |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Track height: 6, 8, 12 or 40 px. `xl` is the hero bar of a card. |

## Accessibility

- The bar is a group named by `label`; the drawn track is hidden and the header and legend carry the numbers as text.
- Parts take the chart palette in order, which is checked for color-vision differences; every part is also named in the legend.
- Over the limit, say so in words in `valueLabel` as well as with the error color.
- `formatTokens`, `formatCost` and `formatDuration` give every agent number one written form.

## Examples

### Default

`src/ui/catalog/docs/usage-bar/default.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { UsageBar } from '../../../components';

const s = stylex.create({ box: { width: '100%', maxWidth: 340 } });

export default function UsageBarDefault() {
  return (
    <UsageBar
      {...stylex.props(s.box)}
      label="Context window"
      max={200000}
      restLabel="Free"
      segments={[
        { id: 'system', label: 'System prompt', value: 4200 },
        { id: 'tools', label: 'Tools', value: 12800 },
        { id: 'files', label: 'Files', value: 46100 },
        { id: 'chat', label: 'Conversation', value: 98400, detail: 'Compacts first' },
      ]}
    />
  );
}
```

### Cost

`format` turns values into text; the agent formatters keep money, tokens and time consistent.

`src/ui/catalog/docs/usage-bar/cost.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { formatCost, UsageBar } from '../../../components';

const s = stylex.create({ box: { width: '100%', maxWidth: 340 } });

export default function UsageBarCost() {
  return (
    <UsageBar
      {...stylex.props(s.box)}
      label="Run cost"
      format={formatCost}
      segments={[
        { id: 'plan', label: 'Plan the report', value: 0.04 },
        { id: 'search', label: 'Search sources', value: 0.31 },
        { id: 'draft', label: 'Draft', value: 0.52 },
        { id: 'check', label: 'Check citations', value: 0.18 },
      ]}
    />
  );
}
```

### Inspect and chips

Point at a part, in the bar or its chip, and it holds while the rest fall back; the header reads that part. `legend="chips"` and `size="xl"` are the card form.

`src/ui/catalog/docs/usage-bar/inspect.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { formatCost, UsageBar } from '../../../components';

const s = stylex.create({ box: { width: '100%', maxWidth: 340 } });

export default function UsageBarInspect() {
  return (
    <UsageBar
      {...stylex.props(s.box)}
      label="Run cost"
      size="xl"
      legend="chips"
      format={formatCost}
      segments={[
        { id: 'search', label: 'Search', value: 0.31 },
        { id: 'draft', label: 'Draft', value: 0.52 },
        { id: 'check', label: 'Check', value: 0.18 },
      ]}
    />
  );
}
```

### About to be freed

`pending` hatches the share of a part that an action is about to free, as a preview. When the part's `value` drops, the hatched share narrows away and the parts after it slide over; a part that reaches zero narrows to nothing rather than vanishing.

`src/ui/catalog/docs/usage-bar/pending.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, UsageBar } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  column: { display: 'grid', gap: t['--os-space-4'], width: '100%', maxWidth: 340 },
  actions: { display: 'flex', flexWrap: 'wrap', gap: t['--os-space-2'] },
});

export default function UsageBarPending() {
  const [marked, setMarked] = useState(false);
  const [done, setDone] = useState(false);
  return (
    <div {...stylex.props(s.column)}>
      <UsageBar
        label="Rate limit"
        max={1000}
        format={value => `${value}`}
        valueLabel={done ? '420 of 1,000 left' : marked ? '420 left after canceling' : '80 of 1,000 left'}
        segments={[
          { id: 'sync', label: 'Nightly sync', value: 540 },
          { id: 'backfill', label: 'Backfill', value: done ? 0 : 340, pending: marked && !done ? 340 : 0 },
          { id: 'alerts', label: 'Alerts', value: 40 },
        ]}
      />
      <div {...stylex.props(s.actions)}>
        <Button size="sm" appearance="secondary" isDisabled={done} onClick={() => setMarked(value => !value)}>
          {marked ? 'Keep backfill' : 'Mark backfill'}
        </Button>
        <Button size="sm" isDisabled={!marked || done} onClick={() => setDone(true)}>Cancel backfill</Button>
        <Button size="sm" appearance="text" onClick={() => { setMarked(false); setDone(false); }}>Reset</Button>
      </div>
    </div>
  );
}
```

### Over the limit

When the parts pass `max`, the whole bar turns to the error color.

`src/ui/catalog/docs/usage-bar/over-budget.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { UsageBar } from '../../../components';

const s = stylex.create({ box: { width: '100%', maxWidth: 340 } });

export default function UsageBarOverBudget() {
  return (
    <UsageBar
      {...stylex.props(s.box)}
      label="Tokens per minute"
      max={120000}
      valueLabel="134k of 120k, over the limit"
      legend="none"
      segments={[
        { id: 'triage', label: 'Inbox triage', value: 52000 },
        { id: 'leads', label: 'Lead research', value: 82000 },
      ]}
    />
  );
}
```

### Sizes

Track heights of 6, 8 and 12 px, here without a key.

`src/ui/catalog/docs/usage-bar/sizes.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { UsageBar, type UsageSegment } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const segments: UsageSegment[] = [
  { id: 'input', label: 'Input', value: 61000 },
  { id: 'output', label: 'Output', value: 18000 },
];

const s = stylex.create({ column: { display: 'grid', gap: t['--os-space-5'], width: '100%', maxWidth: 320 } });

export default function UsageBarSizes() {
  return (
    <div {...stylex.props(s.column)}>
      <UsageBar label="Small" size="sm" max={128000} segments={segments} legend="none" />
      <UsageBar label="Medium" size="md" max={128000} segments={segments} legend="none" />
      <UsageBar label="Large" size="lg" max={128000} segments={segments} legend="none" />
    </div>
  );
}
```
