import * as stylex from '@stylexjs/stylex';
import { Input, InputGroup, InputGroupAddon, InputGroupButton } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function InputGroupWithButton() {
  return (
    <div {...stylex.props(s.root)}>
      <InputGroup>
        <Input aria-label="Discount code" placeholder="Discount code" />
        <InputGroupAddon align="end">
          <InputGroupButton variant="secondary">Apply</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
