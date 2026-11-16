import * as stylex from '@stylexjs/stylex';
import { Field, Input } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-4'], width: 480, maxWidth: '100%' },
});

export default function FieldHorizontal() {
  return (
    <div {...stylex.props(s.root)}>
      <Field orientation="horizontal" label="Display name" description="Shown on comments and mentions.">
        <Input name="displayName" defaultValue="Maya" />
      </Field>
      <Field orientation="horizontal" label="Email">
        <Input type="email" name="email" defaultValue="maya@example.com" />
      </Field>
    </div>
  );
}
