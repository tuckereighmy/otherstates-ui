import { Icon, Toolbar, ToolbarButton, ToolbarGroup, ToolbarSeparator, ToolbarToggleButton } from '../../../components';

export default function ToolbarWithToggleButtons() {
  return (
    <Toolbar aria-label="Formatting">
      <ToolbarGroup aria-label="Text style">
        <ToolbarToggleButton aria-label="Bold" defaultSelected><Icon name="bold" size={16} /></ToolbarToggleButton>
        <ToolbarToggleButton aria-label="Italic"><Icon name="italic" size={16} /></ToolbarToggleButton>
        <ToolbarToggleButton aria-label="Underline"><Icon name="underline" size={16} /></ToolbarToggleButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarButton aria-label="Insert link"><Icon name="link" size={16} /></ToolbarButton>
      <ToolbarButton aria-label="Insert code block"><Icon name="code" size={16} /></ToolbarButton>
    </Toolbar>
  );
}
