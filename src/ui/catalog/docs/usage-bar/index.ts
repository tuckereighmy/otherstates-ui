import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Cost from './cost';
import costCode from './cost.tsx?raw';
import OverBudget from './over-budget';
import overBudgetCode from './over-budget.tsx?raw';
import Inspect from './inspect';
import inspectCode from './inspect.tsx?raw';
import Pending from './pending';
import pendingCode from './pending.tsx?raw';
import Sizes from './sizes';
import sizesCode from './sizes.tsx?raw';

export default defineDoc({
  id: "usage-bar",
  title: "Usage bar",
  category: 'Agents',
  description: "Split one budget into its parts: a context window, a run's cost or a rate limit.",
  source: ["components/usage-bar.tsx", "components/agent-format.ts", "components/internal/agent-parts.tsx", "components/internal/class-name.ts", "components/internal/platform.ts", "components/internal/sr-only.tsx", "components/internal/states.ts", "components/rolling-number.tsx", "tokens.stylex.ts"],
  exports: ["UsageBar", "UsageSegment", "formatTokens", "formatCost", "formatDuration"],
  usage: `import { UsageBar } from '@/ui/components';

<UsageBar label="Context window" max={200000} segments={[
  { id: 'system', label: 'System prompt', value: 4200 },
  { id: 'chat', label: 'Conversation', value: 98400 },
]} />`,
  examples: [
    { id: "default", title: "Default", Component: Default, code: defaultCode },
    { id: "cost", title: "Cost", description: "`format` turns values into text; the agent formatters keep money, tokens and time consistent.", Component: Cost, code: costCode },
    { id: "inspect", title: "Inspect and chips", description: "Point at a part, in the bar or its chip, and it holds while the rest fall back; the header reads that part. `legend=\"chips\"` and `size=\"xl\"` are the card form.", Component: Inspect, code: inspectCode, minHeight: 240 },
    { id: "pending", title: "About to be freed", description: "`pending` hatches the share of a part that an action is about to free, as a preview. When the part's `value` drops, the hatched share narrows away and the parts after it slide over; a part that reaches zero narrows to nothing rather than vanishing.", Component: Pending, code: pendingCode, minHeight: 220 },
    { id: "over-budget", title: "Over the limit", description: "When the parts pass `max`, the whole bar turns to the error color.", Component: OverBudget, code: overBudgetCode },
    { id: "sizes", title: "Sizes", description: "Track heights of 6, 8 and 12 px, here without a key.", Component: Sizes, code: sizesCode },
  ],
  api: [
    {
      name: "UsageBar",
      description: "A bar split into the parts of one budget, with a legend.",
      extends: "<div> attributes",
      props: [
        { name: "label", type: "string", required: true, description: "Names the budget. Shown above the bar unless `hideLabel`." },
        { name: "hideLabel", type: "boolean", default: "false", description: "Hides the label visually; it still names the group." },
        { name: "segments", type: "UsageSegment[]", required: true, description: "Each part: `id`, `label`, `value`, and optional `color` (1 to 5 or muted), `detail` and `pending` (how much of `value` is about to be freed, drawn hatched)." },
        { name: "max", type: "number", description: "The whole budget. Default: the sum of the segments." },
        { name: "format", type: "(value: number) => string", default: "formatTokens", description: "Turns numbers into text for the header and legend." },
        { name: "valueLabel", type: "ReactNode", description: "Replaces the header value (\"175.6k of 200k\")." },
        { name: "legend", type: "'list' | 'chips' | 'none'", default: "'list'", description: "A row per part, wash chips for cards, or no key." },
        { name: "hideHeader", type: "boolean", default: "false", description: "Hides the label and value row, for a card that shows its own figure." },
        { name: "active", type: "string | null", description: "The part held by pointing (controlled)." },
        { name: "onActiveChange", type: "(id: string | null) => void", description: "Called when pointing holds a part or lets go." },
        { name: "restLabel", type: "ReactNode", description: "Adds a legend row for what is left (\"Free\")." },
        { name: "size", type: "'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: "Track height: 6, 8, 12 or 40 px. `xl` is the hero bar of a card." },
      ],
    },
  ],
  accessibility: [
    "The bar is a group named by `label`; the drawn track is hidden and the header and legend carry the numbers as text.",
    "Parts take the chart palette in order, which is checked for color-vision differences; every part is also named in the legend.",
    "Over the limit, say so in words in `valueLabel` as well as with the error color.",
    "`formatTokens`, `formatCost` and `formatDuration` give every agent number one written form.",
  ],
});
