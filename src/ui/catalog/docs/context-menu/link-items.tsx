import * as stylex from '@stylexjs/stylex';
import { ContextMenu, Icon, MenuItem } from '../../../components';
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

export default function ContextMenuLinkItems() {
  return (
    <ContextMenu
      aria-label="Deployment links"
      trigger={<div role="button" {...stylex.props(s.area)}>Production deployment</div>}
    >
      <MenuItem href="#">Open deployment</MenuItem>
      <MenuItem href="#">View build logs</MenuItem>
      <MenuItem href="#" target="_blank" icon={<Icon name="external-link" size={16} />}>
        Open in a new tab
      </MenuItem>
    </ContextMenu>
  );
}
