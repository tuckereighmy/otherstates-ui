import * as stylex from '@stylexjs/stylex';
import { Field, Input } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function FieldReadOnly() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Project ID" description="Use it when you call the API." isReadOnly>
        <Input name="projectId" defaultValue="prj-7c41-a2e9" />
      </Field>
    </div>
  );
}
