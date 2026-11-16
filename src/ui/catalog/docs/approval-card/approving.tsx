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
