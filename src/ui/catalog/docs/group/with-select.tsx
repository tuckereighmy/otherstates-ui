import * as stylex from '@stylexjs/stylex';
import { Button, Group, Select } from '../../../components';

const environments = [
  { id: 'production', label: 'Production' },
  { id: 'staging', label: 'Staging' },
  { id: 'preview', label: 'Preview' },
];

const s = stylex.create({
  group: { width: 320, maxWidth: '100%' },
  select: { flexGrow: 1, flexBasis: 160, minWidth: 0 },
});

export default function GroupWithSelect() {
  return (
    <Group aria-label="Open an environment" {...stylex.props(s.group)}>
      <Select
        appearance="field"
        label="Environment"
        hideLabel
        options={environments}
        defaultValue="staging"
        {...stylex.props(s.select)}
      />
      <Button appearance="tertiary">Open</Button>
    </Group>
  );
}
