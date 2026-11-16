'use client';

import { useState } from 'react';
import { isWeekend, parseDate, startOfWeek } from '@internationalized/date';
import { Calendar } from '../../../components';

export default function CalendarInvalid() {
  const [date, setDate] = useState(() => startOfWeek(parseDate('2026-03-02'), 'en-US'));

  return (
    <Calendar
      aria-label="Delivery day"
      value={date}
      onChange={setDate}
      isInvalid={isWeekend(date, 'en-US')}
      errorMessage="Deliveries run on weekdays only."
    />
  );
}
