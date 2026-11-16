'use client';

import { Button, Checkbox, Sheet } from '../../../components';

export default function SheetDefault() {
  return (
    <Sheet
      trigger={<Button appearance="tertiary">Notifications</Button>}
      title="Notification preferences"
      description="Choose what your workspace sends by email."
      footer={close => (
        <>
          <Button appearance="tertiary" onClick={close}>Cancel</Button>
          <Button onClick={close}>Save</Button>
        </>
      )}
    >
      <Checkbox label="Weekly activity digest" defaultChecked />
      <Checkbox label="Mentions and replies" defaultChecked />
      <Checkbox label="Invoice reminders" />
    </Sheet>
  );
}
