'use client';

import { Button, Command, Icon } from '../../../components';

export default function CommandDescriptions() {
  return (
    <Command
      placeholder="Search settings…"
      trigger={
        <Button appearance="secondary" leadingIcon={<Icon name="settings" />}>
          Settings
        </Button>
      }
      actions={[
        { id: 'profile', label: 'Profile', description: 'Name, photo and time zone', icon: <Icon name="user" size={16} />, onAction: () => {} },
        { id: 'alerts', label: 'Notifications', description: 'Email and in-app alerts', icon: <Icon name="bell" size={16} />, onAction: () => {} },
        { id: 'security', label: 'Security', description: 'Password and two-step sign-in', icon: <Icon name="lock" size={16} />, onAction: () => {} },
      ]}
    />
  );
}
