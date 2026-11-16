import * as stylex from '@stylexjs/stylex';
import { Field, Input } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function FieldDisabled() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Workspace URL" description="Only an owner can change it." isDisabled>
        <Input name="workspace" defaultValue="harbor-notes" />
      </Field>
    </div>
  );
}
