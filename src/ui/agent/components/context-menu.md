# Context Menu

A menu that opens at the pointer on right click or long press.

Category: Overlays · Exports: `ContextMenu`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { ContextMenu, MenuItem, MenuSeparator } from '@/ui/components';

<ContextMenu aria-label="File actions" trigger={<div role="button">Roadmap.md</div>}>
  <MenuItem onAction={() => renameFile()}>Rename</MenuItem>
  <MenuSeparator />
  <MenuItem destructive onAction={() => deleteFile()}>Delete</MenuItem>
</ContextMenu>
```

## ContextMenu

A trigger area and the menu it opens at the pointer. Items, groups, separators and submenus are the Menu parts.

Extends: React Aria MenuProps

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `trigger` (required) | `ReactNode` |  | The element that takes the context menu. A native element or the library Button is made focusable and pressable for you. |
| `closeOnSelect` | `boolean` | `true` | Close when an item is chosen. Checkbox menus stay open by default. Same as `shouldCloseOnSelect`. |
| `isOpen` | `boolean` |  | Whether the menu is open, controlled. |
| `defaultOpen` | `boolean` | `false` | Whether the menu starts open, uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` |  | Called when the menu opens or closes. |
| `placement` | `Placement` | `'bottom start'` | The side of the pointer the menu opens on. It flips and shifts to stay 12px inside the viewport. |
| `offset` | `number` | `0` | Distance from the pointer in px. |
| `crossOffset` | `number` |  | Shift along the cross axis, in px. |
| `portalContainer` | `Element` | `document.body` | Where the menu renders. |
| `className` | `string` |  | Classes for the popup surface. |
| `style` | `CSSProperties` |  | Inline styles for the popup surface. |
| `ref` | `Ref<HTMLDivElement>` |  | The popup surface element. |
| `menuStyle` | `StyleXStyles` |  | StyleX styles merged after the list’s own. |
| `popoverStyle` | `StyleXStyles` |  | StyleX styles merged after the surface’s own. |

## Accessibility

- Right click, long press on touch, Shift+F10 or the Menu key open the menu at the pointer, or at the trigger from the keyboard.
- The trigger must be focusable so keyboard users can reach it; a native element is given `tabIndex={0}`. Give it a role and a name that says what the menu acts on.
- Inside, the menu works like Menu: arrow keys, Home and End, typeahead, Enter or Space to choose, Escape to close and return focus.
- A context menu is a shortcut. Offer the same actions somewhere visible too, such as a Menu on the row.
- The menu grows from the pointer; under reduced motion it only fades.

## Examples

### Default

`src/ui/catalog/docs/context-menu/default.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { ContextMenu, MenuItem, MenuSeparator } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  area: {
    display: 'grid',
    placeItems: 'center',
    width: 'min(100%, 320px)',
    height: 144,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: tokens['--os-color-border-muted'],
    borderRadius: tokens['--os-radius-lg'],
    color: tokens['--os-color-fg-muted'],
    fontSize: tokens['--os-font-size-sm'],
    userSelect: 'none',
  },
});

export default function ContextMenuDefault() {
  return (
    <ContextMenu
      aria-label="Card actions"
      trigger={<div role="button" {...stylex.props(s.area)}>Right-click or long-press here</div>}
    >
      <MenuItem>Open</MenuItem>
      <MenuItem>Duplicate</MenuItem>
      <MenuItem>Copy link</MenuItem>
      <MenuSeparator />
      <MenuItem destructive>Move to trash</MenuItem>
    </ContextMenu>
  );
}
```

### With icons and shortcuts

Icons sit before the label in fg-muted; shortcuts end the row as small keys.

`src/ui/catalog/docs/context-menu/with-icons.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { ContextMenu, Icon, MenuItem, MenuSeparator } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  area: {
    display: 'grid',
    placeItems: 'center',
    width: 'min(100%, 320px)',
    height: 144,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: tokens['--os-color-border-muted'],
    borderRadius: tokens['--os-radius-lg'],
    color: tokens['--os-color-fg-muted'],
    fontSize: tokens['--os-font-size-sm'],
    userSelect: 'none',
  },
});

export default function ContextMenuWithIcons() {
  return (
    <ContextMenu
      aria-label="Note actions"
      trigger={<div role="button" {...stylex.props(s.area)}>Weekly planning notes</div>}
    >
      <MenuItem icon={<Icon name="edit" size={16} />} shortcut="⌘E">Edit</MenuItem>
      <MenuItem icon={<Icon name="copy" size={16} />} shortcut="⌘D">Duplicate</MenuItem>
      <MenuItem icon={<Icon name="star" size={16} />}>Add to favorites</MenuItem>
      <MenuSeparator />
      <MenuItem icon={<Icon name="trash" size={16} />} shortcut="⌫" destructive>Delete</MenuItem>
    </ContextMenu>
  );
}
```

### With group labels

Groups name related items; a separator sets them apart.

`src/ui/catalog/docs/context-menu/group-labels.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { ContextMenu, MenuGroup, MenuItem, MenuSeparator } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  area: {
    display: 'grid',
    placeItems: 'center',
    width: 'min(100%, 320px)',
    height: 144,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: tokens['--os-color-border-muted'],
    borderRadius: tokens['--os-radius-lg'],
    color: tokens['--os-color-fg-muted'],
    fontSize: tokens['--os-font-size-sm'],
    userSelect: 'none',
  },
});

export default function ContextMenuGroupLabels() {
  return (
    <ContextMenu
      aria-label="Task actions"
      trigger={<div role="button" {...stylex.props(s.area)}>Review onboarding copy</div>}
    >
      <MenuGroup label="Task">
        <MenuItem>Assign to me</MenuItem>
        <MenuItem>Set due date</MenuItem>
      </MenuGroup>
      <MenuSeparator />
      <MenuGroup label="Board">
        <MenuItem>Move to done</MenuItem>
        <MenuItem>Archive</MenuItem>
      </MenuGroup>
    </ContextMenu>
  );
}
```

### With checkbox items

With `selectionMode="multiple"` every item toggles, and the menu stays open.

`src/ui/catalog/docs/context-menu/checkbox-items.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { ContextMenu, MenuItem } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  area: {
    display: 'grid',
    placeItems: 'center',
    width: 'min(100%, 320px)',
    height: 144,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: tokens['--os-color-border-muted'],
    borderRadius: tokens['--os-radius-lg'],
    color: tokens['--os-color-fg-muted'],
    fontSize: tokens['--os-font-size-sm'],
    userSelect: 'none',
  },
});

export default function ContextMenuCheckboxItems() {
  return (
    <ContextMenu
      aria-label="Canvas view"
      selectionMode="multiple"
      defaultSelectedKeys={['grid']}
      trigger={<div role="button" {...stylex.props(s.area)}>Canvas</div>}
    >
      <MenuItem id="grid">Show grid</MenuItem>
      <MenuItem id="rulers">Show rulers</MenuItem>
      <MenuItem id="snap">Snap to objects</MenuItem>
    </ContextMenu>
  );
}
```

### With a radio group

A group with `selectionMode="single"` holds one choice.

`src/ui/catalog/docs/context-menu/radio-group.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { ContextMenu, MenuGroup, MenuItem } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  area: {
    display: 'grid',
    placeItems: 'center',
    width: 'min(100%, 320px)',
    height: 144,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: tokens['--os-color-border-muted'],
    borderRadius: tokens['--os-radius-lg'],
    color: tokens['--os-color-fg-muted'],
    fontSize: tokens['--os-font-size-sm'],
    userSelect: 'none',
  },
});

export default function ContextMenuRadioGroup() {
  return (
    <ContextMenu
      aria-label="Image actions"
      trigger={<div role="button" {...stylex.props(s.area)}>cover-photo.png</div>}
    >
      <MenuGroup label="Scaling" selectionMode="single" defaultSelectedKeys={['fill']}>
        <MenuItem id="fill">Fill</MenuItem>
        <MenuItem id="fit">Fit</MenuItem>
        <MenuItem id="crop">Crop</MenuItem>
      </MenuGroup>
    </ContextMenu>
  );
}
```

### With switch items

Set `indicator="switch"` on items that turn a setting on and off.

`src/ui/catalog/docs/context-menu/switch-items.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { ContextMenu, MenuItem } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  area: {
    display: 'grid',
    placeItems: 'center',
    width: 'min(100%, 320px)',
    height: 144,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: tokens['--os-color-border-muted'],
    borderRadius: tokens['--os-radius-lg'],
    color: tokens['--os-color-fg-muted'],
    fontSize: tokens['--os-font-size-sm'],
    userSelect: 'none',
  },
});

export default function ContextMenuSwitchItems() {
  return (
    <ContextMenu
      aria-label="Channel settings"
      selectionMode="multiple"
      defaultSelectedKeys={['notify']}
      trigger={<div role="button" {...stylex.props(s.area)}>Release planning channel</div>}
    >
      <MenuItem id="notify" indicator="switch">Notifications</MenuItem>
      <MenuItem id="pin" indicator="switch">Pin to sidebar</MenuItem>
      <MenuItem id="mute" indicator="switch">Mute for a week</MenuItem>
    </ContextMenu>
  );
}
```

### With link items

An item with `href` renders a link and follows it when chosen.

`src/ui/catalog/docs/context-menu/link-items.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { ContextMenu, Icon, MenuItem } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  area: {
    display: 'grid',
    placeItems: 'center',
    width: 'min(100%, 320px)',
    height: 144,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: tokens['--os-color-border-muted'],
    borderRadius: tokens['--os-radius-lg'],
    color: tokens['--os-color-fg-muted'],
    fontSize: tokens['--os-font-size-sm'],
    userSelect: 'none',
  },
});

export default function ContextMenuLinkItems() {
  return (
    <ContextMenu
      aria-label="Deployment links"
      trigger={<div role="button" {...stylex.props(s.area)}>Production deployment</div>}
    >
      <MenuItem href="#">Open deployment</MenuItem>
      <MenuItem href="#">View build logs</MenuItem>
      <MenuItem href="#" target="_blank" icon={<Icon name="external-link" size={16} />}>
        Open in a new tab
      </MenuItem>
    </ContextMenu>
  );
}
```

### Nested menu

A submenu opens on hover, on press or with the arrow key toward the end.

`src/ui/catalog/docs/context-menu/nested.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { ContextMenu, MenuItem, MenuSeparator, MenuSubmenu } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  area: {
    display: 'grid',
    placeItems: 'center',
    width: 'min(100%, 320px)',
    height: 144,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: tokens['--os-color-border-muted'],
    borderRadius: tokens['--os-radius-lg'],
    color: tokens['--os-color-fg-muted'],
    fontSize: tokens['--os-font-size-sm'],
    userSelect: 'none',
  },
});

export default function ContextMenuNested() {
  return (
    <ContextMenu
      aria-label="File actions"
      trigger={<div role="button" {...stylex.props(s.area)}>quarterly-report.pdf</div>}
    >
      <MenuItem>Open</MenuItem>
      <MenuSubmenu label="Share with" aria-label="Share with">
        <MenuItem>Finance team</MenuItem>
        <MenuItem>Leadership</MenuItem>
        <MenuItem>Everyone</MenuItem>
      </MenuSubmenu>
      <MenuSeparator />
      <MenuItem>Rename</MenuItem>
      <MenuItem destructive>Delete</MenuItem>
    </ContextMenu>
  );
}
```
