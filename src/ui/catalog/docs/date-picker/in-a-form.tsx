'use client';

import * as stylex from '@stylexjs/stylex';
import { useState, type FormEvent } from 'react';
import { Button, DatePicker, Form, FormActions } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
  note: {
    margin: 0,
    color: tokens['--os-color-fg-muted'],
    fontSize: tokens['--os-font-size-caption'],
    lineHeight: tokens['--os-line-height-md'],
  },
});

export default function DatePickerInAForm() {
  const [saved, setSaved] = useState<string | null>(null);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(String(new FormData(event.currentTarget).get('deadline')));
  }

  return (
    <div {...stylex.props(s.root)}>
      <Form onSubmit={submit}>
        <DatePicker label="Deadline" name="deadline" isRequired />
        <FormActions>
          <Button type="submit">Save deadline</Button>
          {saved && <p {...stylex.props(s.note)}>Saved {saved}</p>}
        </FormActions>
      </Form>
    </div>
  );
}
