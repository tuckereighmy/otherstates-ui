# Alert Dialog

Ask for confirmation before a consequential action.

Category: Overlays · Exports: `AlertDialog`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { AlertDialog, Button } from '@/ui/components';

<AlertDialog
  trigger={<Button appearance="destructive-outline">Delete project</Button>}
  title="Delete this project?"
  description="This cannot be undone."
  confirmLabel="Delete project"
  destructive
  onConfirm={() => deleteProject()}
/>
```

## AlertDialog

A modal window with `role="alertdialog"` that asks for a decision, with cancel and confirm buttons in the footer.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` (required) | `ReactNode` |  | The question. It names the dialog for assistive tech. |
| `trigger` | `ReactNode` |  | The element that opens the dialog. Leave it out to control the dialog with `isOpen`. |
| `description` | `ReactNode` |  | What happens on confirm, linked with `aria-describedby`. |
| `children` | `ReactNode` |  | Extra content between the header and the footer. |
| `confirmLabel` | `string` | `'Confirm'` | Label of the confirm button. |
| `cancelLabel` | `string` | `'Cancel'` | Label of the cancel button, which takes focus when the dialog opens. |
| `onConfirm` | `() => void \| Promise<unknown>` |  | Runs on confirm. A promise keeps the dialog open with a loading button until it settles; a rejection keeps it open. |
| `onCancel` | `() => void` |  | Runs when the dialog closes any other way: Cancel, Escape or the backdrop. |
| `destructive` | `boolean` | `false` | Gives the confirm button the destructive appearance. |
| `isDismissable` | `boolean` | `false` | Close when the backdrop is pressed. Off by default, so a decision is explicit. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'small' \| 'medium' \| 'large'` | `'md'` | Width: 320, 400 or 560. The long names are aliases. |
| `footer` | `ReactNode \| ((close: () => void) => ReactNode)` |  | Replaces the cancel and confirm buttons. Its `close` does not call `onCancel`. |
| `isOpen` | `boolean` |  | Whether the dialog is open (controlled). |
| `defaultOpen` | `boolean` | `false` | Whether the dialog starts open (uncontrolled). |
| `onOpenChange` | `(open: boolean) => void` |  | Called when the dialog opens or closes. |
| `portalContainer` | `Element` | `document.body` | Where the dialog renders. |
| `className` | `string` |  | Classes for the window surface. |
| `style` | `CSSProperties` |  | Inline styles for the window surface. |
| `ref` | `Ref<HTMLDivElement>` |  | The window surface element. |

## Accessibility

- The window has `role="alertdialog"` and `aria-modal`; the title labels it and the description is linked with `aria-describedby`.
- Cancel takes focus when the dialog opens, so pressing Enter by reflex never confirms a destructive action.
- Focus stays inside while the dialog is open and returns to the trigger when it closes.
- Escape cancels, except while a confirm is pending. The backdrop does nothing unless `isDismissable` is set.
- While a confirm is pending the confirm button sets `aria-busy` and ignores presses.
- With reduced motion the window and backdrop only fade, over 120ms.

## Examples

### Default

`src/ui/catalog/docs/alert-dialog/default.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { AlertDialog, Button } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-2'], justifyItems: 'center' },
  status: { margin: 0, fontSize: tokens['--os-font-size-caption'], lineHeight: tokens['--os-line-height-sm'], color: tokens['--os-color-fg-muted'] },
});

export default function AlertDialogDefault() {
  const [deleted, setDeleted] = useState(false);

  return (
    <div {...stylex.props(s.root)}>
      <AlertDialog
        trigger={<Button appearance="destructive-outline">Delete draft</Button>}
        title="Delete this draft?"
        description="This permanently removes the draft from your workspace."
        confirmLabel="Delete draft"
        destructive
        onConfirm={() => setDeleted(true)}
      />
      {deleted && <p role="status" {...stylex.props(s.status)}>Draft deleted</p>}
    </div>
  );
}
```

### Primary action

Without `destructive` the confirm button is primary. This one also uses `size="sm"` (320).

`src/ui/catalog/docs/alert-dialog/primary-action.tsx`

```tsx
'use client';

import { AlertDialog, Button } from '../../../components';

export default function AlertDialogPrimaryAction() {
  return (
    <AlertDialog
      size="sm"
      trigger={<Button appearance="tertiary">Publish changes</Button>}
      title="Publish these changes?"
      description="Everyone with access to the project will see them right away."
      confirmLabel="Publish"
      onConfirm={() => {}}
    />
  );
}
```

### Loading

Return a promise from `onConfirm`: the confirm button shows a spinner and the dialog stays open until it settles.

`src/ui/catalog/docs/alert-dialog/loading.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { AlertDialog, Button } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-2'], justifyItems: 'center' },
  status: { margin: 0, fontSize: tokens['--os-font-size-caption'], lineHeight: tokens['--os-line-height-sm'], color: tokens['--os-color-fg-muted'] },
});

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function AlertDialogLoading() {
  const [status, setStatus] = useState('2 active sessions');

  return (
    <div {...stylex.props(s.root)}>
      <AlertDialog
        trigger={<Button appearance="tertiary">Sign out everywhere</Button>}
        title="Sign out of every device?"
        description="You will need to sign in again on each device."
        confirmLabel="Sign out"
        destructive
        onConfirm={async () => {
          await wait(1500);
          setStatus('No active sessions');
        }}
      />
      <p role="status" {...stylex.props(s.status)}>{status}</p>
    </div>
  );
}
```

### Custom footer

`footer` replaces the two buttons, here with a third choice.

`src/ui/catalog/docs/alert-dialog/custom-footer.tsx`

```tsx
'use client';

import { AlertDialog, Button } from '../../../components';

export default function AlertDialogCustomFooter() {
  return (
    <AlertDialog
      trigger={<Button appearance="tertiary">Close invoice</Button>}
      title="Save changes to this invoice?"
      description="You edited two line items since the last save."
      footer={close => (
        <>
          <Button appearance="destructive-outline" onClick={close}>Discard</Button>
          <Button appearance="tertiary" onClick={close}>Keep editing</Button>
          <Button onClick={close}>Save</Button>
        </>
      )}
    />
  );
}
```

### Close confirmation

Ask before a sheet with unsaved changes closes.

`src/ui/catalog/docs/alert-dialog/close-confirmation.tsx`

```tsx
'use client';

import { useState } from 'react';
import { AlertDialog, Button, Field, Input, Sheet } from '../../../components';

export default function AlertDialogCloseConfirmation() {
  const [isOpen, setOpen] = useState(false);
  const [isConfirming, setConfirming] = useState(false);
  const [isDirty, setDirty] = useState(false);

  const requestOpen = (next: boolean) => {
    if (next || !isDirty) setOpen(next);
    else setConfirming(true);
  };
  const close = () => { setDirty(false); setOpen(false); };

  return (
    <>
      <Sheet
        trigger={<Button appearance="tertiary">Edit team</Button>}
        isOpen={isOpen}
        onOpenChange={requestOpen}
        title="Team settings"
        description="Change the name, then try to close the sheet."
        footer={<Button onClick={close}>Save</Button>}
      >
        <Field label="Team name">
          <Input defaultValue="Design" onChange={() => setDirty(true)} />
        </Field>
      </Sheet>
      <AlertDialog
        isOpen={isConfirming}
        onOpenChange={setConfirming}
        title="Discard unsaved changes?"
        description="The team keeps its current name."
        confirmLabel="Discard"
        destructive
        onConfirm={close}
      />
    </>
  );
}
```

### Controlled

Open from state; `onCancel` runs on Cancel, Escape or, with `isDismissable`, a press on the backdrop.

`src/ui/catalog/docs/alert-dialog/controlled.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { AlertDialog, Button } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-2'], justifyItems: 'center' },
  status: { margin: 0, fontSize: tokens['--os-font-size-caption'], lineHeight: tokens['--os-line-height-sm'], color: tokens['--os-color-fg-muted'] },
});

export default function AlertDialogControlled() {
  const [isOpen, setOpen] = useState(false);
  const [status, setStatus] = useState('Jonas is a member');

  return (
    <div {...stylex.props(s.root)}>
      <Button appearance="tertiary" onClick={() => setOpen(true)}>Remove Jonas</Button>
      <p role="status" {...stylex.props(s.status)}>{status}</p>
      <AlertDialog
        isOpen={isOpen}
        onOpenChange={setOpen}
        isDismissable
        title="Remove Jonas from the team?"
        description="He loses access to the team’s projects. Press the backdrop to cancel."
        confirmLabel="Remove"
        destructive
        onConfirm={() => setStatus('Jonas was removed')}
        onCancel={() => setStatus('Jonas is still a member')}
      />
    </div>
  );
}
```
