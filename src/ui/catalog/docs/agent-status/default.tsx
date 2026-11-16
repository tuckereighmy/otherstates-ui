import * as stylex from '@stylexjs/stylex';
import { StatusBadge, type AgentState } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const states: AgentState[] = ['running', 'needs-input', 'failed', 'done', 'queued', 'paused', 'idle', 'skipped', 'canceled'];

const s = stylex.create({
  row: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: t['--os-space-2'], maxWidth: 440 },
});

export default function AgentStatusDefault() {
  return (
    <div {...stylex.props(s.row)}>
      {states.map(state => <StatusBadge key={state} state={state} />)}
    </div>
  );
}
