'use client';

import { useState } from 'react';
import { AlertDialog, Button, Dialog, Textarea } from '../../../components';

export default function DialogCloseConfirmation() {
  const [isOpen, setOpen] = useState(false);
  const [isConfirming, setConfirming] = useState(false);
  const [note, setNote] = useState('');

  const requestOpen = (next: boolean) => {
    if (next || !note) setOpen(next);
    else setConfirming(true);
  };
  const discard = () => { setNote(''); setOpen(false); };

  return (
    <>
      <Dialog
        trigger={<Button appearance="tertiary">New note</Button>}
        isOpen={isOpen}
        onOpenChange={requestOpen}
        title="New note"
        description="Type something, then press Escape to see the confirmation."
        footer={<>
          <Button appearance="tertiary" onClick={() => requestOpen(false)}>Cancel</Button>
          <Button onClick={discard}>Save note</Button>
        </>}
      >
        <Textarea aria-label="Note" value={note} onChange={event => setNote(event.target.value)} />
      </Dialog>
      <AlertDialog
        isOpen={isConfirming}
        onOpenChange={setConfirming}
        title="Discard this note?"
        description="What you wrote will be lost."
        cancelLabel="Keep writing"
        confirmLabel="Discard"
        destructive
        onConfirm={discard}
      />
    </>
  );
}
