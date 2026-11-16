'use client';

import { useSyncExternalStore } from 'react';
import { Button, Dialog, Drawer, Field, Input } from '../../../components';

// Read through useSyncExternalStore with a server value (narrow), so it also renders on a server.
const wideQuery = '(min-width: 640px)';
const subscribe = (onChange: () => void) => {
  const wide = window.matchMedia(wideQuery);
  wide.addEventListener('change', onChange);
  return () => wide.removeEventListener('change', onChange);
};

export default function DrawerResponsiveDialog() {
  const isWide = useSyncExternalStore(subscribe, () => window.matchMedia(wideQuery).matches, () => false);
  const Overlay = isWide ? Dialog : Drawer;

  return (
    <Overlay
      trigger={<Button appearance="tertiary">Edit profile</Button>}
      title="Edit profile"
      description="A dialog on wide screens, a drawer on narrow ones."
      footer={close => <Button onClick={close}>Save</Button>}
    >
      <Field label="Display name">
        <Input defaultValue="Maya" />
      </Field>
    </Overlay>
  );
}
