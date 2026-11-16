'use client';

import { isWeekend } from '@internationalized/date';
import { Calendar, useToday } from '../../../components';

export default function CalendarUnavailable() {
  const today = useToday();
  return (
    <Calendar
      aria-label="Installation day"
      minValue={today ?? undefined}
      isDateUnavailable={date => isWeekend(date, 'en-US')}
    />
  );
}
