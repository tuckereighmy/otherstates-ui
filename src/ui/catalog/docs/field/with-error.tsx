import * as stylex from '@stylexjs/stylex';
import { Field, Input } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function FieldWithError() {
  return (
    <div {...stylex.props(s.root)}>
      <Field
        label="Invoice number"
        description="Numbers run in sequence."
        errorMessage="An invoice with this number already exists."
      >
        <Input name="invoice" defaultValue="INV-2041" />
      </Field>
    </div>
  );
}
