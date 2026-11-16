'use client';

import { parseDate } from '@internationalized/date';
import { Calendar } from '../../../components';

export default function CalendarReadOnly() {
  const start = parseDate('2026-03-02');

  return (
    <Calendar
      mode="range"
      isReadOnly
      aria-label="Booked dates"
      defaultValue={{ start, end: start.add({ days: 2 }) }}
    />
  );
}
