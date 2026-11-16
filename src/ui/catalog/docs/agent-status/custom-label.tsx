import * as stylex from '@stylexjs/stylex';
import { StatusBadge } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({ row: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: t['--os-space-2'] } });

export default function AgentStatusCustomLabel() {
  return (
    <div {...stylex.props(s.row)}>
      <StatusBadge state="running">Editing invoice.ts</StatusBadge>
      <StatusBadge state="needs-input">2 approvals</StatusBadge>
      <StatusBadge state="done">Step 5 of 5</StatusBadge>
    </div>
  );
}
