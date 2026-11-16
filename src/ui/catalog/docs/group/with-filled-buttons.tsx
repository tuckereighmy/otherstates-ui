import { Button, Group } from '../../../components';

export default function GroupWithFilledButtons() {
  return (
    <Group aria-label="Draft">
      <Button appearance="secondary">Save draft</Button>
      <Button>Publish</Button>
    </Group>
  );
}
