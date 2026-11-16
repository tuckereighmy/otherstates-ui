import { Icon, Toolbar, ToolbarButton, ToolbarGroup, ToolbarSeparator } from '../../../components';

export default function ToolbarDefault() {
  return (
    <Toolbar aria-label="Document">
      <ToolbarGroup aria-label="History">
        <ToolbarButton aria-label="Undo"><Icon name="undo" size={16} /></ToolbarButton>
        <ToolbarButton aria-label="Redo"><Icon name="redo" size={16} /></ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup aria-label="Insert">
        <ToolbarButton aria-label="Attach file"><Icon name="paperclip" size={16} /></ToolbarButton>
        <ToolbarButton aria-label="Insert image"><Icon name="image" size={16} /></ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarButton>Share</ToolbarButton>
    </Toolbar>
  );
}
