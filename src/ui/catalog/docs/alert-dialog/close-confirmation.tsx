'use client';

import { useState } from 'react';
import { AlertDialog, Button, Field, Input, Sheet } from '../../../components';

export default function AlertDialogCloseConfirmation() {
  const [isOpen, setOpen] = useState(false);
  const [isConfirming, setConfirming] = useState(false);
  const [isDirty, setDirty] = useState(false);

  const requestOpen = (next: boolean) => {
    if (next || !isDirty) setOpen(next);
    else setConfirming(true);
  };
  const close = () => { setDirty(false); setOpen(false); };

  return (
    <>
      <Sheet
        trigger={<Button appearance="tertiary">Edit team</Button>}
        isOpen={isOpen}
        onOpenChange={requestOpen}
        title="Team settings"
        description="Change the name, then try to close the sheet."
        footer={<Button onClick={close}>Save</Button>}
      >
        <Field label="Team name">
          <Input defaultValue="Design" onChange={() => setDirty(true)} />
        </Field>
      </Sheet>
      <AlertDialog
        isOpen={isConfirming}
        onOpenChange={setConfirming}
        title="Discard unsaved changes?"
        description="The team keeps its current name."
        confirmLabel="Discard"
        destructive
        onConfirm={close}
      />
    </>
  );
}
