'use client';

import { AlertDialog, Button } from '../../../components';

export default function AlertDialogPrimaryAction() {
  return (
    <AlertDialog
      size="sm"
      trigger={<Button appearance="tertiary">Publish changes</Button>}
      title="Publish these changes?"
      description="Everyone with access to the project will see them right away."
      confirmLabel="Publish"
      onConfirm={() => {}}
    />
  );
}
