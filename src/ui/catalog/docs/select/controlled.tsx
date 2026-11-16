'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Select } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const plans = [
  { id: 'starter', label: 'Starter', seats: 3, storage: 5 },
  { id: 'team', label: 'Team', seats: 20, storage: 100 },
  { id: 'business', label: 'Business', seats: 100, storage: 500 },
];

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-3'], width: 280, maxWidth: '100%' },
  summary: {
    margin: 0,
    fontSize: tokens['--os-font-size-caption'],
    lineHeight: tokens['--os-line-height-md'],
    color: tokens['--os-color-fg-muted'],
    fontVariantNumeric: 'tabular-nums',
  },
});

export default function SelectControlled() {
  const [planId, setPlanId] = useState<string | null>('team');
  const plan = plans.find(item => item.id === planId);

  return (
    <div {...stylex.props(s.root)}>
      <Select appearance="field" label="Plan" options={plans} value={planId} onChange={setPlanId} />
      <p {...stylex.props(s.summary)}>
        {plan ? `Up to ${plan.seats} seats and ${plan.storage} GB of storage.` : 'No plan chosen.'}
      </p>
    </div>
  );
}
