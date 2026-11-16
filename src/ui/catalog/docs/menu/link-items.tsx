import { Button, Icon, Menu, MenuItem, MenuSeparator } from '../../../components';

export default function MenuLinkItems() {
  return (
    <Menu
      aria-label="Help"
      trigger={
        <Button appearance="secondary" leadingIcon={<Icon name="help-circle" />}>
          Help
        </Button>
      }
    >
      <MenuItem href="#">Getting started</MenuItem>
      <MenuItem href="#">Keyboard shortcuts</MenuItem>
      <MenuSeparator />
      <MenuItem
        href="#"
        target="_blank"
        icon={<Icon name="external-link" size={16} />}
      >
        Release notes
      </MenuItem>
    </Menu>
  );
}
