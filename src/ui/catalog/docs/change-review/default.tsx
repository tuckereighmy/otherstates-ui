'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { ChangeReview, type Change, type ChangeStatus } from '../../../components';

const initial: Change[] = [
  { id: 'plans', path: 'src/billing/plans.ts', status: 'pending', lines: [
    { type: 'remove', number: 12, text: "team: { seat: 12, currency: 'usd' }," },
    { type: 'add', number: 12, text: "team: { seat: 14, currency: 'usd' }," },
  ] },
  { id: 'copy', path: 'content/pricing.md', status: 'pending', lines: [
    { type: 'remove', number: 4, text: 'Team: $12 per seat, billed monthly.' },
    { type: 'add', number: 4, text: 'Team: $14 per seat, billed monthly.' },
  ] },
  { id: 'test', path: 'tests/billing/plans.test.ts', status: 'accepted', lines: [{ type: 'add', number: 30, text: "expect(plans.team.seat).toBe(14);" }] },
];

const s = stylex.create({ box: { width: '100%', maxWidth: 520 } });

export default function ChangeReviewDefault() {
  const [changes, setChanges] = useState(initial);
  const set = (id: string, status: ChangeStatus) => setChanges(all => all.map(change => (change.id === id ? { ...change, status } : change)));
  return (
    <ChangeReview
      {...stylex.props(s.box)}
      changes={changes}
      onAccept={id => set(id, 'accepted')}
      onReject={id => set(id, 'rejected')}
      onUndo={id => set(id, 'pending')}
      onAcceptAll={() => setChanges(all => all.map(change => ({ ...change, status: change.status === 'pending' ? 'accepted' : change.status })))}
      onRejectAll={() => setChanges(all => all.map(change => ({ ...change, status: change.status === 'pending' ? 'rejected' : change.status })))}
    />
  );
}
