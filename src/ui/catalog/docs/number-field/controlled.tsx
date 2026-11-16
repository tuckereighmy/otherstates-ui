'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, NumberField } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'flex', alignItems: 'flex-end', gap: t['--os-space-2'], width: 300, maxWidth: '100%' },
});

export default function NumberFieldControlled() {
  const [copies, setCopies] = useState(1);

  return (
    <div {...stylex.props(s.root)}>
      <NumberField label="Copies" value={copies} onChange={setCopies} minValue={1} maxValue={99} />
      <Button appearance="tertiary" onClick={() => setCopies(1)}>
        Reset
      </Button>
    </div>
  );
}
