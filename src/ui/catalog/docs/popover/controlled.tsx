'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, Popover, RadioGroup } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-2'], justifyItems: 'center' },
  status: { margin: 0, fontSize: tokens['--os-font-size-caption'], lineHeight: tokens['--os-line-height-sm'], color: tokens['--os-color-fg-muted'] },
});

const sorts = [
  { value: 'updated', label: 'Last updated' },
  { value: 'name', label: 'Name' },
];

export default function PopoverControlled() {
  const [isOpen, setOpen] = useState(false);
  const [sort, setSort] = useState('updated');

  return (
    <div {...stylex.props(s.root)}>
      <Popover isOpen={isOpen} onOpenChange={setOpen} trigger={<Button appearance="tertiary">Sort</Button>} title="Sort projects">
        <RadioGroup aria-label="Sort by" name="sort" value={sort} onChange={value => { setSort(value); setOpen(false); }} options={sorts} />
      </Popover>
      <p {...stylex.props(s.status)}>Sorted by {sort === 'name' ? 'name' : 'last updated'}</p>
    </div>
  );
}
