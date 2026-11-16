'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { RadioGroup } from '../../../components';
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

const sorts = [
  { value: 'updated', label: 'Last updated' },
  { value: 'name', label: 'Name' },
  { value: 'owner', label: 'Owner' },
];

export default function RadioGroupControlled() {
  const [sort, setSort] = useState('updated');

  return (
    <div {...stylex.props(s.column)}>
      <RadioGroup label="Sort notes by" value={sort} onChange={setSort} options={sorts} />
      <p {...stylex.props(s.status)}>Sorted by {sorts.find(option => option.value === sort)?.label.toLowerCase()}.</p>
    </div>
  );
}
