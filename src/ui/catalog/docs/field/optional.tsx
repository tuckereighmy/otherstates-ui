import * as stylex from '@stylexjs/stylex';
import { Field, Input } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-4'], width: 320, maxWidth: '100%' },
});

export default function FieldOptional() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Full name">
        <Input name="name" autoComplete="name" required />
      </Field>
      <Field label="Company" isOptional>
        <Input name="company" autoComplete="organization" />
      </Field>
    </div>
  );
}
