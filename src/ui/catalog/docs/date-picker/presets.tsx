'use client';

import * as stylex from '@stylexjs/stylex';
import { getLocalTimeZone, today } from '@internationalized/date';
import { DatePicker } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function DatePickerPresets() {
  // Read when picked, so "Today" is today even if the page has been open since yesterday.
  const now = () => today(getLocalTimeZone());
  const presets = [
    { label: 'Today', value: now },
    { label: 'Tomorrow', value: () => now().add({ days: 1 }) },
    { label: 'In a week', value: () => now().add({ weeks: 1 }) },
    { label: 'In a month', value: () => now().add({ months: 1 }) },
  ];

  return (
    <div {...stylex.props(s.root)}>
      <DatePicker label="Publish on" presets={presets} />
    </div>
  );
}
