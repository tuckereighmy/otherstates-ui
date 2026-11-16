import * as stylex from '@stylexjs/stylex';
import { SegmentedControl } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const sections = [
  { value: 'activity', label: 'Activity', href: '#' },
  { value: 'members', label: 'Members', href: '#' },
  { value: 'settings', label: 'Settings', href: '#' },
];

const s = stylex.create({
  stack: { display: 'grid', justifyItems: 'center', gap: t['--os-space-4'] },
});

export default function SegmentedControlNavigationSizes() {
  return (
    <div {...stylex.props(s.stack)}>
      <SegmentedControl size="xs" label="Team, small" defaultValue="activity" options={sections} />
      <SegmentedControl size="md" label="Team, large" defaultValue="activity" options={sections} />
    </div>
  );
}
