'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { AlertDialog, Button } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-2'], justifyItems: 'center' },
  status: { margin: 0, fontSize: tokens['--os-font-size-caption'], lineHeight: tokens['--os-line-height-sm'], color: tokens['--os-color-fg-muted'] },
});

export default function AlertDialogControlled() {
  const [isOpen, setOpen] = useState(false);
  const [status, setStatus] = useState('Jonas is a member');

  return (
    <div {...stylex.props(s.root)}>
      <Button appearance="tertiary" onClick={() => setOpen(true)}>Remove Jonas</Button>
      <p role="status" {...stylex.props(s.status)}>{status}</p>
      <AlertDialog
        isOpen={isOpen}
        onOpenChange={setOpen}
        isDismissable
        title="Remove Jonas from the team?"
        description="He loses access to the team’s projects. Press the backdrop to cancel."
        confirmLabel="Remove"
        destructive
        onConfirm={() => setStatus('Jonas was removed')}
        onCancel={() => setStatus('Jonas is still a member')}
      />
    </div>
  );
}
