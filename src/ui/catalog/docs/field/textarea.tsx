import * as stylex from '@stylexjs/stylex';
import { Field, Textarea } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function FieldTextarea() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Release notes" description="Everyone on the project can read these.">
        <Textarea name="notes" rows={4} placeholder="What changed in this release?" />
      </Field>
    </div>
  );
}
