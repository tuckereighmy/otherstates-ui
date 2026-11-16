import * as stylex from '@stylexjs/stylex';
import { DateRangePicker } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function DatePickerRange() {
  return (
    <div {...stylex.props(s.root)}>
      <DateRangePicker label="Offsite dates" />
    </div>
  );
}
