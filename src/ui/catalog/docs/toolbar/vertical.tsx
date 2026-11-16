import { Icon, Toolbar, ToolbarButton, ToolbarSeparator, ToolbarToggleButton } from '../../../components';

export default function ToolbarVertical() {
  return (
    <Toolbar orientation="vertical" aria-label="View">
      <ToolbarToggleButton aria-label="Show sidebar" defaultSelected><Icon name="panel-left" size={16} /></ToolbarToggleButton>
      <ToolbarToggleButton aria-label="Show details"><Icon name="panel-right" size={16} /></ToolbarToggleButton>
      <ToolbarSeparator />
      <ToolbarButton aria-label="Zoom in"><Icon name="plus" size={16} /></ToolbarButton>
      <ToolbarButton aria-label="Zoom out"><Icon name="minus" size={16} /></ToolbarButton>
    </Toolbar>
  );
}
