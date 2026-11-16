import * as stylex from '@stylexjs/stylex';
import { ContextMenu, Icon, MenuItem, MenuSeparator } from '../../../components';
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

export default function ContextMenuWithIcons() {
  return (
    <ContextMenu
      aria-label="Note actions"
      trigger={<div role="button" {...stylex.props(s.area)}>Weekly planning notes</div>}
    >
      <MenuItem icon={<Icon name="edit" size={16} />} shortcut="⌘E">Edit</MenuItem>
      <MenuItem icon={<Icon name="copy" size={16} />} shortcut="⌘D">Duplicate</MenuItem>
      <MenuItem icon={<Icon name="star" size={16} />}>Add to favorites</MenuItem>
      <MenuSeparator />
      <MenuItem icon={<Icon name="trash" size={16} />} shortcut="⌫" destructive>Delete</MenuItem>
    </ContextMenu>
  );
}
