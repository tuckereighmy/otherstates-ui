# Approval gates

Show a run paused at gates, each with what it would change and a decision.

Category: Agents · Exports: `ApprovalGates`, `Gate`, `GateStatus`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { ApprovalGates } from '@/ui/components';

<ApprovalGates title="Launch the pricing page" gates={gates} onDecide={(id, decision) => decide(id, decision)} />
```

## ApprovalGates

A run's approval gates, each with what it would change and a decision.

Extends: Card props (without heading, description, action, footer)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` (required) | `ReactNode` |  | The run. |
| `gates` (required) | `Gate[]` |  | Each gate: `id`, `title`, `meta`, `blocking`, `status` (waiting, approved or rejected) and `content`. |
| `onDecide` | `(id: string, decision: 'approve' \| 'reject') => void` |  | Adds Approve and Reject to waiting gates. |
| `defaultExpanded` | `string[]` |  | Gates open at first. Default: the first waiting gate. |

## Accessibility

- Each gate is a disclosure: Enter or Space opens it, and its trigger is a heading.
- The gate icon has a name ("waiting for you", "approved", "rejected"), so state is never color alone.
- Progress is a progress bar with "1 of 3" as its value text.

## Examples

### Default

`src/ui/catalog/docs/approval-gates/default.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { ApprovalGates, DiffView, type Gate } from '../../../components';

const gates: Gate[] = [
  {
    id: 'prices', title: 'Change team prices', meta: 'Coder · File change · 1m ago', blocking: true, status: 'waiting',
    content: <DiffView heading="src/billing/plans.ts" lines={[
      { type: 'remove', number: 12, text: "team: { seat: 12, currency: 'usd' }," },
      { type: 'add', number: 12, text: "team: { seat: 14, currency: 'usd' }," },
    ]} />,
  },
  { id: 'email', title: 'Email 1,284 trial users', meta: 'Writer · Email · 3m ago', status: 'waiting', content: 'Announces the new prices from Monday.' },
  { id: 'copy', title: 'Publish the pricing copy', meta: 'Writer · Page · 8m ago', status: 'approved' },
];

const s = stylex.create({ box: { width: '100%', maxWidth: 460 } });

export default function ApprovalGatesDefault() {
  return <ApprovalGates {...stylex.props(s.box)} title="Launch the new pricing page" gates={gates} onDecide={() => {}} />;
}
```

### All decided

With no gate waiting, the run is back to running and every gate shows its outcome.

`src/ui/catalog/docs/approval-gates/decided.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { ApprovalGates } from '../../../components';

const s = stylex.create({ box: { width: '100%', maxWidth: 460 } });

export default function ApprovalGatesDecided() {
  return (
    <ApprovalGates
      {...stylex.props(s.box)}
      title="Rotate the signing keys"
      defaultExpanded={[]}
      gates={[
        { id: 'issue', title: 'Issue the new key', meta: 'Ops agent · 4m ago', status: 'approved' },
        { id: 'revoke', title: 'Revoke the old key today', meta: 'Ops agent · 4m ago', status: 'rejected' },
      ]}
    />
  );
}
```
