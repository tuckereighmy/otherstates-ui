import * as stylex from '@stylexjs/stylex';
import { RadioGroup } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'flex', flexWrap: 'wrap', gap: t['--os-space-10'] },
});

const plans = [
  { value: 'starter', label: 'Starter' },
  { value: 'team', label: 'Team' },
  { value: 'scale', label: 'Scale', disabled: true },
];

export default function RadioGroupDisabled() {
  return (
    <div {...stylex.props(s.row)}>
      <RadioGroup label="Plan" defaultValue="team" options={plans} />
      <RadioGroup label="Plan (locked)" isDisabled defaultValue="team" options={plans} />
    </div>
  );
}
