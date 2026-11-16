import * as stylex from '@stylexjs/stylex';
import { Switch } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  column: { display: 'grid', gap: t['--os-space-2'], width: 380, maxWidth: '100%' },
});

export default function SwitchCard() {
  return (
    <div {...stylex.props(s.column)}>
      <Switch
        variant="card"
        label="Branch protection"
        description="Require a review before changes reach the main branch."
        defaultSelected
      />
      <Switch
        variant="card"
        label="Weekly digest"
        description="A summary of activity every Monday morning."
      />
    </div>
  );
}
