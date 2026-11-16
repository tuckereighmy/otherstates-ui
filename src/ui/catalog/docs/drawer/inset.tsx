'use client';

import { Button, Drawer, Switch } from '../../../components';

export default function DrawerInset() {
  return (
    <Drawer
      variant="inset"
      trigger={<Button appearance="tertiary">Display</Button>}
      title="Display"
      description="An inset drawer floats 8px from the screen edges."
      footer={close => <Button onClick={close}>Done</Button>}
    >
      <Switch label="Compact rows" defaultChecked />
      <Switch label="Show archived projects" />
    </Drawer>
  );
}
