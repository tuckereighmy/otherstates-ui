'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { SegmentedControl } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const statuses = [
  { value: 'open', label: 'Open' },
  { value: 'paid', label: 'Paid' },
  { value: 'overdue', label: 'Overdue' },
];

const s = stylex.create({
  stack: { display: 'grid', justifyItems: 'center', gap: t['--os-space-3'] },
  note: { margin: 0, color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-sm'] },
});

export default function SegmentedControlControlled() {
  const [status, setStatus] = useState('overdue');
  return (
    <div {...stylex.props(s.stack)}>
      <SegmentedControl label="Invoice status" value={status} onChange={setStatus} options={statuses} />
      <p {...stylex.props(s.note)}>Showing {status} invoices</p>
    </div>
  );
}
