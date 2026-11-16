'use client';

import * as stylex from '@stylexjs/stylex';
import { DecisionCard } from '../../../components';

const s = stylex.create({ box: { width: '100%', maxWidth: 440 } });

export default function DecisionCardWithoutPick() {
  return (
    <DecisionCard
      {...stylex.props(s.box)}
      question="Who should get the weekly report?"
      options={[
        { id: 'dana', label: 'Dana only' },
        { id: 'team', label: 'The whole team' },
        { id: 'leads', label: 'Team leads' },
      ]}
      submitLabel="Send"
      onSubmit={choice => console.log(choice)}
    />
  );
}
