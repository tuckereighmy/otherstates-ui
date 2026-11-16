import * as stylex from '@stylexjs/stylex';
import { Field, Input } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function InputDefault() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Project name">
        <Input placeholder="Untitled project" />
      </Field>
    </div>
  );
}
