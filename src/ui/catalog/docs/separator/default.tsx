import * as stylex from '@stylexjs/stylex';
import { Separator } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  column: { display: 'grid', gap: t['--os-space-3'], width: 240, maxWidth: '100%' },
});

export default function SeparatorDefault() {
  return (
    <div {...stylex.props(s.column)}>
      <span>Profile</span>
      <Separator />
      <span>Notifications</span>
      <Separator />
      <span>Billing</span>
    </div>
  );
}
