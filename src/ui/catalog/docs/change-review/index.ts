import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Text from './text';
import textCode from './text.tsx?raw';

export default defineDoc({
  id: "change-review",
  title: "Change review",
  category: 'Agents',
  description: "Review an agent's proposed changes one at a time, accepting or rejecting each.",
  source: ["components/change-review.tsx", "components/button.tsx", "components/card.tsx", "components/diff.tsx", "components/Icon.tsx", "components/internal/agent-parts.tsx", "components/internal/class-name.ts", "components/internal/overlay.tsx", "components/internal/platform.ts", "components/internal/size.ts", "components/internal/sr-only.tsx", "components/internal/states.ts", "components/internal/surface.ts", "tokens.stylex.ts"],
  exports: ["ChangeReview", "Change", "ChangeStatus"],
  usage: `import { ChangeReview } from '@/ui/components';

<ChangeReview changes={changes} onAccept={accept} onReject={reject} onAcceptAll={acceptAll} />`,
  examples: [
    { id: "default", title: "Default", Component: Default, code: defaultCode, minHeight: 520 },
    { id: "text", title: "Text edits", description: "A change can be a part of a document instead of a file: give it a `title`.", Component: Text, code: textCode, minHeight: 300 },
  ],
  api: [
    {
      name: "ChangeReview",
      description: "An agent's proposed changes, each with its own Accept and Reject.",
      extends: "Card props (without heading, description, action, footer)",
      props: [
        { name: "changes", type: "Change[]", required: true, description: "Each change: `id`, `path` or `title`, `lines` (DiffLine[]) and `status` (pending, accepted or rejected)." },
        { name: "onAccept", type: "(id: string) => void", required: true, description: "Accepts one change." },
        { name: "onReject", type: "(id: string) => void", required: true, description: "Rejects one change." },
        { name: "onAcceptAll", type: "() => void", description: "Adds Accept all while anything is pending." },
        { name: "onRejectAll", type: "() => void", description: "Adds Reject all while anything is pending." },
        { name: "onUndo", type: "(id: string) => void", description: "Adds Undo to decided changes." },
        { name: "title", type: "ReactNode", default: "'Review changes'", description: "The card title." },
      ],
    },
  ],
  accessibility: [
    "Y accepts and N rejects the change that holds focus; the buttons carry `aria-keyshortcuts`.",
    "The reviewed count is a polite live region, and each decision is a status.",
    "Added and removed lines are named for screen readers, as in DiffView.",
    "A decided change folds to one line, so the list shrinks to what still needs a decision.",
  ],
});
