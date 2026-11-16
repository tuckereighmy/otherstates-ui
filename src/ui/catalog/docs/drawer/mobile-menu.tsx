import { Button, Drawer, DrawerMenu, Icon, MenuItem, MenuSeparator } from '../../../components';

export default function DrawerMobileMenu() {
  return (
    <Drawer trigger={<Button appearance="tertiary">Create</Button>} title="Create">
      <DrawerMenu aria-label="Create">
        <MenuItem id="note" icon={<Icon name="file" size={16} />}>New note</MenuItem>
        <MenuItem id="upload" icon={<Icon name="upload" size={16} />}>Upload a file</MenuItem>
        <MenuItem id="invite" icon={<Icon name="users" size={16} />}>Invite people</MenuItem>
        <MenuSeparator />
        <MenuItem id="settings" icon={<Icon name="settings" size={16} />}>Project settings</MenuItem>
      </DrawerMenu>
    </Drawer>
  );
}
