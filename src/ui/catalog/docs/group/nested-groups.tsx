import { Button, Group, GroupSeparator, Icon, type IconName } from '../../../components';

const styles: { icon: IconName; label: string }[] = [
  { icon: 'bold', label: 'Bold' },
  { icon: 'italic', label: 'Italic' },
  { icon: 'underline', label: 'Underline' },
];

const alignments: { icon: IconName; label: string }[] = [
  { icon: 'align-left', label: 'Align left' },
  { icon: 'align-center', label: 'Align center' },
  { icon: 'align-right', label: 'Align right' },
];

function Tools({ label, tools }: { label: string; tools: typeof styles }) {
  return (
    <Group variant="flush" size="sm" aria-label={label}>
      {tools.map(tool => (
        <Button key={tool.icon} size="sm" appearance="text" iconOnly aria-label={tool.label}>
          <Icon name={tool.icon} />
        </Button>
      ))}
    </Group>
  );
}

export default function GroupNested() {
  return (
    <Group size="sm" aria-label="Formatting">
      <Tools label="Text style" tools={styles} />
      <GroupSeparator />
      <Tools label="Alignment" tools={alignments} />
    </Group>
  );
}
