'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, ToastRegion, createToastQueue } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', justifyItems: 'center', gap: t['--os-space-2'], width: 300, maxWidth: '100%' },
});

export default function ToastLoading() {
  const [queue] = useState(() => createToastQueue());

  function exportRows() {
    const key = queue.add({ kind: 'loading', title: 'Exporting 1,240 rows', description: 'You can keep working.' });
    window.setTimeout(() => {
      queue.update(key, { kind: 'success', title: 'Export ready', description: 'contacts.csv is in your downloads.' });
    }, 2000);
  }

  return (
    <div {...stylex.props(s.root)}>
      <ToastRegion queue={queue} inline />
      <Button appearance="secondary" onClick={exportRows}>Export CSV</Button>
    </div>
  );
}
