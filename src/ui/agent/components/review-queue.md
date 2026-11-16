# Review queue

Work through what agents finished: filter it, pick an item and review it beside the list.

Category: Agents · Exports: `ReviewQueue`, `ReviewItem`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { ReviewQueue } from '@/ui/components';

<ReviewQueue label="Review queue" items={items} renderDetail={item => <Detail item={item} />} />
```

## ReviewQueue

A queue of agent work to review: filters, progress, a list and the selected item.

Extends: <div> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` |  | Names the region and the list. |
| `items` (required) | `ReviewItem[]` |  | Each item: `id`, `title`, `textValue`, `kind`, `age`, `risk`, `unsure` and `reviewed`. |
| `selectedId` | `string \| null` |  | The selected item (controlled). |
| `defaultSelectedId` | `string` |  | Default: the first item not yet reviewed. |
| `onSelectionChange` | `(id: string) => void` |  | Called when the selection changes. |
| `renderDetail` | `(item: ReviewItem) => ReactNode` |  | The selected item's detail, beside the list. |

## Accessibility

- The list is a single-select listbox: the arrow keys move, typing jumps to an item by its `textValue`.
- Reviewed items say "Reviewed" to assistive tech, not just with a check.
- The filters are a segmented control, and progress is a progress bar with "3 of 5" as its value text.
- The detail pane moves under the list on narrow screens.

## Examples

### Default

`src/ui/catalog/docs/review-queue/default.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { Button, Card, ReviewQueue, type ReviewItem } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const items: ReviewItem[] = [
  { id: 'r1', title: 'Retry webhook deliveries', textValue: 'Retry webhook deliveries', kind: 'Code change', age: '28m', risk: 'high' },
  { id: 'r2', title: 'Limitation of liability, section 7', textValue: 'Limitation of liability', kind: 'Contract clause', age: '18m', unsure: true },
  { id: 'r3', title: 'Split names into first and last', textValue: 'Split names', kind: 'Migration', age: '14m', risk: 'high' },
  { id: 'r4', title: 'Refund order 4821', textValue: 'Refund order 4821', kind: 'Refund', age: '9m' },
  { id: 'r5', title: 'Tag 14 tickets as billing', textValue: 'Tag 14 tickets', kind: 'Triage', age: '6m', reviewed: true },
];

const s = stylex.create({ actions: { display: 'flex', justifyContent: 'flex-end', gap: t['--os-space-2'], width: '100%' } });

export default function ReviewQueueDefault() {
  return (
    <ReviewQueue
      label="Review queue"
      items={items}
      renderDetail={item => (
        <Card heading={item.title} description={item.kind} footer={<div {...stylex.props(s.actions)}><Button size="sm" appearance="secondary">Request changes</Button><Button size="sm">Approve</Button></div>}>
          The agent's summary, the diff or the document goes here.
        </Card>
      )}
    />
  );
}
```
