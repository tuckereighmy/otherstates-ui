import { Button, Icon, Menu, MenuItem } from '../../../components';

export default function MenuSwitchItems() {
  return (
    <Menu
      aria-label="Notifications"
      selectionMode="multiple"
      defaultSelectedKeys={['mentions']}
      trigger={
        <Button appearance="secondary" iconOnly aria-label="Notifications">
          <Icon name="bell" />
        </Button>
      }
    >
      <MenuItem id="mentions" indicator="switch">Mentions</MenuItem>
      <MenuItem id="comments" indicator="switch">Comments</MenuItem>
      <MenuItem id="deploys" indicator="switch">Deployments</MenuItem>
    </Menu>
  );
}
