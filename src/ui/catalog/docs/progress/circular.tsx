import * as stylex from '@stylexjs/stylex';
import { Progress } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: t['--os-space-8'] },
});

export default function ProgressCircular() {
  return (
    <div {...stylex.props(s.root)}>
      <Progress variant="circular" label="Profile complete" value={75} showValue />
      <Progress variant="circular" size="sm" label="Syncing" isIndeterminate />
    </div>
  );
}
