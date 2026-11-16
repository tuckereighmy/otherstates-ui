import * as stylex from '@stylexjs/stylex';
import { Skeleton } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-4'], width: 360, maxWidth: '100%' },
  row: { display: 'flex', alignItems: 'center', gap: t['--os-space-3'] },
});

export default function SkeletonShapes() {
  return (
    <div {...stylex.props(s.root)}>
      <Skeleton shape="image" ratio="16:9" radius="lg" />
      <div {...stylex.props(s.row)}>
        <Skeleton shape="circle" size="sm" />
        <Skeleton width="50%" />
      </div>
      <Skeleton lines={2} />
      <Skeleton width={120} height={40} radius="full" />
    </div>
  );
}
