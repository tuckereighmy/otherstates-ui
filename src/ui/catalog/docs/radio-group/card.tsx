import * as stylex from '@stylexjs/stylex';
import { RadioGroup } from '../../../components';

const s = stylex.create({
  root: { width: 380, maxWidth: '100%' },
});

const plans = [
  { value: 'starter', label: 'Starter', description: 'Three projects and community support.' },
  { value: 'team', label: 'Team', description: 'Unlimited projects and shared environments.' },
  { value: 'scale', label: 'Scale', description: 'Audit logs, single sign-on and a support contact.' },
];

export default function RadioGroupCard() {
  return (
    <div {...stylex.props(s.root)}>
      <RadioGroup label="Plan" variant="card" defaultValue="team" options={plans} />
    </div>
  );
}
