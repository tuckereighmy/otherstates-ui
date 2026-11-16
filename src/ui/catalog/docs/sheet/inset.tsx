'use client';

import { Button, Field, Input, Sheet, Textarea } from '../../../components';

export default function SheetInset() {
  return (
    <Sheet
      variant="inset"
      trigger={<Button appearance="tertiary">New project</Button>}
      title="New project"
      description="Projects group notes, files and deployments."
      footer={close => (
        <>
          <Button appearance="tertiary" onClick={close}>Cancel</Button>
          <Button onClick={close}>Create project</Button>
        </>
      )}
    >
      <Field label="Name">
        <Input placeholder="Quarterly report" />
      </Field>
      <Field label="Description" description="Optional. Shown on the project card.">
        <Textarea />
      </Field>
    </Sheet>
  );
}
