'use client';

import { Button, Field, Input, Popover } from '../../../components';

export default function PopoverDefault() {
  return (
    <Popover
      trigger={<Button appearance="tertiary">Rename</Button>}
      title="Rename note"
      description="The new name shows everywhere the note is linked."
      footer={close => <Button size="sm" onClick={close}>Save</Button>}
    >
      <Field label="Name">
        <Input size="sm" defaultValue="Kickoff agenda" />
      </Field>
    </Popover>
  );
}
