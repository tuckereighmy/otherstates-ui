import * as stylex from '@stylexjs/stylex';
import { TextField } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function InputFloatingLabel() {
  return (
    <div {...stylex.props(s.root)}>
      <TextField label="Team name" floating defaultValue="Field research" />
    </div>
  );
}
