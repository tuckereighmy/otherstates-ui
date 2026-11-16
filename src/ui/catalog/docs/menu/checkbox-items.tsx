import { Button, Icon, Menu, MenuItem } from '../../../components';

export default function MenuCheckboxItems() {
  return (
    <Menu
      aria-label="Visible columns"
      selectionMode="multiple"
      defaultSelectedKeys={['status', 'owner']}
      trigger={
        <Button appearance="secondary" leadingIcon={<Icon name="sliders" />}>
          Columns
        </Button>
      }
    >
      <MenuItem id="status">Status</MenuItem>
      <MenuItem id="owner">Owner</MenuItem>
      <MenuItem id="due">Due date</MenuItem>
      <MenuItem id="budget">Budget</MenuItem>
    </Menu>
  );
}
