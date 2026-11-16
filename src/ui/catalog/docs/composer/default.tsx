'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Composer } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-3'], width: 340, maxWidth: '100%' },
  status: {
    margin: 0, minHeight: 16, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'center',
    fontSize: tokens['--os-font-size-xs'], lineHeight: tokens['--os-line-height-xs'], color: tokens['--os-color-fg-muted'],
  },
});

export default function ComposerDefault() {
  const [sent, setSent] = useState('');

  return (
    <div {...stylex.props(s.root)}>
      <Composer onSubmit={message => setSent(`Sent “${message}”`)} />
      <p role="status" {...stylex.props(s.status)}>{sent}</p>
    </div>
  );
}
