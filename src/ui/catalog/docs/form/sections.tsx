'use client';

import * as stylex from '@stylexjs/stylex';
import { Button, Field, Fieldset, Form, FormActions, Input } from '../../../components';

const s = stylex.create({
  root: { width: 400, maxWidth: '100%' },
});

export default function FormSections() {
  return (
    <div {...stylex.props(s.root)}>
      <Form onSubmit={event => event.preventDefault()}>
        <Fieldset legend="Workspace">
          <Field label="Name">
            <Input name="workspace" defaultValue="Harbor notes" />
          </Field>
        </Fieldset>
        <Fieldset legend="Billing contact">
          <Field label="Email" description="Invoices go to this address.">
            <Input type="email" name="billingEmail" defaultValue="ines@example.com" />
          </Field>
        </Fieldset>
        <FormActions align="end">
          <Button type="submit">Save settings</Button>
        </FormActions>
      </Form>
    </div>
  );
}
