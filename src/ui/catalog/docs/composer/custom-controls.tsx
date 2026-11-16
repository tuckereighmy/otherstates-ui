'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, Composer, Icon } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-3'], width: 340, maxWidth: '100%' },
  status: { margin: 0, minHeight: 16, textAlign: 'center', fontSize: tokens['--os-font-size-xs'], lineHeight: tokens['--os-line-height-xs'], color: tokens['--os-color-fg-muted'] },
});

export default function ComposerCustomControls() {
  const [status, setStatus] = useState('');

  return (
    <div {...stylex.props(s.root)}>
      <Composer
        placeholder="Add a note"
        submitLabel="Post note"
        showModel={false}
        showEffort={false}
        actions={
          <>
            <Button appearance="text" size="sm" iconOnly aria-label="Add a photo" onClick={() => setStatus('Photo picker opened')}>
              <Icon name="image" />
            </Button>
            <Button appearance="text" size="sm" iconOnly aria-label="Insert a link" onClick={() => setStatus('Link field opened')}>
              <Icon name="link" />
            </Button>
          </>
        }
        onSubmit={note => setStatus(`Posted “${note}”`)}
      />
      <p role="status" {...stylex.props(s.status)}>{status}</p>
    </div>
  );
}
