'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import {
  Button, Sidebar, SidebarCollapseButton, SidebarContent, SidebarFooter, SidebarInset,
  SidebarItem, SidebarProvider, SidebarSection, SidebarTrigger,
} from '../../../components';
import { tokens } from '../../../tokens.stylex';

const notes = [
  { title: 'Launch checklist', meta: 'Mira, 2 hours ago' },
  { title: 'Interview notes', meta: 'Teo, yesterday' },
  { title: 'Venue options', meta: 'Ines, Monday' },
];

const s = stylex.create({
  frame: { width: '100%', height: 440, overflow: 'hidden', borderWidth: 1, borderStyle: 'solid', borderColor: tokens['--os-color-border-subtle'], borderRadius: tokens['--os-radius-lg'] },
  bar: { display: 'flex', alignItems: 'center', gap: tokens['--os-space-2'], paddingInline: tokens['--os-space-6'], paddingBlock: tokens['--os-space-4'], color: tokens['--os-color-fg-base'], fontSize: tokens['--os-font-size-lg'], lineHeight: tokens['--os-line-height-lg'], fontWeight: tokens['--os-font-weight-medium'] },
  title: { flexGrow: 1, minWidth: 0 },
  list: { display: 'grid', gap: tokens['--os-space-2'], margin: 0, paddingInline: tokens['--os-space-6'], paddingBlock: 0, listStyleType: 'none' },
  row: { display: 'grid', gap: tokens['--os-space-0-5'], padding: tokens['--os-space-4'], borderRadius: tokens['--os-radius-lg'], backgroundColor: tokens['--os-color-bg-surface'], color: tokens['--os-color-fg-base'], fontSize: tokens['--os-font-size-sm'], lineHeight: tokens['--os-line-height-md'] },
  meta: { color: tokens['--os-color-fg-muted'], fontSize: tokens['--os-font-size-xs'], lineHeight: tokens['--os-line-height-xs'] },
});

export default function SidebarWithInset() {
  const [current, setCurrent] = useState('notes');
  return (
    <div {...stylex.props(s.frame)}>
      <SidebarProvider>
        <Sidebar label="Notes app">
          <SidebarContent>
            <SidebarSection>
              <SidebarItem icon="file" isCurrent={current === 'notes'} onPress={() => setCurrent('notes')}>All notes</SidebarItem>
              <SidebarItem icon="star" isCurrent={current === 'starred'} onPress={() => setCurrent('starred')}>Starred</SidebarItem>
              <SidebarItem icon="users" isCurrent={current === 'shared'} onPress={() => setCurrent('shared')}>Shared with me</SidebarItem>
            </SidebarSection>
          </SidebarContent>
          <SidebarFooter>
            <SidebarCollapseButton />
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header {...stylex.props(s.bar)}>
            <SidebarTrigger />
            <span {...stylex.props(s.title)}>All notes</span>
            <Button size="sm">New note</Button>
          </header>
          <ul {...stylex.props(s.list)}>
            {notes.map(note => (
              <li key={note.title} {...stylex.props(s.row)}>{note.title}<span {...stylex.props(s.meta)}>{note.meta}</span></li>
            ))}
          </ul>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
