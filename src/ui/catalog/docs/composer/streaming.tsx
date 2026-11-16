'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Composer, type ComposerStatus } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-3'], width: 340, maxWidth: '100%' },
  status: { margin: 0, minHeight: 16, textAlign: 'center', fontSize: tokens['--os-font-size-xs'], lineHeight: tokens['--os-line-height-xs'], color: tokens['--os-color-fg-muted'] },
});

export default function ComposerStreaming() {
  const [status, setStatus] = useState<ComposerStatus>('streaming');

  return (
    <div {...stylex.props(s.root)}>
      <Composer status={status} onStop={() => setStatus('idle')} onSubmit={() => setStatus('streaming')} />
      <p role="status" {...stylex.props(s.status)}>{status === 'streaming' ? 'Writing a reply' : 'Reply stopped'}</p>
    </div>
  );
}
