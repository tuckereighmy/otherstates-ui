'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, Form, NumberField } from '../../../components';

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function NumberFieldFormIntegration() {
  const [saved, setSaved] = useState('');

  return (
    <div {...stylex.props(s.root)}>
      <Form
        onSubmit={event => {
          event.preventDefault();
          setSaved(String(new FormData(event.currentTarget).get('seats')));
        }}
      >
        <NumberField
          label="Seats"
          name="seats"
          description={saved ? `Plan updated to ${saved} seats.` : 'Between 1 and 50.'}
          defaultValue={5}
          minValue={1}
          maxValue={50}
          isRequired
        />
        <Button type="submit">Update plan</Button>
      </Form>
    </div>
  );
}
