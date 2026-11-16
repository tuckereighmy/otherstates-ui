import * as stylex from '@stylexjs/stylex';
import { Switch } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  column: { display: 'grid', gap: t['--os-space-1'] },
});

export default function SwitchSizes() {
  return (
    <div {...stylex.props(s.column)}>
      <Switch size="sm" label="Small" defaultSelected />
      <Switch size="md" label="Medium" defaultSelected />
      <Switch size="lg" label="Large" defaultSelected />
    </div>
  );
}
