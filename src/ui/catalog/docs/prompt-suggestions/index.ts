import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';

export default defineDoc({
  id: "prompt-suggestions",
  title: "Prompt suggestions",
  category: 'Chat',
  description: "Offer short prompts that start an empty conversation.",
  source: ["components/prompt-suggestions.tsx", "components/Icon.tsx", "components/button.tsx", "components/internal/class-name.ts", "components/internal/overlay.tsx", "components/internal/size.ts", "components/internal/states.ts", "tokens.stylex.ts"],
  exports: ["PromptSuggestions", "PromptSuggestion"],
  usage: `import { PromptSuggestions } from '@/ui/components';

<PromptSuggestions suggestions={suggestions} onSelect={send} />`,
  examples: [
    { id: "default", title: "Default", Component: Default, code: defaultCode, minHeight: 160 },
  ],
  api: [
    {
      name: "PromptSuggestions",
      description: "Short prompts that start a conversation.",
      extends: "<ul> attributes",
      props: [
        { name: "suggestions", type: "PromptSuggestion[]", required: true, description: "Each: `id`, `label`, an optional `prompt` (default: the label) and `icon`." },
        { name: "onSelect", type: "(prompt: string) => void", required: true, description: "Receives the suggestion's prompt." },
        { name: "align", type: "'center' | 'start'", default: "'center'", description: "Where the row sits." },
      ],
    },
  ],
  accessibility: [
    "A list of buttons named by their labels.",
    "Keep it to four suggestions, so the row reads at a glance and fits a phone in two lines.",
  ],
});
