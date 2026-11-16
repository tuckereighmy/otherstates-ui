import * as stylex from '@stylexjs/stylex';
import { ApprovalCard } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({ column: { display: 'grid', gap: t['--os-space-4'], width: '100%', maxWidth: 420 } });

export default function ApprovalCardDecided() {
  return (
    <div {...stylex.props(s.column)}>
      <ApprovalCard title="Refund $240 to the customer" risk="medium" status="approved" statusLabel="Approved by Mia at 9:02" />
      <ApprovalCard title="Delete 312 archived projects" risk="high" status="denied" statusLabel="Denied by Jonas at 9:05" />
    </div>
  );
}
