'use client';

import { useState } from 'react';
import { HandoffList, type Handoff } from '../../../components';

const start: Handoff[] = [
  { id: 'deploy', kind: 'approval', agent: { name: 'Coder', icon: 'code', color: 1 }, title: 'Deploy the checkout fix to staging', subject: 'npm run deploy -- --env staging', waited: 360_000, risk: 'medium' },
  { id: 'refund', kind: 'approval', agent: { name: 'Support', icon: 'message', color: 5 }, title: 'Refund $84.00 for order #1183', subject: 'payments.refund --order 1183 --amount 84.00', waited: 1_320_000, risk: 'high' },
  { id: 'copy', kind: 'question', agent: { name: 'Writer', icon: 'edit', color: 4 }, title: 'Show the Team plan monthly or yearly first?', subject: 'Yearly is 20% cheaper, but the number reads higher', waited: 180_000 },
];

export default function HandoffListDefault() {
  const [items, setItems] = useState(start);
  const settle = (id: string, outcome: string) => {
    setItems(all => all.map(item => (item.id === id ? { ...item, outcome } : item)));
    window.setTimeout(() => setItems(all => all.filter(item => item.id !== id)), 1600);
  };
  return (
    <HandoffList
      label="Waiting on you"
      items={items}
      onApprove={id => settle(id, 'Approved')}
      onDeny={id => settle(id, 'Denied. Nothing ran.')}
      onOpen={id => settle(id, 'Answered')}
    />
  );
}
