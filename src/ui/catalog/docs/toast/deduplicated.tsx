'use client';

import * as stylex from '@stylexjs/stylex';
import { useRef, useState } from 'react';
import { Button, ToastRegion, createToastQueue } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', justifyItems: 'center', gap: t['--os-space-2'], width: 300, maxWidth: '100%' },
});

export default function ToastDeduplicated() {
  const [queue] = useState(() => createToastQueue());
  const count = useRef(0);

  function sync() {
    count.current += 1;
    queue.add({
      id: 'sync',
      kind: 'success',
      title: 'Calendar synced',
      description: `Synced ${count.current} ${count.current === 1 ? 'time' : 'times'} this session.`,
    });
  }

  return (
    <div {...stylex.props(s.root)}>
      <ToastRegion queue={queue} inline />
      <Button appearance="secondary" onClick={sync}>Sync now</Button>
    </div>
  );
}
