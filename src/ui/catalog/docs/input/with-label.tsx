'use client';

import * as stylex from '@stylexjs/stylex';
import { useId } from 'react';
import { Input, Label } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-2'], width: 320, maxWidth: '100%' },
});

export default function InputWithLabel() {
  const id = useId();

  return (
    <div {...stylex.props(s.root)}>
      <Label htmlFor={id}>Display name</Label>
      <Input id={id} placeholder="How teammates see you" autoComplete="nickname" />
    </div>
  );
}
