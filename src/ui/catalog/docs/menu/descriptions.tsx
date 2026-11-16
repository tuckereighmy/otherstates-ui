import { Button, Icon, Menu, MenuItem } from '../../../components';

export default function MenuDescriptions() {
  return (
    <Menu
      aria-label="New document"
      trigger={
        <Button appearance="secondary" leadingIcon={<Icon name="plus" />}>
          New
        </Button>
      }
    >
      <MenuItem icon={<Icon name="file" size={16} />} description="A blank page with a title">
        Document
      </MenuItem>
      <MenuItem icon={<Icon name="list" size={16} />} description="Tasks with owners and due dates">
        Checklist
      </MenuItem>
      <MenuItem icon={<Icon name="folder" size={16} />} description="Group pages under one name">
        Folder
      </MenuItem>
    </Menu>
  );
}
