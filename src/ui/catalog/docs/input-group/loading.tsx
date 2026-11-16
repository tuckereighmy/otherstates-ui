import * as stylex from '@stylexjs/stylex';
import { Icon, Input, InputGroup, InputGroupAddon } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function InputGroupLoading() {
  return (
    <div {...stylex.props(s.root)}>
      <InputGroup isLoading>
        <InputGroupAddon>
          <Icon name="search" />
        </InputGroupAddon>
        <Input aria-label="Search invoices" defaultValue="INV-20" />
      </InputGroup>
    </div>
  );
}
