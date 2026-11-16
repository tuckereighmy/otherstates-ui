import * as stylex from '@stylexjs/stylex';
import { Skeleton } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'flex', alignItems: 'center', gap: t['--os-space-3'], width: 320, maxWidth: '100%' },
  text: { flex: 1, minWidth: 0 },
});

export default function SkeletonDefault() {
  return (
    <div aria-busy="true" {...stylex.props(s.root)}>
      <Skeleton shape="circle" />
      <div {...stylex.props(s.text)}>
        <Skeleton width="40%" />
        <Skeleton />
      </div>
    </div>
  );
}
