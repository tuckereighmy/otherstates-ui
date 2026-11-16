import * as stylex from '@stylexjs/stylex';
import { Switch } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  column: { display: 'grid', gap: t['--os-space-1'] },
});

export default function SwitchDisabled() {
  return (
    <div {...stylex.props(s.column)}>
      <Switch label="Maintenance mode" isDisabled />
      <Switch label="Encrypted backups" isDisabled defaultSelected />
    </div>
  );
}
