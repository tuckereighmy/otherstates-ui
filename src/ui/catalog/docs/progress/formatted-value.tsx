import * as stylex from '@stylexjs/stylex';
import { Progress } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-5'], width: 300, maxWidth: '100%' },
});

export default function ProgressFormattedValue() {
  return (
    <div {...stylex.props(s.root)}>
      <Progress
        label="Downloading backup"
        value={48}
        maxValue={120}
        formatOptions={{ style: 'unit', unit: 'megabyte', maximumFractionDigits: 0 }}
        showLabel
        showValue
      />
      <Progress label="Importing invoices" value={3} maxValue={8} valueLabel="3 of 8 files" showLabel showValue />
    </div>
  );
}
