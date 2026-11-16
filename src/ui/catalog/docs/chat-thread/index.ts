import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Empty from './empty';
import emptyCode from './empty.tsx?raw';

export default defineDoc({
  id: "chat-thread",
  title: "Chat thread",
  category: 'Chat',
  description: "Frame a conversation: one column for the messages and the composer, pinned to the newest text.",
  source: ["components/chat-thread.tsx", "components/button.tsx", "components/composer.tsx", "components/Icon.tsx", "components/internal/class-name.ts", "components/internal/control.ts", "components/internal/overlay.tsx", "components/internal/platform.ts", "components/internal/size.ts", "components/internal/states.ts", "components/kbd.tsx", "tokens.stylex.ts"],
  exports: ["ChatThread"],
  usage: `import { ChatMessage, ChatThread, Composer } from '@/ui/components';

<ChatThread composer={<Composer fullWidth variant="outline" onSubmit={send} />}>
  <ChatMessage role="user">Why does checkout crash?</ChatMessage>
</ChatThread>`,
  examples: [
    { id: "default", title: "Default", Component: Default, code: defaultCode, align: "stretch", minHeight: 460, stage: "canvas" },
    { id: "empty", title: "Empty", description: "With no messages, `empty` and `suggestions` frame the composer in the middle of the thread.", Component: Empty, code: emptyCode, align: "stretch", minHeight: 380, stage: "canvas" },
  ],
  api: [
    {
      name: "ChatThread",
      description: "A conversation: messages in one column, pinned to the newest, with the composer at the foot.",
      extends: "<div> attributes",
      props: [
        { name: "children", type: "ReactNode", description: "ChatMessage elements, oldest first." },
        { name: "composer", type: "ReactNode", description: "The Composer, sticky at the foot. It spans the column (a Composer gets `fullWidth` unless it sets it); use `variant=\"outline\"` on the canvas." },
        { name: "footnote", type: "ReactNode", description: "A caption under the composer." },
        { name: "empty", type: "ReactNode", description: "Shown above the composer while there are no messages: a greeting." },
        { name: "suggestions", type: "ReactNode", description: "Shown under the composer while there are no messages: PromptSuggestions." },
        { name: "maxWidth", type: "number", default: "720", description: "The column's widest size in px." },
        { name: "label", type: "string", default: "'Conversation'", description: "Names the message log." },
      ],
    },
  ],
  accessibility: [
    "The messages are a `role=\"log\"` region that announces new messages politely.",
    "The thread follows new text only while the person is at the bottom; scrolling up stops it, and sending a message starts it again.",
    "The scroll-to-bottom button is named \"Scroll to the newest message\" and leaves the tab order while hidden.",
    "Under reduced motion, jumping to the bottom is instant.",
  ],
});
