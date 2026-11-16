import * as stylex from '@stylexjs/stylex';
import { Field, Fieldset, Input } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function FieldsetWithDescription() {
  return (
    <div {...stylex.props(s.root)}>
      <Fieldset legend="Invoice contact" description="Invoices for this workspace go to this person.">
        <Field label="Name">
          <Input name="contactName" autoComplete="name" />
        </Field>
        <Field label="Email">
          <Input type="email" name="contactEmail" autoComplete="email" />
        </Field>
      </Fieldset>
    </div>
  );
}
