# Reasoning

Show what a model thought before it answered: open while it thinks, one line once it is done.

Category: Chat · Exports: `Reasoning`, `ThinkingText`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { Reasoning } from '@/ui/components';

<Reasoning streaming={thinking} duration={9000}>{thoughts}</Reasoning>
```

## Reasoning

A model's thinking: open while it thinks, one line once it is done.

Extends: <div> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` |  | The model's thinking. |
| `streaming` | `boolean` | `false` | The model is still thinking. |
| `duration` | `number` |  | How long it thought, in ms: "Thought for 12s". |
| `open` | `boolean` |  | Open (controlled). Default: open while streaming, folded once done. |
| `onOpenChange` | `(open: boolean) => void` |  | Called when the header is pressed. |

## ThinkingText

A word that breathes letter by letter while a model works.

Extends: <span> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `string` | `'Thinking'` | The word. |

## Accessibility

- The header is a disclosure button with `aria-expanded`.
- `ThinkingText` is a status named by its word; the animated letters are hidden from assistive tech.
- Under reduced motion, the letters stay still.

## Examples

### Default

`src/ui/catalog/docs/reasoning/default.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useEffect, useState } from 'react';
import { Button, Reasoning } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({ column: { display: 'grid', gap: t['--os-space-4'], width: '100%', maxWidth: 480, justifyItems: 'start' } });

export default function ReasoningDefault() {
  const [thinking, setThinking] = useState(true);
  useEffect(() => { if (!thinking) return; const id = window.setTimeout(() => setThinking(false), 2400); return () => window.clearTimeout(id); }, [thinking]);
  return (
    <div {...stylex.props(s.column)}>
      <Reasoning streaming={thinking} duration={2400}>
        The error reads cart.total before the cart exists. Reproduce it first, then read how the summary is built.
      </Reasoning>
      <Button size="sm" appearance="secondary" onClick={() => setThinking(true)}>Think again</Button>
    </div>
  );
}
```

### Thinking text

`ThinkingText` alone, for a reply that has not started yet.

`src/ui/catalog/docs/reasoning/thinking-text.tsx`

```tsx
import { ThinkingText } from '../../../components';

export default function ReasoningThinkingText() {
  return <ThinkingText>Searching the docs</ThinkingText>;
}
```
