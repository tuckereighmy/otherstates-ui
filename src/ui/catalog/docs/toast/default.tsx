'use client';

import * as stylex from '@stylexjs/stylex';
import { useEffect, useState } from 'react';
import { Button, ToastRegion, createToastQueue } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', justifyItems: 'center', gap: t['--os-space-2'], width: 300, maxWidth: '100%' },
});

export default function ToastDefault() {
  const [queue] = useState(() => createToastQueue());
  // The first toast is added once the page is up: the queue gives every toast a random key, which a prerendered
  // page (Next.js) can't have. Its id keeps a second run of the effect from adding it twice.
  useEffect(() => {
    queue.add({ id: 'saved', title: 'Changes saved', description: 'Your draft is up to date.', kind: 'success' });
  }, [queue]);

  return (
    <div {...stylex.props(s.root)}>
      <ToastRegion queue={queue} inline />
      <Button
        appearance="secondary"
        onClick={() => queue.add({ title: 'Changes saved', description: 'Your draft is up to date.', kind: 'success' })}
      >
        Save changes
      </Button>
    </div>
  );
}
