'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, formatCost, RollingNumber } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'flex', alignItems: 'center', gap: t['--os-space-4'] },
  figure: { fontSize: t['--os-font-size-2xl'], fontWeight: t['--os-font-weight-medium'], letterSpacing: '-0.02em' },
});

export default function RollingNumberDefault() {
  const [cost, setCost] = useState(1.62);
  return (
    <div {...stylex.props(s.row)}>
      <RollingNumber value={formatCost(cost)} {...stylex.props(s.figure)} />
      <Button size="sm" appearance="secondary" onClick={() => setCost(value => value + 0.37)}>Add a step</Button>
      <Button size="sm" appearance="text" onClick={() => setCost(1.62)}>Reset</Button>
    </div>
  );
}
