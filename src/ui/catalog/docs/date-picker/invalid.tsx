'use client';

import * as stylex from '@stylexjs/stylex';
import { parseDate } from '@internationalized/date';
import { DatePicker } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function DatePickerInvalid() {
  return (
    <div {...stylex.props(s.root)}>
      <DatePicker
        label="Renewal date"
        defaultValue={parseDate('2026-03-02')}
        isInvalid
        errorMessage="Pick a date after the current term ends."
      />
    </div>
  );
}
