import * as stylex from '@stylexjs/stylex';
import { ContextMenu, MenuGroup, MenuItem } from '../../../components';
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

export default function ContextMenuRadioGroup() {
  return (
    <ContextMenu
      aria-label="Image actions"
      trigger={<div role="button" {...stylex.props(s.area)}>cover-photo.png</div>}
    >
      <MenuGroup label="Scaling" selectionMode="single" defaultSelectedKeys={['fill']}>
        <MenuItem id="fill">Fill</MenuItem>
        <MenuItem id="fit">Fit</MenuItem>
        <MenuItem id="crop">Crop</MenuItem>
      </MenuGroup>
    </ContextMenu>
  );
}
