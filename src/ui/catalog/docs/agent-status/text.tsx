import * as stylex from '@stylexjs/stylex';
import { RiskBadge, StatusBadge } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({ row: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: t['--os-space-5'] } });

export default function AgentStatusText() {
  return (
    <div {...stylex.props(s.row)}>
      <StatusBadge appearance="text" state="running" />
      <StatusBadge appearance="text" state="needs-input" />
      <StatusBadge appearance="text" state="failed" />
      <StatusBadge appearance="text" state="done" />
      <RiskBadge appearance="text" risk="high" />
    </div>
  );
}
