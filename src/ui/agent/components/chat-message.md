# Chat message

Show one message: a person's bubble, or an assistant's reply as prose, with its actions.

Category: Chat · Exports: `ChatMessage`, `MessageActions`, `ChatRole`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { ChatMessage, MessageActions } from '@/ui/components';

<ChatMessage role="assistant" isLast actions={<MessageActions copyText={text} onRetry={retry} />}>
  <Markdown>{text}</Markdown>
</ChatMessage>
```

## ChatMessage

One message: a person's bubble, or an assistant's reply as prose.

Extends: <div> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `role` (required) | `'user' \| 'assistant'` |  | Who is speaking. |
| `children` (required) | `ReactNode` |  | A person's text, or a reply's parts: Reasoning, RunBlock, Markdown, cards. |
| `actions` | `ReactNode` |  | MessageActions under the message. |
| `isLast` | `boolean` | `false` | The newest reply keeps its actions visible. |
| `speaker` | `{ name: string; icon?: IconName; color?: AgentColor }` |  | For threads with several agents: who replied. |
| `error` | `ReactNode` |  | Why the reply failed, in an alert. |
| `onRetry` | `() => void` |  | Adds Retry to the error. |

## MessageActions

The actions under a message.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `copyText` | `string` |  | Adds Copy: the text it copies. |
| `onRetry` | `() => void` |  | Adds Retry. |
| `onEdit` | `() => void` |  | Adds Edit, for a person's message. |
| `feedback` | `'up' \| 'down' \| null` | `null` | The current feedback. |
| `onFeedback` | `(feedback: 'up' \| 'down' \| null) => void` |  | Adds thumbs up and down. |
| `branch` | `{ index: number; total: number; onPrevious: () => void; onNext: () => void }` |  | Alternate versions: ‹ 2 of 3 ›. |
| `children` | `ReactNode` |  | More actions after the built-in ones. |

## Accessibility

- Each message starts with visually hidden "You said:" or "<speaker> said:", so a screen reader knows who is speaking.
- Every action is an icon button with a name and a tooltip; feedback buttons report `aria-pressed`.
- Hidden actions still take focus: focusing inside a message shows them. On touch screens they always show.
- A failed reply is an alert, with Retry beside it.

## Examples

### Default

`src/ui/catalog/docs/chat-message/default.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { ChatMessage, Markdown, MessageActions } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({ column: { display: 'grid', gap: t['--os-space-8'], width: '100%', maxWidth: 560, marginInline: 'auto' } });

export default function ChatMessageDefault() {
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  return (
    <div {...stylex.props(s.column)}>
      <ChatMessage role="user" actions={<MessageActions copyText="Can we ship the fix today?" onEdit={() => {}} />}>Can we ship the fix today?</ChatMessage>
      <ChatMessage role="assistant" isLast actions={<MessageActions copyText="" feedback={feedback} onFeedback={setFeedback} onRetry={() => {}} />}>
        <Markdown>{'Yes. The tests pass and the change is small. I can deploy it to **staging** first, then production after you check it.'}</Markdown>
      </ChatMessage>
    </div>
  );
}
```

### Versions

`branch` adds `‹ 2 of 3 ›` for replies that were retried.

`src/ui/catalog/docs/chat-message/branches.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { ChatMessage, Markdown, MessageActions } from '../../../components';

const versions = ['Short and direct: the fix is ready.', 'The fix is ready, with two new tests.', 'Ready to ship: one guard, two tests, all green.'];
const s = stylex.create({ box: { width: '100%', maxWidth: 560, marginInline: 'auto' } });

export default function ChatMessageBranches() {
  const [index, setIndex] = useState(3);
  return (
    <ChatMessage {...stylex.props(s.box)} role="assistant" isLast actions={
      <MessageActions copyText={versions[index - 1]} onRetry={() => {}} branch={{ index, total: 3, onPrevious: () => setIndex(index - 1), onNext: () => setIndex(index + 1) }} />
    }>
      <Markdown>{versions[index - 1]}</Markdown>
    </ChatMessage>
  );
}
```

### Failed reply

`error` and `onRetry` keep a failed reply in the thread with a way back.

`src/ui/catalog/docs/chat-message/error.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { ChatMessage, Markdown } from '../../../components';

const s = stylex.create({ box: { width: '100%', maxWidth: 560, marginInline: 'auto' } });

export default function ChatMessageError() {
  return (
    <ChatMessage {...stylex.props(s.box)} role="assistant" error="The connection dropped before the reply finished." onRetry={() => {}}>
      <Markdown>{'Here is what I found so far: the crash starts in'}</Markdown>
    </ChatMessage>
  );
}
```

### Several agents

In a thread with more than one agent, `speaker` names who replied.

`src/ui/catalog/docs/chat-message/speakers.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { ChatMessage, Markdown } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({ column: { display: 'grid', gap: t['--os-space-8'], width: '100%', maxWidth: 560, marginInline: 'auto' } });

export default function ChatMessageSpeakers() {
  return (
    <div {...stylex.props(s.column)}>
      <ChatMessage role="assistant" speaker={{ name: 'Researcher', icon: 'search', color: 2 }}><Markdown>{'Three of five competitors charge per seat.'}</Markdown></ChatMessage>
      <ChatMessage role="assistant" speaker={{ name: 'Writer', icon: 'edit', color: 3 }} isLast><Markdown>{'I drafted the pricing page around per-seat plans.'}</Markdown></ChatMessage>
    </div>
  );
}
```
