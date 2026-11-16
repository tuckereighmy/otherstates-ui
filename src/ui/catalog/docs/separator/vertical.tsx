import * as stylex from '@stylexjs/stylex';
import { Separator } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'flex', alignItems: 'center', gap: t['--os-space-3'], height: 24 },
});

export default function SeparatorVertical() {
  return (
    <div {...stylex.props(s.row)}>
      <span>Overview</span>
      <Separator orientation="vertical" />
      <span>Activity</span>
      <Separator orientation="vertical" />
      <span>Settings</span>
    </div>
  );
}
