import * as stylex from '@stylexjs/stylex';
import { StatusBadge, StatusDot } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({ row: { display: 'flex', alignItems: 'center', gap: t['--os-space-3'] } });

export default function AgentStatusSizes() {
  return (
    <div {...stylex.props(s.row)}>
      <StatusBadge state="running" size="sm" />
      <StatusBadge state="running" size="md" />
      <StatusBadge state="running" size="lg" />
      <StatusDot state="running" size="sm" label="Running" />
      <StatusDot state="running" size="md" label="Running" />
    </div>
  );
}
