import * as stylex from '@stylexjs/stylex';
import { Field, Input, InputGroup, InputGroupAddon, InputGroupText } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function InputGroupInvalid() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Subdomain" errorMessage="Use lowercase letters, numbers and hyphens only.">
        <InputGroup>
          <Input defaultValue="Team_Notes" />
          <InputGroupAddon align="end">
            <InputGroupText>.example.com</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </div>
  );
}
