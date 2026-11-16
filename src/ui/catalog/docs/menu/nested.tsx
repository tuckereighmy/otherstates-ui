import { Button, Icon, Menu, MenuItem, MenuSeparator, MenuSubmenu } from '../../../components';

export default function MenuNested() {
  return (
    <Menu
      aria-label="Invoice actions"
      trigger={
        <Button appearance="secondary" trailingIcon={<Icon name="chevron-down" />}>
          Invoice
        </Button>
      }
    >
      <MenuItem>Send reminder</MenuItem>
      <MenuSubmenu label="Export as" aria-label="Export formats">
        <MenuItem>PDF</MenuItem>
        <MenuItem>Spreadsheet</MenuItem>
        <MenuItem>Plain text</MenuItem>
      </MenuSubmenu>
      <MenuSubmenu label="Move to" aria-label="Move to folder">
        <MenuItem>Drafts</MenuItem>
        <MenuItem>Paid</MenuItem>
        <MenuItem>Archive</MenuItem>
      </MenuSubmenu>
      <MenuSeparator />
      <MenuItem destructive>Void invoice</MenuItem>
    </Menu>
  );
}
