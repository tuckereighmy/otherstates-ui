import * as stylex from '@stylexjs/stylex';
import { Avatar } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'flex', gap: t['--os-space-3'] },
});

export default function AvatarFallbacks() {
  return (
    <div {...stylex.props(s.root)}>
      <Avatar name="Dele Adeyemi" fallback="initial" />
      <Avatar name="Dele Adeyemi" fallback="gradient" />
      <Avatar fallback="icon" />
    </div>
  );
}
