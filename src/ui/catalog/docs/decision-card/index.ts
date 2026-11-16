import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import FollowUp from './follow-up';
import followUpCode from './follow-up.tsx?raw';
import WithoutPick from './without-pick';
import withoutPickCode from './without-pick.tsx?raw';

export default defineDoc({
  id: "decision-card",
  title: "Decision card",
  category: 'Agents',
  description: "Ask a person to choose between options, with the agent's pick and follow-up questions.",
  source: ["components/decision-card.tsx", "components/agent-identity.tsx", "components/agent-status.tsx", "components/approval-card.tsx", "components/badge.tsx", "components/button.tsx", "components/card.tsx", "components/Icon.tsx", "components/internal/agent-parts.tsx", "components/internal/choice.tsx", "components/internal/class-name.ts", "components/internal/control.ts", "components/internal/overlay.tsx", "components/internal/platform.ts", "components/internal/size.ts", "components/internal/spring.ts", "components/internal/sr-only.tsx", "components/internal/states.ts", "components/internal/surface.ts", "components/kbd.tsx", "components/radio-group.tsx", "components/segmented-control.tsx", "components/tool-call.tsx", "tokens.stylex.ts"],
  exports: ["DecisionCard", "DecisionOption"],
  usage: `import { DecisionCard } from '@/ui/components';

<DecisionCard
  question="Which region should the new database run in?"
  options={[
    { id: 'eu', label: 'Frankfurt', recommended: true },
    { id: 'us', label: 'Virginia' },
  ]}
  onSubmit={([region]) => console.log(region)}
/>`,
  examples: [
    { id: "default", title: "Default", Component: Default, code: defaultCode, minHeight: 460 },
    { id: "follow-up", title: "Follow-up question", description: "An option with `followUp` opens a second question under it, so a decision can be a short tree.", Component: FollowUp, code: followUpCode, minHeight: 560 },
    { id: "without-pick", title: "Without a recommendation", description: "With no `recommended` option nothing is chosen at first, and the submit button waits for a choice.", Component: WithoutPick, code: withoutPickCode, minHeight: 400 },
  ],
  api: [
    {
      name: "DecisionCard",
      description: "A question for a person, with the options, the agent's pick and follow-ups.",
      extends: "Card props (without heading, description, action, footer)",
      props: [
        { name: "question", type: "ReactNode", required: true, description: "The question." },
        { name: "context", type: "ReactNode", description: "What the agent knows: the situation, numbers, constraints." },
        { name: "agent", type: "{ name: string; icon?: IconName; color?: AgentColor }", description: "The agent waiting." },
        { name: "risk", type: "'low' | 'medium' | 'high'", description: "Shows the risk in words at the end of the head row." },
        { name: "options", type: "DecisionOption[]", required: true, description: "Each option: `id`, `label`, `description`, `recommended` (shown as \"Agent's pick\"), `isDisabled` and an optional `followUp` question." },
        { name: "value", type: "string[]", description: "The chosen ids, one per level (controlled)." },
        { name: "defaultValue", type: "string[]", description: "Default: the recommended path." },
        { name: "onChange", type: "(value: string[]) => void", description: "Called when a choice changes." },
        { name: "onSubmit", type: "(value: string[]) => void", description: "Adds the submit button." },
        { name: "onLater", type: "() => void", description: "Adds a button that sets the question aside." },
        { name: "submitLabel", type: "string", default: "'Decide'", description: "The submit button." },
        { name: "laterLabel", type: "string", default: "'Later'", description: "The later button." },
        { name: "position", type: "ReactNode", description: "Where the question sits in a queue: \"1 of 3\"." },
        { name: "children", type: "ReactNode", description: "More content under the options." },
        { name: "shortcuts", type: "boolean", default: "true", description: "Listens for Mod+Enter, Escape and the number keys while focus is inside." },
      ],
    },
  ],
  accessibility: [
    "Each level is a radio group, so the arrow keys move between options; the number keys 1 to 9 pick a top-level option.",
    "The agent's pick is written as \"Recommended\", not shown by color.",
    "While focus is inside the card, Mod+Enter submits and Escape sets the question aside; the buttons carry `aria-keyshortcuts`.",
    "The submit button stays disabled until every level has a choice.",
  ],
});
