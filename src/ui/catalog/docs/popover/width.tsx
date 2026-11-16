import { Button, Popover, Switch } from '../../../components';

export default function PopoverWidth() {
  return (
    <Popover
      width={320}
      placement="bottom start"
      trigger={<Button appearance="tertiary">Notifications</Button>}
      title="Project notifications"
      description="Applies to this project only. Your other projects keep their settings."
    >
      <Switch label="New comments" defaultChecked />
      <Switch label="Status changes" defaultChecked />
      <Switch label="Weekly summary" />
    </Popover>
  );
}
