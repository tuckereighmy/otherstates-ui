'use client';

import { useState } from 'react';
import { Button, Icon, Menu, MenuGroup, MenuItem } from '../../../components';

const labels: Record<string, string> = { updated: 'Last updated', created: 'Date created', name: 'Name' };

export default function MenuRadioGroup() {
  const [sort, setSort] = useState('updated');

  return (
    <Menu
      aria-label="Sort projects"
      trigger={
        <Button appearance="secondary" leadingIcon={<Icon name="sort" />}>
          {labels[sort]}
        </Button>
      }
    >
      <MenuGroup
        label="Sort by"
        selectionMode="single"
        selectedKeys={[sort]}
        onSelectionChange={keys => setSort(String([...keys][0]))}
      >
        <MenuItem id="updated">Last updated</MenuItem>
        <MenuItem id="created">Date created</MenuItem>
        <MenuItem id="name">Name</MenuItem>
      </MenuGroup>
    </Menu>
  );
}
