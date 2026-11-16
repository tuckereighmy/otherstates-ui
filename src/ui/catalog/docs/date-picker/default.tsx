import * as stylex from '@stylexjs/stylex';
import { DatePicker } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function DatePickerDefault() {
  return (
    <div {...stylex.props(s.root)}>
      <DatePicker label="Due date" />
    </div>
  );
}
