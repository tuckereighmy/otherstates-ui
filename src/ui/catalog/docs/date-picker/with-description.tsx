import * as stylex from '@stylexjs/stylex';
import { DatePicker } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function DatePickerWithDescription() {
  return (
    <div {...stylex.props(s.root)}>
      <DatePicker label="Invoice date" description="Invoices are sent at 09:00 on this day." />
    </div>
  );
}
