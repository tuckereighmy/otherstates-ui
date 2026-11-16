import * as stylex from '@stylexjs/stylex';
import { DatePicker } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-4'], width: 320, maxWidth: '100%' },
});

export default function DatePickerSizes() {
  return (
    <div {...stylex.props(s.root)}>
      <DatePicker size="sm" label="Small" />
      <DatePicker size="md" label="Medium" />
      <DatePicker size="lg" label="Large" />
    </div>
  );
}
