'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Combobox } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const statuses = [
  { id: 'todo', label: 'To do' },
  { id: 'doing', label: 'In progress' },
  { id: 'done', label: 'Done' },
];

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-3'], width: 280, maxWidth: '100%' },
  note: { margin: 0, fontSize: tokens['--os-font-size-caption'], lineHeight: tokens['--os-line-height-md'], color: tokens['--os-color-fg-muted'] },
});

export default function ComboboxControlled() {
  const [status, setStatus] = useState<string | number | null>('doing');

  return (
    <div {...stylex.props(s.root)}>
      <Combobox label="Status" options={statuses} value={status} onChange={setStatus} />
      <p {...stylex.props(s.note)}>Selected id: {status ?? 'none'}</p>
    </div>
  );
}
