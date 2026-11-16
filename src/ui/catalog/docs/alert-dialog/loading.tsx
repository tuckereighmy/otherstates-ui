'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { AlertDialog, Button } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-2'], justifyItems: 'center' },
  status: { margin: 0, fontSize: tokens['--os-font-size-caption'], lineHeight: tokens['--os-line-height-sm'], color: tokens['--os-color-fg-muted'] },
});

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function AlertDialogLoading() {
  const [status, setStatus] = useState('2 active sessions');

  return (
    <div {...stylex.props(s.root)}>
      <AlertDialog
        trigger={<Button appearance="tertiary">Sign out everywhere</Button>}
        title="Sign out of every device?"
        description="You will need to sign in again on each device."
        confirmLabel="Sign out"
        destructive
        onConfirm={async () => {
          await wait(1500);
          setStatus('No active sessions');
        }}
      />
      <p role="status" {...stylex.props(s.status)}>{status}</p>
    </div>
  );
}
