import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Branches from './branches';
import branchesCode from './branches.tsx?raw';
import Error from './error';
import errorCode from './error.tsx?raw';
import Speakers from './speakers';
import speakersCode from './speakers.tsx?raw';

export default defineDoc({
  id: "chat-message",
  title: "Chat message",
  category: 'Chat',
  description: "Show one message: a person's bubble, or an assistant's reply as prose, with its actions.",
  source: ["components/chat-message.tsx", "components/Icon.tsx", "components/agent-identity.tsx", "components/agent-status.tsx", "components/badge.tsx", "components/button.tsx", "components/internal/class-name.ts", "components/internal/overlay.tsx", "components/internal/size.ts", "components/internal/sr-only.tsx", "components/internal/states.ts", "components/tooltip.tsx", "tokens.stylex.ts"],
  exports: ["ChatMessage", "MessageActions", "ChatRole"],
  usage: `import { ChatMessage, MessageActions } from '@/ui/components';

<ChatMessage role="assistant" isLast actions={<MessageActions copyText={text} onRetry={retry} />}>
  <Markdown>{text}</Markdown>
</ChatMessage>`,
  examples: [
    { id: "default", title: "Default", Component: Default, code: defaultCode, align: "stretch", minHeight: 320, stage: "canvas" },
    { id: "branches", title: "Versions", description: "`branch` adds `\u2039 2 of 3 \u203a` for replies that were retried.", Component: Branches, code: branchesCode, align: "stretch", minHeight: 200, stage: "canvas" },
    { id: "error", title: "Failed reply", description: "`error` and `onRetry` keep a failed reply in the thread with a way back.", Component: Error, code: errorCode, align: "stretch", minHeight: 180, stage: "canvas" },
    { id: "speakers", title: "Several agents", description: "In a thread with more than one agent, `speaker` names who replied.", Component: Speakers, code: speakersCode, align: "stretch", minHeight: 220, stage: "canvas" },
  ],
  api: [
    {
      name: "ChatMessage",
      description: "One message: a person's bubble, or an assistant's reply as prose.",
      extends: "<div> attributes",
      props: [
        { name: "role", type: "'user' | 'assistant'", required: true, description: "Who is speaking." },
        { name: "children", type: "ReactNode", required: true, description: "A person's text, or a reply's parts: Reasoning, RunBlock, Markdown, cards." },
        { name: "actions", type: "ReactNode", description: "MessageActions under the message." },
        { name: "isLast", type: "boolean", default: "false", description: "The newest reply keeps its actions visible." },
        { name: "speaker", type: "{ name: string; icon?: IconName; color?: AgentColor }", description: "For threads with several agents: who replied." },
        { name: "error", type: "ReactNode", description: "Why the reply failed, in an alert." },
        { name: "onRetry", type: "() => void", description: "Adds Retry to the error." },
      ],
    },
    {
      name: "MessageActions",
      description: "The actions under a message.",
      props: [
        { name: "copyText", type: "string", description: "Adds Copy: the text it copies." },
        { name: "onRetry", type: "() => void", description: "Adds Retry." },
        { name: "onEdit", type: "() => void", description: "Adds Edit, for a person's message." },
        { name: "feedback", type: "'up' | 'down' | null", default: "null", description: "The current feedback." },
        { name: "onFeedback", type: "(feedback: 'up' | 'down' | null) => void", description: "Adds thumbs up and down." },
        { name: "branch", type: "{ index: number; total: number; onPrevious: () => void; onNext: () => void }", description: "Alternate versions: \u2039 2 of 3 \u203a." },
        { name: "children", type: "ReactNode", description: "More actions after the built-in ones." },
      ],
    },
  ],
  accessibility: [
    "Each message starts with visually hidden \"You said:\" or \"<speaker> said:\", so a screen reader knows who is speaking.",
    "Every action is an icon button with a name and a tooltip; feedback buttons report `aria-pressed`.",
    "Hidden actions still take focus: focusing inside a message shows them. On touch screens they always show.",
    "A failed reply is an alert, with Retry beside it.",
  ],
});
