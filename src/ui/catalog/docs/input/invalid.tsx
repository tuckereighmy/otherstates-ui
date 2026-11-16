import * as stylex from '@stylexjs/stylex';
import { Field, Input } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function InputInvalid() {
  return (
    <div {...stylex.props(s.root)}>
      <Field
        label="Billing email"
        description="Invoices are sent here."
        errorMessage="Enter an email address that includes an @."
      >
        <Input type="email" defaultValue="maya.billing" />
      </Field>
    </div>
  );
}
