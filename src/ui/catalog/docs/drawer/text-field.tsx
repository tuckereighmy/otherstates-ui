'use client';

import { Button, Drawer, Field, Textarea } from '../../../components';

export default function DrawerTextField() {
  return (
    <Drawer
      trigger={<Button appearance="tertiary">Add comment</Button>}
      title="Add a comment"
      description="On a phone, the drawer waits for the keyboard and rests above it."
      footer={close => (
        <>
          <Button appearance="tertiary" onClick={close}>Cancel</Button>
          <Button onClick={close}>Post comment</Button>
        </>
      )}
    >
      <Field label="Comment">
        <Textarea autoFocus placeholder="Looks good to me" />
      </Field>
    </Drawer>
  );
}
