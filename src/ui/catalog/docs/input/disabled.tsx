import * as stylex from '@stylexjs/stylex';
import { Field, Input } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function InputDisabled() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Workspace ID" description="Set when the workspace was created." isDisabled>
        <Input defaultValue="ws-4821" />
      </Field>
    </div>
  );
}
