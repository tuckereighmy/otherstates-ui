'use client';

import { Button, Dialog, Field, Input } from '../../../components';

export default function DialogDefault() {
  return (
    <Dialog
      trigger={<Button appearance="tertiary">Edit profile</Button>}
      title="Edit profile"
      description="Your display name appears to everyone in your workspace."
      footer={close => (
        <>
          <Button appearance="tertiary" onClick={close}>
            Cancel
          </Button>
          <Button onClick={close}>Save</Button>
        </>
      )}
    >
      <Field label="Display name">
        <Input defaultValue="Maya" />
      </Field>
    </Dialog>
  );
}
