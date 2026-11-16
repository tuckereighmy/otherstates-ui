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

export default function ContextMenuSwitchItems() {
  return (
    <ContextMenu
      aria-label="Channel settings"
      selectionMode="multiple"
      defaultSelectedKeys={['notify']}
      trigger={<div role="button" {...stylex.props(s.area)}>Release planning channel</div>}
    >
      <MenuItem id="notify" indicator="switch">Notifications</MenuItem>
      <MenuItem id="pin" indicator="switch">Pin to sidebar</MenuItem>
      <MenuItem id="mute" indicator="switch">Mute for a week</MenuItem>
    </ContextMenu>
  );
}
