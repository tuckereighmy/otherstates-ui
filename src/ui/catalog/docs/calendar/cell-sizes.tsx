'use client';

import * as stylex from '@stylexjs/stylex';
import { parseDate } from '@internationalized/date';
import { Calendar } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'center', gap: t['--os-space-6'] },
});

export default function CalendarCellSizes() {
  const date = parseDate('2026-03-02');

  return (
    <div {...stylex.props(s.row)}>
      <Calendar size="sm" aria-label="Small calendar" defaultValue={date} />
      <Calendar size="lg" aria-label="Large calendar" defaultValue={date} />
    </div>
  );
}
