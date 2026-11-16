'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, Field, Form, Input } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function ButtonInAForm() {
  const [created, setCreated] = useState('');

  return (
    <div {...stylex.props(s.root)}>
      <Form
        onSubmit={event => {
          event.preventDefault();
          setCreated(String(new FormData(event.currentTarget).get('workspace')));
        }}
      >
        <Field label="Workspace name" description={created ? `Created ${created}.` : 'You can rename it later.'}>
          <Input name="workspace" required />
        </Field>
        <Button type="submit" fullWidth>
          Create workspace
        </Button>
      </Form>
    </div>
  );
}
