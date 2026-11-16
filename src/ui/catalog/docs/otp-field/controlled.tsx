'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, OtpField } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', justifyItems: 'start', gap: t['--os-space-3'] },
});

export default function OtpFieldControlled() {
  const [code, setCode] = useState('');

  return (
    <div {...stylex.props(s.root)}>
      <OtpField
        label="Verification code"
        length={4}
        value={code}
        onChange={setCode}
        description={code.length === 4 ? 'Ready to verify.' : `${4 - code.length} digits to go.`}
      />
      <Button appearance="tertiary" size="sm" onClick={() => setCode('')}>
        Clear
      </Button>
    </div>
  );
}
