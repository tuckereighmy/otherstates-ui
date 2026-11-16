import { Button, Icon, Menu, MenuItem, MenuSeparator } from '../../../components';

export default function MenuDefault() {
  return (
    <Menu
      aria-label="Project actions"
      trigger={
        <Button appearance="secondary" trailingIcon={<Icon name="chevron-down" />}>
          Actions
        </Button>
      }
    >
      <MenuItem>Rename</MenuItem>
      <MenuItem>Duplicate</MenuItem>
      <MenuItem>Move to folder</MenuItem>
      <MenuSeparator />
      <MenuItem destructive>Delete</MenuItem>
    </Menu>
  );
}
