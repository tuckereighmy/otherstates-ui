import { Button, Group, Icon } from '../../../components';

export default function GroupDefault() {
  return (
    <Group aria-label="Edit history">
      <Button appearance="text" leadingIcon={<Icon name="undo" />}>
        Undo
      </Button>
      <Button appearance="text" leadingIcon={<Icon name="redo" />}>
        Redo
      </Button>
    </Group>
  );
}
