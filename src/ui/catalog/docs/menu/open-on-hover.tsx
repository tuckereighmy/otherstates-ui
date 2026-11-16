import { Button, Icon, Menu, MenuItem } from '../../../components';

export default function MenuOpenOnHover() {
  return (
    <Menu
      aria-label="Workspaces"
      openOn="hover"
      trigger={
        <Button appearance="text" trailingIcon={<Icon name="chevron-down" />}>
          Workspaces
        </Button>
      }
    >
      <MenuItem>Design team</MenuItem>
      <MenuItem>Platform</MenuItem>
      <MenuItem>Customer success</MenuItem>
    </Menu>
  );
}
