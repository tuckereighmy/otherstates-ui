'use client';

import { useState } from 'react';
import { Button, Dialog, Icon, Menu, MenuItem } from '../../../components';

export default function DialogOpenFromMenu() {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Menu
        trigger={
          <Button appearance="tertiary" iconOnly aria-label="Project actions">
            <Icon name="more-horizontal" />
          </Button>
        }
        onAction={key => key === 'archive' && setOpen(true)}
      >
        <MenuItem id="duplicate">Duplicate</MenuItem>
        <MenuItem id="archive">Archive…</MenuItem>
      </Menu>
      <Dialog
        isOpen={isOpen}
        onOpenChange={setOpen}
        title="Archive project"
        description="Archived projects move to the bottom of the list and stop sending notifications."
        footer={close => (
          <>
            <Button appearance="tertiary" onClick={close}>Cancel</Button>
            <Button onClick={close}>Archive</Button>
          </>
        )}
      />
    </>
  );
}
