'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { AlertDialog, Button } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-2'], justifyItems: 'center' },
  status: { margin: 0, fontSize: tokens['--os-font-size-caption'], lineHeight: tokens['--os-line-height-sm'], color: tokens['--os-color-fg-muted'] },
});

export default function AlertDialogDefault() {
  const [deleted, setDeleted] = useState(false);

  return (
    <div {...stylex.props(s.root)}>
      <AlertDialog
        trigger={<Button appearance="destructive-outline">Delete draft</Button>}
        title="Delete this draft?"
        description="This permanently removes the draft from your workspace."
        confirmLabel="Delete draft"
        destructive
        onConfirm={() => setDeleted(true)}
      />
      {deleted && <p role="status" {...stylex.props(s.status)}>Draft deleted</p>}
    </div>
  );
}
