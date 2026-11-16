# Steps

Show what a run did, is doing and will do, as steps on a rail.

Category: Agents · Exports: `Steps`, `Step`, `StepState`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { Step, Steps } from '@/ui/components';

<Steps aria-label="Run steps">
  <Step state="done" title="Read the brief" meta="8s" />
  <Step state="running" title="Draft the copy" />
  <Step title="Open a pull request" />
</Steps>
```

## Steps

An ordered list of steps on a rail.

Extends: <ol> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `aria-label` | `string` |  | Names the list for assistive tech: "Run steps", "Plan". |
| `numbered` | `boolean` | `false` | Pending steps show their number instead of an empty ring. |
| `density` | `'default' \| 'compact'` | `'default'` | 16 or 8 px between steps. |
| `children` (required) | `ReactNode` |  | `Step` elements. |

## Step

One step. Its marker shows the state.

Extends: <li> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `state` | `'pending' \| 'running' \| 'needs-input' \| 'done' \| 'failed' \| 'skipped'` | `'pending'` | The step's state. |
| `title` (required) | `ReactNode` |  | What the step does. |
| `detail` | `ReactNode` |  | One line under the title, such as the tool or the result. |
| `meta` | `ReactNode` |  | Trailing text on the title's line: a duration, a cost, a badge. |
| `marker` | `ReactNode` |  | Replaces the state marker, for example with an AgentGlyph. |
| `children` | `ReactNode` |  | Content under the step, indented to the title. |

## Accessibility

- Renders an `<ol>`; give it an `aria-label` that names the run or the plan.
- Each step adds its state in visually hidden text ("Draft a reply, in progress"), so the marker is never the only signal.
- The running step has `aria-current="step"`.
- Markers and the rail are hidden from assistive tech.
- Under reduced motion, the running spinner stops and keeps its still ring.

## Examples

### Default

`src/ui/catalog/docs/steps/default.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Step, Steps } from '../../../components';

const s = stylex.create({ box: { width: '100%', maxWidth: 340 } });

export default function StepsDefault() {
  return (
    <Steps aria-label="Run steps" {...stylex.props(s.box)}>
      <Step state="done" title="Read the support ticket" meta="6s" />
      <Step state="done" title="Find the failed payment" meta="21s" />
      <Step state="running" title="Draft a reply" meta="14s" />
      <Step title="Refund the duplicate charge" />
      <Step title="Close the ticket" />
    </Steps>
  );
}
```

### Numbered plan

With `numbered`, pending steps show their number: a plan before it runs. `detail` names the tool.

`src/ui/catalog/docs/steps/numbered.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Step, Steps } from '../../../components';

const s = stylex.create({ box: { width: '100%', maxWidth: 340 } });

export default function StepsNumbered() {
  return (
    <Steps aria-label="Plan" numbered {...stylex.props(s.box)}>
      <Step title="Pull this month's invoices" detail="billing.list" />
      <Step title="Match them to bank payments" detail="ledger.match" />
      <Step title="Flag anything unpaid after 30 days" detail="sheets.write" />
      <Step title="Email the summary to finance" detail="mail.send" />
    </Steps>
  );
}
```

### With content

Children sit under the step at the title's edge: findings, file changes, actions.

`src/ui/catalog/docs/steps/with-content.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { FileChange, FileChanges, Step, Steps } from '../../../components';

const s = stylex.create({ box: { width: '100%', maxWidth: 360 } });

export default function StepsWithContent() {
  return (
    <Steps aria-label="Run steps" {...stylex.props(s.box)}>
      <Step state="done" title="Reproduce the empty-cart error" meta="34s" />
      <Step state="running" title="Patch the checkout form" meta="Editing">
        <FileChanges aria-label="Changed files">
          <FileChange path="src/checkout/cart.ts" added={14} removed={2} />
          <FileChange path="src/checkout/cart.test.ts" added={22} removed={0} kind="added" />
        </FileChanges>
      </Step>
      <Step title="Write the release note" />
    </Steps>
  );
}
```

### States

Done steps are quiet, so the eye lands on the running step, the one that needs you or the one that failed.

`src/ui/catalog/docs/steps/states.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Step, Steps } from '../../../components';

const s = stylex.create({ box: { width: '100%', maxWidth: 340 } });

export default function StepsStates() {
  return (
    <Steps aria-label="Step states" {...stylex.props(s.box)}>
      <Step state="done" title="Done" meta="2s" />
      <Step state="running" title="Running" meta="5s" />
      <Step state="needs-input" title="Needs you" detail="Approve sending 1,280 emails" />
      <Step state="failed" title="Failed" detail="The calendar token expired" />
      <Step state="skipped" title="Skipped" />
      <Step title="Pending" />
    </Steps>
  );
}
```

### Compact

`density="compact"` sets 8 px between steps, for side panels.

`src/ui/catalog/docs/steps/compact.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Step, Steps } from '../../../components';

const s = stylex.create({ box: { width: '100%', maxWidth: 300 } });

export default function StepsCompact() {
  return (
    <Steps aria-label="Run steps" density="compact" {...stylex.props(s.box)}>
      <Step state="done" title="Collect the survey answers" meta="3s" />
      <Step state="done" title="Group them by theme" meta="11s" />
      <Step state="running" title="Write the summary" />
      <Step title="Share it in the team channel" />
    </Steps>
  );
}
```
