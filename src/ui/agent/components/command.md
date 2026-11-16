# Command

A searchable list of commands, in a palette window or in the page.

Category: Navigation · Exports: `Command`, `CommandAction`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { Button, Command } from '@/ui/components';

<Command
  trigger={<Button appearance="secondary">Search commands</Button>}
  shortcutKey="k"
  actions={[
    { id: 'settings', label: 'Open settings', keywords: ['preferences'], onAction: () => openSettings() },
  ]}
/>
```

## Command

A search field over a filtered list of commands, in a top-anchored window 480 wide or standalone in the page.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `trigger` | `ReactNode` |  | The element that opens the palette. Leave it out to open it with `shortcutKey` or `isOpen`. |
| `actions` | `CommandAction[]` | `[]` | The commands, as data. |
| `children` | `ReactNode` |  | MenuItem, MenuGroup and MenuSeparator, instead of `actions`. |
| `standalone` | `boolean` | `false` | Render the palette in the page instead of a dialog. |
| `title` | `string` | `'Command palette'` | Names the dialog for assistive tech. |
| `placeholder` | `string` | `'Type a command…'` | Placeholder of the search field. |
| `searchLabel` | `string` | `'Search commands'` | Names the search field for assistive tech. |
| `emptyMessage` | `ReactNode` | `'No commands found.'` | Shown when nothing matches. |
| `shortcutKey` | `string` |  | Cmd or Ctrl plus this key opens and closes the palette. |
| `footer` | `ReactNode` |  | Replaces the key hints under the list. `null` removes the footer. |
| `isLoading` | `boolean` | `false` | Shows a loading row in place of the results. |
| `loadingLabel` | `string` | `'Loading…'` | Text of the loading row. |
| `inputValue` | `string` |  | The search text, controlled. |
| `defaultInputValue` | `string` |  | The starting search text, uncontrolled. |
| `onInputChange` | `(value: string) => void` |  | Called as the search text changes. |
| `isOpen` | `boolean` |  | Whether the palette is open, controlled. |
| `defaultOpen` | `boolean` | `false` | Whether the palette starts open, uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` |  | Called when the palette opens or closes. |
| `portalContainer` | `Element` | `document.body` | Where the dialog renders. |
| `className` | `string` |  | Classes for the palette surface. |
| `style` | `CSSProperties` |  | Inline styles for the palette surface. |
| `ref` | `Ref<HTMLDivElement>` |  | The palette surface element. |

## CommandAction

One command in `actions`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `id` (required) | `string` |  | A unique key. |
| `label` (required) | `string` |  | The command name. |
| `onAction` (required) | `() => void` |  | Runs the command. The palette closes after it. |
| `keywords` | `string[]` |  | Extra words the search matches. |
| `icon` | `ReactNode` |  | A 16px Icon before the label. |
| `shortcut` | `string` |  | A shortcut shown as a Kbd `sm` at the end. |
| `description` | `string` |  | A second line under the label. |
| `group` | `string` |  | A group label; actions with the same group sit together under it. |
| `isDisabled` | `boolean` |  | Shows the command but blocks it. |
| `disabled` | `boolean` |  | Deprecated: use `isDisabled`. |

## Accessibility

- The palette is a modal `dialog` named by `title`; focus moves to the search field and returns to the trigger on close.
- The search field controls a `menu` with virtual focus: arrow keys move the highlight while typing continues, Enter runs the highlighted command, Escape clears the text and then closes.
- The highlight is the hover fill, with no ring; the field itself shows no ring because the palette is the focus context.
- While loading, the loading row is a `status`, so screen readers announce it. Groups are labeled sections, announced with their first item.
- The window comes down 8px and settles over 280ms; under reduced motion it only fades.

## Examples

### Default

`src/ui/catalog/docs/command/default.tsx`

```tsx
'use client';

import { Button, Command, Icon } from '../../../components';

export default function CommandDefault() {
  return (
    <Command
      trigger={
        <Button appearance="secondary" leadingIcon={<Icon name="search" />}>
          Search commands
        </Button>
      }
      actions={[
        { id: 'new-project', label: 'New project', onAction: () => {} },
        { id: 'invite', label: 'Invite a teammate', onAction: () => {} },
        { id: 'billing', label: 'Open billing', onAction: () => {} },
        { id: 'theme', label: 'Switch theme', onAction: () => {} },
        { id: 'sign-out', label: 'Sign out', onAction: () => {} },
      ]}
    />
  );
}
```

### With a keyboard shortcut

With `shortcutKey`, Cmd or Ctrl plus the key opens and closes the palette from anywhere.

`src/ui/catalog/docs/command/keyboard-shortcut.tsx`

```tsx
'use client';

import { useState } from 'react';
import { Button, Command, Icon, Kbd, KbdGroup } from '../../../components';

export default function CommandKeyboardShortcut() {
  const [open, setOpen] = useState(false);

  return (
    <Command
      isOpen={open}
      onOpenChange={setOpen}
      shortcutKey="j"
      trigger={
        <Button
          appearance="secondary"
          leadingIcon={<Icon name="command" />}
          trailingIcon={<KbdGroup size="sm"><Kbd>⌘</Kbd><Kbd>J</Kbd></KbdGroup>}
        >
          Quick actions
        </Button>
      }
      actions={[
        { id: 'deploy', label: 'Deploy to staging', shortcut: '⌘D', onAction: () => {} },
        { id: 'logs', label: 'Open build logs', shortcut: '⌘L', onAction: () => {} },
        { id: 'env', label: 'Edit environment variables', onAction: () => {} },
      ]}
    />
  );
}
```

### With grouped items

Actions with the same `group` sit under one label, and a separator divides the groups.

`src/ui/catalog/docs/command/grouped.tsx`

```tsx
'use client';

import { Button, Command, Icon } from '../../../components';
import type { CommandAction } from '../../../components';

const actions: CommandAction[] = [
  { id: 'inbox', group: 'Go to', label: 'Inbox', icon: <Icon name="inbox" size={16} />, onAction: () => {} },
  { id: 'projects', group: 'Go to', label: 'Projects', icon: <Icon name="folder" size={16} />, onAction: () => {} },
  { id: 'calendar', group: 'Go to', label: 'Calendar', icon: <Icon name="calendar" size={16} />, onAction: () => {} },
  { id: 'note', group: 'Create', label: 'New note', icon: <Icon name="file" size={16} />, shortcut: 'N', onAction: () => {} },
  { id: 'invoice', group: 'Create', label: 'New invoice', icon: <Icon name="credit-card" size={16} />, onAction: () => {} },
  { id: 'members', group: 'Settings', label: 'Team members', icon: <Icon name="users" size={16} />, onAction: () => {} },
  { id: 'export', group: 'Settings', label: 'Export workspace', icon: <Icon name="download" size={16} />, isDisabled: true, onAction: () => {} },
];

export default function CommandGrouped() {
  return (
    <Command
      trigger={
        <Button appearance="secondary" leadingIcon={<Icon name="search" />}>
          Jump to
        </Button>
      }
      actions={actions}
    />
  );
}
```

### With icons and descriptions

A second line explains each command; search matches it too.

`src/ui/catalog/docs/command/descriptions.tsx`

```tsx
'use client';

import { Button, Command, Icon } from '../../../components';

export default function CommandDescriptions() {
  return (
    <Command
      placeholder="Search settings…"
      trigger={
        <Button appearance="secondary" leadingIcon={<Icon name="settings" />}>
          Settings
        </Button>
      }
      actions={[
        { id: 'profile', label: 'Profile', description: 'Name, photo and time zone', icon: <Icon name="user" size={16} />, onAction: () => {} },
        { id: 'alerts', label: 'Notifications', description: 'Email and in-app alerts', icon: <Icon name="bell" size={16} />, onAction: () => {} },
        { id: 'security', label: 'Security', description: 'Password and two-step sign-in', icon: <Icon name="lock" size={16} />, onAction: () => {} },
      ]}
    />
  );
}
```

### Standalone

With `standalone` the palette renders in the page, on a surface with a hairline.

`src/ui/catalog/docs/command/standalone.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { Command, Icon } from '../../../components';

const s = stylex.create({ frame: { width: 'min(100%, 420px)' } });

export default function CommandStandalone() {
  return (
    <div {...stylex.props(s.frame)}>
      <Command
        standalone
        footer={null}
        placeholder="Filter files…"
        actions={[
          { id: 'brief', label: 'Project brief', icon: <Icon name="file" size={16} />, onAction: () => {} },
          { id: 'budget', label: 'Budget 2027', icon: <Icon name="file" size={16} />, onAction: () => {} },
          { id: 'research', label: 'User research', icon: <Icon name="folder" size={16} />, onAction: () => {} },
          { id: 'assets', label: 'Brand assets', icon: <Icon name="image" size={16} />, onAction: () => {} },
        ]}
      />
    </div>
  );
}
```

### Composed items

Pass MenuGroup, MenuItem and MenuSeparator as children instead of `actions`.

`src/ui/catalog/docs/command/composed.tsx`

```tsx
import { Button, Command, Icon, MenuGroup, MenuItem, MenuSeparator } from '../../../components';

export default function CommandComposed() {
  return (
    <Command
      trigger={
        <Button appearance="secondary" leadingIcon={<Icon name="search" />}>
          Open palette
        </Button>
      }
    >
      <MenuGroup label="Suggestions">
        <MenuItem icon={<Icon name="clock" size={16} />}>Recent invoices</MenuItem>
        <MenuItem icon={<Icon name="star" size={16} />}>Starred projects</MenuItem>
      </MenuGroup>
      <MenuSeparator />
      <MenuGroup label="Help">
        <MenuItem icon={<Icon name="keyboard" size={16} />}>Keyboard shortcuts</MenuItem>
        <MenuItem href="#" icon={<Icon name="external-link" size={16} />}>Documentation</MenuItem>
      </MenuGroup>
    </Command>
  );
}
```

### Async search

Control the search text and set `isLoading` while results load; a loading row takes the list’s place.

`src/ui/catalog/docs/command/loading.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useEffect, useState } from 'react';
import { Command, MenuItem } from '../../../components';

const s = stylex.create({ frame: { width: 'min(100%, 420px)' } });
const customers = ['Aiko Tanaka', 'Bruno Silva', 'Chiara Rossi', 'Dev Patel', 'Elif Kaya'];

export default function CommandLoading() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const id = setTimeout(() => {
      setResults(customers.filter(name => name.toLowerCase().includes(query.toLowerCase())));
      setLoading(false);
    }, 700);
    return () => clearTimeout(id);
  }, [query]);

  return (
    <div {...stylex.props(s.frame)}>
      <Command standalone footer={null} placeholder="Search customers…" inputValue={query} onInputChange={setQuery} isLoading={loading} loadingLabel="Searching…">
        {results.map(name => <MenuItem key={name} id={name}>{name}</MenuItem>)}
      </Command>
    </div>
  );
}
```

### Custom footer and empty message

Replace the key hints with `footer`, or pass `null` to drop them.

`src/ui/catalog/docs/command/custom-footer.tsx`

```tsx
'use client';

import { Button, Command, Icon, Kbd } from '../../../components';

export default function CommandCustomFooter() {
  return (
    <Command
      emptyMessage="No teammates match that name."
      placeholder="Find a teammate…"
      trigger={
        <Button appearance="secondary" leadingIcon={<Icon name="users" />}>
          Find a teammate
        </Button>
      }
      footer={<span>3 teammates · <Kbd size="sm">↵</Kbd> opens a profile</span>}
      actions={[
        { id: 'noor', label: 'Noor Haddad', description: 'Design', onAction: () => {} },
        { id: 'tomas', label: 'Tomás Reyes', description: 'Engineering', onAction: () => {} },
        { id: 'wen', label: 'Wen Zhao', description: 'Support', onAction: () => {} },
      ]}
    />
  );
}
```
