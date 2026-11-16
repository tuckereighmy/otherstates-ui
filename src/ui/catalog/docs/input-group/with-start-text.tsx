import * as stylex from '@stylexjs/stylex';
import { Field, Input, InputGroup, InputGroupAddon, InputGroupText } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function InputGroupWithStartText() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Profile handle">
        <InputGroup>
          <InputGroupAddon>
            <InputGroupText>@</InputGroupText>
          </InputGroupAddon>
          <Input placeholder="your-name" autoComplete="username" />
        </InputGroup>
      </Field>
    </div>
  );
}
