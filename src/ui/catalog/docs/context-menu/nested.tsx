import * as stylex from '@stylexjs/stylex';
import { ContextMenu, MenuItem, MenuSeparator, MenuSubmenu } from '../../../components';
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

export default function ContextMenuNested() {
  return (
    <ContextMenu
      aria-label="File actions"
      trigger={<div role="button" {...stylex.props(s.area)}>quarterly-report.pdf</div>}
    >
      <MenuItem>Open</MenuItem>
      <MenuSubmenu label="Share with" aria-label="Share with">
        <MenuItem>Finance team</MenuItem>
        <MenuItem>Leadership</MenuItem>
        <MenuItem>Everyone</MenuItem>
      </MenuSubmenu>
      <MenuSeparator />
      <MenuItem>Rename</MenuItem>
      <MenuItem destructive>Delete</MenuItem>
    </ContextMenu>
  );
}
