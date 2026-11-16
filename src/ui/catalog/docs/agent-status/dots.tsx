import * as stylex from '@stylexjs/stylex';
import { StatusDot } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  list: { display: 'grid', gap: t['--os-space-3'], margin: 0, padding: 0, listStyleType: 'none' },
  row: { display: 'flex', alignItems: 'center', gap: t['--os-space-2'], fontSize: t['--os-font-size-sm'] },
});

export default function AgentStatusDots() {
  return (
    <ul {...stylex.props(s.list)}>
      <li {...stylex.props(s.row)}><StatusDot state="running" /> Indexing the help center</li>
      <li {...stylex.props(s.row)}><StatusDot state="needs-input" /> Waiting for a refund approval</li>
      <li {...stylex.props(s.row)}><StatusDot state="done" /> Weekly digest sent</li>
      <li {...stylex.props(s.row)}><StatusDot state="queued" /> Translate the release notes</li>
    </ul>
  );
}
