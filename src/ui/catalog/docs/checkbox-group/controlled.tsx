'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { CheckboxGroup } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  column: { display: 'grid', gap: tokens['--os-space-2'] },
  status: {
    margin: 0,
    color: tokens['--os-color-fg-muted'],
    fontSize: tokens['--os-font-size-caption'],
    lineHeight: tokens['--os-line-height-md'],
  },
});

const columns = [
  { id: 'status', label: 'Status' },
  { id: 'owner', label: 'Owner' },
  { id: 'due', label: 'Due date' },
];

export default function CheckboxGroupControlled() {
  const [visible, setVisible] = useState(['status', 'owner']);

  return (
    <div {...stylex.props(s.column)}>
      <CheckboxGroup label="Visible columns" value={visible} onChange={setVisible} options={columns} />
      <p {...stylex.props(s.status)}>{visible.length} of {columns.length} columns shown.</p>
    </div>
  );
}
