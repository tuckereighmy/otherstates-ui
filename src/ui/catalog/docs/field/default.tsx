import * as stylex from '@stylexjs/stylex';
import { Field, Input } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function FieldDefault() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Work email" description="Use the address your team signs in with.">
        <Input type="email" name="email" placeholder="you@example.com" />
      </Field>
    </div>
  );
}
