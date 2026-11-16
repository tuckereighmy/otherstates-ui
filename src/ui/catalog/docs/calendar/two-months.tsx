'use client';

import { parseDate } from '@internationalized/date';
import { Calendar } from '../../../components';

export default function CalendarTwoMonths() {
  const start = parseDate('2026-03-02');

  return (
    <Calendar
      mode="range"
      visibleMonths={2}
      aria-label="Campaign dates"
      defaultValue={{ start, end: start.add({ days: 10 }) }}
    />
  );
}
