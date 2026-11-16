'use client';

import * as stylex from '@stylexjs/stylex';
import { useEffect, useState } from 'react';
import { Button, Reasoning } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({ column: { display: 'grid', gap: t['--os-space-4'], width: '100%', maxWidth: 480, justifyItems: 'start' } });

export default function ReasoningDefault() {
  const [thinking, setThinking] = useState(true);
  useEffect(() => { if (!thinking) return; const id = window.setTimeout(() => setThinking(false), 2400); return () => window.clearTimeout(id); }, [thinking]);
  return (
    <div {...stylex.props(s.column)}>
      <Reasoning streaming={thinking} duration={2400}>
        The error reads cart.total before the cart exists. Reproduce it first, then read how the summary is built.
      </Reasoning>
      <Button size="sm" appearance="secondary" onClick={() => setThinking(true)}>Think again</Button>
    </div>
  );
}
