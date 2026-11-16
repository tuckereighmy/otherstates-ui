'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Composer, type ComposerEffort } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const models = [
  { id: 'quick', label: 'Quick' },
  { id: 'balanced', label: 'Balanced' },
  { id: 'thorough', label: 'Thorough' },
];

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-3'], width: 340, maxWidth: '100%' },
  status: { margin: 0, textAlign: 'center', fontSize: tokens['--os-font-size-xs'], lineHeight: tokens['--os-line-height-xs'], color: tokens['--os-color-fg-muted'] },
});

export default function ComposerModels() {
  const [model, setModel] = useState('balanced');
  const [effort, setEffort] = useState<ComposerEffort>('Low');

  return (
    <div {...stylex.props(s.root)}>
      <Composer models={models} model={model} onModelChange={setModel} effort={effort} onEffortChange={setEffort} onSubmit={() => {}} />
      <p {...stylex.props(s.status)}>Model: {model}, effort: {effort.toLowerCase()}</p>
    </div>
  );
}
