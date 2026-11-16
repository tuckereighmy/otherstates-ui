# Sidebar

A navigation panel that folds to its icons, and moves into a sheet on small screens.

Category: Navigation · Exports: `SidebarProvider`, `Sidebar`, `SidebarHeader`, `SidebarContent`, `SidebarSection`, `SidebarItem`, `SidebarFooter`, `SidebarCollapseButton`, `SidebarInset`, `SidebarTrigger`, `useSidebar`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import {
  Sidebar, SidebarCollapseButton, SidebarContent, SidebarFooter, SidebarHeader,
  SidebarInset, SidebarItem, SidebarProvider, SidebarSection, SidebarTrigger,
} from '@/ui/components';

<SidebarProvider persistKey="app-sidebar">
  <Sidebar label="Workspace">
    <SidebarHeader logo={<Logo />} title="Quillo" />
    <SidebarContent>
      <SidebarSection label="Projects">
        <SidebarItem icon="home" href="/" isCurrent>Home</SidebarItem>
        <SidebarItem icon="inbox" href="/inbox" badge={4}>Inbox</SidebarItem>
      </SidebarSection>
    </SidebarContent>
    <SidebarFooter>
      <SidebarCollapseButton />
    </SidebarFooter>
  </Sidebar>
  <SidebarInset>
    <SidebarTrigger />
    <main>…</main>
  </SidebarInset>
</SidebarProvider>
```

## SidebarProvider

Holds the collapsed state and lays the sidebar and its SidebarInset out in a row. ⌘B (Ctrl+B outside Apple platforms) toggles the sidebar that holds focus, or the first on the page, unless focus is in a text field.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `collapsed` | `boolean` |  | Collapsed state (controlled). |
| `defaultCollapsed` | `boolean` | `false` | Collapsed state at first (uncontrolled). A value stored under `persistKey` wins. |
| `onCollapsedChange` | `(collapsed: boolean) => void` |  | Called with the new state when the panel folds or unfolds. |
| `persistKey` | `string` |  | A localStorage key. The collapsed state is saved there and read back on the next visit; storage errors are ignored. |
| `keyboardShortcut` | `boolean` | `true` | Wires up ⌘B / Ctrl+B for this provider. |
| `mobile` | `boolean` |  | Forces the mobile sheet on or off. By default it follows a 768px media query. |

## Sidebar

The navigation panel, a `nav` landmark. Below 768px it renders inside a left Sheet.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'floating' \| 'docked'` | `'floating'` | `floating`: a raised surface 8px from the frame. `docked`: full height with an edge hairline and no radius. |
| `label` | `string` | `'Navigation'` | Names the navigation landmark and titles the mobile sheet. |
| `children` | `ReactNode` |  | SidebarHeader, SidebarContent and SidebarFooter. |
| `className` | `string` |  | A class added to the panel. |
| `style` | `CSSProperties` |  | Inline styles on the panel. Set `--os-sidebar-width` to change the 240px expanded width. |
| `ref` | `Ref<HTMLElement>` |  | A ref to the `nav` element. |

## SidebarHeader

The brand row on top. Its words fold away with the labels; extra children are inert while collapsed.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `logo` | `ReactNode` |  | An Avatar or logo of 24 to 32px, centered on the icon column. |
| `title` | `ReactNode` |  | The product or workspace name beside the logo. |
| `description` | `ReactNode` |  | A second line under the title, 12/16 in `fg-muted`. |

## SidebarContent

The middle of the panel, which scrolls when the items do not fit.

## SidebarSection

A list of items, optionally under a label.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` |  | A heading for the group, 12/16 500 in `fg-muted`. It names the group and becomes a hairline while collapsed. |

## SidebarItem

One destination: a link when it has `href`, otherwise a button. 36px tall like a menu item (44 on touch screens), 14/20, `fg-muted` until hovered or current.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `icon` (required) | `IconName \| ReactElement` |  | The 16px glyph that stays visible while collapsed. |
| `children` (required) | `ReactNode` |  | The label. Visually hidden while collapsed and shown in a tooltip then. |
| `href` | `string` |  | Renders a link to this URL. |
| `target` | `string` |  | The link target, with `href`. |
| `rel` | `string` |  | The link rel, with `href`. |
| `onPress` | `() => void` |  | Called on click, tap or Enter. In the mobile sheet the sheet also closes. |
| `isCurrent` | `boolean` | `false` | Marks the current page: a `bg-interactive-primary` fill, weight 500 and `aria-current="page"`. |
| `badge` | `ReactNode` |  | A count at the end of the row. While collapsed it becomes a dot on the icon. |
| `badgeLabel` | `string` |  | Words read after the label in place of the bare count, such as "4 unread". |
| `isDisabled` | `boolean` | `false` | Shows the item in `fg-disabled` and takes it out of the tab order. |
| `className` | `string` |  | A class added to the link or button. |
| `style` | `CSSProperties` |  | Inline styles on the link or button. |
| `ref` | `Ref<HTMLElement>` |  | A ref to the link or button. |

## SidebarFooter

The bottom of the panel under a hairline, for the collapse button, settings or an account.

## SidebarCollapseButton

Folds and unfolds the panel, with `aria-expanded` and `aria-controls`. It shows the shortcut while expanded and is left out of the mobile sheet.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `collapseLabel` | `string` | `'Collapse'` | The label and name while expanded. |
| `expandLabel` | `string` | `'Expand'` | The name and tooltip while collapsed. |
| `className` | `string` |  | A class added to the button. |
| `style` | `CSSProperties` |  | Inline styles on the button. |
| `ref` | `Ref<HTMLButtonElement>` |  | A ref to the button. |

## SidebarInset

The page area beside the panel. It fills the rest of the row and scrolls on its own.

## SidebarTrigger

A 32px icon button that opens the mobile sheet. It renders nothing at desktop widths.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `'Open navigation'` | The accessible name of the button. |
| `className` | `string` |  | A class added to the button. |
| `style` | `CSSProperties` |  | Inline styles on the button. |
| `ref` | `Ref<HTMLButtonElement>` |  | A ref to the button. |

## useSidebar

Reads the nearest SidebarProvider from any component inside it. It returns the fields below and throws outside a provider.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `collapsed` | `boolean` |  | True while the desktop panel shows only its icons. |
| `setCollapsed` | `(collapsed: boolean) => void` |  | Folds or unfolds the panel. |
| `toggle` | `() => void` |  | Toggles the panel, or the sheet below the breakpoint. |
| `isMobile` | `boolean` |  | True while the panel lives in the mobile sheet. |
| `mobileOpen` | `boolean` |  | Whether the mobile sheet is open. |
| `setMobileOpen` | `(open: boolean) => void` |  | Opens or closes the mobile sheet. |
| `panelId` | `string` |  | The id of the panel, for `aria-controls`. |
| `keyboardShortcut` | `boolean` |  | Whether ⌘B / Ctrl+B is active for this provider. |

## Accessibility

- The panel is a `nav` landmark named by `label`. Items are links (with `href`) or buttons in the normal tab order, and the current one carries `aria-current="page"`.
- Collapsed labels are visually hidden, not removed, so every item keeps its name; a tooltip shows the label on hover and at once on keyboard focus.
- A section label names its group (`role="group"`). A badge count is read with its item, or as `badgeLabel` when you give one.
- The collapse button has `aria-expanded`, `aria-controls` and `aria-keyshortcuts`. ⌘B or Ctrl+B toggles the panel, except while typing in a text field.
- Below 768px the panel opens in a modal Sheet: focus moves into it, Escape closes it and focus returns to the trigger.
- Items show the inset focus ring. With reduced motion the panel folds and unfolds at once.

## Examples

### Default

`src/ui/catalog/docs/sidebar/default.tsx`

```tsx
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
```

### Collapsed by default

`defaultCollapsed` starts on the icon column. Each icon shows its label in a tooltip on hover or keyboard focus, and a count becomes a dot.

`src/ui/catalog/docs/sidebar/collapsed.tsx`

```tsx
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
```

### Docked

`variant="docked"` runs the full height of the frame with a hairline on its inner edge and no radius.

`src/ui/catalog/docs/sidebar/docked.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import {
  Avatar, Sidebar, SidebarCollapseButton, SidebarContent, SidebarFooter, SidebarHeader,
  SidebarInset, SidebarItem, SidebarProvider, SidebarSection, SidebarTrigger, type IconName,
} from '../../../components';
import { tokens } from '../../../tokens.stylex';

const pages: { id: string; label: string; icon: IconName }[] = [
  { id: 'deployments', label: 'Deployments', icon: 'layers' },
  { id: 'schedule', label: 'Schedule', icon: 'clock' },
  { id: 'regions', label: 'Regions', icon: 'globe' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

const s = stylex.create({
  frame: { width: '100%', height: 420, overflow: 'hidden', borderWidth: 1, borderStyle: 'solid', borderColor: tokens['--os-color-border-subtle'], borderRadius: tokens['--os-radius-lg'], backgroundColor: tokens['--os-color-bg-canvas'] },
  page: { display: 'flex', alignItems: 'center', gap: tokens['--os-space-2'], padding: tokens['--os-space-6'], color: tokens['--os-color-fg-base'], fontSize: tokens['--os-font-size-lg'], lineHeight: tokens['--os-line-height-lg'], fontWeight: tokens['--os-font-weight-medium'] },
});

export default function SidebarDocked() {
  const [current, setCurrent] = useState('deployments');
  return (
    <div {...stylex.props(s.frame)}>
      <SidebarProvider>
        <Sidebar variant="docked" label="Console">
          <SidebarHeader logo={<Avatar name="Relay" size="xs" shape="square" fallback="gradient" decorative />} title="Relay" description="Production" />
          <SidebarContent>
            <SidebarSection>
              {pages.map(page => (
                <SidebarItem key={page.id} icon={page.icon} isCurrent={current === page.id} onPress={() => setCurrent(page.id)}>{page.label}</SidebarItem>
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
```

### Sections and badges

A `SidebarSection` with a `label` groups items under a heading, which becomes a hairline when collapsed. `badge` adds a count at the end of a row, and `isDisabled` keeps an item visible but out of reach.

`src/ui/catalog/docs/sidebar/sections-badges.tsx`

```tsx
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
```

### Controlled

Pass `collapsed` and `onCollapsedChange` to fold the panel from elsewhere, here a button in the page.

`src/ui/catalog/docs/sidebar/controlled.tsx`

```tsx
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
```

### With page content

`SidebarInset` is the page beside the panel: it takes the rest of the row and scrolls on its own. Put `SidebarTrigger` in its header for small screens.

`src/ui/catalog/docs/sidebar/inset.tsx`

```tsx
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
```

### Mobile

Below 768px the panel moves into a left `Sheet` that `SidebarTrigger` opens; choosing an item closes it. `mobile` forces that mode here so it shows on a wide screen.

`src/ui/catalog/docs/sidebar/mobile.tsx`

```tsx
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
```
