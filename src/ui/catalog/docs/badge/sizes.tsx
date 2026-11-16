import * as stylex from '@stylexjs/stylex';
import { Badge } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: t['--os-space-2'] },
});

export default function BadgeSizes() {
  return (
    <div {...stylex.props(s.row)}>
      <Badge size="sm" variant="secondary">Small</Badge>
      <Badge size="md" variant="secondary">Medium</Badge>
      <Badge size="lg" variant="secondary">Large</Badge>
    </div>
  );
}
