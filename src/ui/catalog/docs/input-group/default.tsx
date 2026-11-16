import * as stylex from '@stylexjs/stylex';
import { Icon, Input, InputGroup, InputGroupAddon } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function InputGroupDefault() {
  return (
    <div {...stylex.props(s.root)}>
      <InputGroup>
        <InputGroupAddon>
          <Icon name="search" />
        </InputGroupAddon>
        <Input aria-label="Search projects" placeholder="Search projects" />
      </InputGroup>
    </div>
  );
}
