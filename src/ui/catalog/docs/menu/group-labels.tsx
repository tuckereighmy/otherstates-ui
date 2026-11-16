import { Button, Icon, Menu, MenuGroup, MenuItem, MenuSeparator } from '../../../components';

export default function MenuGroupLabels() {
  return (
    <Menu
      aria-label="Account"
      trigger={
        <Button appearance="secondary" trailingIcon={<Icon name="chevron-down" />}>
          Mara
        </Button>
      }
    >
      <MenuGroup label="Workspace">
        <MenuItem>Team settings</MenuItem>
        <MenuItem>Members</MenuItem>
        <MenuItem>Billing</MenuItem>
      </MenuGroup>
      <MenuSeparator />
      <MenuGroup label="Account">
        <MenuItem>Profile</MenuItem>
        <MenuItem>Sign out</MenuItem>
      </MenuGroup>
    </Menu>
  );
}
