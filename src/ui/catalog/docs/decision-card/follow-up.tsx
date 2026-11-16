'use client';

import * as stylex from '@stylexjs/stylex';
import { DecisionCard } from '../../../components';

const s = stylex.create({ box: { width: '100%', maxWidth: 460 } });

export default function DecisionCardFollowUp() {
  return (
    <DecisionCard
      {...stylex.props(s.box)}
      question="Errors jumped to 18% after the last deploy. What should I do?"
      context="2,140 failed checkouts in 12 minutes."
      risk="high"
      position="1 of 3"
      options={[
        {
          id: 'rollback', label: 'Roll back the deploy', recommended: true,
          followUp: {
            question: 'Tell customers?',
            options: [
              { id: 'status', label: 'Post on the status page', recommended: true },
              { id: 'team', label: 'Tell the team only' },
            ],
          },
        },
        { id: 'hotfix', label: 'Ship a fix forward', description: 'About 20 minutes, errors continue meanwhile.' },
      ]}
      onSubmit={path => console.log(path)}
      onLater={() => {}}
    />
  );
}
