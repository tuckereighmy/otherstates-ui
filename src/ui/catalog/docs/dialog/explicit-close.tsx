'use client';

import { Button, Dialog, RadioGroup } from '../../../components';

const workspaces = [
  { value: 'studio', label: 'Studio' },
  { value: 'finance', label: 'Finance' },
];

export default function DialogExplicitClose() {
  return (
    <Dialog
      trigger={<Button appearance="tertiary">Choose workspace</Button>}
      title="Choose a workspace"
      description="New projects are saved here. You can change it later in team settings."
      isDismissable={false}
      isKeyboardDismissDisabled
      footer={close => <Button onClick={close}>Continue</Button>}
    >
      <RadioGroup label="Workspace" name="workspace" defaultValue="studio" options={workspaces} />
    </Dialog>
  );
}
