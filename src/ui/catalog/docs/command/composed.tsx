import { Button, Command, Icon, MenuGroup, MenuItem, MenuSeparator } from '../../../components';

export default function CommandComposed() {
  return (
    <Command
      trigger={
        <Button appearance="secondary" leadingIcon={<Icon name="search" />}>
          Open palette
        </Button>
      }
    >
      <MenuGroup label="Suggestions">
        <MenuItem icon={<Icon name="clock" size={16} />}>Recent invoices</MenuItem>
        <MenuItem icon={<Icon name="star" size={16} />}>Starred projects</MenuItem>
      </MenuGroup>
      <MenuSeparator />
      <MenuGroup label="Help">
        <MenuItem icon={<Icon name="keyboard" size={16} />}>Keyboard shortcuts</MenuItem>
        <MenuItem href="#" icon={<Icon name="external-link" size={16} />}>Documentation</MenuItem>
      </MenuGroup>
    </Command>
  );
}
