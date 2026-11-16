import * as stylex from '@stylexjs/stylex';
import { Avatar } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const sizes = ['sm', 'md', 'xl'] as const;

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-4'] },
  row: { display: 'flex', alignItems: 'center', gap: t['--os-space-3'] },
});

export default function AvatarShapes() {
  return (
    <div {...stylex.props(s.root)}>
      <div {...stylex.props(s.row)}>
        {sizes.map(size => <Avatar key={size} size={size} name="Ines Okafor" fallback="gradient" />)}
      </div>
      <div {...stylex.props(s.row)}>
        {sizes.map(size => <Avatar key={size} size={size} shape="square" name="Ines Okafor" fallback="gradient" />)}
      </div>
    </div>
  );
}
