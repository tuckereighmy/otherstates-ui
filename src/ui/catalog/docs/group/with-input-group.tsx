import * as stylex from '@stylexjs/stylex';
import { Button, Group, Icon, Input, InputGroup, InputGroupAddon } from '../../../components';

const s = stylex.create({
  group: { width: 400, maxWidth: '100%' },
  field: { flexGrow: 1, flexBasis: 180, minWidth: 0 },
});

export default function GroupWithInputGroup() {
  return (
    <Group aria-label="Search projects" {...stylex.props(s.group)}>
      <InputGroup {...stylex.props(s.field)}>
        <InputGroupAddon>
          <Icon name="search" />
        </InputGroupAddon>
        <Input type="search" aria-label="Search projects" placeholder="Search projects" />
      </InputGroup>
      <Button appearance="secondary">Search</Button>
    </Group>
  );
}
