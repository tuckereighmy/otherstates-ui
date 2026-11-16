import * as stylex from '@stylexjs/stylex';
import { UsageBar } from '../../../components';

const s = stylex.create({ box: { width: '100%', maxWidth: 340 } });

export default function UsageBarOverBudget() {
  return (
    <UsageBar
      {...stylex.props(s.box)}
      label="Tokens per minute"
      max={120000}
      valueLabel="134k of 120k, over the limit"
      legend="none"
      segments={[
        { id: 'triage', label: 'Inbox triage', value: 52000 },
        { id: 'leads', label: 'Lead research', value: 82000 },
      ]}
    />
  );
}
