import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Numbered from './numbered';
import numberedCode from './numbered.tsx?raw';
import WithContent from './with-content';
import withContentCode from './with-content.tsx?raw';
import States from './states';
import statesCode from './states.tsx?raw';
import Compact from './compact';
import compactCode from './compact.tsx?raw';

export default defineDoc({
  id: "steps",
  title: "Steps",
  category: 'Agents',
  description: "Show what a run did, is doing and will do, as steps on a rail.",
  source: ["components/steps.tsx", "components/Icon.tsx", "components/internal/class-name.ts", "components/internal/sr-only.tsx", "components/internal/states.ts", "tokens.stylex.ts"],
  exports: ["Steps", "Step", "StepState"],
  usage: `import { Step, Steps } from '@/ui/components';

<Steps aria-label="Run steps">
  <Step state="done" title="Read the brief" meta="8s" />
  <Step state="running" title="Draft the copy" />
  <Step title="Open a pull request" />
</Steps>`,
  examples: [
    { id: "default", title: "Default", Component: Default, code: defaultCode },
    { id: "numbered", title: "Numbered plan", description: "With `numbered`, pending steps show their number: a plan before it runs. `detail` names the tool.", Component: Numbered, code: numberedCode },
    { id: "with-content", title: "With content", description: "Children sit under the step at the title's edge: findings, file changes, actions.", Component: WithContent, code: withContentCode },
    { id: "states", title: "States", description: "Done steps are quiet, so the eye lands on the running step, the one that needs you or the one that failed.", Component: States, code: statesCode },
    { id: "compact", title: "Compact", description: "`density=\"compact\"` sets 8 px between steps, for side panels.", Component: Compact, code: compactCode },
  ],
  api: [
    {
      name: "Steps",
      description: "An ordered list of steps on a rail.",
      extends: "<ol> attributes",
      props: [
        { name: "aria-label", type: "string", description: "Names the list for assistive tech: \"Run steps\", \"Plan\"." },
        { name: "numbered", type: "boolean", default: "false", description: "Pending steps show their number instead of an empty ring." },
        { name: "density", type: "'default' | 'compact'", default: "'default'", description: "16 or 8 px between steps." },
        { name: "children", type: "ReactNode", required: true, description: "`Step` elements." },
      ],
    },
    {
      name: "Step",
      description: "One step. Its marker shows the state.",
      extends: "<li> attributes",
      props: [
        { name: "state", type: "'pending' | 'running' | 'needs-input' | 'done' | 'failed' | 'skipped'", default: "'pending'", description: "The step's state." },
        { name: "title", type: "ReactNode", required: true, description: "What the step does." },
        { name: "detail", type: "ReactNode", description: "One line under the title, such as the tool or the result." },
        { name: "meta", type: "ReactNode", description: "Trailing text on the title's line: a duration, a cost, a badge." },
        { name: "marker", type: "ReactNode", description: "Replaces the state marker, for example with an AgentGlyph." },
        { name: "children", type: "ReactNode", description: "Content under the step, indented to the title." },
      ],
    },
  ],
  accessibility: [
    "Renders an `<ol>`; give it an `aria-label` that names the run or the plan.",
    "Each step adds its state in visually hidden text (\"Draft a reply, in progress\"), so the marker is never the only signal.",
    "The running step has `aria-current=\"step\"`.",
    "Markers and the rail are hidden from assistive tech.",
    "Under reduced motion, the running spinner stops and keeps its still ring.",
  ],
});
