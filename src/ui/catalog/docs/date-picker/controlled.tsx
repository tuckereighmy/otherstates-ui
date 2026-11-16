'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import type { CalendarDate } from '@internationalized/date';
import { DatePicker } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-3'], width: 320, maxWidth: '100%' },
  note: {
    margin: 0,
    color: tokens['--os-color-fg-muted'],
    fontSize: tokens['--os-font-size-caption'],
    lineHeight: tokens['--os-line-height-md'],
  },
});

export default function DatePickerControlled() {
  const [date, setDate] = useState<CalendarDate | null>(null);

  return (
    <div {...stylex.props(s.root)}>
      <DatePicker label="Kickoff" value={date} onChange={setDate} />
      <p {...stylex.props(s.note)}>{date ? `Kickoff is set for ${date.toString()}.` : 'No date yet.'}</p>
    </div>
  );
}
