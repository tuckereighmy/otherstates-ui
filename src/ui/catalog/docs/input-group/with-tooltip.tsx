import * as stylex from '@stylexjs/stylex';
import { Field, Icon, Input, InputGroup, InputGroupAddon, InputGroupButton, Tooltip } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function InputGroupWithTooltip() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Signing secret">
        <InputGroup>
          <Input type="password" defaultValue="sig-7f3k-29ad-q81m" />
          <InputGroupAddon align="end">
            <Tooltip
              trigger={
                <InputGroupButton iconOnly aria-label="About the signing secret">
                  <Icon name="info" />
                </InputGroupButton>
              }
            >
              Signs every request we send to your endpoint.
            </Tooltip>
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </div>
  );
}
