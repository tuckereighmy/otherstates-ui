'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, ToastRegion, createToastQueue } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', justifyItems: 'center', gap: t['--os-space-2'], width: 300, maxWidth: '100%' },
});

export default function ToastWithAction() {
  const [queue] = useState(() => createToastQueue());
  const [archived, setArchived] = useState(false);

  function archive() {
    setArchived(true);
    queue.add({
      title: 'Note archived',
      action: { label: 'Undo', onAction: () => setArchived(false) },
    });
  }

  return (
    <div {...stylex.props(s.root)}>
      <ToastRegion queue={queue} inline />
      <Button appearance="secondary" isDisabled={archived} onClick={archive}>
        {archived ? 'Archived' : 'Archive note'}
      </Button>
    </div>
  );
}
