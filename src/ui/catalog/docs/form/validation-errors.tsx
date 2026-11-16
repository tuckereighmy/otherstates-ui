'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, Field, Form, FormActions, Input } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

const taken = ['maya', 'admin', 'support'];

export default function FormValidationErrors() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  return (
    <div {...stylex.props(s.root)}>
      <Form
        validationErrors={errors}
        onSubmit={event => {
          event.preventDefault();
          const username = String(new FormData(event.currentTarget).get('username'));
          setErrors(taken.includes(username) ? { username: `The username ${username} is taken.` } : {});
        }}
      >
        <Field label="Username" description="Submit as maya to see the error from the server.">
          <Input name="username" defaultValue="maya" autoComplete="off" />
        </Field>
        <FormActions>
          <Button type="submit">Claim username</Button>
        </FormActions>
      </Form>
    </div>
  );
}
