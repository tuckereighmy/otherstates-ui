'use client';

import { Button, Command, Icon, Kbd } from '../../../components';

export default function CommandCustomFooter() {
  return (
    <Command
      emptyMessage="No teammates match that name."
      placeholder="Find a teammate…"
      trigger={
        <Button appearance="secondary" leadingIcon={<Icon name="users" />}>
          Find a teammate
        </Button>
      }
      footer={<span>3 teammates · <Kbd size="sm">↵</Kbd> opens a profile</span>}
      actions={[
        { id: 'noor', label: 'Noor Haddad', description: 'Design', onAction: () => {} },
        { id: 'tomas', label: 'Tomás Reyes', description: 'Engineering', onAction: () => {} },
        { id: 'wen', label: 'Wen Zhao', description: 'Support', onAction: () => {} },
      ]}
    />
  );
}
