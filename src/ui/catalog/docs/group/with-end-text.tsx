import * as stylex from '@stylexjs/stylex';
import { Group, GroupText, Input } from '../../../components';

const s = stylex.create({
  group: { width: 220, maxWidth: '100%' },
  input: { flexGrow: 1, flexBasis: 80, minWidth: 0 },
});

export default function GroupWithEndText() {
  return (
    <Group aria-label="Storage limit" {...stylex.props(s.group)}>
      <Input
        type="number"
        aria-label="Storage limit in gigabytes"
        defaultValue={50}
        min={1}
        {...stylex.props(s.input)}
      />
      <GroupText>GB</GroupText>
    </Group>
  );
}
