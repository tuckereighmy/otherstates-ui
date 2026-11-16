# Agent inbox

Sort agent tasks by who they wait on, as a board or a list.

Category: Agents · Exports: `AgentInbox`, `AgentTaskCard`, `AgentTask`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { AgentInbox } from '@/ui/components';

<AgentInbox label="Agent inbox" tasks={tasks} onApprove={approve} onReject={reject} />
```

## AgentInbox

Agent tasks sorted into needs you, working and finished.

Extends: <div> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` |  | Names the inbox region. |
| `tasks` (required) | `AgentTask[]` |  | Each task: `id`, `title`, `summary`, `agent`, `state`, `elapsed`, `cost` and `detail`. |
| `view` | `'board' \| 'list'` |  | The view (controlled). |
| `defaultView` | `'board' \| 'list'` | `'board'` | The view at first. |
| `onViewChange` | `(view: 'board' \| 'list') => void` |  | Called when the view changes. |
| `onApprove` | `(id: string) => void` |  | Adds Approve to tasks that need you. |
| `onReject` | `(id: string) => void` |  | Adds Reject to tasks that need you. |
| `toolbar` | `ReactNode` |  | Trailing toolbar content: filters, a search field. |

## AgentTaskCard

One task: what it is, which agent has it, its state and time.

Extends: Card props (without heading, description, action, footer)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `task` (required) | `AgentTask` |  | The task to show. |
| `actions` | `ReactNode` |  | Actions in the footer, such as Approve and Reject. |

## Accessibility

- The inbox is a named region; each board column is a section named by its heading.
- States are written in each card's badge, and list rows give their dot a label.
- Board columns stack into one column on narrow screens.

## Examples

### Default

`src/ui/catalog/docs/agent-inbox/default.tsx`

```tsx
'use client';

import { AgentInbox, type AgentTask } from '../../../components';

const tasks: AgentTask[] = [
  { id: 't1', title: 'Split the users table', summary: 'The dry run on staging passed. It wants to run on production.', state: 'needs-input', elapsed: '6m', agent: { name: 'Data agent', icon: 'layers', color: 1 } },
  { id: 't2', title: 'Merge duplicate contacts', summary: 'Matched 1,312 likely duplicates.', state: 'running', elapsed: '12m', agent: { name: 'CRM agent', icon: 'users', color: 2 } },
  { id: 't3', title: 'Translate the release notes', state: 'queued', agent: { name: 'Writer', icon: 'edit', color: 3 } },
  { id: 't4', title: 'Summarize churn calls', summary: '14 calls, 4 themes.', state: 'done', elapsed: '9m', cost: '$0.42', agent: { name: 'Researcher', icon: 'search', color: 4 } },
];

export default function AgentInboxDefault() {
  return <AgentInbox label="Agent inbox" tasks={tasks} onApprove={() => {}} onReject={() => {}} />;
}
```

### List view

The same tasks as one list, needs you first.

`src/ui/catalog/docs/agent-inbox/list.tsx`

```tsx
'use client';

import { AgentInbox, type AgentTask } from '../../../components';

const tasks: AgentTask[] = [
  { id: 't1', title: 'Approve a $240 refund', state: 'needs-input', elapsed: '4m', agent: { name: 'Support agent', icon: 'message' } },
  { id: 't2', title: 'Rotate the signing keys', state: 'running', elapsed: '2m', agent: { name: 'Ops agent', icon: 'lock' } },
  { id: 't3', title: 'Sync the calendar', state: 'failed', elapsed: '1m', agent: { name: 'Scheduler', icon: 'calendar' } },
  { id: 't4', title: 'Tag 14 tickets as billing', state: 'done', elapsed: '40s', agent: { name: 'Triage', icon: 'tag' } },
];

export default function AgentInboxList() {
  return <AgentInbox label="Agent inbox" tasks={tasks} defaultView="list" onApprove={() => {}} onReject={() => {}} />;
}
```

### Task card

`AgentTaskCard` on its own, with run steps as its `detail`.

`src/ui/catalog/docs/agent-inbox/task-card.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { AgentTaskCard, Button, Step, Steps } from '../../../components';

const s = stylex.create({ box: { width: '100%', maxWidth: 380 } });

export default function AgentInboxTaskCard() {
  return (
    <AgentTaskCard
      {...stylex.props(s.box)}
      task={{
        id: 'migrate', title: 'Split the users table', state: 'needs-input', elapsed: '6m 12s',
        agent: { name: 'Data agent', icon: 'layers' },
        detail: (
          <Steps aria-label="Steps so far" density="compact">
            <Step state="done" title="Read the schema" meta="1.4s" />
            <Step state="done" title="Dry run on staging" meta="2m" />
            <Step state="needs-input" title="Run on production" />
          </Steps>
        ),
      }}
      actions={<><Button size="sm" appearance="secondary">Reject</Button><Button size="sm">Approve</Button></>}
    />
  );
}
```
