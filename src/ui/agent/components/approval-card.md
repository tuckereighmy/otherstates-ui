# Approval card

Ask a person before an agent acts: what will happen, how risky it is and one decision.

Category: Agents · Exports: `ApprovalCard`, `ApprovalAgent`, `ApprovalScope`, `ApprovalStatus`, `RiskBadge`, `RiskLevel`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { ApprovalCard } from '@/ui/components';

<ApprovalCard
  title="Send the October newsletter"
  risk="medium"
  onApprove={() => send()}
  onDeny={() => cancel()}
/>
```

## ApprovalCard

An agent's request for permission, with the details and one decision.

Extends: Card props (without heading, description, action, footer)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` (required) | `ReactNode` |  | What will happen, as a short action. |
| `description` | `ReactNode` |  | Why, or for whom: one or two sentences. |
| `agent` | `{ name: string; icon?: IconName; color?: AgentColor }` |  | The agent asking, in the head row. |
| `askVerb` | `ReactNode` | `'asks'` | The words after the agent's name. |
| `risk` | `'low' \| 'medium' \| 'high'` |  | Shows the risk in words at the end of the head row. |
| `command` | `string` |  | Exactly what will run, as the agent will send it. Shown in full with a copy button. |
| `tool` | `string` |  | The tool that runs `command`: "bash", "sql". |
| `commandLabel` | `string` | `'Command'` | Names `command`. |
| `details` | `{ label: ReactNode; value: ReactNode }[]` |  | The figures that matter, as wash tiles. Two or three read best. |
| `children` | `ReactNode` |  | More content under the tiles, such as FileChanges or a DiffView. |
| `scopes` | `{ id: string; label: string }[]` |  | Choices for how long the approval lasts. |
| `scope` | `string` |  | The chosen scope (controlled). |
| `defaultScope` | `string` |  | The scope chosen at first. Default: the first. |
| `onScopeChange` | `(scope: string) => void` |  | Called when the scope changes. |
| `approveLabel` | `string` | `'Approve'` | The approve button. |
| `denyLabel` | `string` | `'Deny'` | The deny button. |
| `onApprove` | `(scope?: string) => void` |  | Adds the approve button. Receives the scope when there are `scopes`. |
| `onDeny` | `() => void` |  | Adds the deny button. |
| `status` | `'pending' \| 'approved' \| 'denied'` | `'pending'` | A decided status replaces the buttons with the outcome. |
| `statusLabel` | `ReactNode` |  | Replaces the outcome line. |
| `isApproving` | `boolean` | `false` | Shows the approve button as loading. |
| `shortcuts` | `boolean` | `true` | Listens for Mod+Enter and Escape while focus is inside. |

## RiskBadge

An action's risk: gray for low, warning for medium, error for high.

Extends: <span> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `risk` (required) | `'low' \| 'medium' \| 'high'` |  | The risk level. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'sm'` | Badge height. Ignored by `text`. |
| `appearance` | `'badge' \| 'text'` | `'badge'` | A pill, or the words alone in the risk's color for the head of a card. |
| `children` | `ReactNode` |  | Replaces the words, for example "Destructive". |

## Accessibility

- The card is an `<article>` named by its title.
- While focus is inside the card, Mod+Enter approves and Escape denies; the buttons carry `aria-keyshortcuts`.
- The outcome line is a status region, so assistive tech hears the decision when it lands.
- Risk is written as words ("High risk"), never shown by color alone.

## Examples

### Default

`src/ui/catalog/docs/approval-card/default.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { ApprovalCard } from '../../../components';

const s = stylex.create({ box: { width: '100%', maxWidth: 420 } });

export default function ApprovalCardDefault() {
  return (
    <ApprovalCard
      {...stylex.props(s.box)}
      title="Send the October newsletter"
      description="The draft is ready and the test send looked right."
      agent={{ name: 'Newsletter agent', icon: 'mail' }}
      askVerb="wants to send it"
      risk="medium"
      details={[
        { label: 'Recipients', value: '1,284' },
        { label: 'List', value: 'Monthly update' },
        { label: 'Sends', value: 'Today, 9:00' },
      ]}
      onApprove={() => {}}
      onDeny={() => {}}
    />
  );
}
```

### Permission with a scope

`scopes` asks how long the permission lasts; `onApprove` receives the choice. Children show what will change.

`src/ui/catalog/docs/approval-card/permission.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { ApprovalCard, FileChange, FileChanges } from '../../../components';

const s = stylex.create({ box: { width: '100%', maxWidth: 440 } });

export default function ApprovalCardPermission() {
  return (
    <ApprovalCard
      {...stylex.props(s.box)}
      title="Merge into main"
      description="The fix passed review and all 214 checks. Merging deploys it."
      agent={{ name: 'Coder', icon: 'code', color: 2 }}
      askVerb="wants to merge"
      risk="high"
      scopes={[
        { id: 'once', label: 'Just once' },
        { id: 'hour', label: 'For 1 hour' },
        { id: 'always', label: 'Always' },
      ]}
      approveLabel="Allow"
      onApprove={scope => console.log(scope)}
      onDeny={() => {}}
    >
      <FileChanges aria-label="Changed files">
        <FileChange path="src/checkout/cart.ts" added={12} removed={4} />
        <FileChange path="tests/checkout.test.ts" added={31} removed={2} />
      </FileChanges>
    </ApprovalCard>
  );
}
```

### Exact command

`command` shows exactly what will run, with copy, so the person approves the literal action. `tool` names what runs it.

`src/ui/catalog/docs/approval-card/command.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { ApprovalCard } from '../../../components';

const s = stylex.create({ box: { width: '100%', maxWidth: 460 } });

export default function ApprovalCardCommand() {
  return (
    <ApprovalCard
      {...stylex.props(s.box)}
      title="Run the staging migration"
      description="Splits users into accounts and profiles. The dry run passed."
      agent={{ name: 'Data agent', icon: 'layers' }}
      askVerb="wants to run a command"
      risk="high"
      tool="bash"
      command="npm run db:migrate -- --env staging --step 0042_split_users"
      scopes={[{ id: 'once', label: 'Just once' }, { id: 'session', label: 'This session' }]}
      approveLabel="Run it"
      onApprove={() => {}}
      onDeny={() => {}}
    />
  );
}
```

### Decided

`status` replaces the buttons with the outcome once someone has decided; `statusLabel` says who and when.

`src/ui/catalog/docs/approval-card/decided.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { ApprovalCard } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({ column: { display: 'grid', gap: t['--os-space-4'], width: '100%', maxWidth: 420 } });

export default function ApprovalCardDecided() {
  return (
    <div {...stylex.props(s.column)}>
      <ApprovalCard title="Refund $240 to the customer" risk="medium" status="approved" statusLabel="Approved by Mia at 9:02" />
      <ApprovalCard title="Delete 312 archived projects" risk="high" status="denied" statusLabel="Denied by Jonas at 9:05" />
    </div>
  );
}
```

### Starting the action

`isApproving` shows the approve button as loading while the action starts.

`src/ui/catalog/docs/approval-card/approving.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { ApprovalCard } from '../../../components';

const s = stylex.create({ box: { width: '100%', maxWidth: 420 } });

export default function ApprovalCardApproving() {
  const [busy, setBusy] = useState(false);
  return (
    <ApprovalCard
      {...stylex.props(s.box)}
      title="Publish the help center changes"
      details={[{ label: 'Articles', value: '6 updated, 2 new' }]}
      risk="low"
      isApproving={busy}
      onApprove={() => { setBusy(true); window.setTimeout(() => setBusy(false), 1800); }}
      onDeny={() => {}}
    />
  );
}
```
