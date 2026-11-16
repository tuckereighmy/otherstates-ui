# Run block

Show an agent's run inside a message: each step with its real tool call, open while it works and one line once it ends.

Category: Agents · Exports: `RunBlock`, `RunStep`, `RunStatus`, `ToolCall`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { RunBlock } from '@/ui/components';

<RunBlock title="Fixing the checkout crash" status="running" steps={steps} onStop={stop} />
```

## RunBlock

An agent run in a message: open while it works, one line once it ends.

Extends: Card props (without heading, description, action, footer)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` (required) | `ReactNode` |  | What the run is doing or did. |
| `status` (required) | `'running' \| 'needs-input' \| 'done' \| 'failed' \| 'stopped'` |  | The run's state. |
| `steps` (required) | `RunStep[]` |  | Each step: `id`, `title`, `state`, and optionally `tool`, `input`, `inputLabel`, `output`, `error`, `duration`, `detail` and `children`. |
| `elapsed` | `ReactNode` |  | How long it has run. |
| `summary` | `ReactNode` |  | What it changed, after the step count. |
| `expanded` | `boolean` |  | Open (controlled). Default: open while running, waiting or failed; closed once done or stopped. |
| `onExpandedChange` | `(expanded: boolean) => void` |  | Called when the head is pressed. |
| `onStop` | `() => void` |  | Adds Stop to the head while running. |
| `onRetry` | `(stepId: string) => void` |  | Adds Retry to failed steps. |

## ToolCall

One tool call: the tool, its literal input, its output and any error.

Extends: <div> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `tool` (required) | `string` |  | The tool: "bash", "read_file". |
| `input` | `string` |  | The literal input, exactly as sent. It has a copy button. |
| `inputLabel` | `string` | `'Input'` | Names the input: "Command", "Query", "Path". |
| `output` | `string` |  | What the tool returned. Past eight lines it scrolls, with Show all. |
| `error` | `ReactNode` |  | Why the call failed, in an alert. |
| `onRetry` | `() => void` |  | Adds Retry to the error. |
| `children` | `ReactNode` |  | Extra content after the output, such as FileChanges. |

## Accessibility

- The head is a disclosure button with `aria-expanded`; the block is `aria-busy` while it runs.
- Each step with a tool call has its own disclosure button; a failed step opens on its own.
- Errors are alerts, so they are announced when they appear.
- Output is a focusable region, so keyboard users can scroll it.
- Under reduced motion, spinners stop and keep their still ring.

## Examples

### Default

`src/ui/catalog/docs/run-block/default.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { RunBlock, type RunStep } from '../../../components';

const steps: RunStep[] = [
  { id: 'read', title: 'Read the bug report', state: 'done', tool: 'read_file', inputLabel: 'Path', input: 'issues/482.md', output: 'Checkout crashes when the cart is empty.', duration: '0.4s' },
  { id: 'repro', title: 'Reproduce the crash', state: 'done', tool: 'bash', inputLabel: 'Command', input: 'npm test -- checkout.test.ts', output: 'FAIL  checkout.test.ts\n  ✕ empty cart (12 ms)\n    TypeError: Cannot read properties of undefined (reading \'total\')', duration: '8s' },
  { id: 'patch', title: 'Guard the empty cart', state: 'running', tool: 'edit_file', duration: '4s' },
  { id: 'test', title: 'Run the tests again', state: 'pending' },
];

const s = stylex.create({ box: { width: '100%', maxWidth: 480 } });

export default function RunBlockDefault() {
  return <RunBlock {...stylex.props(s.box)} title="Fixing the checkout crash" status="running" elapsed="12s" steps={steps} onStop={() => {}} />;
}
```

### A failed step

A failed step opens on its error and the command that caused it; `onRetry` adds Retry.

`src/ui/catalog/docs/run-block/failed.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { RunBlock, type RunStep } from '../../../components';

const steps: RunStep[] = [
  { id: 'install', title: 'Install dependencies', state: 'done', tool: 'bash', inputLabel: 'Command', input: 'npm ci', output: 'added 412 packages in 9s', duration: '9s' },
  { id: 'migrate', title: 'Run the migration', state: 'failed', tool: 'bash', inputLabel: 'Command', input: 'npm run db:migrate -- --env staging', error: 'Connection refused: staging database at 10.0.4.12:5432', duration: '2s' },
  { id: 'verify', title: 'Check the row counts', state: 'skipped' },
];

const s = stylex.create({ box: { width: '100%', maxWidth: 480 } });

export default function RunBlockFailed() {
  return <RunBlock {...stylex.props(s.box)} title="Migrating the users table" status="failed" elapsed="11s" steps={steps} onRetry={() => {}} />;
}
```

### Finished

Once a run ends it closes to one line: steps, time and what changed. A click opens it again.

`src/ui/catalog/docs/run-block/finished.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { FileChange, FileChanges, RunBlock, type RunStep } from '../../../components';

const steps: RunStep[] = [
  { id: 'patch', title: 'Guard the empty cart', state: 'done', duration: '6s', children: (
    <FileChanges aria-label="Changed files"><FileChange path="src/checkout/cart.ts" added={6} removed={1} /></FileChanges>
  ) },
  { id: 'test', title: 'Run the tests', state: 'done', tool: 'bash', inputLabel: 'Command', input: 'npm test', output: 'Tests  214 passed (214)', duration: '21s' },
];

const s = stylex.create({ box: { width: '100%', maxWidth: 480 } });

export default function RunBlockFinished() {
  return <RunBlock {...stylex.props(s.box)} title="Fixed the checkout crash" status="done" elapsed="1m 12s" summary="1 file changed" steps={steps} />;
}
```

### Tool call

`ToolCall` alone: the tool, its literal input with copy, and the output, which scrolls past eight lines.

`src/ui/catalog/docs/run-block/tool-call.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { ToolCall } from '../../../components';

const output = ['src/checkout/cart.ts', 'src/checkout/cart.test.ts', 'src/checkout/summary.tsx', 'src/checkout/coupon.ts', 'src/billing/plans.ts', 'src/billing/invoice.tsx', 'src/billing/tax.ts', 'src/billing/currency.ts', 'src/billing/refund.ts', 'src/billing/plans.test.ts'].join('\n');

const s = stylex.create({ box: { width: '100%', maxWidth: 480 } });

export default function RunBlockToolCall() {
  return <ToolCall {...stylex.props(s.box)} tool="bash" inputLabel="Command" input="git diff --name-only main" output={output} />;
}
```
