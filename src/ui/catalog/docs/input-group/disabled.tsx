import * as stylex from '@stylexjs/stylex';
import { Field, Icon, Input, InputGroup, InputGroupAddon, InputGroupButton } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function InputGroupDisabled() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Webhook endpoint" description="Upgrade the plan to add endpoints." isDisabled>
        <InputGroup start="https://">
          <Input placeholder="hooks.example.com" />
          <InputGroupAddon align="end">
            <InputGroupButton iconOnly aria-label="Test endpoint">
              <Icon name="send" />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </div>
  );
}
