# Chat thread

Frame a conversation: one column for the messages and the composer, pinned to the newest text.

Category: Chat · Exports: `ChatThread`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { ChatMessage, ChatThread, Composer } from '@/ui/components';

<ChatThread composer={<Composer fullWidth variant="outline" onSubmit={send} />}>
  <ChatMessage role="user">Why does checkout crash?</ChatMessage>
</ChatThread>
```

## ChatThread

A conversation: messages in one column, pinned to the newest, with the composer at the foot.

Extends: <div> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` |  | ChatMessage elements, oldest first. |
| `composer` | `ReactNode` |  | The Composer, sticky at the foot. It spans the column (a Composer gets `fullWidth` unless it sets it); use `variant="outline"` on the canvas. |
| `footnote` | `ReactNode` |  | A caption under the composer. |
| `empty` | `ReactNode` |  | Shown above the composer while there are no messages: a greeting. |
| `suggestions` | `ReactNode` |  | Shown under the composer while there are no messages: PromptSuggestions. |
| `maxWidth` | `number` | `720` | The column's widest size in px. |
| `label` | `string` | `'Conversation'` | Names the message log. |

## Accessibility

- The messages are a `role="log"` region that announces new messages politely.
- The thread follows new text only while the person is at the bottom; scrolling up stops it, and sending a message starts it again.
- The scroll-to-bottom button is named "Scroll to the newest message" and leaves the tab order while hidden.
- Under reduced motion, jumping to the bottom is instant.

## Examples

### Default

`src/ui/catalog/docs/chat-thread/default.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { ChatMessage, ChatThread, Composer, Markdown, MessageActions } from '../../../components';

const s = stylex.create({ frame: { height: 440 } });

export default function ChatThreadDefault() {
  return (
    <ChatThread
      {...stylex.props(s.frame)}
      composer={<Composer fullWidth variant="outline" onSubmit={() => {}} />}
      footnote="Agents can make mistakes. Check important changes."
    >
      <ChatMessage role="user">Summarize the churn calls from this week.</ChatMessage>
      <ChatMessage role="assistant" isLast actions={<MessageActions copyText="" onRetry={() => {}} />}>
        <Markdown>{'Fourteen calls, four themes:\n\n- **Onboarding** took longer than promised\n- **Pricing** felt unclear for small teams\n- **Exports** were missing CSV\n- **Support** replies were slow on weekends'}</Markdown>
      </ChatMessage>
    </ChatThread>
  );
}
```

### Empty

With no messages, `empty` and `suggestions` frame the composer in the middle of the thread.

`src/ui/catalog/docs/chat-thread/empty.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { ChatThread, Composer, PromptSuggestions } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  frame: { height: 360 },
  greeting: { margin: 0, textAlign: 'center', fontSize: t['--os-font-size-xl'], fontWeight: t['--os-font-weight-medium'] },
});

export default function ChatThreadEmpty() {
  return (
    <ChatThread
      {...stylex.props(s.frame)}
      composer={<Composer fullWidth variant="outline" onSubmit={() => {}} />}
      empty={<h2 {...stylex.props(s.greeting)}>What should we work on?</h2>}
      suggestions={<PromptSuggestions onSelect={() => {}} suggestions={[
        { id: 'test', label: 'Fix a failing test', icon: 'code' },
        { id: 'notes', label: 'Write release notes', icon: 'edit' },
      ]} />}
    />
  );
}
```
