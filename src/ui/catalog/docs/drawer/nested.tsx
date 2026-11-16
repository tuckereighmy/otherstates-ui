'use client';

import { Button, Checkbox, Drawer } from '../../../components';

export default function DrawerNested() {
  return (
    <Drawer
      trigger={<Button appearance="tertiary">Export</Button>}
      title="Export projects"
      description="Choose what goes into the archive."
      footer={close => <Button onClick={close}>Export</Button>}
    >
      <Checkbox label="Notes" defaultChecked />
      <Checkbox label="Invoices" defaultChecked />
      <div>
        <Drawer
          trigger={<Button appearance="secondary" size="sm">About archives</Button>}
          title="About archives"
          description="Archives are kept for seven days. A link to download one is sent by email."
          footer={close => <Button onClick={close}>Back</Button>}
        />
      </div>
    </Drawer>
  );
}
