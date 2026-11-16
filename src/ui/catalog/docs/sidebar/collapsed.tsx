'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import {
  Avatar, Sidebar, SidebarCollapseButton, SidebarContent, SidebarFooter, SidebarHeader,
  SidebarInset, SidebarItem, SidebarProvider, SidebarSection, SidebarTrigger,
} from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  frame: { width: '100%', height: 400, overflow: 'hidden', borderWidth: 1, borderStyle: 'solid', borderColor: tokens['--os-color-border-subtle'], borderRadius: tokens['--os-radius-lg'] },
  page: { display: 'flex', alignItems: 'center', gap: tokens['--os-space-2'], padding: tokens['--os-space-6'], color: tokens['--os-color-fg-muted'], fontSize: tokens['--os-font-size-sm'], lineHeight: tokens['--os-line-height-md'] },
});

export default function SidebarCollapsed() {
  const [current, setCurrent] = useState('notes');
  return (
    <div {...stylex.props(s.frame)}>
      <SidebarProvider defaultCollapsed>
        <Sidebar label="Notebook">
          <SidebarHeader logo={<Avatar name="Teo" size="xs" decorative />} title="Teo's notebook" />
          <SidebarContent>
            <SidebarSection>
              <SidebarItem icon="home" isCurrent={current === 'home'} onPress={() => setCurrent('home')}>Home</SidebarItem>
              <SidebarItem icon="file" isCurrent={current === 'notes'} onPress={() => setCurrent('notes')}>Notes</SidebarItem>
              <SidebarItem icon="inbox" badge={3} badgeLabel="3 unread" isCurrent={current === 'inbox'} onPress={() => setCurrent('inbox')}>Inbox</SidebarItem>
              <SidebarItem icon="star" isCurrent={current === 'starred'} onPress={() => setCurrent('starred')}>Starred</SidebarItem>
            </SidebarSection>
          </SidebarContent>
          <SidebarFooter>
            <SidebarCollapseButton />
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <div {...stylex.props(s.page)}><SidebarTrigger />Three notes changed since Friday.</div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
