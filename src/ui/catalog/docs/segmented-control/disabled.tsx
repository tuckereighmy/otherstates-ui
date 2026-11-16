import * as stylex from '@stylexjs/stylex';
import { SegmentedControl } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const plans = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'lifetime', label: 'Lifetime', disabled: true },
];

const s = stylex.create({
  stack: { display: 'grid', justifyItems: 'center', gap: t['--os-space-4'] },
});

export default function SegmentedControlDisabled() {
  return (
    <div {...stylex.props(s.stack)}>
      <SegmentedControl label="Billing period" defaultValue="monthly" options={plans} />
      <SegmentedControl label="Billing period, locked" defaultValue="yearly" options={plans} isDisabled />
    </div>
  );
}
