'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import {
  Avatar, Sidebar, SidebarCollapseButton, SidebarContent, SidebarFooter, SidebarHeader,
  SidebarInset, SidebarItem, SidebarProvider, SidebarSection, SidebarTrigger, type IconName,
} from '../../../components';
import { tokens } from '../../../tokens.stylex';

const pages: { id: string; label: string; icon: IconName }[] = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'inbox', label: 'Inbox', icon: 'inbox' },
  { id: 'projects', label: 'Projects', icon: 'folder' },
  { id: 'calendar', label: 'Calendar', icon: 'calendar' },
  { id: 'members', label: 'Members', icon: 'users' },
];

const s = stylex.create({
  frame: { width: '100%', height: 480, overflow: 'hidden', borderWidth: 1, borderStyle: 'solid', borderColor: tokens['--os-color-border-subtle'], borderRadius: tokens['--os-radius-lg'] },
  page: { display: 'flex', alignItems: 'center', gap: tokens['--os-space-2'], padding: tokens['--os-space-6'], color: tokens['--os-color-fg-base'], fontSize: tokens['--os-font-size-lg'], lineHeight: tokens['--os-line-height-lg'], fontWeight: tokens['--os-font-weight-medium'] },
});

export default function SidebarDefault() {
  const [current, setCurrent] = useState('home');
  return (
    <div {...stylex.props(s.frame)}>
      <SidebarProvider persistKey="quillo-sidebar">
        <Sidebar label="Workspace">
          <SidebarHeader logo={<Avatar name="Quillo" size="xs" shape="square" fallback="gradient" decorative />} title="Quillo" />
          <SidebarContent>
            <SidebarSection>
              {pages.map(page => (
                <SidebarItem key={page.id} icon={page.icon} isCurrent={current === page.id} onPress={() => setCurrent(page.id)}>
                  {page.label}
                </SidebarItem>
              ))}
            </SidebarSection>
          </SidebarContent>
          <SidebarFooter>
            <SidebarCollapseButton />
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <div {...stylex.props(s.page)}><SidebarTrigger />{pages.find(page => page.id === current)?.label}</div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
