import * as stylex from '@stylexjs/stylex';
import { Skeleton } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-5'], width: 360, maxWidth: '100%' },
});

export default function SkeletonTextLines() {
  return (
    <div {...stylex.props(s.root)}>
      <Skeleton width="55%" height={24} />
      <Skeleton lines={4} />
    </div>
  );
}
