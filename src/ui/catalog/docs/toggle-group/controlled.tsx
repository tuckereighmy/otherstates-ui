'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  stack: { display: 'grid', justifyItems: 'center', gap: t['--os-space-3'] },
  note: { margin: 0, color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-sm'] },
});

export default function ToggleGroupControlled() {
  const [days, setDays] = useState(new Set<string | number>(['mon', 'wed']));
  return (
    <div {...stylex.props(s.stack)}>
      <ToggleGroup aria-label="Reminder days" selectedKeys={days} onSelectionChange={setDays}>
        <ToggleGroupItem id="mon">Mon</ToggleGroupItem>
        <ToggleGroupItem id="tue">Tue</ToggleGroupItem>
        <ToggleGroupItem id="wed">Wed</ToggleGroupItem>
        <ToggleGroupItem id="thu">Thu</ToggleGroupItem>
        <ToggleGroupItem id="fri">Fri</ToggleGroupItem>
      </ToggleGroup>
      <p {...stylex.props(s.note)}>
        {days.size === 0 ? 'No reminders' : `Reminders on ${days.size} ${days.size === 1 ? 'day' : 'days'}`}
      </p>
    </div>
  );
}
