import * as stylex from '@stylexjs/stylex';
import { Field, Input, InputGroup } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function InputGroupAttachedAddons() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Workspace address">
        <InputGroup start="https://" end=".example.com">
          <Input placeholder="team-name" />
        </InputGroup>
      </Field>
    </div>
  );
}
