'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, Form, Slider } from '../../../components';

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function SliderFormIntegration() {
  const [submitted, setSubmitted] = useState('');

  return (
    <div {...stylex.props(s.root)}>
      <Form
        onSubmit={event => {
          event.preventDefault();
          setSubmitted(String(new FormData(event.currentTarget).get('retention')));
        }}
      >
        <Slider
          label="Log retention"
          name="retention"
          defaultValue={30}
          minValue={7}
          maxValue={90}
          formatOptions={{ style: 'unit', unit: 'day', unitDisplay: 'long' }}
          description={submitted ? `Saved: ${submitted} days.` : 'How long to keep deployment logs.'}
        />
        <Button type="submit">Save</Button>
      </Form>
    </div>
  );
}
