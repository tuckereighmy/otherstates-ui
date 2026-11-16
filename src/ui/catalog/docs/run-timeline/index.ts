import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Parallel from './parallel';
import parallelCode from './parallel.tsx?raw';

export default defineDoc({
  id: "run-timeline",
  title: "Run timeline",
  category: 'Agents',
  description: "Show a run's steps on one time axis: where the time went, what failed and how long it waited on people.",
  source: ["components/run-timeline.tsx", "components/agent-format.ts", "components/agent-status.tsx", "components/badge.tsx", "components/Icon.tsx", "components/internal/agent-parts.tsx", "components/internal/class-name.ts", "components/internal/platform.ts", "components/internal/states.ts", "tokens.stylex.ts"],
  exports: ["RunTimeline"],
  usage: `import { RunTimeline } from '@/ui/components';

<RunTimeline label="Steps of Fix the checkout crash" spans={spans} now={elapsed} />`,
  examples: [
    { id: "default", title: "Default", description: "Point at a step to hold it and read its numbers; press it to keep it. With nothing held, the wash names the slowest step and the time spent waiting on people.", Component: Default, code: defaultCode, align: "stretch" },
    { id: "parallel", title: "Helpers and a failure", description: "Steps that run side by side share the axis; `depth` indents the work a helper did. A failed step is red and its error shows when held.", Component: Parallel, code: parallelCode, align: "stretch" },
  ],
  api: [
    {
      name: "RunTimeline",
      description: "A run's steps on one time axis.",
      extends: "<div> attributes",
      props: [
        { name: "label", type: "string", required: true, description: "Names the timeline: \"Steps of Fix the checkout crash\"." },
        { name: "spans", type: "TimelineSpan[]", required: true, description: "The steps, in order: `{ id, label, tool?, start, duration?, state, depth?, tokens?, cost?, detail?, waiting? }`. Times are ms after the run began; leave `duration` out while a step is still going." },
        { name: "now", type: "number", description: "How long the run has gone, in ms. Open steps run to here and a line marks it. Default: the latest end." },
        { name: "selectedId", type: "string | null", description: "The pressed step (controlled)." },
        { name: "defaultSelectedId", type: "string | null", default: "null", description: "The step pressed at first." },
        { name: "onSelectionChange", type: "(id: string | null) => void", description: "Called when a step is pressed or released." },
        { name: "hideSummary", type: "boolean", default: "false", description: "Hides the wash under the bars." },
      ],
    },
  ],
  accessibility: [
    "The steps are a list of buttons in a named group. Each button reads its step, tool, state, start time and duration, so the bars are never the only record.",
    "Up and Down arrows move between steps, Home and End jump to the ends, Enter or Space keeps a step held (`aria-pressed`), and Escape lets go.",
    "Focus holds a step exactly as pointing does. The time axis and guides are hidden from assistive tech.",
    "Waiting time is an amber wash with a ring and failures are red, and both are written as words in the name of each step.",
  ],
});
