'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, Sheet } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-2'], justifyItems: 'center' },
  status: { margin: 0, fontSize: tokens['--os-font-size-caption'], lineHeight: tokens['--os-line-height-sm'], color: tokens['--os-color-fg-muted'] },
  copy: { margin: 0, color: tokens['--os-color-fg-muted'] },
});

export default function SheetControlled() {
  const [isOpen, setOpen] = useState(false);

  return (
    <div {...stylex.props(s.root)}>
      <Button appearance="tertiary" onClick={() => setOpen(true)}>Show deployment</Button>
      <p {...stylex.props(s.status)}>{isOpen ? 'Sheet open' : 'Sheet closed'}</p>
      <Sheet
        isOpen={isOpen}
        onOpenChange={setOpen}
        title="Deployment 214"
        description="Started by Lena 12 minutes ago."
        showCloseButton
      >
        <p {...stylex.props(s.copy)}>Build finished in 48 seconds. All checks passed and traffic moved to the new version.</p>
      </Sheet>
    </div>
  );
}
