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
