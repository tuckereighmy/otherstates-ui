'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, formatTokens, RollingNumber } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'flex', alignItems: 'center', gap: t['--os-space-4'] },
  figure: { fontSize: t['--os-font-size-xl'], fontWeight: t['--os-font-weight-medium'], letterSpacing: '-0.02em' },
});

const steps = [24400, 102600, 980000, 1300000];

export default function RollingNumberUnits() {
  const [step, setStep] = useState(0);
  return (
    <div {...stylex.props(s.row)}>
      <RollingNumber value={formatTokens(steps[step])} {...stylex.props(s.figure)} />
      <Button size="sm" appearance="secondary" onClick={() => setStep(value => (value + 1) % steps.length)}>Next</Button>
    </div>
  );
}
