import * as stylex from '@stylexjs/stylex';
import { ContextMenu, MenuGroup, MenuItem, MenuSeparator } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  area: {
    display: 'grid',
    placeItems: 'center',
    width: 'min(100%, 320px)',
    height: 144,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: tokens['--os-color-border-muted'],
    borderRadius: tokens['--os-radius-lg'],
    color: tokens['--os-color-fg-muted'],
    fontSize: tokens['--os-font-size-sm'],
    userSelect: 'none',
  },
});

export default function ContextMenuGroupLabels() {
  return (
    <ContextMenu
      aria-label="Task actions"
      trigger={<div role="button" {...stylex.props(s.area)}>Review onboarding copy</div>}
    >
      <MenuGroup label="Task">
        <MenuItem>Assign to me</MenuItem>
        <MenuItem>Set due date</MenuItem>
      </MenuGroup>
      <MenuSeparator />
      <MenuGroup label="Board">
        <MenuItem>Move to done</MenuItem>
        <MenuItem>Archive</MenuItem>
      </MenuGroup>
    </ContextMenu>
  );
}
