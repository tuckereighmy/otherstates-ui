'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, ToastRegion, createToastQueue } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', justifyItems: 'center', gap: t['--os-space-2'], width: 300, maxWidth: '100%' },
});

function publish() {
  return new Promise<string>(resolve => window.setTimeout(() => resolve('v2.4'), 1600));
}

export default function ToastPromise() {
  const [queue] = useState(() => createToastQueue());

  return (
    <div {...stylex.props(s.root)}>
      <ToastRegion queue={queue} inline />
      <Button
        appearance="secondary"
        onClick={() => queue.promise(publish(), {
          loading: { title: 'Publishing release' },
          success: version => ({ title: `Release ${version} is live` }),
          error: { title: 'Release failed', description: 'Nothing was changed.' },
        })}
      >
        Publish release
      </Button>
    </div>
  );
}
