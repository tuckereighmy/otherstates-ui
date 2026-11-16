# Agent status

Show what an agent, run or task is doing with one shared set of states.

Category: Agents · Exports: `StatusBadge`, `StatusDot`, `AgentState`, `agentStateLabels`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { StatusBadge } from '@/ui/components';

<StatusBadge state="running" />
```

## StatusBadge

The state as a badge: a dot and a word.

Extends: <span> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `state` (required) | `AgentState` |  | One of idle, queued, running, needs-input, paused, done, failed, skipped or canceled. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'sm'` | Badge height: 20, 24 or 28 px. Ignored by `text`. |
| `appearance` | `'badge' \| 'text'` | `'badge'` | A pill for tables and lists, or the dot and the word alone for the head of an agent card. |
| `children` | `ReactNode` |  | Replaces the state's word. The color still follows `state`. |

## StatusDot

A dot in the state's color. Running pulses.

Extends: <span> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `state` (required) | `AgentState` |  | The state to show. |
| `size` | `'sm' \| 'md'` | `'md'` | Diameter: 6 or 8 px. |
| `label` | `string` |  | Names the dot for assistive tech. Leave it out when the state is written beside it. |

## Accessibility

- A `StatusBadge` reads as its word ("Needs you"); the dot inside it is hidden from assistive tech.
- A `StatusDot` is decorative unless it has a `label`, which makes it an image with that name.
- Color is never the only signal: each state has a word, and not-started states are rings, not fills.
- Under reduced motion, the running pulse stops and the dot stays still.

## Examples

### Default

`src/ui/catalog/docs/agent-status/default.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { StatusBadge, type AgentState } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const states: AgentState[] = ['running', 'needs-input', 'failed', 'done', 'queued', 'paused', 'idle', 'skipped', 'canceled'];

const s = stylex.create({
  row: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: t['--os-space-2'], maxWidth: 440 },
});

export default function AgentStatusDefault() {
  return (
    <div {...stylex.props(s.row)}>
      {states.map(state => <StatusBadge key={state} state={state} />)}
    </div>
  );
}
```

### Dots

A `StatusDot` beside text that already says the state. Give it a `label` only when nothing else does.

`src/ui/catalog/docs/agent-status/dots.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { StatusDot } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  list: { display: 'grid', gap: t['--os-space-3'], margin: 0, padding: 0, listStyleType: 'none' },
  row: { display: 'flex', alignItems: 'center', gap: t['--os-space-2'], fontSize: t['--os-font-size-sm'] },
});

export default function AgentStatusDots() {
  return (
    <ul {...stylex.props(s.list)}>
      <li {...stylex.props(s.row)}><StatusDot state="running" /> Indexing the help center</li>
      <li {...stylex.props(s.row)}><StatusDot state="needs-input" /> Waiting for a refund approval</li>
      <li {...stylex.props(s.row)}><StatusDot state="done" /> Weekly digest sent</li>
      <li {...stylex.props(s.row)}><StatusDot state="queued" /> Translate the release notes</li>
    </ul>
  );
}
```

### Custom label

Children replace the state word; the color still follows `state`.

`src/ui/catalog/docs/agent-status/custom-label.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { StatusBadge } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({ row: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: t['--os-space-2'] } });

export default function AgentStatusCustomLabel() {
  return (
    <div {...stylex.props(s.row)}>
      <StatusBadge state="running">Editing invoice.ts</StatusBadge>
      <StatusBadge state="needs-input">2 approvals</StatusBadge>
      <StatusBadge state="done">Step 5 of 5</StatusBadge>
    </div>
  );
}
```

### Quiet text

`appearance="text"` drops the pill: the dot and the word alone, for the head of an agent card where a pill would compete with the content.

`src/ui/catalog/docs/agent-status/text.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { RiskBadge, StatusBadge } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({ row: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: t['--os-space-5'] } });

export default function AgentStatusText() {
  return (
    <div {...stylex.props(s.row)}>
      <StatusBadge appearance="text" state="running" />
      <StatusBadge appearance="text" state="needs-input" />
      <StatusBadge appearance="text" state="failed" />
      <StatusBadge appearance="text" state="done" />
      <RiskBadge appearance="text" risk="high" />
    </div>
  );
}
```

### Sizes

Badges at 20, 24 and 28 px; dots at 6 and 8 px.

`src/ui/catalog/docs/agent-status/sizes.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { StatusBadge, StatusDot } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({ row: { display: 'flex', alignItems: 'center', gap: t['--os-space-3'] } });

export default function AgentStatusSizes() {
  return (
    <div {...stylex.props(s.row)}>
      <StatusBadge state="running" size="sm" />
      <StatusBadge state="running" size="md" />
      <StatusBadge state="running" size="lg" />
      <StatusDot state="running" size="sm" label="Running" />
      <StatusDot state="running" size="md" label="Running" />
    </div>
  );
}
```
