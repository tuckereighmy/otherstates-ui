import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Failed from './failed';
import failedCode from './failed.tsx?raw';
import Finished from './finished';
import finishedCode from './finished.tsx?raw';
import ToolCall from './tool-call';
import toolCallCode from './tool-call.tsx?raw';

export default defineDoc({
  id: "run-block",
  title: "Run block",
  category: 'Agents',
  description: "Show an agent's run inside a message: each step with its real tool call, open while it works and one line once it ends.",
  source: ["components/run-block.tsx", "components/button.tsx", "components/card.tsx", "components/Icon.tsx", "components/internal/agent-parts.tsx", "components/internal/class-name.ts", "components/internal/overlay.tsx", "components/internal/platform.ts", "components/internal/size.ts", "components/internal/sr-only.tsx", "components/internal/states.ts", "components/internal/surface.ts", "components/steps.tsx", "components/tool-call.tsx", "tokens.stylex.ts"],
  exports: ["RunBlock", "RunStep", "RunStatus", "ToolCall"],
  usage: `import { RunBlock } from '@/ui/components';

<RunBlock title="Fixing the checkout crash" status="running" steps={steps} onStop={stop} />`,
  examples: [
    { id: "default", title: "Default", Component: Default, code: defaultCode, minHeight: 380 },
    { id: "failed", title: "A failed step", description: "A failed step opens on its error and the command that caused it; `onRetry` adds Retry.", Component: Failed, code: failedCode, minHeight: 420 },
    { id: "finished", title: "Finished", description: "Once a run ends it closes to one line: steps, time and what changed. A click opens it again.", Component: Finished, code: finishedCode, minHeight: 240 },
    { id: "tool-call", title: "Tool call", description: "`ToolCall` alone: the tool, its literal input with copy, and the output, which scrolls past eight lines.", Component: ToolCall, code: toolCallCode, minHeight: 300 },
  ],
  api: [
    {
      name: "RunBlock",
      description: "An agent run in a message: open while it works, one line once it ends.",
      extends: "Card props (without heading, description, action, footer)",
      props: [
        { name: "title", type: "ReactNode", required: true, description: "What the run is doing or did." },
        { name: "status", type: "'running' | 'needs-input' | 'done' | 'failed' | 'stopped'", required: true, description: "The run's state." },
        { name: "steps", type: "RunStep[]", required: true, description: "Each step: `id`, `title`, `state`, and optionally `tool`, `input`, `inputLabel`, `output`, `error`, `duration`, `detail` and `children`." },
        { name: "elapsed", type: "ReactNode", description: "How long it has run." },
        { name: "summary", type: "ReactNode", description: "What it changed, after the step count." },
        { name: "expanded", type: "boolean", description: "Open (controlled). Default: open while running, waiting or failed; closed once done or stopped." },
        { name: "onExpandedChange", type: "(expanded: boolean) => void", description: "Called when the head is pressed." },
        { name: "onStop", type: "() => void", description: "Adds Stop to the head while running." },
        { name: "onRetry", type: "(stepId: string) => void", description: "Adds Retry to failed steps." },
      ],
    },
    {
      name: "ToolCall",
      description: "One tool call: the tool, its literal input, its output and any error.",
      extends: "<div> attributes",
      props: [
        { name: "tool", type: "string", required: true, description: "The tool: \"bash\", \"read_file\"." },
        { name: "input", type: "string", description: "The literal input, exactly as sent. It has a copy button." },
        { name: "inputLabel", type: "string", default: "'Input'", description: "Names the input: \"Command\", \"Query\", \"Path\"." },
        { name: "output", type: "string", description: "What the tool returned. Past eight lines it scrolls, with Show all." },
        { name: "error", type: "ReactNode", description: "Why the call failed, in an alert." },
        { name: "onRetry", type: "() => void", description: "Adds Retry to the error." },
        { name: "children", type: "ReactNode", description: "Extra content after the output, such as FileChanges." },
      ],
    },
  ],
  accessibility: [
    "The head is a disclosure button with `aria-expanded`; the block is `aria-busy` while it runs.",
    "Each step with a tool call has its own disclosure button; a failed step opens on its own.",
    "Errors are alerts, so they are announced when they appear.",
    "Output is a focusable region, so keyboard users can scroll it.",
    "Under reduced motion, spinners stop and keep their still ring.",
  ],
});
