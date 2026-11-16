'use client';

import { AlertDialog, Button } from '../../../components';

export default function AlertDialogCustomFooter() {
  return (
    <AlertDialog
      trigger={<Button appearance="tertiary">Close invoice</Button>}
      title="Save changes to this invoice?"
      description="You edited two line items since the last save."
      footer={close => (
        <>
          <Button appearance="destructive-outline" onClick={close}>Discard</Button>
          <Button appearance="tertiary" onClick={close}>Keep editing</Button>
          <Button onClick={close}>Save</Button>
        </>
      )}
    />
  );
}
