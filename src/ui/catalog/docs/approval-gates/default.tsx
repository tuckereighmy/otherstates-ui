'use client';

import * as stylex from '@stylexjs/stylex';
import { ApprovalGates, DiffView, type Gate } from '../../../components';

const gates: Gate[] = [
  {
    id: 'prices', title: 'Change team prices', meta: 'Coder · File change · 1m ago', blocking: true, status: 'waiting',
    content: <DiffView heading="src/billing/plans.ts" lines={[
      { type: 'remove', number: 12, text: "team: { seat: 12, currency: 'usd' }," },
      { type: 'add', number: 12, text: "team: { seat: 14, currency: 'usd' }," },
    ]} />,
  },
  { id: 'email', title: 'Email 1,284 trial users', meta: 'Writer · Email · 3m ago', status: 'waiting', content: 'Announces the new prices from Monday.' },
  { id: 'copy', title: 'Publish the pricing copy', meta: 'Writer · Page · 8m ago', status: 'approved' },
];

const s = stylex.create({ box: { width: '100%', maxWidth: 460 } });

export default function ApprovalGatesDefault() {
  return <ApprovalGates {...stylex.props(s.box)} title="Launch the new pricing page" gates={gates} onDecide={() => {}} />;
}
