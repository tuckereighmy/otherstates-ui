'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, ToastRegion, createToastQueue } from '../../../components';
import type { ToastMessage } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const messages: ToastMessage[] = [
  { kind: 'success', title: 'Invoice paid', description: 'INV-2041 was paid in full.' },
  { kind: 'info', title: 'New sign-in', description: 'A new device signed in to your account.' },
  { kind: 'warning', title: 'Storage almost full', description: '92% of your plan is in use.' },
  { kind: 'error', title: 'Upload failed', description: 'The file is larger than 10 MB.' },
];

const s = stylex.create({
  root: { display: 'grid', justifyItems: 'center', gap: t['--os-space-2'], width: 300, maxWidth: '100%' },
  buttons: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: t['--os-space-2'] },
});

export default function ToastWithStatus() {
  const [queue] = useState(() => createToastQueue());

  return (
    <div {...stylex.props(s.root)}>
      <ToastRegion queue={queue} inline />
      <div {...stylex.props(s.buttons)}>
        {messages.map(message => (
          <Button key={message.kind} appearance="secondary" size="sm" onClick={() => queue.add(message)}>
            {message.title}
          </Button>
        ))}
      </div>
    </div>
  );
}
