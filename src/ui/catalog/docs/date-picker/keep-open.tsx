import * as stylex from '@stylexjs/stylex';
import { DateRangePicker } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function DatePickerKeepOpen() {
  return (
    <div {...stylex.props(s.root)}>
      <DateRangePicker label="Billing period" shouldCloseOnSelect={false} />
    </div>
  );
}
