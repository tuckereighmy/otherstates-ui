import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Dots from './dots';
import dotsCode from './dots.tsx?raw';
import CustomLabel from './custom-label';
import customLabelCode from './custom-label.tsx?raw';
import Text from './text';
import textCode from './text.tsx?raw';
import Sizes from './sizes';
import sizesCode from './sizes.tsx?raw';

export default defineDoc({
  id: "agent-status",
  title: "Agent status",
  category: 'Agents',
  description: "Show what an agent, run or task is doing with one shared set of states.",
  source: ["components/agent-status.tsx", "components/Icon.tsx", "components/badge.tsx", "components/internal/class-name.ts", "components/internal/states.ts", "tokens.stylex.ts"],
  exports: ["StatusBadge", "StatusDot", "AgentState", "agentStateLabels"],
  usage: `import { StatusBadge } from '@/ui/components';

<StatusBadge state="running" />`,
  examples: [
    { id: "default", title: "Default", Component: Default, code: defaultCode },
    { id: "dots", title: "Dots", description: "A `StatusDot` beside text that already says the state. Give it a `label` only when nothing else does.", Component: Dots, code: dotsCode },
    { id: "custom-label", title: "Custom label", description: "Children replace the state word; the color still follows `state`.", Component: CustomLabel, code: customLabelCode },
    { id: "text", title: "Quiet text", description: "`appearance=\"text\"` drops the pill: the dot and the word alone, for the head of an agent card where a pill would compete with the content.", Component: Text, code: textCode },
    { id: "sizes", title: "Sizes", description: "Badges at 20, 24 and 28 px; dots at 6 and 8 px.", Component: Sizes, code: sizesCode },
  ],
  api: [
    {
      name: "StatusBadge",
      description: "The state as a badge: a dot and a word.",
      extends: "<span> attributes",
      props: [
        { name: "state", type: "AgentState", required: true, description: "One of idle, queued, running, needs-input, paused, done, failed, skipped or canceled." },
        { name: "size", type: "'sm' | 'md' | 'lg'", default: "'sm'", description: "Badge height: 20, 24 or 28 px. Ignored by `text`." },
        { name: "appearance", type: "'badge' | 'text'", default: "'badge'", description: "A pill for tables and lists, or the dot and the word alone for the head of an agent card." },
        { name: "children", type: "ReactNode", description: "Replaces the state's word. The color still follows `state`." },
      ],
    },
    {
      name: "StatusDot",
      description: "A dot in the state's color. Running pulses.",
      extends: "<span> attributes",
      props: [
        { name: "state", type: "AgentState", required: true, description: "The state to show." },
        { name: "size", type: "'sm' | 'md'", default: "'md'", description: "Diameter: 6 or 8 px." },
        { name: "label", type: "string", description: "Names the dot for assistive tech. Leave it out when the state is written beside it." },
      ],
    },
  ],
  accessibility: [
    "A `StatusBadge` reads as its word (\"Needs you\"); the dot inside it is hidden from assistive tech.",
    "A `StatusDot` is decorative unless it has a `label`, which makes it an image with that name.",
    "Color is never the only signal: each state has a word, and not-started states are rings, not fills.",
    "Under reduced motion, the running pulse stops and the dot stays still.",
  ],
});
