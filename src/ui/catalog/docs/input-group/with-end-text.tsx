import * as stylex from '@stylexjs/stylex';
import { Field, Input, InputGroup, InputGroupAddon, InputGroupText } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function InputGroupWithEndText() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Keep backups for" description="Between 7 and 365 days.">
        <InputGroup>
          <Input type="number" min={7} max={365} defaultValue={30} />
          <InputGroupAddon align="end">
            <InputGroupText>days</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </div>
  );
}
