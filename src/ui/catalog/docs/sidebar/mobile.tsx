'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import {
  Avatar, Sidebar, SidebarContent, SidebarHeader, SidebarInset,
  SidebarItem, SidebarProvider, SidebarSection, SidebarTrigger, type IconName,
} from '../../../components';
import { tokens } from '../../../tokens.stylex';

const pages: { id: string; label: string; icon: IconName }[] = [
  { id: 'today', label: 'Today', icon: 'clock' },
  { id: 'upcoming', label: 'Upcoming', icon: 'calendar' },
  { id: 'projects', label: 'Projects', icon: 'folder' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

const s = stylex.create({
  phone: { width: '100%', maxWidth: 360, height: 360, overflow: 'hidden', borderWidth: 1, borderStyle: 'solid', borderColor: tokens['--os-color-border-subtle'], borderRadius: tokens['--os-radius-xl'], backgroundColor: tokens['--os-color-bg-canvas'] },
  bar: { display: 'flex', alignItems: 'center', gap: tokens['--os-space-2'], padding: tokens['--os-space-3'], color: tokens['--os-color-fg-base'], fontSize: tokens['--os-font-size-sm'], lineHeight: tokens['--os-line-height-md'], fontWeight: tokens['--os-font-weight-medium'] },
});

export default function SidebarMobile() {
  const [current, setCurrent] = useState('today');
  return (
    <div {...stylex.props(s.phone)}>
      <SidebarProvider mobile>
        <Sidebar label="Planner">
          <SidebarHeader logo={<Avatar name="Ines" size="xs" decorative />} title="Ines" description="Personal planner" />
          <SidebarContent>
            <SidebarSection>
              {pages.map(page => (
                <SidebarItem key={page.id} icon={page.icon} isCurrent={current === page.id} onPress={() => setCurrent(page.id)}>{page.label}</SidebarItem>
              ))}
            </SidebarSection>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <div {...stylex.props(s.bar)}><SidebarTrigger />{pages.find(page => page.id === current)?.label}</div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
