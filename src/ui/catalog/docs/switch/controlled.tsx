'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Switch } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  column: { display: 'grid', gap: tokens['--os-space-2'] },
  status: {
    margin: 0,
    color: tokens['--os-color-fg-muted'],
    fontSize: tokens['--os-font-size-caption'],
    lineHeight: tokens['--os-line-height-md'],
  },
});

export default function SwitchControlled() {
  const [paused, setPaused] = useState(false);

  return (
    <div {...stylex.props(s.column)}>
      <Switch label="Pause deployments" isSelected={paused} onChange={setPaused} />
      <p {...stylex.props(s.status)}>{paused ? 'New commits wait in the queue.' : 'Every commit deploys.'}</p>
    </div>
  );
}
