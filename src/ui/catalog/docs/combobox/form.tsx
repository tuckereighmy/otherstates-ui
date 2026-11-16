'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, Combobox, Form, FormActions } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const people = ['Amara', 'Jonas', 'Priya', 'Tomas'].map(name => ({ id: name.toLowerCase(), label: name }));
const labels = ['Bug', 'Feature', 'Design', 'Urgent'].map(name => ({ id: name.toLowerCase(), label: name }));

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-3'], width: 320, maxWidth: '100%' },
  status: { margin: 0, minHeight: 20, fontSize: tokens['--os-font-size-caption'], lineHeight: tokens['--os-line-height-md'], color: tokens['--os-color-fg-muted'] },
});

export default function ComboboxForm() {
  const [result, setResult] = useState('');

  return (
    <div {...stylex.props(s.root)}>
      <Form
        onSubmit={event => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          setResult(`Assigned to ${data.get('assignee')}, labels: ${data.getAll('labels').join(', ') || 'none'}.`);
        }}
      >
        <Combobox name="assignee" label="Assignee" placeholder="Choose a teammate" options={people} isRequired />
        <Combobox name="labels" selectionMode="multiple" label="Labels" placeholder="Add labels" options={labels} />
        <FormActions>
          <Button type="submit">Create issue</Button>
        </FormActions>
      </Form>
      <p role="status" {...stylex.props(s.status)}>{result}</p>
    </div>
  );
}
