# Checkpoints

Let a person go back to before an agent step, after saying exactly what that undoes.

Category: Agents · Exports: `CheckpointList`, `CheckpointMarker`, `Checkpoint`, `describeUndo`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { CheckpointList } from '@/ui/components';

<CheckpointList checkpoints={checkpoints} onRestore={restore} />
```

## CheckpointList

A run's restore points, oldest first; the last is the present.

Extends: Card props (without heading, description, action, footer)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `checkpoints` (required) | `Checkpoint[]` |  | Each checkpoint: `id`, `label`, `textLabel`, `time` and `undoes` (`files`, `messages`). |
| `onRestore` (required) | `(id: string) => void \| Promise<unknown>` |  | Restores after the person confirms. Return a promise to keep the dialog open until it settles. |
| `title` | `ReactNode` | `'Checkpoints'` | The card title. |

## CheckpointMarker

A restore point between two messages in a thread.

Extends: <div> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `checkpoint` (required) | `Checkpoint` |  | The restore point. |
| `onRestore` | `(id: string) => void \| Promise<unknown>` |  | Adds Restore, after a confirmation. |

## Accessibility

- Restore always opens an alert dialog that says what it undoes; nothing is lost on one click.
- Each Restore button is named after its checkpoint ("Restore to Before ...").
- The present checkpoint is marked `aria-current` and has no Restore.
- A marker is a named group, so its Restore button stays reachable.

## Examples

### Default

`src/ui/catalog/docs/checkpoints/default.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { CheckpointList, type Checkpoint } from '../../../components';

const checkpoints: Checkpoint[] = [
  { id: 'c1', label: 'Before "Read the bug report"', time: '2:02 PM', undoes: { files: 4, messages: 6 } },
  { id: 'c2', label: 'Before "Guard the empty cart"', time: '2:09 PM', undoes: { files: 3, messages: 3 } },
  { id: 'c3', label: 'Before "Update the pricing copy"', time: '2:14 PM', undoes: { files: 1, messages: 1 } },
  { id: 'c4', label: 'Latest', time: '2:16 PM' },
];

const s = stylex.create({ box: { width: '100%', maxWidth: 440 } });

export default function CheckpointsDefault() {
  return <CheckpointList {...stylex.props(s.box)} checkpoints={checkpoints} onRestore={() => {}} />;
}
```

### In a thread

`CheckpointMarker` sits between two messages: a hairline, the label and Restore, which asks first.

`src/ui/catalog/docs/checkpoints/marker.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { CheckpointMarker } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  thread: { display: 'grid', gap: t['--os-space-4'], width: '100%', maxWidth: 520, marginInline: 'auto' },
  message: { margin: 0, color: t['--os-color-fg-base'], fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'] },
});

export default function CheckpointsMarker() {
  return (
    <div {...stylex.props(s.thread)}>
      <p {...stylex.props(s.message)}>I found the crash: the cart total is read before the cart exists.</p>
      <CheckpointMarker checkpoint={{ id: 'c2', label: 'Before "Guard the empty cart"', time: '2:09 PM', undoes: { files: 3, messages: 3 } }} onRestore={() => {}} />
      <p {...stylex.props(s.message)}>I added a guard and two tests. All 214 tests pass.</p>
    </div>
  );
}
```
