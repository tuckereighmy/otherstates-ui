'use client';

import * as stylex from '@stylexjs/stylex';
import { useEffect, useState } from 'react';
import { ToastRegion, createToastQueue } from '../../../components';

const s = stylex.create({
  root: { width: 300, maxWidth: '100%' },
});

export default function ToastStacked() {
  const [queue] = useState(() => createToastQueue());
  // Added once the page is up (each toast gets a random key, which a prerendered page can't have); the ids keep a
  // second run of the effect from adding them twice.
  useEffect(() => {
    queue.add({ id: 'uploaded', kind: 'success', title: 'Logo files uploaded', description: 'Saved to Launch week.' }, { timeout: 0 });
    queue.add({ id: 'joined', kind: 'info', title: 'Dele joined the workspace', description: 'They can comment and edit.' }, { timeout: 0 });
    queue.add({ id: 'declined', kind: 'error', title: 'Payment declined', description: 'Try another card.' }, { timeout: 0 });
  }, [queue]);

  return (
    <div {...stylex.props(s.root)}>
      <ToastRegion queue={queue} inline />
    </div>
  );
}
