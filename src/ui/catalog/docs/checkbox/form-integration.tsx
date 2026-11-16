'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, Checkbox, Form, FormActions } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-3'], width: 320, maxWidth: '100%' },
  choices: { display: 'grid', gap: tokens['--os-space-1'] },
  status: {
    margin: 0,
    minHeight: 20,
    color: tokens['--os-color-fg-muted'],
    fontSize: tokens['--os-font-size-caption'],
    lineHeight: tokens['--os-line-height-md'],
  },
});

export default function CheckboxFormIntegration() {
  const [result, setResult] = useState('');

  return (
    <div {...stylex.props(s.root)}>
      <Form
        onSubmit={event => {
          event.preventDefault();
          const backups = new FormData(event.currentTarget).get('backups');
          setResult(backups ? 'Published with daily backups.' : 'Published without backups.');
        }}
      >
        <div {...stylex.props(s.choices)}>
          <Checkbox name="backups" value="daily" label="Keep daily backups" defaultSelected />
          <Checkbox name="confirm" label="I read the release notes" isRequired errorMessage="Confirm before you publish." />
        </div>
        <FormActions>
          <Button type="submit">Publish</Button>
        </FormActions>
      </Form>
      <p role="status" {...stylex.props(s.status)}>{result}</p>
    </div>
  );
}
