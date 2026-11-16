'use client';

import * as stylex from '@stylexjs/stylex';
import { Field, FieldDescription, FieldValidity, Input, type FieldValidityState } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

function usernameError({ validationDetails }: FieldValidityState) {
  if (validationDetails.valueMissing) return 'Choose a username.';
  if (validationDetails.tooShort) return 'Use at least 3 characters.';
  return 'Use lowercase letters, numbers and dashes.';
}

export default function FieldWithValidity() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Username" isRequired errorMessage={usernameError}>
        <Input name="username" minLength={3} pattern="[a-z0-9\-]+" autoComplete="off" />
        <FieldValidity>
          {({ validationDetails }) => (
            <FieldDescription>
              {validationDetails.valid ? 'Looks good.' : 'Lowercase letters, numbers and dashes, 3 or more.'}
            </FieldDescription>
          )}
        </FieldValidity>
      </Field>
    </div>
  );
}
