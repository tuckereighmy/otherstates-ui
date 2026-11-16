'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Autocomplete, Button, Form, FormActions } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const categories = ['Hosting', 'Software', 'Travel', 'Office supplies'].map(name => ({ id: name.toLowerCase(), label: name }));

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-3'], width: 280, maxWidth: '100%' },
  status: { margin: 0, minHeight: 20, fontSize: tokens['--os-font-size-caption'], lineHeight: tokens['--os-line-height-md'], color: tokens['--os-color-fg-muted'] },
});

export default function AutocompleteForm() {
  const [saved, setSaved] = useState('');

  return (
    <div {...stylex.props(s.root)}>
      <Form
        onSubmit={event => {
          event.preventDefault();
          setSaved(String(new FormData(event.currentTarget).get('category')));
        }}
      >
        <Autocomplete name="category" label="Expense category" description="Pick one or type your own." options={categories} isRequired />
        <FormActions>
          <Button type="submit">Save expense</Button>
        </FormActions>
      </Form>
      <p role="status" {...stylex.props(s.status)}>{saved && `Filed under ${saved}.`}</p>
    </div>
  );
}
