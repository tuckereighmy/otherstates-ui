'use client';

import { parseDate } from '@internationalized/date';
import { Calendar } from '../../../components';

export default function CalendarMultiple() {
  const first = parseDate('2026-03-02');

  return (
    <Calendar
      mode="multiple"
      aria-label="Review days"
      defaultValue={[first, first.add({ days: 2 }), first.add({ days: 7 })]}
    />
  );
}
