'use client';

import * as stylex from '@stylexjs/stylex';
import { parseDate } from '@internationalized/date';
import { DatePicker } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function DatePickerDisabled() {
  return (
    <div {...stylex.props(s.root)}>
      <DatePicker label="Archive date" isDisabled defaultValue={parseDate('2026-01-31')} />
    </div>
  );
}
