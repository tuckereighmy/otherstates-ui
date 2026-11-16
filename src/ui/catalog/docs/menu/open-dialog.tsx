'use client';

import { useState } from 'react';
import { Button, Dialog, Icon, Menu, MenuItem } from '../../../components';

export default function MenuOpenDialog() {
  const [renaming, setRenaming] = useState(false);

  return (
    <>
      <Menu
        aria-label="Board actions"
        trigger={
          <Button appearance="secondary" trailingIcon={<Icon name="chevron-down" />}>
            Board
          </Button>
        }
      >
        <MenuItem onAction={() => setRenaming(true)}>Rename…</MenuItem>
        <MenuItem>Copy link</MenuItem>
      </Menu>
      <Dialog
        isOpen={renaming}
        onOpenChange={setRenaming}
        title="Rename board"
        description="The new name shows for everyone on the team."
        footer={close => <>
          <Button appearance="tertiary" onClick={close}>Cancel</Button>
          <Button onClick={close}>Save</Button>
        </>}
      />
    </>
  );
}
