# Context window

Show how much room is left in a model's context window, what fills it, and let a person choose what to free.

Category: Agents · Exports: `ContextWindow`, `ContextReclaim`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { ContextWindow } from '@/ui/components';

<ContextWindow
  max={200000}
  segments={segments}
  reclaim={[{ id: 'conversation', to: 22000, action: 'Summarize' }, { id: 'files', action: 'Close' }]}
/>
```

## ContextWindow

A context window: how much room is left, what fills it, and the sources a person can free.

Extends: Card props (without heading, description, action, footer)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `max` (required) | `number` |  | The window in tokens. |
| `segments` (required) | `UsageSegment[]` |  | What fills it, in the order the bar draws them. The order never changes. |
| `reclaim` | `ContextReclaim[]` |  | The sources a person may free: `id`, `to` (what it shrinks to, default 0) and `action` ("Summarize", "Close"). Leave out for a card that only reads. |
| `freed` | `string[]` |  | The sources already freed (controlled). |
| `defaultFreed` | `string[]` |  | The sources freed at first (uncontrolled). |
| `onFreedChange` | `(freed: string[]) => void` |  | Called with every freed source when a person presses Free or Undo. |
| `title` | `ReactNode` | `'Context'` | The card title. |
| `model` | `ReactNode` |  | The model, under the title. |
| `format` | `(value: number) => string` | `formatTokens` | Turns token counts into text. |
| `compact` | `{ id: string; to: number }` |  | Deprecated: use `reclaim={[{ id, to }]}`. |
| `compacted` | `boolean` |  | Deprecated: use `freed`. |
| `onCompactedChange` | `(compacted: boolean) => void` |  | Deprecated: use `onFreedChange`. |

## Accessibility

- How full the window is, is written in the head ("Nearly full"); color only repeats it.
- The figure is a polite live region that reads its final value as text, so a choice announces the room it would leave.
- Each source that can be freed is a toggle button (`aria-pressed`) named with its size and what freeing does; focusing one inspects it, as pointing does.
- Every number is in the rows as text; the drawn bar is hidden from assistive tech.
- Mod+Enter frees the chosen sources and Escape clears the choice while focus is in the card; the buttons carry `aria-keyshortcuts`. The outcome is a status region with Undo.
- Under reduced motion, the figure and the bar change without easing.

## Examples

### Default

Choose the sources to free: each choice hatches its share of the bar and the figure counts to the room you would have. Free commits them together; Undo puts them back.

`src/ui/catalog/docs/context-window/default.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { ContextWindow } from '../../../components';

const segments = [
  { id: 'conversation', label: 'Conversation', value: 102400 },
  { id: 'files', label: 'Open files', value: 51800 },
  { id: 'tools', label: 'Tool results', value: 18900 },
  { id: 'instructions', label: 'Instructions', value: 6200 },
  { id: 'memory', label: 'Memory', value: 2700 },
];

const s = stylex.create({ box: { width: '100%', maxWidth: 360 } });

export default function ContextWindowDefault() {
  return (
    <ContextWindow
      {...stylex.props(s.box)}
      model="Large model"
      max={200000}
      segments={segments}
      reclaim={[
        { id: 'conversation', to: 22000, action: 'Summarize' },
        { id: 'files', action: 'Close' },
        { id: 'tools', action: 'Clear' },
      ]}
    />
  );
}
```

### Controlled

`freed` and `onFreedChange` keep the freed sources in your state, so you can summarize or close them for real when the person presses Free.

`src/ui/catalog/docs/context-window/controlled.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { ContextWindow } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const segments = [
  { id: 'conversation', label: 'Conversation', value: 102400 },
  { id: 'files', label: 'Open files', value: 51800 },
  { id: 'instructions', label: 'Instructions', value: 6200 },
];

const s = stylex.create({
  column: { display: 'grid', gap: t['--os-space-3'], width: '100%', maxWidth: 360 },
  note: { margin: 0, color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'] },
});

export default function ContextWindowControlled() {
  const [freed, setFreed] = useState<string[]>([]);
  return (
    <div {...stylex.props(s.column)}>
      <ContextWindow
        model="Large model"
        max={200000}
        segments={segments}
        reclaim={[{ id: 'conversation', to: 22000, action: 'Summarize' }, { id: 'files', action: 'Close' }]}
        freed={freed}
        onFreedChange={setFreed}
      />
      <p {...stylex.props(s.note)}>{freed.length ? `Freed: ${freed.join(', ')}` : 'Nothing freed yet.'}</p>
    </div>
  );
}
```

### Over the limit

Past `max` the head says so in words, the bar turns to the error color and the figure reads how far over it is.

`src/ui/catalog/docs/context-window/over-limit.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { ContextWindow } from '../../../components';

const s = stylex.create({ box: { width: '100%', maxWidth: 360 } });

export default function ContextWindowOverLimit() {
  return (
    <ContextWindow
      {...stylex.props(s.box)}
      title="Debugger"
      model="Small model"
      max={128000}
      segments={[
        { id: 'conversation', label: 'Conversation', value: 88600 },
        { id: 'logs', label: 'Pasted logs', value: 34200 },
        { id: 'instructions', label: 'Instructions', value: 5400 },
        { id: 'memory', label: 'Memory', value: 1900 },
      ]}
      reclaim={[{ id: 'conversation', to: 16000 }, { id: 'logs' }]}
    />
  );
}
```

### Read only

Without `reclaim`, the card shows the window and its sources and nothing more.

`src/ui/catalog/docs/context-window/without-compact.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { ContextWindow } from '../../../components';

const s = stylex.create({ box: { width: '100%', maxWidth: 360 } });

export default function ContextWindowReadOnly() {
  return (
    <ContextWindow
      {...stylex.props(s.box)}
      title="Researcher"
      model="Standard model"
      max={128000}
      segments={[
        { id: 'sources', label: 'Sources', value: 61200 },
        { id: 'notes', label: 'Notes', value: 9800 },
        { id: 'system', label: 'Instructions', value: 3100 },
      ]}
    />
  );
}
```
