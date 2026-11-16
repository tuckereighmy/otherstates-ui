'use client';

import { parseDate } from '@internationalized/date';
import { Calendar, Card } from '../../../components';

export default function CalendarInACard() {
  return (
    <Card heading="Release day" description="Ships at 09:00 that day.">
      <Calendar variant="plain" aria-label="Release day" defaultValue={parseDate('2026-03-02').add({ days: 3 })} />
    </Card>
  );
}
