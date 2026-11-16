import * as stylex from '@stylexjs/stylex';
import { Switch } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  column: { display: 'grid', justifyItems: 'start', gap: t['--os-space-3'] },
});

export default function SwitchStretchSizes() {
  return (
    <div {...stylex.props(s.column)}>
      <Switch appearance="stretch" size="sm" label="Small" defaultSelected />
      <Switch appearance="stretch" size="md" label="Medium" defaultSelected />
      <Switch appearance="stretch" label="Large, the default" defaultSelected />
    </div>
  );
}
