import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import ThinkingText from './thinking-text';
import thinkingTextCode from './thinking-text.tsx?raw';

export default defineDoc({
  id: "reasoning",
  title: "Reasoning",
  category: 'Chat',
  description: "Show what a model thought before it answered: open while it thinks, one line once it is done.",
  source: ["components/reasoning.tsx", "components/agent-format.ts", "components/Icon.tsx", "components/internal/class-name.ts", "components/internal/states.ts", "tokens.stylex.ts"],
  exports: ["Reasoning", "ThinkingText"],
  usage: `import { Reasoning } from '@/ui/components';

<Reasoning streaming={thinking} duration={9000}>{thoughts}</Reasoning>`,
  examples: [
    { id: "default", title: "Default", Component: Default, code: defaultCode, minHeight: 220, stage: "canvas" },
    { id: "thinking-text", title: "Thinking text", description: "`ThinkingText` alone, for a reply that has not started yet.", Component: ThinkingText, code: thinkingTextCode, minHeight: 120, stage: "canvas" },
  ],
  api: [
    {
      name: "Reasoning",
      description: "A model's thinking: open while it thinks, one line once it is done.",
      extends: "<div> attributes",
      props: [
        { name: "children", type: "ReactNode", description: "The model's thinking." },
        { name: "streaming", type: "boolean", default: "false", description: "The model is still thinking." },
        { name: "duration", type: "number", description: "How long it thought, in ms: \"Thought for 12s\"." },
        { name: "open", type: "boolean", description: "Open (controlled). Default: open while streaming, folded once done." },
        { name: "onOpenChange", type: "(open: boolean) => void", description: "Called when the header is pressed." },
      ],
    },
    {
      name: "ThinkingText",
      description: "A word that breathes letter by letter while a model works.",
      extends: "<span> attributes",
      props: [
        { name: "children", type: "string", default: "'Thinking'", description: "The word." },
      ],
    },
  ],
  accessibility: [
    "The header is a disclosure button with `aria-expanded`.",
    "`ThinkingText` is a status named by its word; the animated letters are hidden from assistive tech.",
    "Under reduced motion, the letters stay still.",
  ],
});
