import * as stylex from '@stylexjs/stylex';
import { Progress } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-5'], width: 300, maxWidth: '100%' },
});

export default function ProgressTones() {
  return (
    <div {...stylex.props(s.root)}>
      <Progress label="Onboarding" value={70} tone="brand" showLabel showValue />
      <Progress label="Tests passed" value={100} tone="success" showLabel showValue />
      <Progress label="Build minutes used" value={86} tone="warning" showLabel showValue />
      <Progress label="Failed uploads" value={20} tone="error" showLabel showValue />
    </div>
  );
}
