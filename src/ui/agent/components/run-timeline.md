# Run timeline

Show a run's steps on one time axis: where the time went, what failed and how long it waited on people.

Category: Agents · Exports: `RunTimeline`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { RunTimeline } from '@/ui/components';

<RunTimeline label="Steps of Fix the checkout crash" spans={spans} now={elapsed} />
```

## RunTimeline

A run's steps on one time axis.

Extends: <div> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` |  | Names the timeline: "Steps of Fix the checkout crash". |
| `spans` (required) | `TimelineSpan[]` |  | The steps, in order: `{ id, label, tool?, start, duration?, state, depth?, tokens?, cost?, detail?, waiting? }`. Times are ms after the run began; leave `duration` out while a step is still going. |
| `now` | `number` |  | How long the run has gone, in ms. Open steps run to here and a line marks it. Default: the latest end. |
| `selectedId` | `string \| null` |  | The pressed step (controlled). |
| `defaultSelectedId` | `string \| null` | `null` | The step pressed at first. |
| `onSelectionChange` | `(id: string \| null) => void` |  | Called when a step is pressed or released. |
| `hideSummary` | `boolean` | `false` | Hides the wash under the bars. |

## Accessibility

- The steps are a list of buttons in a named group. Each button reads its step, tool, state, start time and duration, so the bars are never the only record.
- Up and Down arrows move between steps, Home and End jump to the ends, Enter or Space keeps a step held (`aria-pressed`), and Escape lets go.
- Focus holds a step exactly as pointing does. The time axis and guides are hidden from assistive tech.
- Waiting time is an amber wash with a ring and failures are red, and both are written as words in the name of each step.

## Examples

### Default

Point at a step to hold it and read its numbers; press it to keep it. With nothing held, the wash names the slowest step and the time spent waiting on people.

`src/ui/catalog/docs/run-timeline/default.tsx`

```tsx
import { RunTimeline, type TimelineSpan } from '../../../components';

const spans: TimelineSpan[] = [
  { id: 'read', label: 'Read the bug report', tool: 'read_file', start: 0, duration: 2000, state: 'done', tokens: 3100, cost: 0.01, detail: 'issues/482.md' },
  { id: 'repro', label: 'Reproduce the crash', tool: 'bash', start: 2000, duration: 9000, state: 'done', tokens: 5200, cost: 0.03, detail: 'npm test -- checkout.test.ts' },
  { id: 'patch', label: 'Guard the empty cart', tool: 'edit_file', start: 11000, duration: 14000, state: 'done', tokens: 9000, cost: 0.08, detail: 'src/checkout/cart.ts' },
  { id: 'test', label: 'Run the tests', tool: 'bash', start: 25000, duration: 18000, state: 'done', tokens: 4000, cost: 0.03, detail: 'npm test' },
  { id: 'approve', label: 'Approved by you', start: 43000, duration: 41000, state: 'done', waiting: true, detail: 'npm run deploy -- --env staging' },
  { id: 'deploy', label: 'Deploy to staging', tool: 'bash', start: 84000, state: 'running', tokens: 900, cost: 0.01 },
];

export default function RunTimelineDefault() {
  return <RunTimeline label="Steps of Fix the checkout crash" spans={spans} now={92000} />;
}
```

### Helpers and a failure

Steps that run side by side share the axis; `depth` indents the work a helper did. A failed step is red and its error shows when held.

`src/ui/catalog/docs/run-timeline/parallel.tsx`

```tsx
import { RunTimeline, type TimelineSpan } from '../../../components';

const spans: TimelineSpan[] = [
  { id: 'find', label: 'Find the call notes', tool: 'search', start: 0, duration: 5000, state: 'done' },
  { id: 'split', label: 'Hand the calls to two helpers', tool: 'agents', start: 5000, duration: 62000, state: 'done' },
  { id: 'a', label: 'Summarize calls 1 to 7', tool: 'helper', start: 5000, duration: 54000, state: 'done', depth: 1, tokens: 48000, cost: 0.22 },
  { id: 'b', label: 'Summarize calls 8 to 14', tool: 'helper', start: 5000, duration: 62000, state: 'done', depth: 1, tokens: 51000, cost: 0.24 },
  { id: 'sync', label: 'Save the themes to the CRM', tool: 'crm', start: 67000, duration: 9000, state: 'failed', detail: 'The CRM refused: it allows 100 changes a minute.' },
];

export default function RunTimelineParallel() {
  return <RunTimeline label="Steps of Summarize the churn calls" spans={spans} defaultSelectedId="sync" />;
}
```
