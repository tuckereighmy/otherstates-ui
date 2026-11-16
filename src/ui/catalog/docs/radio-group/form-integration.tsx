'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, Form, FormActions, RadioGroup } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-3'], width: 320, maxWidth: '100%' },
  status: {
    margin: 0,
    minHeight: 20,
    color: tokens['--os-color-fg-muted'],
    fontSize: tokens['--os-font-size-caption'],
    lineHeight: tokens['--os-line-height-md'],
  },
});

const environments = [
  { value: 'preview', label: 'Preview' },
  { value: 'staging', label: 'Staging' },
  { value: 'production', label: 'Production' },
];

export default function RadioGroupFormIntegration() {
  const [target, setTarget] = useState('');

  return (
    <div {...stylex.props(s.root)}>
      <Form
        onSubmit={event => {
          event.preventDefault();
          setTarget(String(new FormData(event.currentTarget).get('environment')));
        }}
      >
        <RadioGroup label="Deploy to" name="environment" isRequired options={environments} />
        <FormActions>
          <Button type="submit">Deploy</Button>
        </FormActions>
      </Form>
      <p role="status" {...stylex.props(s.status)}>{target && `Deploying to ${target}.`}</p>
    </div>
  );
}
