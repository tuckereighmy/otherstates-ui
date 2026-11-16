'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import {
  Sidebar, SidebarCollapseButton, SidebarContent, SidebarFooter, SidebarInset,
  SidebarItem, SidebarProvider, SidebarSection, SidebarTrigger, type IconName,
} from '../../../components';
import { tokens } from '../../../tokens.stylex';

type Page = { id: string; label: string; icon: IconName; badge?: number; badgeLabel?: string; disabled?: boolean };

const sections: { label?: string; pages: Page[] }[] = [
  { pages: [{ id: 'home', label: 'Home', icon: 'home' }, { id: 'inbox', label: 'Inbox', icon: 'inbox', badge: 12, badgeLabel: '12 unread' }] },
  { label: 'Projects', pages: [{ id: 'refresh', label: 'Website refresh', icon: 'layers' }, { id: 'field', label: 'Field notes', icon: 'file' }, { id: 'archive', label: 'Archive', icon: 'bookmark', disabled: true }] },
  { label: 'Team', pages: [{ id: 'members', label: 'Members', icon: 'users', badge: 2, badgeLabel: '2 pending invites' }, { id: 'settings', label: 'Settings', icon: 'settings' }] },
];

const s = stylex.create({
  frame: { width: '100%', height: 520, overflow: 'hidden', borderWidth: 1, borderStyle: 'solid', borderColor: tokens['--os-color-border-subtle'], borderRadius: tokens['--os-radius-lg'] },
  page: { display: 'flex', alignItems: 'center', gap: tokens['--os-space-2'], padding: tokens['--os-space-6'] },
});

export default function SidebarSectionsBadges() {
  const [current, setCurrent] = useState('refresh');
  return (
    <div {...stylex.props(s.frame)}>
      <SidebarProvider>
        <Sidebar label="Studio">
          <SidebarContent>
            {sections.map(section => (
              <SidebarSection key={section.label ?? 'main'} label={section.label}>
                {section.pages.map(page => (
                  <SidebarItem key={page.id} icon={page.icon} badge={page.badge} badgeLabel={page.badgeLabel} isDisabled={page.disabled} isCurrent={current === page.id} onPress={() => setCurrent(page.id)}>
                    {page.label}
                  </SidebarItem>
                ))}
              </SidebarSection>
            ))}
          </SidebarContent>
          <SidebarFooter>
            <SidebarCollapseButton />
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <div {...stylex.props(s.page)}><SidebarTrigger /></div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
