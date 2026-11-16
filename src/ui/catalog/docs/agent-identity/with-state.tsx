import * as stylex from '@stylexjs/stylex';
import { AgentIdentity, StatusBadge } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({ column: { display: 'grid', gap: t['--os-space-4'], width: '100%', maxWidth: 320 } });

export default function AgentIdentityWithState() {
  return (
    <div {...stylex.props(s.column)}>
      <AgentIdentity name="Support lead" model="Large model" icon="message" state="running" end={<StatusBadge state="running" />} />
      <AgentIdentity name="Billing" model="Fast model" icon="credit-card" state="needs-input" end={<StatusBadge state="needs-input" />} />
    </div>
  );
}
