'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Checkbox, Table, TableBody, TableCell, TableColumnHeader, TableHead, TableRow } from '../../../components';

const members = [
  { id: 'ana', name: 'Ana', role: 'Owner' },
  { id: 'jonas', name: 'Jonas', role: 'Editor' },
  { id: 'priya', name: 'Priya', role: 'Viewer' },
];

const s = stylex.create({
  root: { width: 440, maxWidth: '100%' },
  check: { width: 48 },
});

export default function TableSelection() {
  const [selected, setSelected] = useState(new Set(['jonas']));
  const toggle = (id: string, on: boolean) => {
    const next = new Set(selected);
    if (on) next.add(id); else next.delete(id);
    setSelected(next);
  };

  return (
    <div {...stylex.props(s.root)}>
      <Table aria-label="Members">
        <TableHead>
          <TableRow>
            <TableColumnHeader {...stylex.props(s.check)}>
              <Checkbox
                aria-label="Select all members"
                isSelected={selected.size === members.length}
                isIndeterminate={selected.size > 0 && selected.size < members.length}
                onChange={on => setSelected(new Set(on ? members.map(m => m.id) : []))}
              />
            </TableColumnHeader>
            <TableColumnHeader>Name</TableColumnHeader>
            <TableColumnHeader>Role</TableColumnHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {members.map(member => (
            <TableRow key={member.id} isSelected={selected.has(member.id)}>
              <TableCell>
                <Checkbox aria-label={`Select ${member.name}`} isSelected={selected.has(member.id)} onChange={on => toggle(member.id, on)} />
              </TableCell>
              <TableCell>{member.name}</TableCell>
              <TableCell>{member.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
