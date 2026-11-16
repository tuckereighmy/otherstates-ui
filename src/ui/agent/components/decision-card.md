# Decision card

Ask a person to choose between options, with the agent's pick and follow-up questions.

Category: Agents · Exports: `DecisionCard`, `DecisionOption`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { DecisionCard } from '@/ui/components';

<DecisionCard
  question="Which region should the new database run in?"
  options={[
    { id: 'eu', label: 'Frankfurt', recommended: true },
    { id: 'us', label: 'Virginia' },
  ]}
  onSubmit={([region]) => console.log(region)}
/>
```

## DecisionCard

A question for a person, with the options, the agent's pick and follow-ups.

Extends: Card props (without heading, description, action, footer)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `question` (required) | `ReactNode` |  | The question. |
| `context` | `ReactNode` |  | What the agent knows: the situation, numbers, constraints. |
| `agent` | `{ name: string; icon?: IconName; color?: AgentColor }` |  | The agent waiting. |
| `risk` | `'low' \| 'medium' \| 'high'` |  | Shows the risk in words at the end of the head row. |
| `options` (required) | `DecisionOption[]` |  | Each option: `id`, `label`, `description`, `recommended` (shown as "Agent's pick"), `isDisabled` and an optional `followUp` question. |
| `value` | `string[]` |  | The chosen ids, one per level (controlled). |
| `defaultValue` | `string[]` |  | Default: the recommended path. |
| `onChange` | `(value: string[]) => void` |  | Called when a choice changes. |
| `onSubmit` | `(value: string[]) => void` |  | Adds the submit button. |
| `onLater` | `() => void` |  | Adds a button that sets the question aside. |
| `submitLabel` | `string` | `'Decide'` | The submit button. |
| `laterLabel` | `string` | `'Later'` | The later button. |
| `position` | `ReactNode` |  | Where the question sits in a queue: "1 of 3". |
| `children` | `ReactNode` |  | More content under the options. |
| `shortcuts` | `boolean` | `true` | Listens for Mod+Enter, Escape and the number keys while focus is inside. |

## Accessibility

- Each level is a radio group, so the arrow keys move between options; the number keys 1 to 9 pick a top-level option.
- The agent's pick is written as "Recommended", not shown by color.
- While focus is inside the card, Mod+Enter submits and Escape sets the question aside; the buttons carry `aria-keyshortcuts`.
- The submit button stays disabled until every level has a choice.

## Examples

### Default

`src/ui/catalog/docs/decision-card/default.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { DecisionCard } from '../../../components';

const s = stylex.create({ box: { width: '100%', maxWidth: 440 } });

export default function DecisionCardDefault() {
  return (
    <DecisionCard
      {...stylex.props(s.box)}
      question="Which queue should the import service use?"
      context="It gets about 40,000 events an hour, with bursts after each nightly sync."
      agent={{ name: 'Platform agent', icon: 'layers' }}
      options={[
        { id: 'log', label: 'Durable log', description: 'Keeps a day of events to replay after a bad deploy.', recommended: true },
        { id: 'managed', label: 'Managed queue', description: 'Nothing to run, but no replay.' },
        { id: 'database', label: 'Database table', description: 'Uses what exists today; slows down in bursts.' },
      ]}
      onSubmit={choice => console.log(choice)}
      onLater={() => {}}
    />
  );
}
```

### Follow-up question

An option with `followUp` opens a second question under it, so a decision can be a short tree.

`src/ui/catalog/docs/decision-card/follow-up.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { DecisionCard } from '../../../components';

const s = stylex.create({ box: { width: '100%', maxWidth: 460 } });

export default function DecisionCardFollowUp() {
  return (
    <DecisionCard
      {...stylex.props(s.box)}
      question="Errors jumped to 18% after the last deploy. What should I do?"
      context="2,140 failed checkouts in 12 minutes."
      risk="high"
      position="1 of 3"
      options={[
        {
          id: 'rollback', label: 'Roll back the deploy', recommended: true,
          followUp: {
            question: 'Tell customers?',
            options: [
              { id: 'status', label: 'Post on the status page', recommended: true },
              { id: 'team', label: 'Tell the team only' },
            ],
          },
        },
        { id: 'hotfix', label: 'Ship a fix forward', description: 'About 20 minutes, errors continue meanwhile.' },
      ]}
      onSubmit={path => console.log(path)}
      onLater={() => {}}
    />
  );
}
```

### Without a recommendation

With no `recommended` option nothing is chosen at first, and the submit button waits for a choice.

`src/ui/catalog/docs/decision-card/without-pick.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { DecisionCard } from '../../../components';

const s = stylex.create({ box: { width: '100%', maxWidth: 440 } });

export default function DecisionCardWithoutPick() {
  return (
    <DecisionCard
      {...stylex.props(s.box)}
      question="Who should get the weekly report?"
      options={[
        { id: 'dana', label: 'Dana only' },
        { id: 'team', label: 'The whole team' },
        { id: 'leads', label: 'Team leads' },
      ]}
      submitLabel="Send"
      onSubmit={choice => console.log(choice)}
    />
  );
}
```
