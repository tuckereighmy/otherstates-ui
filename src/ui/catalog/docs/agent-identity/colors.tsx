import * as stylex from '@stylexjs/stylex';
import { AgentIdentity } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const crew = [
  { name: 'Planner', model: 'Large model', icon: 'list', color: 1 },
  { name: 'Researcher', model: 'Standard model', icon: 'search', color: 2 },
  { name: 'Writer', model: 'Standard model', icon: 'edit', color: 3 },
  { name: 'Reviewer', model: 'Large model', icon: 'eye', color: 4 },
] as const;

const s = stylex.create({ grid: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 160px))', gap: t['--os-space-4'] } });

export default function AgentIdentityColors() {
  return (
    <div {...stylex.props(s.grid)}>
      {crew.map(agent => <AgentIdentity key={agent.name} {...agent} />)}
    </div>
  );
}
