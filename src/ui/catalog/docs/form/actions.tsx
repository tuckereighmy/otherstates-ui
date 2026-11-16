'use client';

import * as stylex from '@stylexjs/stylex';
import { Button, Field, Form, FormActions, Input } from '../../../components';

const s = stylex.create({
  root: { width: 400, maxWidth: '100%' },
});

export default function FormActionsRow() {
  return (
    <div {...stylex.props(s.root)}>
      <Form onSubmit={event => event.preventDefault()}>
        <Field label="Note title">
          <Input name="title" defaultValue="Quarterly planning" />
        </Field>
        <Field label="Folder">
          <Input name="folder" defaultValue="Team notes" />
        </Field>
        <FormActions align="end">
          <Button type="reset" appearance="tertiary">Reset</Button>
          <Button type="submit">Save changes</Button>
        </FormActions>
      </Form>
    </div>
  );
}
