'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { ContextWindow } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const segments = [
  { id: 'conversation', label: 'Conversation', value: 102400 },
  { id: 'files', label: 'Open files', value: 51800 },
  { id: 'instructions', label: 'Instructions', value: 6200 },
];

const s = stylex.create({
  column: { display: 'grid', gap: t['--os-space-3'], width: '100%', maxWidth: 360 },
  note: { margin: 0, color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'] },
});

export default function ContextWindowControlled() {
  const [freed, setFreed] = useState<string[]>([]);
  return (
    <div {...stylex.props(s.column)}>
      <ContextWindow
        model="Large model"
        max={200000}
        segments={segments}
        reclaim={[{ id: 'conversation', to: 22000, action: 'Summarize' }, { id: 'files', action: 'Close' }]}
        freed={freed}
        onFreedChange={setFreed}
      />
      <p {...stylex.props(s.note)}>{freed.length ? `Freed: ${freed.join(', ')}` : 'Nothing freed yet.'}</p>
    </div>
  );
}
