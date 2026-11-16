import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Decided from './decided';
import decidedCode from './decided.tsx?raw';

export default defineDoc({
  id: "approval-gates",
  title: "Approval gates",
  category: 'Agents',
  description: "Show a run paused at gates, each with what it would change and a decision.",
  source: ["components/approval-gates.tsx", "components/accordion.tsx", "components/agent-status.tsx", "components/badge.tsx", "components/button.tsx", "components/card.tsx", "components/Icon.tsx", "components/internal/agent-parts.tsx", "components/internal/class-name.ts", "components/internal/overlay.tsx", "components/internal/platform.ts", "components/internal/size.ts", "components/internal/states.ts", "components/internal/surface.ts", "components/progress.tsx", "tokens.stylex.ts"],
  exports: ["ApprovalGates", "Gate", "GateStatus"],
  usage: `import { ApprovalGates } from '@/ui/components';

<ApprovalGates title="Launch the pricing page" gates={gates} onDecide={(id, decision) => decide(id, decision)} />`,
  examples: [
    { id: "default", title: "Default", Component: Default, code: defaultCode, minHeight: 520 },
    { id: "decided", title: "All decided", description: "With no gate waiting, the run is back to running and every gate shows its outcome.", Component: Decided, code: decidedCode, minHeight: 320 },
  ],
  api: [
    {
      name: "ApprovalGates",
      description: "A run's approval gates, each with what it would change and a decision.",
      extends: "Card props (without heading, description, action, footer)",
      props: [
        { name: "title", type: "ReactNode", required: true, description: "The run." },
        { name: "gates", type: "Gate[]", required: true, description: "Each gate: `id`, `title`, `meta`, `blocking`, `status` (waiting, approved or rejected) and `content`." },
        { name: "onDecide", type: "(id: string, decision: 'approve' | 'reject') => void", description: "Adds Approve and Reject to waiting gates." },
        { name: "defaultExpanded", type: "string[]", description: "Gates open at first. Default: the first waiting gate." },
      ],
    },
  ],
  accessibility: [
    "Each gate is a disclosure: Enter or Space opens it, and its trigger is a heading.",
    "The gate icon has a name (\"waiting for you\", \"approved\", \"rejected\"), so state is never color alone.",
    "Progress is a progress bar with \"1 of 3\" as its value text.",
  ],
});
