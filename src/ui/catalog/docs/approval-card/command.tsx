'use client';

import * as stylex from '@stylexjs/stylex';
import { ApprovalCard } from '../../../components';

const s = stylex.create({ box: { width: '100%', maxWidth: 460 } });

export default function ApprovalCardCommand() {
  return (
    <ApprovalCard
      {...stylex.props(s.box)}
      title="Run the staging migration"
      description="Splits users into accounts and profiles. The dry run passed."
      agent={{ name: 'Data agent', icon: 'layers' }}
      askVerb="wants to run a command"
      risk="high"
      tool="bash"
      command="npm run db:migrate -- --env staging --step 0042_split_users"
      scopes={[{ id: 'once', label: 'Just once' }, { id: 'session', label: 'This session' }]}
      approveLabel="Run it"
      onApprove={() => {}}
      onDeny={() => {}}
    />
  );
}
