'use client';

import * as stylex from '@stylexjs/stylex';
import { ApprovalCard, FileChange, FileChanges } from '../../../components';

const s = stylex.create({ box: { width: '100%', maxWidth: 440 } });

export default function ApprovalCardPermission() {
  return (
    <ApprovalCard
      {...stylex.props(s.box)}
      title="Merge into main"
      description="The fix passed review and all 214 checks. Merging deploys it."
      agent={{ name: 'Coder', icon: 'code', color: 2 }}
      askVerb="wants to merge"
      risk="high"
      scopes={[
        { id: 'once', label: 'Just once' },
        { id: 'hour', label: 'For 1 hour' },
        { id: 'always', label: 'Always' },
      ]}
      approveLabel="Allow"
      onApprove={scope => console.log(scope)}
      onDeny={() => {}}
    >
      <FileChanges aria-label="Changed files">
        <FileChange path="src/checkout/cart.ts" added={12} removed={4} />
        <FileChange path="tests/checkout.test.ts" added={31} removed={2} />
      </FileChanges>
    </ApprovalCard>
  );
}
