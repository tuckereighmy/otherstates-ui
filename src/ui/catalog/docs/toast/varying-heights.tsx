'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, ToastRegion, createToastQueue } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', justifyItems: 'center', gap: t['--os-space-2'], width: 300, maxWidth: '100%' },
  buttons: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: t['--os-space-2'] },
});

export default function ToastVaryingHeights() {
  const [queue] = useState(() => createToastQueue());

  return (
    <div {...stylex.props(s.root)}>
      <ToastRegion queue={queue} inline />
      <div {...stylex.props(s.buttons)}>
        <Button appearance="secondary" size="sm" onClick={() => queue.add({ title: 'Link copied' })}>
          Short
        </Button>
        <Button
          appearance="secondary"
          size="sm"
          onClick={() => queue.add({
            kind: 'info',
            title: 'Weekly report scheduled',
            description: 'It goes to the whole design team every Monday at 9:00, starting next week, with the open tasks attached.',
          })}
        >
          Long
        </Button>
      </div>
    </div>
  );
}
