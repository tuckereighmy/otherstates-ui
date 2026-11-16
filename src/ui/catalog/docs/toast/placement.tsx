'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, ToastRegion, createToastQueue } from '../../../components';
import type { ToastPlacement } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const placements: { value: ToastPlacement; label: string }[] = [
  { value: 'top-start', label: 'Top start' },
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'bottom-end', label: 'Bottom end' },
];

const s = stylex.create({
  root: { display: 'grid', justifyItems: 'center', gap: t['--os-space-2'], width: 320, maxWidth: '100%' },
  buttons: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: t['--os-space-2'] },
});

export default function ToastPlacementExample() {
  const [queue] = useState(() => createToastQueue());
  const [placement, setPlacement] = useState<ToastPlacement>('bottom-end');

  return (
    <div {...stylex.props(s.root)}>
      <ToastRegion queue={queue} inline placement={placement} />
      <div {...stylex.props(s.buttons)}>
        {placements.map(({ value, label }) => (
          <Button
            key={value}
            appearance="secondary"
            size="sm"
            onClick={() => { setPlacement(value); queue.add({ title: `${label} placement` }); }}
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}
