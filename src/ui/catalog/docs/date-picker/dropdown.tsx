'use client';

import * as stylex from '@stylexjs/stylex';
import { parseDate } from '@internationalized/date';
import { DatePicker } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function DatePickerDropdown() {
  return (
    <div {...stylex.props(s.root)}>
      <DatePicker label="Contract start" navigation="dropdown" defaultValue={parseDate('2019-04-15')} />
    </div>
  );
}
