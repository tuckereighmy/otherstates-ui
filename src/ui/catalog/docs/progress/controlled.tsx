'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, Progress } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', justifyItems: 'start', gap: t['--os-space-4'], width: 300, maxWidth: '100%' },
});

export default function ProgressControlled() {
  const [done, setDone] = useState(2);

  return (
    <div {...stylex.props(s.root)}>
      <Progress label="Deploying services" value={done} maxValue={5} valueLabel={`${done} of 5 services`} showLabel showValue />
      <Button appearance="tertiary" size="sm" onClick={() => setDone(current => (current === 5 ? 0 : current + 1))}>
        {done === 5 ? 'Start again' : 'Deploy next'}
      </Button>
    </div>
  );
}
