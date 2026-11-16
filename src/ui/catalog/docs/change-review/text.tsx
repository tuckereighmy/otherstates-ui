'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { ChangeReview, type Change, type ChangeStatus } from '../../../components';

const s = stylex.create({ box: { width: '100%', maxWidth: 520 } });

export default function ChangeReviewText() {
  const [changes, setChanges] = useState<Change[]>([
    { id: 'intro', title: 'Opening paragraph', status: 'pending', lines: [
      { type: 'remove', text: 'We are very excited to announce that the new dashboard is now live for all users.' },
      { type: 'add', text: 'The new dashboard is live for everyone.' },
    ] },
  ]);
  const set = (id: string, status: ChangeStatus) => setChanges(all => all.map(change => (change.id === id ? { ...change, status } : change)));
  return <ChangeReview {...stylex.props(s.box)} title="Make it shorter" changes={changes} onAccept={id => set(id, 'accepted')} onReject={id => set(id, 'rejected')} onUndo={id => set(id, 'pending')} />;
}
