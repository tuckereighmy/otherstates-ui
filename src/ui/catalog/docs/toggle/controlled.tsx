'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Icon, Toggle } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  column: { display: 'grid', justifyItems: 'center', gap: tokens['--os-space-3'] },
  status: { margin: 0, color: tokens['--os-color-fg-muted'], fontSize: tokens['--os-font-size-caption'] },
});

export default function ToggleControlled() {
  const [isMuted, setMuted] = useState(false);

  return (
    <div {...stylex.props(s.column)}>
      <Toggle variant="outline" isSelected={isMuted} onChange={setMuted}>
        <Icon name="volume" />
        Mute thread
      </Toggle>
      <p {...stylex.props(s.status)}>{isMuted ? 'You will not get updates from this thread.' : 'You get an update for every reply.'}</p>
    </div>
  );
}
