'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, Field, Form, FormActions, Input, Textarea } from '../../../components';

const s = stylex.create({
  root: { width: 400, maxWidth: '100%' },
});

export default function FieldCompleteForm() {
  const [sent, setSent] = useState(false);

  return (
    <div {...stylex.props(s.root)}>
      <Form onSubmit={event => { event.preventDefault(); setSent(true); }}>
        <Field label="Name" isRequired errorMessage={() => 'Enter your name.'}>
          <Input name="name" autoComplete="name" />
        </Field>
        <Field
          label="Email"
          isRequired
          errorMessage={({ validationDetails }) =>
            validationDetails.valueMissing ? 'Enter your email.' : 'Enter an address like sam@example.com.'}
        >
          <Input type="email" name="email" autoComplete="email" />
        </Field>
        <Field label="Project details" isOptional description="A few lines on scope and timing.">
          <Textarea name="details" rows={3} />
        </Field>
        <FormActions>
          <Button type="submit">{sent ? 'Request sent' : 'Send request'}</Button>
        </FormActions>
      </Form>
    </div>
  );
}
