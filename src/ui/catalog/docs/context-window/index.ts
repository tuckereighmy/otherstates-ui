import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Controlled from './controlled';
import controlledCode from './controlled.tsx?raw';
import OverLimit from './over-limit';
import overLimitCode from './over-limit.tsx?raw';
import WithoutCompact from './without-compact';
import withoutCompactCode from './without-compact.tsx?raw';

export default defineDoc({
  id: "context-window",
  title: "Context window",
  category: 'Agents',
  description: "Show how much room is left in a model's context window, what fills it, and let a person choose what to free.",
  source: ["components/context-window.tsx", "components/agent-format.ts", "components/button.tsx", "components/card.tsx", "components/Icon.tsx", "components/internal/agent-parts.tsx", "components/internal/class-name.ts", "components/internal/overlay.tsx", "components/internal/platform.ts", "components/internal/size.ts", "components/internal/sr-only.tsx", "components/internal/states.ts", "components/internal/surface.ts", "components/rolling-number.tsx", "components/usage-bar.tsx", "tokens.stylex.ts"],
  exports: ["ContextWindow", "ContextReclaim"],
  usage: `import { ContextWindow } from '@/ui/components';

<ContextWindow
  max={200000}
  segments={segments}
  reclaim={[{ id: 'conversation', to: 22000, action: 'Summarize' }, { id: 'files', action: 'Close' }]}
/>`,
  examples: [
    { id: "default", title: "Default", description: "Choose the sources to free: each choice hatches its share of the bar and the figure counts to the room you would have. Free commits them together; Undo puts them back.", Component: Default, code: defaultCode, minHeight: 520 },
    { id: "controlled", title: "Controlled", description: "`freed` and `onFreedChange` keep the freed sources in your state, so you can summarize or close them for real when the person presses Free.", Component: Controlled, code: controlledCode, minHeight: 420 },
    { id: "over-limit", title: "Over the limit", description: "Past `max` the head says so in words, the bar turns to the error color and the figure reads how far over it is.", Component: OverLimit, code: overLimitCode, minHeight: 460 },
    { id: "without-compact", title: "Read only", description: "Without `reclaim`, the card shows the window and its sources and nothing more.", Component: WithoutCompact, code: withoutCompactCode, minHeight: 340 },
  ],
  api: [
    {
      name: "ContextWindow",
      description: "A context window: how much room is left, what fills it, and the sources a person can free.",
      extends: "Card props (without heading, description, action, footer)",
      props: [
        { name: "max", type: "number", required: true, description: "The window in tokens." },
        { name: "segments", type: "UsageSegment[]", required: true, description: "What fills it, in the order the bar draws them. The order never changes." },
        { name: "reclaim", type: "ContextReclaim[]", description: "The sources a person may free: `id`, `to` (what it shrinks to, default 0) and `action` (\"Summarize\", \"Close\"). Leave out for a card that only reads." },
        { name: "freed", type: "string[]", description: "The sources already freed (controlled)." },
        { name: "defaultFreed", type: "string[]", description: "The sources freed at first (uncontrolled)." },
        { name: "onFreedChange", type: "(freed: string[]) => void", description: "Called with every freed source when a person presses Free or Undo." },
        { name: "title", type: "ReactNode", default: "'Context'", description: "The card title." },
        { name: "model", type: "ReactNode", description: "The model, under the title." },
        { name: "format", type: "(value: number) => string", default: "formatTokens", description: "Turns token counts into text." },
        { name: "compact", type: "{ id: string; to: number }", description: "Deprecated: use `reclaim={[{ id, to }]}`." },
        { name: "compacted", type: "boolean", description: "Deprecated: use `freed`." },
        { name: "onCompactedChange", type: "(compacted: boolean) => void", description: "Deprecated: use `onFreedChange`." },
      ],
    },
  ],
  accessibility: [
    "How full the window is, is written in the head (\"Nearly full\"); color only repeats it.",
    "The figure is a polite live region that reads its final value as text, so a choice announces the room it would leave.",
    "Each source that can be freed is a toggle button (`aria-pressed`) named with its size and what freeing does; focusing one inspects it, as pointing does.",
    "Every number is in the rows as text; the drawn bar is hidden from assistive tech.",
    "Mod+Enter frees the chosen sources and Escape clears the choice while focus is in the card; the buttons carry `aria-keyshortcuts`. The outcome is a status region with Undo.",
    "Under reduced motion, the figure and the bar change without easing.",
  ],
});
