import * as stylex from '@stylexjs/stylex';
import { UsageBar, type UsageSegment } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const segments: UsageSegment[] = [
  { id: 'input', label: 'Input', value: 61000 },
  { id: 'output', label: 'Output', value: 18000 },
];

const s = stylex.create({ column: { display: 'grid', gap: t['--os-space-5'], width: '100%', maxWidth: 320 } });

export default function UsageBarSizes() {
  return (
    <div {...stylex.props(s.column)}>
      <UsageBar label="Small" size="sm" max={128000} segments={segments} legend="none" />
      <UsageBar label="Medium" size="md" max={128000} segments={segments} legend="none" />
      <UsageBar label="Large" size="lg" max={128000} segments={segments} legend="none" />
    </div>
  );
}
