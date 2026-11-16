'use client';

import { parseDate } from '@internationalized/date';
import { Calendar } from '../../../components';

export default function CalendarDropdown() {
  return (
    <Calendar
      navigation="dropdown"
      aria-label="Contract start"
      defaultValue={parseDate('2019-04-15')}
    />
  );
}
