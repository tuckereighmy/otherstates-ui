# Dialog

Keep attention on a short task in a modal window.

Category: Overlays · Exports: `Dialog`, `DialogActions`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { Button, Dialog } from '@/ui/components';

<Dialog
  trigger={<Button appearance="tertiary">Edit profile</Button>}
  title="Edit profile"
  description="Your display name appears to everyone in your workspace."
  footer={close => <Button onClick={close}>Save</Button>}
>
  …
</Dialog>
```

## Dialog

A modal window with a title, an optional description, a body and a footer row. It opens from `trigger` or from `isOpen`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` (required) | `ReactNode` |  | The heading. It names the dialog for assistive tech. |
| `trigger` | `ReactNode` |  | The element that opens the dialog. Leave it out to control the dialog with `isOpen`. |
| `description` | `ReactNode` |  | One or two sentences under the title, linked to the dialog with `aria-describedby`. |
| `children` | `ReactNode \| ((close: () => void) => ReactNode)` |  | The body. It scrolls when the window runs out of height. |
| `footer` | `ReactNode \| ((close: () => void) => ReactNode)` |  | Actions in an end-aligned row, primary action last. Below 480px of viewport they stack full width. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'small' \| 'medium' \| 'large'` | `'md'` | Width: 320, 400 or 560, never wider than the viewport less 32px. The long names are aliases. |
| `showCloseButton` | `boolean` | `false` | Shows a close button at the top end of the window. |
| `closeLabel` | `string` | `'Close'` | Accessible name of the close button. |
| `isDismissable` | `boolean` | `true` | Close when the backdrop is pressed. |
| `dismissable` | `boolean` |  | Deprecated. Use `isDismissable`; `false` also turns off Escape. |
| `isKeyboardDismissDisabled` | `boolean` | `false` | Ignore Escape. |
| `media` | `{ content: ReactNode; placement: 'thumbnail' \| 'cover' }` |  | An image above the title: a 120px thumbnail or a cover flush with the top edge. Centers the header and stacks the footer. |
| `isOpen` | `boolean` |  | Whether the dialog is open (controlled). |
| `defaultOpen` | `boolean` | `false` | Whether the dialog starts open (uncontrolled). |
| `onOpenChange` | `(open: boolean) => void` |  | Called when the dialog opens or closes. |
| `portalContainer` | `Element` | `document.body` | Where the dialog renders. |
| `className` | `string` |  | Classes for the window surface. |
| `style` | `CSSProperties` |  | Inline styles for the window surface. |
| `ref` | `Ref<HTMLDivElement>` |  | The window surface element. |

## DialogActions

Deprecated: use `footer`. A footer row placed inside the body; in a dialog with `media` its actions stack.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` (required) | `ReactNode` |  | The action buttons, primary action last. |

## Accessibility

- The window has `role="dialog"` and `aria-modal`; the title labels it and the description is linked with `aria-describedby`.
- Focus moves into the dialog when it opens, stays inside while it is open, and returns to the trigger when it closes.
- Escape closes the dialog unless `isKeyboardDismissDisabled` is set; with nested dialogs it closes the top one first.
- Content behind the dialog is hidden from assistive tech and page scrolling is locked.
- Give the close button and any icon-only trigger an accessible name (`closeLabel`, `aria-label`).
- With reduced motion the window and backdrop only fade, over 120ms.

## Examples

### Default

`src/ui/catalog/docs/dialog/default.tsx`

```tsx
'use client';

import { Button, Dialog, Field, Input } from '../../../components';

export default function DialogDefault() {
  return (
    <Dialog
      trigger={<Button appearance="tertiary">Edit profile</Button>}
      title="Edit profile"
      description="Your display name appears to everyone in your workspace."
      footer={close => (
        <>
          <Button appearance="tertiary" onClick={close}>
            Cancel
          </Button>
          <Button onClick={close}>Save</Button>
        </>
      )}
    >
      <Field label="Display name">
        <Input defaultValue="Maya" />
      </Field>
    </Dialog>
  );
}
```

### Sizes

Three widths: `sm` 320, `md` 400 (the default) and `lg` 560.

`src/ui/catalog/docs/dialog/sizes.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { Button, Dialog } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: t['--os-space-2'] },
});

const sizes = [
  { size: 'sm', label: 'Small', width: 320 },
  { size: 'md', label: 'Medium', width: 400 },
  { size: 'lg', label: 'Large', width: 560 },
] as const;

export default function DialogSizes() {
  return (
    <div {...stylex.props(s.row)}>
      {sizes.map(({ size, label, width }) => (
        <Dialog
          key={size}
          size={size}
          trigger={<Button appearance="tertiary">{label}</Button>}
          title={`${label} dialog`}
          description={`This window is ${width}px wide, or the viewport less 32px on small screens.`}
          footer={close => <Button onClick={close}>Done</Button>}
        />
      ))}
    </div>
  );
}
```

### Close button

A dialog with no footer, closed by its close button, Escape or the backdrop.

`src/ui/catalog/docs/dialog/close-button.tsx`

```tsx
import { Button, Dialog, Field, Input } from '../../../components';

export default function DialogCloseButton() {
  return (
    <Dialog
      trigger={<Button appearance="tertiary">Share</Button>}
      title="Share project"
      description="Anyone with the link can view this project."
      showCloseButton
    >
      <Field label="Project link">
        <Input isReadOnly defaultValue="https://example.com/p/atlas" />
      </Field>
    </Dialog>
  );
}
```

### Controlled

Open and close the dialog from state with `isOpen` and `onOpenChange`; the footer submits a form in the body.

`src/ui/catalog/docs/dialog/controlled.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button, Dialog, Field, Input } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-2'], justifyItems: 'center' },
  status: { margin: 0, fontSize: tokens['--os-font-size-caption'], lineHeight: tokens['--os-line-height-sm'], color: tokens['--os-color-fg-muted'] },
});

export default function DialogControlled() {
  const [isOpen, setOpen] = useState(false);
  const [name, setName] = useState('Atlas');

  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setName(String(new FormData(event.currentTarget).get('name')));
    setOpen(false);
  };

  return (
    <div {...stylex.props(s.root)}>
      <Button appearance="tertiary" onClick={() => setOpen(true)}>Rename project</Button>
      <p {...stylex.props(s.status)}>Project: {name}</p>
      <Dialog
        isOpen={isOpen}
        onOpenChange={setOpen}
        title="Rename project"
        footer={<Button form="rename-project" type="submit">Save</Button>}
      >
        <form id="rename-project" onSubmit={save}>
          <Field label="Name">
            <Input name="name" defaultValue={name} required />
          </Field>
        </form>
      </Dialog>
    </div>
  );
}
```

### Open from a menu

A menu item opens a dialog that has no trigger of its own.

`src/ui/catalog/docs/dialog/open-from-menu.tsx`

```tsx
'use client';

import { useState } from 'react';
import { Button, Dialog, Icon, Menu, MenuItem } from '../../../components';

export default function DialogOpenFromMenu() {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Menu
        trigger={
          <Button appearance="tertiary" iconOnly aria-label="Project actions">
            <Icon name="more-horizontal" />
          </Button>
        }
        onAction={key => key === 'archive' && setOpen(true)}
      >
        <MenuItem id="duplicate">Duplicate</MenuItem>
        <MenuItem id="archive">Archive…</MenuItem>
      </Menu>
      <Dialog
        isOpen={isOpen}
        onOpenChange={setOpen}
        title="Archive project"
        description="Archived projects move to the bottom of the list and stop sending notifications."
        footer={close => (
          <>
            <Button appearance="tertiary" onClick={close}>Cancel</Button>
            <Button onClick={close}>Archive</Button>
          </>
        )}
      />
    </>
  );
}
```

### Scrollable body

When the content is taller than the viewport, the body scrolls between a fixed header and footer.

`src/ui/catalog/docs/dialog/scrollable.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { Button, Dialog } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  note: { margin: 0, color: tokens['--os-color-fg-muted'] },
});

const notes = [
  'Projects open twice as fast in large workspaces, because lists now load in pages.',
  'Invoices can be exported as one archive, with a summary sheet for each month.',
  'Comments keep their place when a file is renamed or moved to another folder.',
  'Each deployment shows the change that triggered it and who approved it.',
  'Team settings include a default time zone for due dates and reminders.',
  'Search matches note titles before their contents, so the right note comes first.',
  'Archived projects can be restored for 30 days from the project list.',
  'Keyboard focus returns to the list when a dialog or sheet closes.',
  'Members can leave a workspace from their profile without asking an owner.',
  'Exports include the name of the person who ran them and the time they finished.',
  'The activity feed groups changes made within a minute into a single entry.',
  'Billing emails go to every workspace owner instead of the first one only.',
  'Shared links can expire after a day, a week or a month.',
  'Notes keep their formatting when pasted into a project description.',
];

export default function DialogScrollable() {
  return (
    <Dialog
      trigger={<Button appearance="tertiary">What’s new</Button>}
      title="What’s new in 4.2"
      description="Fourteen changes since the last release."
      footer={close => <Button onClick={close}>Got it</Button>}
    >
      {notes.map(note => <p key={note} {...stylex.props(s.note)}>{note}</p>)}
    </Dialog>
  );
}
```

### Nested dialogs

A dialog can open another one; Escape closes the top dialog first.

`src/ui/catalog/docs/dialog/nested.tsx`

```tsx
'use client';

import { Button, Dialog, Field, Input } from '../../../components';

export default function DialogNested() {
  return (
    <Dialog
      trigger={<Button appearance="tertiary">Invite people</Button>}
      title="Invite people"
      description="New members join as editors unless you choose otherwise."
      footer={close => (
        <>
          <Button appearance="tertiary" onClick={close}>Cancel</Button>
          <Button onClick={close}>Send invites</Button>
        </>
      )}
    >
      <Field label="Email addresses">
        <Input placeholder="name@example.com" />
      </Field>
      <div>
        <Dialog
          size="sm"
          trigger={<Button appearance="secondary" size="sm">About roles</Button>}
          title="Roles"
          description="Editors can change projects and invoices. Viewers can read and comment."
          footer={close => <Button onClick={close}>Back</Button>}
        />
      </div>
    </Dialog>
  );
}
```

### Close confirmation

Intercept a close in `onOpenChange` and ask before unsaved work is lost.

`src/ui/catalog/docs/dialog/close-confirmation.tsx`

```tsx
'use client';

import { useState } from 'react';
import { AlertDialog, Button, Dialog, Textarea } from '../../../components';

export default function DialogCloseConfirmation() {
  const [isOpen, setOpen] = useState(false);
  const [isConfirming, setConfirming] = useState(false);
  const [note, setNote] = useState('');

  const requestOpen = (next: boolean) => {
    if (next || !note) setOpen(next);
    else setConfirming(true);
  };
  const discard = () => { setNote(''); setOpen(false); };

  return (
    <>
      <Dialog
        trigger={<Button appearance="tertiary">New note</Button>}
        isOpen={isOpen}
        onOpenChange={requestOpen}
        title="New note"
        description="Type something, then press Escape to see the confirmation."
        footer={<>
          <Button appearance="tertiary" onClick={() => requestOpen(false)}>Cancel</Button>
          <Button onClick={discard}>Save note</Button>
        </>}
      >
        <Textarea aria-label="Note" value={note} onChange={event => setNote(event.target.value)} />
      </Dialog>
      <AlertDialog
        isOpen={isConfirming}
        onOpenChange={setConfirming}
        title="Discard this note?"
        description="What you wrote will be lost."
        cancelLabel="Keep writing"
        confirmLabel="Discard"
        destructive
        onConfirm={discard}
      />
    </>
  );
}
```

### Explicit close

With `isDismissable={false}` and `isKeyboardDismissDisabled`, only a button in the dialog closes it.

`src/ui/catalog/docs/dialog/explicit-close.tsx`

```tsx
'use client';

import { Button, Dialog, RadioGroup } from '../../../components';

const workspaces = [
  { value: 'studio', label: 'Studio' },
  { value: 'finance', label: 'Finance' },
];

export default function DialogExplicitClose() {
  return (
    <Dialog
      trigger={<Button appearance="tertiary">Choose workspace</Button>}
      title="Choose a workspace"
      description="New projects are saved here. You can change it later in team settings."
      isDismissable={false}
      isKeyboardDismissDisabled
      footer={close => <Button onClick={close}>Continue</Button>}
    >
      <RadioGroup label="Workspace" name="workspace" defaultValue="studio" options={workspaces} />
    </Dialog>
  );
}
```

### With media

`media` puts an image above the title and centers the header; the actions stack.

`src/ui/catalog/docs/dialog/with-media.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { Button, Dialog, Icon } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  art: {
    display: 'grid', placeItems: 'center', width: '100%', height: '100%',
    backgroundColor: tokens['--os-color-bg-muted'], color: tokens['--os-color-fg-muted'],
  },
});

export default function DialogWithMedia() {
  return (
    <Dialog
      trigger={<Button appearance="tertiary">Send invite</Button>}
      title="Invite sent"
      description="Jonas will get an email with a link to join the workspace."
      media={{ placement: 'thumbnail', content: <div {...stylex.props(s.art)}><Icon name="mail" size={40} /></div> }}
      footer={close => <Button onClick={close}>Done</Button>}
    />
  );
}
```
