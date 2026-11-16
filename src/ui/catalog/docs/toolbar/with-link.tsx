import { Icon, Toolbar, ToolbarLink, ToolbarSeparator } from '../../../components';

export default function ToolbarWithLink() {
  return (
    <Toolbar aria-label="Deployment">
      <ToolbarLink href="#" aria-current="page">Overview</ToolbarLink>
      <ToolbarLink href="#">Logs</ToolbarLink>
      <ToolbarLink href="#">Settings</ToolbarLink>
      <ToolbarSeparator />
      <ToolbarLink href="#" aria-label="Open preview"><Icon name="external-link" size={16} /></ToolbarLink>
    </Toolbar>
  );
}
