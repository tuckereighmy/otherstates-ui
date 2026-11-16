import * as stylex from '@stylexjs/stylex';
import { Avatar } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'flex', gap: t['--os-space-4'] },
});

export default function AvatarStatus() {
  return (
    <div {...stylex.props(s.root)}>
      <Avatar name="Mei Tanaka" status="online" />
      <Avatar name="Rafael Costa" status="away" />
      <Avatar name="Lena Fischer" status="busy" />
      <Avatar name="Kofi Mensah" status="offline" />
    </div>
  );
}
