'use client';

import { useState } from 'react';
import { Button, Command, Icon, Kbd, KbdGroup } from '../../../components';

export default function CommandKeyboardShortcut() {
  const [open, setOpen] = useState(false);

  return (
    <Command
      isOpen={open}
      onOpenChange={setOpen}
      shortcutKey="j"
      trigger={
        <Button
          appearance="secondary"
          leadingIcon={<Icon name="command" />}
          trailingIcon={<KbdGroup size="sm"><Kbd>⌘</Kbd><Kbd>J</Kbd></KbdGroup>}
        >
          Quick actions
        </Button>
      }
      actions={[
        { id: 'deploy', label: 'Deploy to staging', shortcut: '⌘D', onAction: () => {} },
        { id: 'logs', label: 'Open build logs', shortcut: '⌘L', onAction: () => {} },
        { id: 'env', label: 'Edit environment variables', onAction: () => {} },
      ]}
    />
  );
}
