'use client';

import { Button, Checkbox, Drawer } from '../../../components';

export default function DrawerDefault() {
  return (
    <Drawer
      trigger={<Button appearance="tertiary">Filters</Button>}
      title="Filters"
      description="Narrow the project list."
      footer={close => (
        <>
          <Button appearance="tertiary" onClick={close}>Cancel</Button>
          <Button onClick={close}>Apply filters</Button>
        </>
      )}
    >
      <Checkbox label="Assigned to me" defaultChecked />
      <Checkbox label="Updated this week" />
      <Checkbox label="Has open invoices" />
    </Drawer>
  );
}
