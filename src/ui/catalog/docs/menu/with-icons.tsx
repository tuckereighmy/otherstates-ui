import { Button, Icon, Menu, MenuItem, MenuSeparator } from '../../../components';

export default function MenuWithIcons() {
  return (
    <Menu
      aria-label="Note actions"
      trigger={
        <Button appearance="secondary" iconOnly aria-label="Note actions">
          <Icon name="more-horizontal" />
        </Button>
      }
    >
      <MenuItem icon={<Icon name="edit" size={16} />} shortcut="⌘E">Edit</MenuItem>
      <MenuItem icon={<Icon name="copy" size={16} />} shortcut="⌘D">Duplicate</MenuItem>
      <MenuItem icon={<Icon name="share" size={16} />}>Share</MenuItem>
      <MenuSeparator />
      <MenuItem icon={<Icon name="trash" size={16} />} shortcut="⌫" destructive>
        Delete
      </MenuItem>
    </Menu>
  );
}
