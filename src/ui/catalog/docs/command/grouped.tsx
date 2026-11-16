'use client';

import { Button, Command, Icon } from '../../../components';
import type { CommandAction } from '../../../components';

const actions: CommandAction[] = [
  { id: 'inbox', group: 'Go to', label: 'Inbox', icon: <Icon name="inbox" size={16} />, onAction: () => {} },
  { id: 'projects', group: 'Go to', label: 'Projects', icon: <Icon name="folder" size={16} />, onAction: () => {} },
  { id: 'calendar', group: 'Go to', label: 'Calendar', icon: <Icon name="calendar" size={16} />, onAction: () => {} },
  { id: 'note', group: 'Create', label: 'New note', icon: <Icon name="file" size={16} />, shortcut: 'N', onAction: () => {} },
  { id: 'invoice', group: 'Create', label: 'New invoice', icon: <Icon name="credit-card" size={16} />, onAction: () => {} },
  { id: 'members', group: 'Settings', label: 'Team members', icon: <Icon name="users" size={16} />, onAction: () => {} },
  { id: 'export', group: 'Settings', label: 'Export workspace', icon: <Icon name="download" size={16} />, isDisabled: true, onAction: () => {} },
];

export default function CommandGrouped() {
  return (
    <Command
      trigger={
        <Button appearance="secondary" leadingIcon={<Icon name="search" />}>
          Jump to
        </Button>
      }
      actions={actions}
    />
  );
}
