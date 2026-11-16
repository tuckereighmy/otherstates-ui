import * as stylex from '@stylexjs/stylex';
import { Progress } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-5'], width: 300, maxWidth: '100%' },
});

export default function ProgressSizes() {
  return (
    <div {...stylex.props(s.root)}>
      <Progress label="Small" size="sm" value={40} showLabel />
      <Progress label="Medium" value={60} showLabel />
      <Progress label="Large" size="lg" value={80} showLabel />
    </div>
  );
}
