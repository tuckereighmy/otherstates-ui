# Change review

Review an agent's proposed changes one at a time, accepting or rejecting each.

Category: Agents · Exports: `ChangeReview`, `Change`, `ChangeStatus`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { ChangeReview } from '@/ui/components';

<ChangeReview changes={changes} onAccept={accept} onReject={reject} onAcceptAll={acceptAll} />
```

## ChangeReview

An agent's proposed changes, each with its own Accept and Reject.

Extends: Card props (without heading, description, action, footer)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `changes` (required) | `Change[]` |  | Each change: `id`, `path` or `title`, `lines` (DiffLine[]) and `status` (pending, accepted or rejected). |
| `onAccept` (required) | `(id: string) => void` |  | Accepts one change. |
| `onReject` (required) | `(id: string) => void` |  | Rejects one change. |
| `onAcceptAll` | `() => void` |  | Adds Accept all while anything is pending. |
| `onRejectAll` | `() => void` |  | Adds Reject all while anything is pending. |
| `onUndo` | `(id: string) => void` |  | Adds Undo to decided changes. |
| `title` | `ReactNode` | `'Review changes'` | The card title. |

## Accessibility

- Y accepts and N rejects the change that holds focus; the buttons carry `aria-keyshortcuts`.
- The reviewed count is a polite live region, and each decision is a status.
- Added and removed lines are named for screen readers, as in DiffView.
- A decided change folds to one line, so the list shrinks to what still needs a decision.

## Examples

### Default

`src/ui/catalog/docs/change-review/default.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { ChangeReview, type Change, type ChangeStatus } from '../../../components';

const initial: Change[] = [
  { id: 'plans', path: 'src/billing/plans.ts', status: 'pending', lines: [
    { type: 'remove', number: 12, text: "team: { seat: 12, currency: 'usd' }," },
    { type: 'add', number: 12, text: "team: { seat: 14, currency: 'usd' }," },
  ] },
  { id: 'copy', path: 'content/pricing.md', status: 'pending', lines: [
    { type: 'remove', number: 4, text: 'Team: $12 per seat, billed monthly.' },
    { type: 'add', number: 4, text: 'Team: $14 per seat, billed monthly.' },
  ] },
  { id: 'test', path: 'tests/billing/plans.test.ts', status: 'accepted', lines: [{ type: 'add', number: 30, text: "expect(plans.team.seat).toBe(14);" }] },
];

const s = stylex.create({ box: { width: '100%', maxWidth: 520 } });

export default function ChangeReviewDefault() {
  const [changes, setChanges] = useState(initial);
  const set = (id: string, status: ChangeStatus) => setChanges(all => all.map(change => (change.id === id ? { ...change, status } : change)));
  return (
    <ChangeReview
      {...stylex.props(s.box)}
      changes={changes}
      onAccept={id => set(id, 'accepted')}
      onReject={id => set(id, 'rejected')}
      onUndo={id => set(id, 'pending')}
      onAcceptAll={() => setChanges(all => all.map(change => ({ ...change, status: change.status === 'pending' ? 'accepted' : change.status })))}
      onRejectAll={() => setChanges(all => all.map(change => ({ ...change, status: change.status === 'pending' ? 'rejected' : change.status })))}
    />
  );
}
```

### Text edits

A change can be a part of a document instead of a file: give it a `title`.

`src/ui/catalog/docs/change-review/text.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { ChangeReview, type Change, type ChangeStatus } from '../../../components';

const s = stylex.create({ box: { width: '100%', maxWidth: 520 } });

export default function ChangeReviewText() {
  const [changes, setChanges] = useState<Change[]>([
    { id: 'intro', title: 'Opening paragraph', status: 'pending', lines: [
      { type: 'remove', text: 'We are very excited to announce that the new dashboard is now live for all users.' },
      { type: 'add', text: 'The new dashboard is live for everyone.' },
    ] },
  ]);
  const set = (id: string, status: ChangeStatus) => setChanges(all => all.map(change => (change.id === id ? { ...change, status } : change)));
  return <ChangeReview {...stylex.props(s.box)} title="Make it shorter" changes={changes} onAccept={id => set(id, 'accepted')} onReject={id => set(id, 'rejected')} onUndo={id => set(id, 'pending')} />;
}
```
