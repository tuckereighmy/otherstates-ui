'use client';

import { Button, Command, Icon } from '../../../components';

export default function CommandDefault() {
  return (
    <Command
      trigger={
        <Button appearance="secondary" leadingIcon={<Icon name="search" />}>
          Search commands
        </Button>
      }
      actions={[
        { id: 'new-project', label: 'New project', onAction: () => {} },
        { id: 'invite', label: 'Invite a teammate', onAction: () => {} },
        { id: 'billing', label: 'Open billing', onAction: () => {} },
        { id: 'theme', label: 'Switch theme', onAction: () => {} },
        { id: 'sign-out', label: 'Sign out', onAction: () => {} },
      ]}
    />
  );
}
