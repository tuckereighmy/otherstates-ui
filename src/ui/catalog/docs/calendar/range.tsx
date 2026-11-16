'use client';

import { parseDate } from '@internationalized/date';
import { Calendar } from '../../../components';

export default function CalendarRange() {
  const start = parseDate('2026-03-02');

  return (
    <Calendar
      mode="range"
      aria-label="Trip dates"
      defaultValue={{ start, end: start.add({ days: 4 }) }}
    />
  );
}
