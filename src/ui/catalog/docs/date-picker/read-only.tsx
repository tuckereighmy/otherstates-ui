'use client';

import * as stylex from '@stylexjs/stylex';
import { parseDate } from '@internationalized/date';
import { DatePicker } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function DatePickerReadOnly() {
  return (
    <div {...stylex.props(s.root)}>
      <DatePicker label="Created on" isReadOnly defaultValue={parseDate('2025-09-08')} />
    </div>
  );
}
