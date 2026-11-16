'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import {
  Button, Sidebar, SidebarContent, SidebarInset, SidebarItem,
  SidebarProvider, SidebarSection, SidebarTrigger, type IconName,
} from '../../../components';
import { tokens } from '../../../tokens.stylex';

const pages: { id: string; label: string; icon: IconName }[] = [
  { id: 'overview', label: 'Overview', icon: 'grid' },
  { id: 'invoices', label: 'Invoices', icon: 'file' },
  { id: 'expenses', label: 'Expenses', icon: 'tag' },
  { id: 'schedule', label: 'Schedule', icon: 'calendar' },
];

const s = stylex.create({
  frame: { width: '100%', height: 360, overflow: 'hidden', borderWidth: 1, borderStyle: 'solid', borderColor: tokens['--os-color-border-subtle'], borderRadius: tokens['--os-radius-lg'] },
  page: { display: 'flex', alignItems: 'center', gap: tokens['--os-space-2'], padding: tokens['--os-space-6'] },
});

export default function SidebarControlled() {
  const [collapsed, setCollapsed] = useState(false);
  const [current, setCurrent] = useState('invoices');
  return (
    <div {...stylex.props(s.frame)}>
      <SidebarProvider collapsed={collapsed} onCollapsedChange={setCollapsed}>
        <Sidebar label="Billing">
          <SidebarContent>
            <SidebarSection label="Billing">
              {pages.map(page => (
                <SidebarItem key={page.id} icon={page.icon} isCurrent={current === page.id} onPress={() => setCurrent(page.id)}>{page.label}</SidebarItem>
              ))}
            </SidebarSection>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <div {...stylex.props(s.page)}>
            <SidebarTrigger />
            <Button size="sm" appearance="secondary" onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? 'Show labels' : 'Icons only'}
            </Button>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
