import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Empty from './empty';
import emptyCode from './empty.tsx?raw';

export default defineDoc({
  id: "handoff-list",
  title: "Handoff list",
  category: 'Agents',
  description: "List what agents are waiting on a person for, longest wait first, and decide each in place.",
  source: ["components/handoff-list.tsx", "components/agent-format.ts", "components/agent-identity.tsx", "components/agent-status.tsx", "components/badge.tsx", "components/button.tsx", "components/Icon.tsx", "components/internal/agent-parts.tsx", "components/internal/class-name.ts", "components/internal/overlay.tsx", "components/internal/platform.ts", "components/internal/size.ts", "components/internal/sr-only.tsx", "components/internal/states.ts", "tokens.stylex.ts"],
  exports: ["HandoffList", "formatWait"],
  usage: `import { HandoffList } from '@/ui/components';

<HandoffList label="Waiting on you" items={handoffs} onApprove={approve} onDeny={deny} onOpen={open} />`,
  examples: [
    { id: "default", title: "Default", description: "Approvals decide in place; questions and reviews open where they can be answered. A wait past ten minutes turns amber.", Component: Default, code: defaultCode, align: "stretch" },
    { id: "empty", title: "Nothing waiting", Component: Empty, code: emptyCode, align: "stretch" },
  ],
  api: [
    {
      name: "HandoffList",
      description: "What agents are waiting on a person for, longest first.",
      extends: "<ul> attributes",
      props: [
        { name: "label", type: "string", required: true, description: "Names the list: \"Waiting on you\"." },
        { name: "items", type: "Handoff[]", required: true, description: "`{ id, agent, kind, title, subject?, waited, risk?, outcome? }`. `kind` is 'approval', 'question', 'review' or 'blocked'; `waited` is in ms." },
        { name: "onApprove", type: "(id: string) => void", description: "Adds Approve to approvals." },
        { name: "onDeny", type: "(id: string) => void", description: "Adds Deny to approvals." },
        { name: "onOpen", type: "(id: string) => void", description: "Adds Answer, Review or Open to the other kinds." },
        { name: "lateAfter", type: "number", default: "600000", description: "A wait longer than this, in ms, turns amber." },
        { name: "empty", type: "ReactNode", default: "\"Nothing is waiting on you.\"", description: "Shown when nothing is waiting." },
      ],
    },
    {
      name: "formatWait",
      description: "A wait as \"<1m\", \"14m\" or \"1h 05m\".",
      props: [
        { name: "ms", type: "number", required: true, description: "The wait in ms." },
      ],
    },
  ],
  accessibility: [
    "The rows are a named list. Each button names its item (\"Approve: Deploy the checkout fix to staging\"), so a screen reader hears what it decides.",
    "Risk and lateness are written as words, never color alone.",
    "A decided row shows its outcome in a status region before the item is removed.",
  ],
});
