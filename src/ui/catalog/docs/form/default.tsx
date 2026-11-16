'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, Field, Form, FormActions, Input } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function FormDefault() {
  const [sent, setSent] = useState(false);

  return (
    <div {...stylex.props(s.root)}>
      <Form onSubmit={event => { event.preventDefault(); setSent(true); }}>
        <Field label="Name">
          <Input name="name" autoComplete="off" />
        </Field>
        <Field label="Email" isRequired>
          <Input type="email" name="email" placeholder="teammate@example.com" autoComplete="off" />
        </Field>
        <FormActions>
          <Button type="submit">{sent ? 'Invite sent' : 'Send invite'}</Button>
        </FormActions>
      </Form>
    </div>
  );
}
