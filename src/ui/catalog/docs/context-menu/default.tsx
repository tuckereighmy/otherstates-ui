import * as stylex from '@stylexjs/stylex';
import { ContextMenu, MenuItem, MenuSeparator } from '../../../components';
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

export default function ContextMenuDefault() {
  return (
    <ContextMenu
      aria-label="Card actions"
      trigger={<div role="button" {...stylex.props(s.area)}>Right-click or long-press here</div>}
    >
      <MenuItem>Open</MenuItem>
      <MenuItem>Duplicate</MenuItem>
      <MenuItem>Copy link</MenuItem>
      <MenuSeparator />
      <MenuItem destructive>Move to trash</MenuItem>
    </ContextMenu>
  );
}
