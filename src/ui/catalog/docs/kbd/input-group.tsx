import * as stylex from '@stylexjs/stylex';
import { Icon, Input, InputGroup, InputGroupAddon, Kbd, KbdGroup } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function KbdInputGroup() {
  return (
    <div {...stylex.props(s.root)}>
      <InputGroup>
        <InputGroupAddon>
          <Icon name="search" size={16} />
        </InputGroupAddon>
        <Input type="search" placeholder="Search notes" aria-label="Search notes" />
        <InputGroupAddon align="end">
          <KbdGroup size="sm">
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
