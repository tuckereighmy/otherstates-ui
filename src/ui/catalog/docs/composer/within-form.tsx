'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Checkbox, Composer, Form } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-3'], width: 340, maxWidth: '100%' },
  status: { margin: 0, minHeight: 20, fontSize: tokens['--os-font-size-caption'], lineHeight: tokens['--os-line-height-md'], color: tokens['--os-color-fg-muted'] },
});

export default function ComposerWithinForm() {
  const [saved, setSaved] = useState('');

  return (
    <div {...stylex.props(s.root)}>
      <Form
        onSubmit={event => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          setSaved(`Saved “${data.get('reply')}”${data.get('notify') ? ' and notified the team' : ''}.`);
        }}
      >
        <Composer withinForm name="reply" label="Reply" placeholder="Write a reply" showModel={false} showEffort={false} />
        <Checkbox name="notify" label="Notify the team" defaultChecked />
      </Form>
      <p role="status" {...stylex.props(s.status)}>{saved}</p>
    </div>
  );
}
