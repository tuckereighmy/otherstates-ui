'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Alert, Button } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', justifyItems: 'start', gap: t['--os-space-3'], width: 380, maxWidth: '100%' },
});

export default function AlertAnnounced() {
  const [checked, setChecked] = useState(false);

  return (
    <div {...stylex.props(s.root)}>
      <Button appearance="secondary" size="sm" onClick={() => setChecked(true)}>
        Check domain
      </Button>
      {checked && (
        <Alert tone="success" announce="polite" heading="Domain verified">
          notes.example.com now points to your workspace.
        </Alert>
      )}
    </div>
  );
}
