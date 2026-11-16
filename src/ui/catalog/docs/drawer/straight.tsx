'use client';

import { Button, Drawer, Switch } from '../../../components';

export default function DrawerStraight() {
  return (
    <Drawer
      variant="straight"
      trigger={<Button appearance="tertiary">Sharing</Button>}
      title="Sharing"
      description="A straight drawer has square corners."
      footer={close => <Button onClick={close}>Done</Button>}
    >
      <Switch label="Anyone with the link can view" defaultChecked />
      <Switch label="Allow comments" />
    </Drawer>
  );
}
