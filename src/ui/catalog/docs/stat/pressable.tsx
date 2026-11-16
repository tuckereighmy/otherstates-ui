'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Stat } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'grid', gap: t['--os-space-4'], gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', width: '100%' },
  note: { margin: 0, color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-sm'] },
});

export default function StatPressable() {
  const [opened, setOpened] = useState('nothing yet');
  return (
    <div {...stylex.props(s.row)}>
      <Stat label="Running" value="4" unit="runs" caption="1 queued" onPress={() => setOpened('the running runs')} />
      <Stat label="Failed today" value="2" change={{ label: '1', direction: 'up', good: false, against: 'than yesterday' }} onPress={() => setOpened('the failed runs')} />
      <p {...stylex.props(s.note)} role="status">Opened: {opened}</p>
    </div>
  );
}
