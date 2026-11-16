'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Field, Fieldset, Input } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function FieldsetWithError() {
  const [start, setStart] = useState('18:00');
  const [end, setEnd] = useState('09:00');
  const invalid = end <= start;

  return (
    <div {...stylex.props(s.root)}>
      <Fieldset
        legend="Quiet hours"
        description="Notifications pause between these times."
        errorMessage={invalid ? 'The end time must be after the start time.' : undefined}
      >
        <Field label="From" isInvalid={invalid}>
          <Input type="time" name="from" value={start} onChange={event => setStart(event.target.value)} />
        </Field>
        <Field label="Until" isInvalid={invalid}>
          <Input type="time" name="until" value={end} onChange={event => setEnd(event.target.value)} />
        </Field>
      </Fieldset>
    </div>
  );
}
