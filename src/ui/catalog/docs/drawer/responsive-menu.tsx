'use client';

import { useSyncExternalStore } from 'react';
import { Button, Drawer, DrawerMenu, Icon, Menu, MenuItem } from '../../../components';

// Read through useSyncExternalStore with a server value (narrow), so it also renders on a server.
const wideQuery = '(min-width: 640px)';
const subscribe = (onChange: () => void) => {
  const wide = window.matchMedia(wideQuery);
  wide.addEventListener('change', onChange);
  return () => wide.removeEventListener('change', onChange);
};

const trigger = (
  <Button appearance="tertiary" iconOnly aria-label="Project actions">
    <Icon name="more-horizontal" />
  </Button>
);
const items = [
  <MenuItem key="rename" id="rename">Rename</MenuItem>,
  <MenuItem key="duplicate" id="duplicate">Duplicate</MenuItem>,
  <MenuItem key="archive" id="archive">Archive</MenuItem>,
];

export default function DrawerResponsiveMenu() {
  const isWide = useSyncExternalStore(subscribe, () => window.matchMedia(wideQuery).matches, () => false);
  if (isWide) return <Menu trigger={trigger}>{items}</Menu>;
  return (
    <Drawer trigger={trigger} title="Project actions">
      <DrawerMenu aria-label="Project actions">{items}</DrawerMenu>
    </Drawer>
  );
}
