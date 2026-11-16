'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Checkbox } from '../../../components';
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

export default function CheckboxControlled() {
  const [pinned, setPinned] = useState(false);

  return (
    <div {...stylex.props(s.column)}>
      <Checkbox label="Pin this note" isSelected={pinned} onChange={setPinned} />
      <p {...stylex.props(s.status)}>{pinned ? 'Shown at the top of the list.' : 'Sorted by date.'}</p>
    </div>
  );
}
