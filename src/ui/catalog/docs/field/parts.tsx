'use client';

import * as stylex from '@stylexjs/stylex';
import { Field, FieldDescription, FieldError, FieldLabel, Input } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function FieldParts() {
  return (
    <div {...stylex.props(s.root)}>
      <Field isRequired>
        <FieldLabel>Billing email</FieldLabel>
        <FieldDescription>Invoices and receipts go to this address.</FieldDescription>
        <FieldError>
          {({ validationDetails }) =>
            validationDetails.valueMissing ? 'Enter a billing email.' : 'Enter an address like billing@example.com.'}
        </FieldError>
        <Input type="email" name="billingEmail" placeholder="billing@example.com" />
      </Field>
    </div>
  );
}
