'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, CheckboxGroup, Form, FormActions } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-3'], width: 320, maxWidth: '100%' },
  status: {
    margin: 0, minHeight: 20, color: tokens['--os-color-fg-muted'],
    fontSize: tokens['--os-font-size-caption'], lineHeight: tokens['--os-line-height-md'],
  },
});

const events = [
  { id: 'deploy', label: 'Deployment finished' },
  { id: 'failure', label: 'Build failed' },
  { id: 'comment', label: 'New comment' },
];

export default function CheckboxGroupFormIntegration() {
  const [saved, setSaved] = useState('');

  return (
    <div {...stylex.props(s.root)}>
      <Form
        onSubmit={event => {
          event.preventDefault();
          setSaved(new FormData(event.currentTarget).getAll('events').join(', '));
        }}
      >
        <CheckboxGroup label="Send a webhook on" name="events" isRequired errorMessage="Choose at least one event." options={events} />
        <FormActions>
          <Button type="submit">Save webhook</Button>
        </FormActions>
      </Form>
      <p role="status" {...stylex.props(s.status)}>{saved && `Saved: ${saved}.`}</p>
    </div>
  );
}
