import { Button, Group, Icon } from '../../../components';

export default function GroupWithDisabledButton() {
  return (
    <Group aria-label="Pages">
      <Button appearance="text" isDisabled leadingIcon={<Icon name="chevron-left" />}>
        Previous
      </Button>
      <Button appearance="text" trailingIcon={<Icon name="chevron-right" />}>
        Next
      </Button>
    </Group>
  );
}
