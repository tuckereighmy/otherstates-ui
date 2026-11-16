import { Button, Icon, Menu, MenuItem, MenuSeparator } from '../../../components';

export default function MenuDisabled() {
  return (
    <Menu
      aria-label="Deployment actions"
      disabledKeys={['rollback']}
      trigger={
        <Button appearance="secondary" trailingIcon={<Icon name="chevron-down" />}>
          Deployment
        </Button>
      }
    >
      <MenuItem id="logs" icon={<Icon name="terminal" size={16} />}>View logs</MenuItem>
      <MenuItem id="redeploy" icon={<Icon name="refresh" size={16} />}>Redeploy</MenuItem>
      <MenuItem id="rollback" icon={<Icon name="undo" size={16} />} description="No earlier build to return to">
        Roll back
      </MenuItem>
      <MenuSeparator />
      <MenuItem id="delete" isDisabled destructive>Delete deployment</MenuItem>
    </Menu>
  );
}
