import * as stylex from '@stylexjs/stylex';
import { Button, Group, Input } from '../../../components';

const s = stylex.create({
  group: { width: 380, maxWidth: '100%' },
  input: { flexGrow: 1, flexBasis: 160, minWidth: 0 },
});

export default function GroupWithInput() {
  return (
    <Group aria-label="Invite by email" {...stylex.props(s.group)}>
      <Input
        type="email"
        aria-label="Email address"
        placeholder="name@example.com"
        {...stylex.props(s.input)}
      />
      <Button>Send invite</Button>
    </Group>
  );
}
