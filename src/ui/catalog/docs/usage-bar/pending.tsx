'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, UsageBar } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  column: { display: 'grid', gap: t['--os-space-4'], width: '100%', maxWidth: 340 },
  actions: { display: 'flex', flexWrap: 'wrap', gap: t['--os-space-2'] },
});

export default function UsageBarPending() {
  const [marked, setMarked] = useState(false);
  const [done, setDone] = useState(false);
  return (
    <div {...stylex.props(s.column)}>
      <UsageBar
        label="Rate limit"
        max={1000}
        format={value => `${value}`}
        valueLabel={done ? '420 of 1,000 left' : marked ? '420 left after canceling' : '80 of 1,000 left'}
        segments={[
          { id: 'sync', label: 'Nightly sync', value: 540 },
          { id: 'backfill', label: 'Backfill', value: done ? 0 : 340, pending: marked && !done ? 340 : 0 },
          { id: 'alerts', label: 'Alerts', value: 40 },
        ]}
      />
      <div {...stylex.props(s.actions)}>
        <Button size="sm" appearance="secondary" isDisabled={done} onClick={() => setMarked(value => !value)}>
          {marked ? 'Keep backfill' : 'Mark backfill'}
        </Button>
        <Button size="sm" isDisabled={!marked || done} onClick={() => setDone(true)}>Cancel backfill</Button>
        <Button size="sm" appearance="text" onClick={() => { setMarked(false); setDone(false); }}>Reset</Button>
      </div>
    </div>
  );
}
