import * as stylex from '@stylexjs/stylex';
import { Avatar } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'flex', gap: t['--os-space-3'] },
});

export default function AvatarDefault() {
  return (
    <div {...stylex.props(s.root)}>
      <Avatar name="Hana Sato" />
      <Avatar name="Arjun Mehta" />
      <Avatar name="Omar Farouk" />
    </div>
  );
}
