'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, Field, Form, FormActions, Input } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

type Errors = Partial<Record<'title' | 'estimate', string>>;

function validate(data: FormData): Errors {
  const errors: Errors = {};
  if (!String(data.get('title')).trim()) errors.title = 'Give the task a title.';
  const estimate = Number(data.get('estimate'));
  if (!(estimate >= 1 && estimate <= 40)) errors.estimate = 'Estimate between 1 and 40 hours.';
  return errors;
}

export default function FormCustomValidation() {
  const [errors, setErrors] = useState<Errors>({});

  return (
    <div {...stylex.props(s.root)}>
      <Form
        validationBehavior="aria"
        validationErrors={errors}
        onSubmit={event => { event.preventDefault(); setErrors(validate(new FormData(event.currentTarget))); }}
      >
        <Field label="Task title">
          <Input name="title" autoComplete="off" />
        </Field>
        <Field label="Estimate" description="In hours.">
          <Input type="number" name="estimate" />
        </Field>
        <FormActions>
          <Button type="submit">Add task</Button>
        </FormActions>
      </Form>
    </div>
  );
}
