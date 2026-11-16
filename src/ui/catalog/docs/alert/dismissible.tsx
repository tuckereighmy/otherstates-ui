'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Alert, Button } from '../../../components';

const s = stylex.create({
  root: { display: 'grid', justifyItems: 'center', width: 380, maxWidth: '100%' },
});

export default function AlertDismissible() {
  const [open, setOpen] = useState(true);

  return (
    <div {...stylex.props(s.root)}>
      {open ? (
        <Alert
          tone="info"
          heading="Two-step sign-in is available"
          onDismiss={() => setOpen(false)}
        >
          Turn it on in Settings to protect your account.
        </Alert>
      ) : (
        <Button appearance="secondary" size="sm" onClick={() => setOpen(true)}>
          Show the alert again
        </Button>
      )}
    </div>
  );
}
