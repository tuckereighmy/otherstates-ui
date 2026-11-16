'use client';

import * as stylex from '@stylexjs/stylex';
import { DecisionCard } from '../../../components';

const s = stylex.create({ box: { width: '100%', maxWidth: 440 } });

export default function DecisionCardDefault() {
  return (
    <DecisionCard
      {...stylex.props(s.box)}
      question="Which queue should the import service use?"
      context="It gets about 40,000 events an hour, with bursts after each nightly sync."
      agent={{ name: 'Platform agent', icon: 'layers' }}
      options={[
        { id: 'log', label: 'Durable log', description: 'Keeps a day of events to replay after a bad deploy.', recommended: true },
        { id: 'managed', label: 'Managed queue', description: 'Nothing to run, but no replay.' },
        { id: 'database', label: 'Database table', description: 'Uses what exists today; slows down in bursts.' },
      ]}
      onSubmit={choice => console.log(choice)}
      onLater={() => {}}
    />
  );
}
