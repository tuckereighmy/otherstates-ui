'use client';

import { Button, Dialog, Field, Input } from '../../../components';

export default function DialogNested() {
  return (
    <Dialog
      trigger={<Button appearance="tertiary">Invite people</Button>}
      title="Invite people"
      description="New members join as editors unless you choose otherwise."
      footer={close => (
        <>
          <Button appearance="tertiary" onClick={close}>Cancel</Button>
          <Button onClick={close}>Send invites</Button>
        </>
      )}
    >
      <Field label="Email addresses">
        <Input placeholder="name@example.com" />
      </Field>
      <div>
        <Dialog
          size="sm"
          trigger={<Button appearance="secondary" size="sm">About roles</Button>}
          title="Roles"
          description="Editors can change projects and invoices. Viewers can read and comment."
          footer={close => <Button onClick={close}>Back</Button>}
        />
      </div>
    </Dialog>
  );
}
