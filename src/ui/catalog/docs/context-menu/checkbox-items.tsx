import * as stylex from '@stylexjs/stylex';
import { ContextMenu, MenuItem } from '../../../components';
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

export default function ContextMenuCheckboxItems() {
  return (
    <ContextMenu
      aria-label="Canvas view"
      selectionMode="multiple"
      defaultSelectedKeys={['grid']}
      trigger={<div role="button" {...stylex.props(s.area)}>Canvas</div>}
    >
      <MenuItem id="grid">Show grid</MenuItem>
      <MenuItem id="rulers">Show rulers</MenuItem>
      <MenuItem id="snap">Snap to objects</MenuItem>
    </ContextMenu>
  );
}
