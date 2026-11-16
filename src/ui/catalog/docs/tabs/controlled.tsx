'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, Tabs } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const items = [
  { id: 'details', label: 'Details', content: 'Name the deployment and pick a branch.' },
  { id: 'variables', label: 'Variables', content: 'Three variables are set for production.' },
  { id: 'review', label: 'Review', content: 'Everything is ready to ship.' },
];

const s = stylex.create({
  frame: { display: 'grid', justifyItems: 'start', gap: t['--os-space-2'], width: '100%', maxWidth: 480 },
});

export default function TabsControlled() {
  const [step, setStep] = useState('details');
  const next = items[items.findIndex(item => item.id === step) + 1];
  return (
    <div {...stylex.props(s.frame)}>
      <Tabs label="New deployment" items={items} selectedKey={step} onSelectionChange={setStep} />
      <Button size="sm" appearance="secondary" isDisabled={!next} onClick={() => next && setStep(next.id)}>
        Next step
      </Button>
    </div>
  );
}
