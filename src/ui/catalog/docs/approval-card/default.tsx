'use client';

import * as stylex from '@stylexjs/stylex';
import { ApprovalCard } from '../../../components';

const s = stylex.create({ box: { width: '100%', maxWidth: 420 } });

export default function ApprovalCardDefault() {
  return (
    <ApprovalCard
      {...stylex.props(s.box)}
      title="Send the October newsletter"
      description="The draft is ready and the test send looked right."
      agent={{ name: 'Newsletter agent', icon: 'mail' }}
      askVerb="wants to send it"
      risk="medium"
      details={[
        { label: 'Recipients', value: '1,284' },
        { label: 'List', value: 'Monthly update' },
        { label: 'Sends', value: 'Today, 9:00' },
      ]}
      onApprove={() => {}}
      onDeny={() => {}}
    />
  );
}
