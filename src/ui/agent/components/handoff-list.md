# Handoff list

List what agents are waiting on a person for, longest wait first, and decide each in place.

Category: Agents · Exports: `HandoffList`, `formatWait`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { HandoffList } from '@/ui/components';

<HandoffList label="Waiting on you" items={handoffs} onApprove={approve} onDeny={deny} onOpen={open} />
```

## HandoffList

What agents are waiting on a person for, longest first.

Extends: <ul> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` |  | Names the list: "Waiting on you". |
| `items` (required) | `Handoff[]` |  | `{ id, agent, kind, title, subject?, waited, risk?, outcome? }`. `kind` is 'approval', 'question', 'review' or 'blocked'; `waited` is in ms. |
| `onApprove` | `(id: string) => void` |  | Adds Approve to approvals. |
| `onDeny` | `(id: string) => void` |  | Adds Deny to approvals. |
| `onOpen` | `(id: string) => void` |  | Adds Answer, Review or Open to the other kinds. |
| `lateAfter` | `number` | `600000` | A wait longer than this, in ms, turns amber. |
| `empty` | `ReactNode` | `"Nothing is waiting on you."` | Shown when nothing is waiting. |

## formatWait

A wait as "<1m", "14m" or "1h 05m".

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `ms` (required) | `number` |  | The wait in ms. |

## Accessibility

- The rows are a named list. Each button names its item ("Approve: Deploy the checkout fix to staging"), so a screen reader hears what it decides.
- Risk and lateness are written as words, never color alone.
- A decided row shows its outcome in a status region before the item is removed.

## Examples

### Default

Approvals decide in place; questions and reviews open where they can be answered. A wait past ten minutes turns amber.

`src/ui/catalog/docs/handoff-list/default.tsx`

```tsx
'use client';

import { useState } from 'react';
import { HandoffList, type Handoff } from '../../../components';

const start: Handoff[] = [
  { id: 'deploy', kind: 'approval', agent: { name: 'Coder', icon: 'code', color: 1 }, title: 'Deploy the checkout fix to staging', subject: 'npm run deploy -- --env staging', waited: 360_000, risk: 'medium' },
  { id: 'refund', kind: 'approval', agent: { name: 'Support', icon: 'message', color: 5 }, title: 'Refund $84.00 for order #1183', subject: 'payments.refund --order 1183 --amount 84.00', waited: 1_320_000, risk: 'high' },
  { id: 'copy', kind: 'question', agent: { name: 'Writer', icon: 'edit', color: 4 }, title: 'Show the Team plan monthly or yearly first?', subject: 'Yearly is 20% cheaper, but the number reads higher', waited: 180_000 },
];

export default function HandoffListDefault() {
  const [items, setItems] = useState(start);
  const settle = (id: string, outcome: string) => {
    setItems(all => all.map(item => (item.id === id ? { ...item, outcome } : item)));
    window.setTimeout(() => setItems(all => all.filter(item => item.id !== id)), 1600);
  };
  return (
    <HandoffList
      label="Waiting on you"
      items={items}
      onApprove={id => settle(id, 'Approved')}
      onDeny={id => settle(id, 'Denied. Nothing ran.')}
      onOpen={id => settle(id, 'Answered')}
    />
  );
}
```

### Nothing waiting

`src/ui/catalog/docs/handoff-list/empty.tsx`

```tsx
import { HandoffList } from '../../../components';

export default function HandoffListEmpty() {
  return <HandoffList label="Waiting on you" items={[]} empty="Nothing is waiting on you. Runs that need a decision show here." />;
}
```
