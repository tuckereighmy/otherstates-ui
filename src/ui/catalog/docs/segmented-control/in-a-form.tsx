'use client';

import * as stylex from '@stylexjs/stylex';
import { useState, type FormEvent } from 'react';
import { Button, SegmentedControl } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const regions = [
  { value: 'eu', label: 'Europe' },
  { value: 'us', label: 'Americas' },
  { value: 'apac', label: 'Asia Pacific' },
];

const s = stylex.create({
  form: { display: 'grid', justifyItems: 'start', gap: t['--os-space-4'] },
  note: { margin: 0, color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-sm'] },
});

export default function SegmentedControlInAForm() {
  const [saved, setSaved] = useState<string | null>(null);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaved(String(new FormData(event.currentTarget).get('region')));
  };
  return (
    <form onSubmit={submit} {...stylex.props(s.form)}>
      <SegmentedControl label="Data region" name="region" defaultValue="eu" options={regions} />
      <Button type="submit">Save region</Button>
      <p {...stylex.props(s.note)}>{saved ? `Saved: ${saved}` : 'Not saved yet'}</p>
    </form>
  );
}
