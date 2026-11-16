import * as stylex from '@stylexjs/stylex';
import { Field, Icon, Input, InputGroup, InputGroupAddon } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function InputGroupWithEndIcon() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Reply-to address">
        <InputGroup>
          <Input type="email" placeholder="support@example.com" />
          <InputGroupAddon align="end">
            <Icon name="mail" />
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </div>
  );
}
