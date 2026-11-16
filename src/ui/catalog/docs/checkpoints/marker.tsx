'use client';

import * as stylex from '@stylexjs/stylex';
import { CheckpointMarker } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  thread: { display: 'grid', gap: t['--os-space-4'], width: '100%', maxWidth: 520, marginInline: 'auto' },
  message: { margin: 0, color: t['--os-color-fg-base'], fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'] },
});

export default function CheckpointsMarker() {
  return (
    <div {...stylex.props(s.thread)}>
      <p {...stylex.props(s.message)}>I found the crash: the cart total is read before the cart exists.</p>
      <CheckpointMarker checkpoint={{ id: 'c2', label: 'Before "Guard the empty cart"', time: '2:09 PM', undoes: { files: 3, messages: 3 } }} onRestore={() => {}} />
      <p {...stylex.props(s.message)}>I added a guard and two tests. All 214 tests pass.</p>
    </div>
  );
}
