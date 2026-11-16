import { Icon, Toolbar, ToolbarButton, ToolbarGroup, ToolbarSeparator } from '../../../components';

export default function ToolbarDisabled() {
  return (
    <Toolbar aria-label="Invoice">
      <ToolbarGroup aria-label="History">
        <ToolbarButton aria-label="Undo" isDisabled><Icon name="undo" size={16} /></ToolbarButton>
        <ToolbarButton aria-label="Redo" isDisabled><Icon name="redo" size={16} /></ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarButton aria-label="Download"><Icon name="download" size={16} /></ToolbarButton>
      <ToolbarButton isDisabled>Send</ToolbarButton>
    </Toolbar>
  );
}
