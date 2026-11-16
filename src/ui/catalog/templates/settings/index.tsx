'use client';

import * as stylex from '@stylexjs/stylex';
import { useState, type ReactNode } from 'react';
import {
  AlertDialog, Avatar, Badge, Button, Card, CardPanel, Field, Icon, Input, InputGroup, InputGroupAddon, InputGroupText, Menu,
  MenuItem, MenuSeparator, Meter, RadioGroup, Select, Sidebar, SidebarCollapseButton, SidebarContent, SidebarFooter,
  SidebarHeader, SidebarInset, SidebarItem, SidebarProvider, SidebarSection, SidebarTrigger, Switch, Table, TableBody,
  TableCell, TableColumnHeader, TableHead, TableRow, Tabs, ToastRegion, createToastQueue,
} from '../../../components';
import { tokens as t } from '../../../tokens.stylex';
import {
  frequencies, invoices, languages, members as initialMembers, nav, notifications, plan, timezones, views, workspace,
  workspaceNav, type Member, type Role,
} from './data';

// A settings page in four tabs. Layout is StyleX on the tokens; every control is a library component.

const phone = '@media (max-width: 767px)';

const roleVariant: Record<Role, 'secondary' | 'outline' | 'neutral'> = {
  Owner: 'secondary',
  Admin: 'secondary',
  Member: 'neutral',
  Guest: 'outline',
};

type Notify = (title: string, description?: string) => void;

export default function SettingsTemplate() {
  const [toasts] = useState(() => createToastQueue());
  const [current, setCurrent] = useState('settings');
  const notify: Notify = (title, description) => toasts.add({ title, description, kind: 'success' });

  return (
    <SidebarProvider {...stylex.props(s.app)}>
      <Sidebar label="Halden">
        <SidebarHeader logo={<span {...stylex.props(s.logo)}><Icon name="layers" size={16} /></span>} title="Halden" description="Studio workspace" />
        <SidebarContent>
          <SidebarSection>
            {nav.map(item => (
              <SidebarItem key={item.id} icon={item.icon} badge={item.badge} badgeLabel={item.badge ? `${item.badge} unread` : undefined} isCurrent={current === item.id} onPress={() => setCurrent(item.id)}>
                {item.label}
              </SidebarItem>
            ))}
          </SidebarSection>
          <SidebarSection label="Workspace">
            {workspaceNav.map(item => (
              <SidebarItem key={item.id} icon={item.icon} isCurrent={current === item.id} onPress={() => setCurrent(item.id)}>{item.label}</SidebarItem>
            ))}
          </SidebarSection>
        </SidebarContent>
        <SidebarFooter>
          <SidebarCollapseButton />
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <div {...stylex.props(s.page)}>
          <header {...stylex.props(s.heading)}>
            <SidebarTrigger />
            <div {...stylex.props(s.titles)}>
              <h1 {...stylex.props(s.title)}>Settings</h1>
              <p {...stylex.props(s.subtitle)}>Manage your workspace, the people in it and how you hear from it.</p>
            </div>
          </header>
          <Tabs
            label="Settings sections"
            variant="underline"
            defaultSelectedKey="general"
            items={[
              { id: 'general', label: 'General', content: <General notify={notify} /> },
              { id: 'members', label: 'Members', content: <Members notify={notify} /> },
              { id: 'notifications', label: 'Notifications', content: <Notifications notify={notify} /> },
              { id: 'billing', label: 'Billing', content: <Billing notify={notify} /> },
            ]}
          />
        </div>
      </SidebarInset>
      <ToastRegion queue={toasts} />
    </SidebarProvider>
  );
}

function General({ notify }: { notify: Notify }) {
  const [name, setName] = useState(workspace.name);
  return (
    <div {...stylex.props(s.stack)}>
      <Card
        heading="Workspace"
        description="How the workspace appears to members and guests."
        footer={<SaveFooter hint="Members see changes the next time they load a page." onSave={() => notify('Settings saved', `${name.trim() || 'The workspace'} is up to date.`)} />}
      >
        <div {...stylex.props(s.fields)}>
          <Field label="Workspace name">
            <Input value={name} onChange={event => setName(event.target.value)} />
          </Field>
          <Field label="Address" description="Letters, numbers and dashes.">
            <InputGroup>
              <InputGroupAddon><InputGroupText>halden.example/</InputGroupText></InputGroupAddon>
              <Input defaultValue={workspace.handle} />
            </InputGroup>
          </Field>
          <Field label="Time zone">
            <Select options={timezones} defaultValue={workspace.timezone} />
          </Field>
          <Field label="Language">
            <Select options={languages} defaultValue={workspace.language} />
          </Field>
        </div>
      </Card>

      <Card heading="Projects" description="Defaults for new projects. Changes save as you make them.">
        <div {...stylex.props(s.group)}>
          <RadioGroup label="Default view" options={views} defaultValue={workspace.defaultView} variant="card" orientation="horizontal" />
          <div {...stylex.props(s.rows)}>
            <Switch variant="row" className={rowClass} label="Show completed projects" description="Keep done projects in lists and boards." defaultSelected />
            <Switch variant="row" className={rowClass} label="Let guests invite people" description="Guests can share projects they can see." />
          </div>
        </div>
      </Card>

      <Card
        heading="Delete workspace"
        description="Removes every project, file and member."
        footer={
          <div {...stylex.props(s.footer)}>
            <span {...stylex.props(s.hint)}>This cannot be undone.</span>
            <span {...stylex.props(s.actions)}>
            <AlertDialog
              trigger={<Button size="sm" appearance="destructive">Delete workspace</Button>}
              title={`Delete ${name.trim() || 'this workspace'}?`}
              description="Everyone loses access straight away, and the projects and files in it are deleted after 30 days."
              confirmLabel="Delete workspace"
              destructive
              onConfirm={() => notify('Deletion scheduled', 'The workspace closes in 30 days. Contact support to undo it.')}
            />
            </span>
          </div>
        }
      />
    </div>
  );
}

function Members({ notify }: { notify: Notify }) {
  const [list, setList] = useState(initialMembers);
  const update = (id: string, changes: Partial<Member>) => setList(rows => rows.map(row => (row.id === id ? { ...row, ...changes } : row)));
  return (
    <Card
      heading="Members"
      description={`${list.length} people have access to this workspace.`}
      action={<Button size="sm" leadingIcon={<Icon name="plus" />} onClick={() => notify('Invite link copied', 'Anyone with the link can join as a member for 7 days.')}>Invite</Button>}
    >
      <CardPanel>
        <Table aria-label="Members" variant="plain">
          <TableHead>
            <TableRow>
              <TableColumnHeader>Name</TableColumnHeader>
              <TableColumnHeader>Role</TableColumnHeader>
              <TableColumnHeader>Last active</TableColumnHeader>
              <TableColumnHeader alignEnd><span {...stylex.props(s.hidden)}>Actions</span></TableColumnHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map(member => (
              <TableRow key={member.id}>
                <TableCell>
                  <span {...stylex.props(s.member)}>
                    <Avatar name={member.name} size="sm" decorative />
                    <span {...stylex.props(s.memberText)}>
                      <span {...stylex.props(s.memberName)}>{member.name}</span>
                      <span {...stylex.props(s.muted)}>{member.email}</span>
                    </span>
                  </span>
                </TableCell>
                <TableCell wrap="nowrap"><Badge variant={roleVariant[member.role]} size="sm">{member.role}</Badge></TableCell>
                <TableCell wrap="nowrap"><span {...stylex.props(s.muted)}>{member.lastActive}</span></TableCell>
                <TableCell alignEnd wrap="nowrap">
                  <Menu
                    aria-label={`Actions for ${member.name}`}
                    placement="bottom end"
                    trigger={<Button appearance="text" size="sm" iconOnly aria-label={`Actions for ${member.name}`}><Icon name="more-horizontal" size={16} /></Button>}
                  >
                    <MenuItem isDisabled={member.role === 'Owner' || member.role === 'Admin'} onAction={() => { update(member.id, { role: 'Admin' }); notify('Role changed', `${member.name} is now an admin.`); }}>Make admin</MenuItem>
                    <MenuItem isDisabled={member.role === 'Owner' || member.role === 'Member'} onAction={() => { update(member.id, { role: 'Member' }); notify('Role changed', `${member.name} is now a member.`); }}>Make member</MenuItem>
                    {member.invited && <MenuItem onAction={() => notify('Invite sent again', `We emailed ${member.email}.`)}>Resend invite</MenuItem>}
                    <MenuSeparator />
                    <MenuItem destructive isDisabled={member.role === 'Owner'} onAction={() => { setList(rows => rows.filter(row => row.id !== member.id)); notify('Member removed', `${member.name} no longer has access.`); }}>
                      Remove from workspace
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardPanel>
    </Card>
  );
}

function Notifications({ notify }: { notify: Notify }) {
  return (
    <div {...stylex.props(s.stack)}>
      <Card heading="Email" description="Choose what reaches your inbox. In-app notifications stay on.">
        <div {...stylex.props(s.rows)}>
          {notifications.map(item => <Switch key={item.id} variant="row" className={rowClass} label={item.label} description={item.description} defaultSelected={item.on} />)}
        </div>
      </Card>
      <Card heading="Delivery" description="Group emails so they arrive less often. Changes save as you make them.">
        <RadioGroup
          aria-label="Send emails"
          options={frequencies}
          defaultValue="daily"
          onChange={value => notify('Delivery updated', frequencies.find(item => item.value === value)?.label)}
        />
      </Card>
    </div>
  );
}

function Billing({ notify }: { notify: Notify }) {
  return (
    <div {...stylex.props(s.stack)}>
      <Card heading={plan.name} description={`Billed monthly. Renews on ${plan.renews}.`} action={<Button size="sm" appearance="secondary">Change plan</Button>}>
        <div {...stylex.props(s.fields)}>
          <Meter label="Seats" value={plan.seatsUsed} maxValue={plan.seats} valueLabel={`${plan.seatsUsed} of ${plan.seats}`} />
          <Meter label="Storage" value={plan.storageUsed} maxValue={plan.storage} valueLabel={`${plan.storageUsed} of ${plan.storage} GB`} />
        </div>
      </Card>
      <Card
        heading="Billing details"
        description="Invoices go to this address."
        footer={<SaveFooter hint="Applies from the next invoice." onSave={() => notify('Billing details saved')} />}
      >
        <div {...stylex.props(s.fields)}>
          <Field label="Billing email">
            <Input type="email" defaultValue="accounts@halden.example" />
          </Field>
          <Field label="Currency">
            <Select options={[{ id: 'eur', label: 'Euro (€)' }, { id: 'gbp', label: 'Pound (£)' }, { id: 'usd', label: 'US dollar ($)' }]} defaultValue="eur" />
          </Field>
        </div>
      </Card>
      <Card heading="Invoices">
        <CardPanel>
          <Table aria-label="Invoices" variant="plain">
            <TableHead>
              <TableRow>
                <TableColumnHeader>Date</TableColumnHeader>
                <TableColumnHeader>Description</TableColumnHeader>
                <TableColumnHeader>Status</TableColumnHeader>
                <TableColumnHeader alignEnd>Amount</TableColumnHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map(invoice => (
                <TableRow key={invoice.id}>
                  <TableCell wrap="nowrap">{invoice.date}</TableCell>
                  <TableCell>{invoice.description}</TableCell>
                  <TableCell wrap="nowrap"><Badge variant="success" size="sm">{invoice.status}</Badge></TableCell>
                  <TableCell alignEnd wrap="nowrap"><span {...stylex.props(s.number)}>{invoice.amount}</span></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardPanel>
      </Card>
    </div>
  );
}

/** A card footer: a hint on the start side, the card's one action on the end side (the action never floats in the body). */
function SaveFooter({ hint, onSave }: { hint: ReactNode; onSave: () => void }) {
  return (
    <div {...stylex.props(s.footer)}>
      <span {...stylex.props(s.hint)}>{hint}</span>
      <span {...stylex.props(s.actions)}><Button size="sm" onClick={onSave}>Save changes</Button></span>
    </div>
  );
}

const s = stylex.create({
  app: { backgroundColor: t['--os-color-bg-subtle'], color: t['--os-color-fg-base'], fontFamily: t['--os-font-family'] },
  logo: {
    display: 'grid', placeItems: 'center', width: t['--os-size-sm'], height: t['--os-size-sm'], borderRadius: t['--os-radius-md'],
    backgroundColor: t['--os-color-accent-moderate'], color: t['--os-color-accent-on-accent'],
  },
  page: {
    display: 'grid', gap: t['--os-space-4'], alignContent: 'start', boxSizing: 'border-box', width: '100%', maxWidth: 768, marginInline: 'auto',
    paddingInline: { default: t['--os-space-6'], [phone]: t['--os-space-4'] }, paddingBlock: { default: t['--os-space-6'], [phone]: t['--os-space-4'] },
  },
  heading: { display: 'flex', alignItems: 'center', gap: t['--os-space-2'], minWidth: 0, paddingBlockEnd: t['--os-space-2'] },
  titles: { display: 'grid', gap: t['--os-space-0-5'], minWidth: 0 },
  title: {
    margin: 0, fontSize: t['--os-font-size-lg'], lineHeight: t['--os-line-height-lg'], fontWeight: t['--os-font-weight-medium'],
    letterSpacing: t['--os-tracking-tight'],
  },
  subtitle: { margin: 0, color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-caption'], letterSpacing: t['--os-tracking-tight'], lineHeight: t['--os-line-height-sm'] },
  // Spacing tiers (spec 1.11): 8 inside a field, 20 between fields and rows, 32 between sections. A section gap
  // larger than a card's own 20px padding is what makes each card read as its own group.
  stack: { display: 'grid', gap: t['--os-space-8'], paddingBlockStart: t['--os-space-6'] },
  fields: { display: 'grid', columnGap: t['--os-space-4'], rowGap: t['--os-space-5'], alignItems: 'start', gridTemplateColumns: { default: 'repeat(2, minmax(0, 1fr))', [phone]: 'minmax(0, 1fr)' } },
  group: { display: 'grid', gap: t['--os-space-5'] },
  rows: { display: 'grid' },
  // Settings rows: 16 above and below the text, a hairline between rows, none outside the list.
  row: {
    paddingBlockStart: { default: t['--os-space-4'], ':first-child': 0 },
    paddingBlockEnd: { default: t['--os-space-4'], ':last-child': 0 },
    borderTopWidth: { default: 1, ':first-child': 0 },
    borderTopStyle: 'solid',
    borderTopColor: t['--os-color-border-subtle'],
  },
  footer: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', columnGap: t['--os-space-4'], rowGap: t['--os-space-2'], width: '100%' },
  // When the footer wraps on a phone, the hint takes the line and the action stays on the end side.
  actions: { display: 'flex', gap: t['--os-space-2'], marginInlineStart: 'auto' },
  hint: { flexGrow: 1, flexBasis: 200, minWidth: 0, color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-sm'], letterSpacing: t['--os-tracking-tight'] },
  member: { display: 'flex', alignItems: 'center', gap: t['--os-space-3'], minWidth: 0 },
  memberText: { display: 'grid', minWidth: 0 },
  memberName: { fontWeight: t['--os-font-weight-medium'] },
  muted: { color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-caption'], letterSpacing: t['--os-tracking-tight'], lineHeight: t['--os-line-height-sm'] },
  number: { fontVariantNumeric: 'tabular-nums' },
  hidden: {
    position: 'absolute', width: 1, height: 1, margin: -1, padding: 0, overflow: 'hidden', clipPath: 'inset(50%)', whiteSpace: 'nowrap',
  },
});

const rowClass = stylex.props(s.row).className;
