'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, Form, FormActions, Switch } from '../../../components';
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

export default function SwitchFormIntegration() {
  const [saved, setSaved] = useState('');

  return (
    <div {...stylex.props(s.root)}>
      <Form
        onSubmit={event => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          setSaved(`Saved. Previews ${data.get('previews') ? 'on' : 'off'}, comments ${data.get('comments') ? 'on' : 'off'}.`);
        }}
      >
        <div {...stylex.props(s.choices)}>
          <Switch name="previews" value="enabled" label="Preview deployments" defaultSelected />
          <Switch name="comments" value="enabled" label="Comments on previews" />
        </div>
        <FormActions>
          <Button type="submit">Save settings</Button>
        </FormActions>
      </Form>
      <p role="status" {...stylex.props(s.status)}>{saved}</p>
    </div>
  );
}
