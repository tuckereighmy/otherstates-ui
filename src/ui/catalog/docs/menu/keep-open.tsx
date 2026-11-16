'use client';

import { useState } from 'react';
import { Button, Icon, Menu, MenuItem, MenuSeparator } from '../../../components';

export default function MenuKeepOpen() {
  const [zoom, setZoom] = useState(100);

  return (
    <Menu
      aria-label="Zoom"
      closeOnSelect={false}
      trigger={
        <Button appearance="secondary" trailingIcon={<Icon name="chevron-down" />}>
          Zoom {zoom}%
        </Button>
      }
    >
      <MenuItem shortcut="⌘+" onAction={() => setZoom(z => Math.min(z + 25, 200))}>
        Zoom in
      </MenuItem>
      <MenuItem shortcut="⌘−" onAction={() => setZoom(z => Math.max(z - 25, 25))}>
        Zoom out
      </MenuItem>
      <MenuSeparator />
      <MenuItem closeOnSelect onAction={() => setZoom(100)}>
        Reset to 100%
      </MenuItem>
    </Menu>
  );
}
