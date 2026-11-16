import * as stylex from '@stylexjs/stylex';
import { Skeleton } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-3'], width: 360, maxWidth: '100%' },
  row: { display: 'flex', gap: t['--os-space-3'] },
});

export default function SkeletonCustomSize() {
  return (
    <div {...stylex.props(s.root)}>
      <Skeleton height={140} radius="lg" />
      <div {...stylex.props(s.row)}>
        <Skeleton height={64} radius="md" />
        <Skeleton height={64} radius="md" />
        <Skeleton height={64} radius="md" />
      </div>
      <Skeleton width={96} height={32} radius="full" />
    </div>
  );
}
