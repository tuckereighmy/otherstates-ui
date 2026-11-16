import { Button, Group, GroupSeparator, Icon } from '../../../components';

export default function GroupVertical() {
  return (
    <Group orientation="vertical" aria-label="Zoom">
      <Button appearance="text" iconOnly aria-label="Zoom in">
        <Icon name="plus" />
      </Button>
      <Button appearance="text" iconOnly aria-label="Zoom out">
        <Icon name="minus" />
      </Button>
      <GroupSeparator />
      <Button appearance="text" iconOnly aria-label="Fit to screen">
        <Icon name="maximize" />
      </Button>
    </Group>
  );
}
