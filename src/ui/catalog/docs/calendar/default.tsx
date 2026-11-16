'use client';

import { parseDate } from '@internationalized/date';
import { Calendar } from '../../../components';

export default function CalendarDefault() {
  return <Calendar aria-label="Delivery date" defaultValue={parseDate('2026-03-02')} />;
}
