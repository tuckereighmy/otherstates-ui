'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Textarea } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function TextareaCharacterCount() {
  const [bio, setBio] = useState('Product designer working on billing and invoices.');

  return (
    <div {...stylex.props(s.root)}>
      <Textarea
        label="Short bio"
        description="Shown on your profile card."
        value={bio}
        onChange={event => setBio(event.currentTarget.value)}
        maxLength={160}
        showCount
      />
    </div>
  );
}
