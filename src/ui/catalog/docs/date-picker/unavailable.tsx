'use client';

import * as stylex from '@stylexjs/stylex';
import { isWeekend } from '@internationalized/date';
import { DatePicker, useToday } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function DatePickerUnavailable() {
  const today = useToday();
  return (
    <div {...stylex.props(s.root)}>
      <DatePicker
        label="Installation day"
        description="Weekdays from today on."
        minValue={today ?? undefined}
        isDateUnavailable={date => isWeekend(date, 'en-US')}
      />
    </div>
  );
}
