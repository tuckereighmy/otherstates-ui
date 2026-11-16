import * as stylex from '@stylexjs/stylex';
import { AgentGlyph } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({ row: { display: 'flex', alignItems: 'center', gap: t['--os-space-3'] } });

export default function AgentIdentityGlyphs() {
  return (
    <div {...stylex.props(s.row)}>
      <AgentGlyph name="Triage" size="xs" />
      <AgentGlyph name="Triage" size="sm" />
      <AgentGlyph name="Triage" size="md" icon="inbox" />
      <AgentGlyph name="Triage" size="lg" icon="inbox" state="running" />
    </div>
  );
}
