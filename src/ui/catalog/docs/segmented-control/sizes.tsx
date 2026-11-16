import * as stylex from '@stylexjs/stylex';
import { SegmentedControl } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const ranges = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

const s = stylex.create({
  stack: { display: 'grid', justifyItems: 'center', gap: t['--os-space-4'] },
});

export default function SegmentedControlSizes() {
  return (
    <div {...stylex.props(s.stack)}>
      <SegmentedControl size="xs" label="Range, small" defaultValue="week" options={ranges} />
      <SegmentedControl size="sm" label="Range, default" defaultValue="week" options={ranges} />
      <SegmentedControl size="md" label="Range, large" defaultValue="week" options={ranges} />
    </div>
  );
}
