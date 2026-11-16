'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, Field, Form, FormActions, Textarea } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-3'], width: 360, maxWidth: '100%' },
  status: {
    margin: 0,
    minHeight: 20,
    fontSize: tokens['--os-font-size-caption'],
    lineHeight: tokens['--os-line-height-md'],
    color: tokens['--os-color-fg-muted'],
  },
});

export default function TextareaFormIntegration() {
  const [saved, setSaved] = useState(0);

  return (
    <div {...stylex.props(s.root)}>
      <Form
        onSubmit={event => {
          event.preventDefault();
          setSaved(String(new FormData(event.currentTarget).get('note')).length);
        }}
      >
        <Field label="Deployment note" isRequired>
          <Textarea name="note" placeholder="Why is this going out today?" />
        </Field>
        <FormActions>
          <Button type="submit">Save note</Button>
        </FormActions>
      </Form>
      <p role="status" {...stylex.props(s.status)}>{saved > 0 && `Saved ${saved} characters.`}</p>
    </div>
  );
}
