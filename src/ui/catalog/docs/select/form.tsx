'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, Form, FormActions, Select } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const priorities = [
  { id: 'low', label: 'Low' },
  { id: 'medium', label: 'Medium' },
  { id: 'high', label: 'High' },
];

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-3'], width: 280, maxWidth: '100%' },
  status: { margin: 0, minHeight: 20, fontSize: tokens['--os-font-size-caption'], lineHeight: tokens['--os-line-height-md'], color: tokens['--os-color-fg-muted'] },
});

export default function SelectForm() {
  const [saved, setSaved] = useState('');

  return (
    <div {...stylex.props(s.root)}>
      <Form
        onSubmit={event => {
          event.preventDefault();
          setSaved(String(new FormData(event.currentTarget).get('priority')));
        }}
      >
        <Select appearance="field" name="priority" label="Priority" placeholder="Choose a priority" options={priorities} isRequired />
        <FormActions>
          <Button type="submit">Save task</Button>
        </FormActions>
      </Form>
      <p role="status" {...stylex.props(s.status)}>{saved && `Saved with priority: ${saved}.`}</p>
    </div>
  );
}
