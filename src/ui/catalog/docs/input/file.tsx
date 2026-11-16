import * as stylex from '@stylexjs/stylex';
import { Field, Input } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function InputFile() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Receipt" description="PDF or PNG, up to 10 MB.">
        <Input type="file" name="receipt" accept=".pdf,.png" />
      </Field>
    </div>
  );
}
