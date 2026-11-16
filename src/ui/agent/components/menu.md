# Menu

A list of actions in a popup, with keyboard navigation and typeahead.

Category: Overlays · Exports: `Menu`, `MenuItem`, `MenuGroup`, `MenuSeparator`, `MenuShortcut`, `MenuSubmenu`, `MenuPopup`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { Button, Menu, MenuItem, MenuSeparator } from '@/ui/components';

<Menu aria-label="Project actions" trigger={<Button appearance="secondary">Actions</Button>}>
  <MenuItem onAction={() => renameProject()}>Rename</MenuItem>
  <MenuItem onAction={() => duplicateProject()}>Duplicate</MenuItem>
  <MenuSeparator />
  <MenuItem destructive onAction={() => deleteProject()}>Delete</MenuItem>
</Menu>
```

## Menu

A trigger and the popup list it opens.

Extends: React Aria MenuProps

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `trigger` (required) | `ReactNode` |  | The element that opens the menu: a Button or any React Aria pressable. |
| `openOn` | `'press' \| 'hover'` | `'press'` | With `hover` the menu also opens while the pointer rests on the trigger. |
| `closeOnSelect` | `boolean` | `true` | Close when an item is chosen. Checkbox menus stay open by default. Same as `shouldCloseOnSelect`. |
| `isOpen` | `boolean` |  | Whether the menu is open, controlled. |
| `defaultOpen` | `boolean` | `false` | Whether the menu starts open, uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` |  | Called when the menu opens or closes. |

## MenuItem

One action: 36px tall, with an optional icon, description, shortcut and selection indicator.

Extends: React Aria MenuItemProps

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` (required) | `ReactNode` |  | The label. A string also feeds typeahead. |
| `icon` | `ReactNode` |  | A 16px Icon before the label, in fg-muted. |
| `description` | `ReactNode` |  | A second line under the label, 13/18 in fg-muted. |
| `shortcut` | `ReactNode` |  | A shortcut at the end. A string renders as a Kbd `sm`. |
| `destructive` | `boolean` | `false` | Danger text, with an error tint on hover and focus. |
| `indicator` | `'check' \| 'switch'` | `'check'` | How a selectable item shows its state. |
| `closeOnSelect` | `boolean` |  | Close the menu when this item is chosen. Defaults to the menu’s setting. |
| `className` | `string` |  | Classes for the item. |
| `style` | `CSSProperties` |  | Inline styles for the item. |
| `ref` | `Ref<HTMLDivElement>` |  | The item element. |

## MenuGroup

Related items under a label. With `selectionMode` its items become checkboxes or radios.

Extends: React Aria MenuSectionProps

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` |  | The group label, 12/16 500 in fg-muted. It also names the group. |
| `children` (required) | `ReactNode` |  | The items. |

## MenuSeparator

A 1px rule with 4px above and below.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` |  | Classes for the rule. |
| `style` | `CSSProperties` |  | Inline styles for the rule. |

## MenuShortcut

A shortcut in a Kbd `sm`, linked to its item as a description, for a custom row.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` (required) | `ReactNode` |  | The keys. A string renders as one Kbd. |
| `className` | `string` |  | Classes for the wrapper. |

## MenuSubmenu

An item that opens a nested menu.

Extends: React Aria MenuProps

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` |  | The label of the item that opens the submenu. |
| `icon` | `ReactNode` |  | A 16px Icon before the label. |
| `isDisabled` | `boolean` | `false` | Disables the item, so the submenu cannot open. |
| `delay` | `number` | `200` | Milliseconds of hover before the submenu opens. |

## MenuPopup

The surface and list on their own, to compose with React Aria’s MenuTrigger or SubmenuTrigger.

Extends: React Aria MenuProps

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `origin` | `'trigger' \| 'pointer'` | `'trigger'` | Where the popup grows from: the trigger side, or the pointer for context menus. |
| `isNonModal` | `boolean` | `false` | Leave the page interactive behind the popup; it closes on blur. |
| `onPointerEnter` | `(event: PointerEvent) => void` |  | Pointer enters the surface. |
| `onPointerLeave` | `(event: PointerEvent) => void` |  | Pointer leaves the surface. |

## Accessibility

- The trigger gets `aria-haspopup` and `aria-expanded`. Enter, Space and the arrow keys open the menu; Down focuses the first item and Up the last.
- Items are `menuitem`, `menuitemcheckbox` or `menuitemradio`. Arrow keys move, Home and End jump, typing a letter jumps to a matching item, Enter or Space chooses, Escape closes and returns focus to the trigger.
- Give the menu an `aria-label`, or let the trigger name it. An icon-only trigger needs its own `aria-label`.
- Shortcuts are linked to their item as a description; they are hints, so wire the keys up yourself.
- The keyboard highlight is the hover fill, with no ring. Under reduced motion the popup only fades.

## Examples

### Default

`src/ui/catalog/docs/menu/default.tsx`

```tsx
import { Button, Icon, Menu, MenuItem, MenuSeparator } from '../../../components';

export default function MenuDefault() {
  return (
    <Menu
      aria-label="Project actions"
      trigger={
        <Button appearance="secondary" trailingIcon={<Icon name="chevron-down" />}>
          Actions
        </Button>
      }
    >
      <MenuItem>Rename</MenuItem>
      <MenuItem>Duplicate</MenuItem>
      <MenuItem>Move to folder</MenuItem>
      <MenuSeparator />
      <MenuItem destructive>Delete</MenuItem>
    </Menu>
  );
}
```

### With icons and shortcuts

Icons sit before the label in fg-muted; shortcuts end the row as small keys.

`src/ui/catalog/docs/menu/with-icons.tsx`

```tsx
import { Button, Icon, Menu, MenuItem, MenuSeparator } from '../../../components';

export default function MenuWithIcons() {
  return (
    <Menu
      aria-label="Note actions"
      trigger={
        <Button appearance="secondary" iconOnly aria-label="Note actions">
          <Icon name="more-horizontal" />
        </Button>
      }
    >
      <MenuItem icon={<Icon name="edit" size={16} />} shortcut="⌘E">Edit</MenuItem>
      <MenuItem icon={<Icon name="copy" size={16} />} shortcut="⌘D">Duplicate</MenuItem>
      <MenuItem icon={<Icon name="share" size={16} />}>Share</MenuItem>
      <MenuSeparator />
      <MenuItem icon={<Icon name="trash" size={16} />} shortcut="⌫" destructive>
        Delete
      </MenuItem>
    </Menu>
  );
}
```

### With descriptions

A second line under the label explains the choice.

`src/ui/catalog/docs/menu/descriptions.tsx`

```tsx
import { Button, Icon, Menu, MenuItem } from '../../../components';

export default function MenuDescriptions() {
  return (
    <Menu
      aria-label="New document"
      trigger={
        <Button appearance="secondary" leadingIcon={<Icon name="plus" />}>
          New
        </Button>
      }
    >
      <MenuItem icon={<Icon name="file" size={16} />} description="A blank page with a title">
        Document
      </MenuItem>
      <MenuItem icon={<Icon name="list" size={16} />} description="Tasks with owners and due dates">
        Checklist
      </MenuItem>
      <MenuItem icon={<Icon name="folder" size={16} />} description="Group pages under one name">
        Folder
      </MenuItem>
    </Menu>
  );
}
```

### With group labels

Groups name related items; a separator sets them apart.

`src/ui/catalog/docs/menu/group-labels.tsx`

```tsx
import { Button, Icon, Menu, MenuGroup, MenuItem, MenuSeparator } from '../../../components';

export default function MenuGroupLabels() {
  return (
    <Menu
      aria-label="Account"
      trigger={
        <Button appearance="secondary" trailingIcon={<Icon name="chevron-down" />}>
          Mara
        </Button>
      }
    >
      <MenuGroup label="Workspace">
        <MenuItem>Team settings</MenuItem>
        <MenuItem>Members</MenuItem>
        <MenuItem>Billing</MenuItem>
      </MenuGroup>
      <MenuSeparator />
      <MenuGroup label="Account">
        <MenuItem>Profile</MenuItem>
        <MenuItem>Sign out</MenuItem>
      </MenuGroup>
    </Menu>
  );
}
```

### With checkbox items

With `selectionMode="multiple"` every item toggles, and the menu stays open.

`src/ui/catalog/docs/menu/checkbox-items.tsx`

```tsx
import { Button, Icon, Menu, MenuItem } from '../../../components';

export default function MenuCheckboxItems() {
  return (
    <Menu
      aria-label="Visible columns"
      selectionMode="multiple"
      defaultSelectedKeys={['status', 'owner']}
      trigger={
        <Button appearance="secondary" leadingIcon={<Icon name="sliders" />}>
          Columns
        </Button>
      }
    >
      <MenuItem id="status">Status</MenuItem>
      <MenuItem id="owner">Owner</MenuItem>
      <MenuItem id="due">Due date</MenuItem>
      <MenuItem id="budget">Budget</MenuItem>
    </Menu>
  );
}
```

### With a radio group

A group with `selectionMode="single"` holds one choice, here controlled with state.

`src/ui/catalog/docs/menu/radio-group.tsx`

```tsx
'use client';

import { useState } from 'react';
import { Button, Icon, Menu, MenuGroup, MenuItem } from '../../../components';

const labels: Record<string, string> = { updated: 'Last updated', created: 'Date created', name: 'Name' };

export default function MenuRadioGroup() {
  const [sort, setSort] = useState('updated');

  return (
    <Menu
      aria-label="Sort projects"
      trigger={
        <Button appearance="secondary" leadingIcon={<Icon name="sort" />}>
          {labels[sort]}
        </Button>
      }
    >
      <MenuGroup
        label="Sort by"
        selectionMode="single"
        selectedKeys={[sort]}
        onSelectionChange={keys => setSort(String([...keys][0]))}
      >
        <MenuItem id="updated">Last updated</MenuItem>
        <MenuItem id="created">Date created</MenuItem>
        <MenuItem id="name">Name</MenuItem>
      </MenuGroup>
    </Menu>
  );
}
```

### With switch items

Set `indicator="switch"` for settings that turn on and off.

`src/ui/catalog/docs/menu/switch-items.tsx`

```tsx
import { Button, Icon, Menu, MenuItem } from '../../../components';

export default function MenuSwitchItems() {
  return (
    <Menu
      aria-label="Notifications"
      selectionMode="multiple"
      defaultSelectedKeys={['mentions']}
      trigger={
        <Button appearance="secondary" iconOnly aria-label="Notifications">
          <Icon name="bell" />
        </Button>
      }
    >
      <MenuItem id="mentions" indicator="switch">Mentions</MenuItem>
      <MenuItem id="comments" indicator="switch">Comments</MenuItem>
      <MenuItem id="deploys" indicator="switch">Deployments</MenuItem>
    </Menu>
  );
}
```

### With link items

An item with `href` renders a link and follows it when chosen.

`src/ui/catalog/docs/menu/link-items.tsx`

```tsx
import { Button, Icon, Menu, MenuItem, MenuSeparator } from '../../../components';

export default function MenuLinkItems() {
  return (
    <Menu
      aria-label="Help"
      trigger={
        <Button appearance="secondary" leadingIcon={<Icon name="help-circle" />}>
          Help
        </Button>
      }
    >
      <MenuItem href="#">Getting started</MenuItem>
      <MenuItem href="#">Keyboard shortcuts</MenuItem>
      <MenuSeparator />
      <MenuItem
        href="#"
        target="_blank"
        icon={<Icon name="external-link" size={16} />}
      >
        Release notes
      </MenuItem>
    </Menu>
  );
}
```

### Nested menu

A submenu opens on hover, on press or with the arrow key toward the end.

`src/ui/catalog/docs/menu/nested.tsx`

```tsx
import { Button, Icon, Menu, MenuItem, MenuSeparator, MenuSubmenu } from '../../../components';

export default function MenuNested() {
  return (
    <Menu
      aria-label="Invoice actions"
      trigger={
        <Button appearance="secondary" trailingIcon={<Icon name="chevron-down" />}>
          Invoice
        </Button>
      }
    >
      <MenuItem>Send reminder</MenuItem>
      <MenuSubmenu label="Export as" aria-label="Export formats">
        <MenuItem>PDF</MenuItem>
        <MenuItem>Spreadsheet</MenuItem>
        <MenuItem>Plain text</MenuItem>
      </MenuSubmenu>
      <MenuSubmenu label="Move to" aria-label="Move to folder">
        <MenuItem>Drafts</MenuItem>
        <MenuItem>Paid</MenuItem>
        <MenuItem>Archive</MenuItem>
      </MenuSubmenu>
      <MenuSeparator />
      <MenuItem destructive>Void invoice</MenuItem>
    </Menu>
  );
}
```

### Open on hover

The menu also opens while the pointer rests on the trigger, and closes when it leaves both.

`src/ui/catalog/docs/menu/open-on-hover.tsx`

```tsx
import { Button, Icon, Menu, MenuItem } from '../../../components';

export default function MenuOpenOnHover() {
  return (
    <Menu
      aria-label="Workspaces"
      openOn="hover"
      trigger={
        <Button appearance="text" trailingIcon={<Icon name="chevron-down" />}>
          Workspaces
        </Button>
      }
    >
      <MenuItem>Design team</MenuItem>
      <MenuItem>Platform</MenuItem>
      <MenuItem>Customer success</MenuItem>
    </Menu>
  );
}
```

### Keep open on select

Set `closeOnSelect={false}` for actions people repeat; one item can still close it.

`src/ui/catalog/docs/menu/keep-open.tsx`

```tsx
'use client';

import { useState } from 'react';
import { Button, Icon, Menu, MenuItem, MenuSeparator } from '../../../components';

export default function MenuKeepOpen() {
  const [zoom, setZoom] = useState(100);

  return (
    <Menu
      aria-label="Zoom"
      closeOnSelect={false}
      trigger={
        <Button appearance="secondary" trailingIcon={<Icon name="chevron-down" />}>
          Zoom {zoom}%
        </Button>
      }
    >
      <MenuItem shortcut="⌘+" onAction={() => setZoom(z => Math.min(z + 25, 200))}>
        Zoom in
      </MenuItem>
      <MenuItem shortcut="⌘−" onAction={() => setZoom(z => Math.max(z - 25, 25))}>
        Zoom out
      </MenuItem>
      <MenuSeparator />
      <MenuItem closeOnSelect onAction={() => setZoom(100)}>
        Reset to 100%
      </MenuItem>
    </Menu>
  );
}
```

### Open a dialog

An item opens a controlled Dialog once the menu has closed.

`src/ui/catalog/docs/menu/open-dialog.tsx`

```tsx
'use client';

import { useState } from 'react';
import { Button, Dialog, Icon, Menu, MenuItem } from '../../../components';

export default function MenuOpenDialog() {
  const [renaming, setRenaming] = useState(false);

  return (
    <>
      <Menu
        aria-label="Board actions"
        trigger={
          <Button appearance="secondary" trailingIcon={<Icon name="chevron-down" />}>
            Board
          </Button>
        }
      >
        <MenuItem onAction={() => setRenaming(true)}>Rename…</MenuItem>
        <MenuItem>Copy link</MenuItem>
      </Menu>
      <Dialog
        isOpen={renaming}
        onOpenChange={setRenaming}
        title="Rename board"
        description="The new name shows for everyone on the team."
        footer={close => <>
          <Button appearance="tertiary" onClick={close}>Cancel</Button>
          <Button onClick={close}>Save</Button>
        </>}
      />
    </>
  );
}
```

### Disabled items

Disabled items keep their place, lose their hover and are skipped by the keyboard.

`src/ui/catalog/docs/menu/disabled.tsx`

```tsx
import { Button, Icon, Menu, MenuItem, MenuSeparator } from '../../../components';

export default function MenuDisabled() {
  return (
    <Menu
      aria-label="Deployment actions"
      disabledKeys={['rollback']}
      trigger={
        <Button appearance="secondary" trailingIcon={<Icon name="chevron-down" />}>
          Deployment
        </Button>
      }
    >
      <MenuItem id="logs" icon={<Icon name="terminal" size={16} />}>View logs</MenuItem>
      <MenuItem id="redeploy" icon={<Icon name="refresh" size={16} />}>Redeploy</MenuItem>
      <MenuItem id="rollback" icon={<Icon name="undo" size={16} />} description="No earlier build to return to">
        Roll back
      </MenuItem>
      <MenuSeparator />
      <MenuItem id="delete" isDisabled destructive>Delete deployment</MenuItem>
    </Menu>
  );
}
```
