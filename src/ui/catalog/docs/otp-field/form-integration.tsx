'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, Field, Form, OtpField } from '../../../components';

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function OtpFieldFormIntegration() {
  const [submitted, setSubmitted] = useState('');

  return (
    <div {...stylex.props(s.root)}>
      <Form
        onSubmit={event => {
          event.preventDefault();
          setSubmitted(String(new FormData(event.currentTarget).get('code')));
        }}
      >
        <Field
          label="Authenticator code"
          description={submitted ? `Submitted ${submitted}.` : 'Open your authenticator app to find it.'}
          errorMessage={validity => (validity.validationDetails.valueMissing ? 'Enter the code.' : 'Enter all 6 digits.')}
        >
          <OtpField name="code" isRequired />
        </Field>
        <Button type="submit">Verify</Button>
      </Form>
    </div>
  );
}
