# Drawer

Slide a panel in from an edge, with swipe gestures and snap points.

Category: Overlays · Exports: `Drawer`, `DrawerMenu`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { Button, Drawer } from '@/ui/components';

<Drawer
  trigger={<Button appearance="tertiary">Filters</Button>}
  title="Filters"
  description="Narrow the project list."
  footer={close => <Button onClick={close}>Apply filters</Button>}
>
  …
</Drawer>
```

## Drawer

A swipeable panel on one edge of the viewport, built on the React Aria Sheet, with a header, a body and a footer.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` (required) | `ReactNode` |  | The heading. It names the drawer for assistive tech. |
| `trigger` | `ReactNode` |  | The element that opens the drawer. Leave it out to control the drawer with `isOpen`. |
| `description` | `ReactNode` |  | One or two sentences under the title, linked with `aria-describedby`. |
| `children` | `ReactNode \| ((close: () => void) => ReactNode)` |  | The body. With snap points it scrolls only once the drawer is fully open. |
| `footer` | `ReactNode \| ((close: () => void) => ReactNode)` |  | Actions pinned to the far end, end-aligned, primary action last. They stack below 480px of viewport. |
| `edge` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | The viewport edge the drawer opens from. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'small' \| 'medium' \| 'large'` | `'md'` | Top and bottom: up to 480, 640 or 800 wide. Left and right: 320, 384 or 480 wide. |
| `variant` | `'default' \| 'inset' \| 'straight'` | `'default'` | `default` rounds the inner corners, `inset` floats 8px from the viewport, `straight` has square corners. |
| `snapPoints` | `Array<number \| string>` |  | Heights (or widths) the drawer rests at: numbers are px, percentages are of the drawer. It opens at the first one. |
| `swipeDirection` | `'top' \| 'bottom' \| 'left' \| 'right' \| 'vertical' \| 'horizontal'` |  | The direction a swipe dismisses. Defaults to `edge`. |
| `showCloseButton` | `boolean` | `false` | Shows a close button at the top end of the drawer. |
| `closeLabel` | `string` | `'Close'` | Accessible name of the close button. |
| `isDismissable` | `boolean` | `true` | Close on a swipe, Escape or a press on the backdrop. With snap points, a drawer that can’t be dismissed rests at its smallest one. |
| `dismissable` | `boolean` |  | Deprecated. Use `isDismissable`. |
| `isOpen` | `boolean` |  | Whether the drawer is open (controlled). |
| `defaultOpen` | `boolean` | `false` | Whether the drawer starts open (uncontrolled). |
| `onOpenChange` | `(open: boolean) => void` |  | Called when the drawer opens or closes. |
| `portalContainer` | `Element` | `document.body` | Where the drawer renders. |
| `className` | `string` |  | Classes for the drawer surface. |
| `style` | `CSSProperties` |  | Inline styles for the drawer surface. |
| `ref` | `Ref<HTMLDivElement>` |  | The drawer surface element. |

## DrawerMenu

A list of actions inside a drawer. Put `MenuItem`, `MenuGroup` and `MenuSeparator` in it; item text lines up with the drawer title.

Extends: React Aria MenuProps

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `keepOpen` | `boolean` | `false` | Keep the drawer open after an item is chosen. |
| `onAction` | `(key: Key, value: T) => void` |  | Runs when an item is chosen, before the drawer closes. |
| `className` | `string` |  | Classes for the list. |
| `style` | `CSSProperties` |  | Inline styles for the list. |

## Accessibility

- The drawer has `role="dialog"` and `aria-modal`; the title labels it and the description is linked with `aria-describedby`.
- Focus moves into the drawer once it has entered, stays inside while it is open, and returns to the trigger when it closes.
- Escape, a press on the backdrop and a swipe toward the edge close it, unless `isDismissable={false}`. The handle is decorative; every gesture has a keyboard equivalent.
- `DrawerMenu` is a `menu`: arrow keys move between items, Enter or Space chooses one, and typing jumps to an item by its label.
- With reduced motion the drawer appears and leaves without sliding.

## Examples

### Default

`src/ui/catalog/docs/drawer/default.tsx`

```tsx
'use client';

import { Button, Checkbox, Drawer } from '../../../components';

export default function DrawerDefault() {
  return (
    <Drawer
      trigger={<Button appearance="tertiary">Filters</Button>}
      title="Filters"
      description="Narrow the project list."
      footer={close => (
        <>
          <Button appearance="tertiary" onClick={close}>Cancel</Button>
          <Button onClick={close}>Apply filters</Button>
        </>
      )}
    >
      <Checkbox label="Assigned to me" defaultChecked />
      <Checkbox label="Updated this week" />
      <Checkbox label="Has open invoices" />
    </Drawer>
  );
}
```

### Inset

`variant="inset"` floats the drawer 8px from the screen edges with every corner rounded.

`src/ui/catalog/docs/drawer/inset.tsx`

```tsx
'use client';

import { Button, Drawer, Switch } from '../../../components';

export default function DrawerInset() {
  return (
    <Drawer
      variant="inset"
      trigger={<Button appearance="tertiary">Display</Button>}
      title="Display"
      description="An inset drawer floats 8px from the screen edges."
      footer={close => <Button onClick={close}>Done</Button>}
    >
      <Switch label="Compact rows" defaultChecked />
      <Switch label="Show archived projects" />
    </Drawer>
  );
}
```

### Straight

`variant="straight"` keeps every corner square.

`src/ui/catalog/docs/drawer/straight.tsx`

```tsx
'use client';

import { Button, Drawer, Switch } from '../../../components';

export default function DrawerStraight() {
  return (
    <Drawer
      variant="straight"
      trigger={<Button appearance="tertiary">Sharing</Button>}
      title="Sharing"
      description="A straight drawer has square corners."
      footer={close => <Button onClick={close}>Done</Button>}
    >
      <Switch label="Anyone with the link can view" defaultChecked />
      <Switch label="Allow comments" />
    </Drawer>
  );
}
```

### Edges

`edge` picks the side the drawer opens from; it swipes back toward the same edge.

`src/ui/catalog/docs/drawer/edges.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { Button, Drawer } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: t['--os-space-2'] },
});

const edges = [
  { edge: 'top', label: 'Top' },
  { edge: 'right', label: 'Right' },
  { edge: 'bottom', label: 'Bottom' },
  { edge: 'left', label: 'Left' },
] as const;

export default function DrawerEdges() {
  return (
    <div {...stylex.props(s.row)}>
      {edges.map(({ edge, label }) => (
        <Drawer
          key={edge}
          edge={edge}
          trigger={<Button appearance="tertiary">{label}</Button>}
          title={`${label} drawer`}
          description="Swipe toward the edge, press Escape or press outside to close."
          footer={close => <Button onClick={close}>Done</Button>}
        />
      ))}
    </div>
  );
}
```

### Scrollable content

Long content scrolls between the header and the footer.

`src/ui/catalog/docs/drawer/scrollable.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { Button, Drawer } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  section: { margin: 0, color: tokens['--os-color-fg-muted'] },
});

const sections = Array.from({ length: 12 }, (_, i) => `Section ${i + 1}. Invoices are issued on the first working day of the month and are due within 30 days. Late invoices are flagged on the project card.`);

export default function DrawerScrollable() {
  return (
    <Drawer
      trigger={<Button appearance="tertiary">Billing terms</Button>}
      title="Billing terms"
      description="Last updated in March."
      footer={close => <Button onClick={close}>Close</Button>}
    >
      {sections.map(text => <p key={text} {...stylex.props(s.section)}>{text}</p>)}
    </Drawer>
  );
}
```

### With a text field

A field that takes focus on open. On touch devices the drawer waits for the software keyboard before it slides in.

`src/ui/catalog/docs/drawer/text-field.tsx`

```tsx
'use client';

import { Button, Drawer, Field, Textarea } from '../../../components';

export default function DrawerTextField() {
  return (
    <Drawer
      trigger={<Button appearance="tertiary">Add comment</Button>}
      title="Add a comment"
      description="On a phone, the drawer waits for the keyboard and rests above it."
      footer={close => (
        <>
          <Button appearance="tertiary" onClick={close}>Cancel</Button>
          <Button onClick={close}>Post comment</Button>
        </>
      )}
    >
      <Field label="Comment">
        <Textarea autoFocus placeholder="Looks good to me" />
      </Field>
    </Drawer>
  );
}
```

### Nested drawers

A drawer can open another one on top; each closes on its own.

`src/ui/catalog/docs/drawer/nested.tsx`

```tsx
'use client';

import { Button, Checkbox, Drawer } from '../../../components';

export default function DrawerNested() {
  return (
    <Drawer
      trigger={<Button appearance="tertiary">Export</Button>}
      title="Export projects"
      description="Choose what goes into the archive."
      footer={close => <Button onClick={close}>Export</Button>}
    >
      <Checkbox label="Notes" defaultChecked />
      <Checkbox label="Invoices" defaultChecked />
      <div>
        <Drawer
          trigger={<Button appearance="secondary" size="sm">About archives</Button>}
          title="About archives"
          description="Archives are kept for seven days. A link to download one is sent by email."
          footer={close => <Button onClick={close}>Back</Button>}
        />
      </div>
    </Drawer>
  );
}
```

### Snap points

`snapPoints` lets the drawer rest part way; the body scrolls once it is fully open.

`src/ui/catalog/docs/drawer/snap-points.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Button, Drawer } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  member: { display: 'flex', justifyContent: 'space-between', margin: 0 },
  role: { color: tokens['--os-color-fg-muted'] },
});

const members = ['Lena', 'Omar', 'Priya', 'Theo', 'Jonas', 'Maya', 'Ines', 'Ravi', 'Nora', 'Felix', 'Sana', 'Hugo'];

export default function DrawerSnapPoints() {
  return (
    <Drawer
      snapPoints={[240, '100%']}
      trigger={<Button appearance="tertiary">Members</Button>}
      title="Members"
      description="Opens part way. Swipe up for the full list."
    >
      {members.map((name, i) => (
        <p key={name} {...stylex.props(s.member)}>
          {name}
          <span {...stylex.props(s.role)}>{i < 2 ? 'Owner' : 'Editor'}</span>
        </p>
      ))}
    </Drawer>
  );
}
```

### Mobile menu

`DrawerMenu` holds menu items; choosing one closes the drawer.

`src/ui/catalog/docs/drawer/mobile-menu.tsx`

```tsx
import { Button, Drawer, DrawerMenu, Icon, MenuItem, MenuSeparator } from '../../../components';

export default function DrawerMobileMenu() {
  return (
    <Drawer trigger={<Button appearance="tertiary">Create</Button>} title="Create">
      <DrawerMenu aria-label="Create">
        <MenuItem id="note" icon={<Icon name="file" size={16} />}>New note</MenuItem>
        <MenuItem id="upload" icon={<Icon name="upload" size={16} />}>Upload a file</MenuItem>
        <MenuItem id="invite" icon={<Icon name="users" size={16} />}>Invite people</MenuItem>
        <MenuSeparator />
        <MenuItem id="settings" icon={<Icon name="settings" size={16} />}>Project settings</MenuItem>
      </DrawerMenu>
    </Drawer>
  );
}
```

### Responsive dialog

Dialog and Drawer take the same props, so one can stand in for the other by screen width.

`src/ui/catalog/docs/drawer/responsive-dialog.tsx`

```tsx
'use client';

import { useSyncExternalStore } from 'react';
import { Button, Dialog, Drawer, Field, Input } from '../../../components';

// Read through useSyncExternalStore with a server value (narrow), so it also renders on a server.
const wideQuery = '(min-width: 640px)';
const subscribe = (onChange: () => void) => {
  const wide = window.matchMedia(wideQuery);
  wide.addEventListener('change', onChange);
  return () => wide.removeEventListener('change', onChange);
};

export default function DrawerResponsiveDialog() {
  const isWide = useSyncExternalStore(subscribe, () => window.matchMedia(wideQuery).matches, () => false);
  const Overlay = isWide ? Dialog : Drawer;

  return (
    <Overlay
      trigger={<Button appearance="tertiary">Edit profile</Button>}
      title="Edit profile"
      description="A dialog on wide screens, a drawer on narrow ones."
      footer={close => <Button onClick={close}>Save</Button>}
    >
      <Field label="Display name">
        <Input defaultValue="Maya" />
      </Field>
    </Overlay>
  );
}
```

### Responsive menu

A Menu on wide screens and a drawer with the same items on narrow ones.

`src/ui/catalog/docs/drawer/responsive-menu.tsx`

```tsx
'use client';

import { useSyncExternalStore } from 'react';
import { Button, Drawer, DrawerMenu, Icon, Menu, MenuItem } from '../../../components';

// Read through useSyncExternalStore with a server value (narrow), so it also renders on a server.
const wideQuery = '(min-width: 640px)';
const subscribe = (onChange: () => void) => {
  const wide = window.matchMedia(wideQuery);
  wide.addEventListener('change', onChange);
  return () => wide.removeEventListener('change', onChange);
};

const trigger = (
  <Button appearance="tertiary" iconOnly aria-label="Project actions">
    <Icon name="more-horizontal" />
  </Button>
);
const items = [
  <MenuItem key="rename" id="rename">Rename</MenuItem>,
  <MenuItem key="duplicate" id="duplicate">Duplicate</MenuItem>,
  <MenuItem key="archive" id="archive">Archive</MenuItem>,
];

export default function DrawerResponsiveMenu() {
  const isWide = useSyncExternalStore(subscribe, () => window.matchMedia(wideQuery).matches, () => false);
  if (isWide) return <Menu trigger={trigger}>{items}</Menu>;
  return (
    <Drawer trigger={trigger} title="Project actions">
      <DrawerMenu aria-label="Project actions">{items}</DrawerMenu>
    </Drawer>
  );
}
```
