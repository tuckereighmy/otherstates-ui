import * as stylex from '@stylexjs/stylex';
import { Icon, TextField } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function InputTextField() {
  return (
    <div {...stylex.props(s.root)}>
      <TextField
        label="Work email"
        type="email"
        description="Used for sign-in and receipts."
        placeholder="name@example.com"
        leadingIcon={<Icon name="mail" />}
        autoComplete="email"
        isRequired
      />
    </div>
  );
}
