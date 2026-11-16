import * as stylex from '@stylexjs/stylex';
import { Avatar } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

const s = stylex.create({
  root: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: t['--os-space-3'] },
});

export default function AvatarSizes() {
  return (
    <div {...stylex.props(s.root)}>
      {sizes.map(size => (
        <Avatar key={size} size={size} name="Amara Diallo" />
      ))}
    </div>
  );
}
