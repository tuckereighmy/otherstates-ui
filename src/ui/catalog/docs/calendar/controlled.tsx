'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { parseDate } from '@internationalized/date';
import { Calendar } from '../../../components';
import { tokens } from '../../../tokens.stylex';

// A calendar date has no time zone, so it's formatted from its fields in UTC: the same day on the server and in
// every browser. (date.toDate() would build a Date, which a prerendered Next.js page counts as reading the clock.)
const formatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeZone: 'UTC' });

const s = stylex.create({
  root: { display: 'grid', justifyItems: 'center', gap: tokens['--os-space-3'] },
  note: {
    margin: 0,
    color: tokens['--os-color-fg-muted'],
    fontSize: tokens['--os-font-size-caption'],
    lineHeight: tokens['--os-line-height-md'],
  },
});

export default function CalendarControlled() {
  const [date, setDate] = useState(() => parseDate('2026-03-02'));

  return (
    <div {...stylex.props(s.root)}>
      <Calendar aria-label="Meeting day" value={date} onChange={setDate} />
      <p {...stylex.props(s.note)}>Meeting on {formatter.format(Date.UTC(date.year, date.month - 1, date.day))}</p>
    </div>
  );
}
