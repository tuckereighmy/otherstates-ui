import * as stylex from '@stylexjs/stylex';
import { Field, Input, InputGroup, InputGroupAddon, InputGroupText } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function InputGroupWithStartAndEndText() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Team budget">
        <InputGroup>
          <InputGroupAddon>
            <InputGroupText>$</InputGroupText>
          </InputGroupAddon>
          <Input inputMode="decimal" placeholder="0.00" />
          <InputGroupAddon align="end">
            <InputGroupText>per month</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </div>
  );
}
