'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, Field, Form, FormActions, Input } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-3'], width: 320, maxWidth: '100%' },
  status: {
    margin: 0,
    minHeight: 20,
    fontSize: tokens['--os-font-size-caption'],
    lineHeight: tokens['--os-line-height-md'],
    color: tokens['--os-color-fg-muted'],
  },
});

export default function InputFormIntegration() {
  const [sentTo, setSentTo] = useState('');

  return (
    <div {...stylex.props(s.root)}>
      <Form
        onSubmit={event => {
          event.preventDefault();
          setSentTo(String(new FormData(event.currentTarget).get('email')));
        }}
      >
        <Field label="Email" description="We send the invite to this address." isRequired>
          <Input name="email" type="email" placeholder="name@example.com" />
        </Field>
        <FormActions>
          <Button type="submit">Send invite</Button>
        </FormActions>
      </Form>
      <p role="status" {...stylex.props(s.status)}>{sentTo && `Invite sent to ${sentTo}.`}</p>
    </div>
  );
}
