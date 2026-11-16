'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Field, Input } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

const toSlug = (text: string) =>
  text.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default function InputControlled() {
  const [title, setTitle] = useState('Quarterly planning');

  return (
    <div {...stylex.props(s.root)}>
      <Field label="Page title" description={`Address: /notes/${toSlug(title) || 'untitled'}`}>
        <Input value={title} onChange={event => setTitle(event.currentTarget.value)} />
      </Field>
    </div>
  );
}
