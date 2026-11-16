import * as stylex from '@stylexjs/stylex';
import { Field, Fieldset, Input } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function FieldsetDisabled() {
  return (
    <div {...stylex.props(s.root)}>
      <Fieldset legend="Single sign-on" description="Available on the Business plan." isDisabled>
        <Field label="Sign-in URL">
          <Input type="url" name="ssoUrl" placeholder="https://" />
        </Field>
        <Field label="Certificate fingerprint">
          <Input name="fingerprint" />
        </Field>
      </Fieldset>
    </div>
  );
}
