import * as stylex from '@stylexjs/stylex';
import { TextField } from '../../../components';

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function InputNotchField() {
  return (
    <div {...stylex.props(s.root)}>
      <TextField label="Email" type="email" floating="notch" autoComplete="email" />
    </div>
  );
}
