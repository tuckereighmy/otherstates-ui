import * as stylex from '@stylexjs/stylex';
import { Field, Fieldset, Input } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function FieldsetDefault() {
  return (
    <div {...stylex.props(s.root)}>
      <Fieldset legend="Billing address">
        <Field label="Street">
          <Input name="street" autoComplete="address-line1" />
        </Field>
        <Field label="City">
          <Input name="city" autoComplete="address-level2" />
        </Field>
      </Fieldset>
    </div>
  );
}
