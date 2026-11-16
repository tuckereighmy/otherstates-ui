'use client';

import * as stylex from '@stylexjs/stylex';
import { parseDateTime } from '@internationalized/date';
import { DatePicker } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function DatePickerWithTime() {
  return (
    <div {...stylex.props(s.root)}>
      <DatePicker label="Send reminder" granularity="minute" defaultValue={parseDateTime('2026-12-01T09:30')} />
    </div>
  );
}
