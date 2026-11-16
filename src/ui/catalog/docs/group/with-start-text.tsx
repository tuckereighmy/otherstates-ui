'use client';

import * as stylex from '@stylexjs/stylex';
import { useId } from 'react';
import { Button, Group, GroupText, Icon, Input } from '../../../components';

const s = stylex.create({
  group: { width: 400, maxWidth: '100%' },
  input: { flexGrow: 1, flexBasis: 140, minWidth: 0 },
});

export default function GroupWithStartText() {
  const id = useId();

  return (
    <Group aria-label="Share link" {...stylex.props(s.group)}>
      <GroupText htmlFor={id}>Link</GroupText>
      <Input id={id} isReadOnly defaultValue="example.com/p/8f2k" {...stylex.props(s.input)} />
      <Button appearance="secondary" leadingIcon={<Icon name="copy" />}>
        Copy
      </Button>
    </Group>
  );
}
