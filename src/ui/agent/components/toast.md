# Toast

Confirm an action without interrupting the current task.

Category: Feedback · Exports: `ToastRegion`, `createToastQueue`, `ToastQueue`, `AnchoredToast`, `toastTimeouts`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { Button, ToastRegion, createToastQueue } from '@/ui/components';

const queue = createToastQueue();

<>
  <Button onClick={() => queue.add({ title: 'Changes saved', kind: 'success' })}>
    Save
  </Button>
  <ToastRegion queue={queue} />
</>
```

## createToastQueue

Creates the queue a `ToastRegion` shows. Keep one per app and add toasts from anywhere.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `maxVisibleToasts` | `number` | `3` | How many toasts show at once; the rest wait in order. |

## ToastQueue

The object `createToastQueue` returns: React Aria's queue with timeouts by kind, updates in place and promise toasts.

Extends: React Aria ToastQueue

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `add` | `(content: ToastMessage, options?: ToastAddOptions) => string` |  | Shows a toast and returns its key. A `content.id` that is already queued updates that toast instead. |
| `update` | `(key: string, content: ToastMessage, options?: ToastAddOptions) => string` |  | Replaces a toast's content in place and restarts its timeout; adds it again if it has closed. |
| `promise` | `<T>(promise: Promise<T>, messages: ToastPromiseMessages<T>, options?: ToastAddOptions) => Promise<T>` |  | Shows `messages.loading`, then the success or error message, which can be functions of the result. |
| `dismiss` | `(key: string) => void` |  | Closes a toast with its exit motion. `close(key)` removes it at once. |

## ToastMessage

The content of one toast.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` (required) | `string` |  | One line, 14/20 at weight 500. |
| `description` | `ReactNode` |  | Supporting text, 13/18 in `fg-muted`, up to two lines. |
| `kind` | `'success' \| 'error' \| 'warning' \| 'info' \| 'loading'` |  | A status icon or spinner, and the default timeout. |
| `action` | `{ label: string; onAction: () => void }` |  | One action button. The toast closes after it runs. |
| `id` | `string` |  | Deduplication key: a second toast with the same `id` updates the first. |

## ToastAddOptions

The second argument of `add`, `update` and `promise`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `timeout` | `number` |  | Milliseconds before the toast closes; 0 keeps it. Default from `toastTimeouts`: 5000, warning 8000, error and loading 0, and 0 for any toast with an action. |
| `onClose` | `() => void` |  | Called when the toast closes for any reason. |

## ToastRegion

The landmark that shows the queue as a stack. Render it once, near the root.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `queue` (required) | `ToastQueue` |  | The queue from `createToastQueue()`. |
| `label` | `string` | `'Notifications'` | Names the landmark. |
| `placement` | `'bottom-end' \| 'bottom-start' \| 'bottom' \| 'top-end' \| 'top-start' \| 'top'` | `'bottom-end'` | The corner or edge of the viewport the stack sits on. |
| `inline` | `boolean` | `false` | Renders the region in its container instead of fixed to the viewport, as in these examples. |
| `className` | `string` |  | Added to the region element. |
| `style` | `CSSProperties` |  | Merged into the region's style, for example to change its width. |
| `ref` | `Ref<HTMLDivElement>` |  | The region element. |

## AnchoredToast

A short confirmation positioned next to a control, such as "Link copied".

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `triggerRef` (required) | `RefObject<Element \| null>` |  | The element the toast points at. |
| `isOpen` (required) | `boolean` |  | Shows the toast. Set it after the action; the toast sets it back when it times out. |
| `onOpenChange` (required) | `(isOpen: boolean) => void` |  | Called with false when the toast closes. |
| `title` (required) | `string` |  | The message, 14/20 at weight 500. |
| `description` | `ReactNode` |  | A second line, 13/18 in `fg-muted`. |
| `kind` | `'success' \| 'error' \| 'warning' \| 'info' \| 'loading'` |  | A status icon or spinner before the text. |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Side of the trigger; it flips when there is no room. |
| `timeout` | `number` | `2000` | Milliseconds before it closes; 0 keeps it open. Hovering pauses it. |
| `className` | `string` |  | Added to the popup surface. |
| `style` | `CSSProperties` |  | Merged into the popup surface's style. |

## Accessibility

- The region is a landmark named "Notifications"; F6 moves focus into it and back, and focusing or hovering it pauses every timeout.
- Each toast is announced when it appears. Updating a toast in place announces the new content.
- Toasts with an action, errors and loading toasts do not time out by default, so nobody has to race a timer.
- Close buttons are named after the toast, for example "Dismiss Invite not sent". Actions are 28px with a 44px touch area.
- `AnchoredToast` announces its message through a polite status region and does not take focus.
- Under reduced motion toasts appear and leave without sliding or scaling.

## Examples

### Default

`src/ui/catalog/docs/toast/default.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useEffect, useState } from 'react';
import { Button, ToastRegion, createToastQueue } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', justifyItems: 'center', gap: t['--os-space-2'], width: 300, maxWidth: '100%' },
});

export default function ToastDefault() {
  const [queue] = useState(() => createToastQueue());
  // The first toast is added once the page is up: the queue gives every toast a random key, which a prerendered
  // page (Next.js) can't have. Its id keeps a second run of the effect from adding it twice.
  useEffect(() => {
    queue.add({ id: 'saved', title: 'Changes saved', description: 'Your draft is up to date.', kind: 'success' });
  }, [queue]);

  return (
    <div {...stylex.props(s.root)}>
      <ToastRegion queue={queue} inline />
      <Button
        appearance="secondary"
        onClick={() => queue.add({ title: 'Changes saved', description: 'Your draft is up to date.', kind: 'success' })}
      >
        Save changes
      </Button>
    </div>
  );
}
```

### With status

`kind` adds a status icon and picks the default timeout.

`src/ui/catalog/docs/toast/with-status.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, ToastRegion, createToastQueue } from '../../../components';
import type { ToastMessage } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const messages: ToastMessage[] = [
  { kind: 'success', title: 'Invoice paid', description: 'INV-2041 was paid in full.' },
  { kind: 'info', title: 'New sign-in', description: 'A new device signed in to your account.' },
  { kind: 'warning', title: 'Storage almost full', description: '92% of your plan is in use.' },
  { kind: 'error', title: 'Upload failed', description: 'The file is larger than 10 MB.' },
];

const s = stylex.create({
  root: { display: 'grid', justifyItems: 'center', gap: t['--os-space-2'], width: 300, maxWidth: '100%' },
  buttons: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: t['--os-space-2'] },
});

export default function ToastWithStatus() {
  const [queue] = useState(() => createToastQueue());

  return (
    <div {...stylex.props(s.root)}>
      <ToastRegion queue={queue} inline />
      <div {...stylex.props(s.buttons)}>
        {messages.map(message => (
          <Button key={message.kind} appearance="secondary" size="sm" onClick={() => queue.add(message)}>
            {message.title}
          </Button>
        ))}
      </div>
    </div>
  );
}
```

### Loading

A `loading` toast shows a spinner and stays; `queue.update()` turns it into the result in place.

`src/ui/catalog/docs/toast/loading.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, ToastRegion, createToastQueue } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', justifyItems: 'center', gap: t['--os-space-2'], width: 300, maxWidth: '100%' },
});

export default function ToastLoading() {
  const [queue] = useState(() => createToastQueue());

  function exportRows() {
    const key = queue.add({ kind: 'loading', title: 'Exporting 1,240 rows', description: 'You can keep working.' });
    window.setTimeout(() => {
      queue.update(key, { kind: 'success', title: 'Export ready', description: 'contacts.csv is in your downloads.' });
    }, 2000);
  }

  return (
    <div {...stylex.props(s.root)}>
      <ToastRegion queue={queue} inline />
      <Button appearance="secondary" onClick={exportRows}>Export CSV</Button>
    </div>
  );
}
```

### With action

One action button, such as Undo. Toasts with an action stay until they are used or dismissed.

`src/ui/catalog/docs/toast/with-action.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, ToastRegion, createToastQueue } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', justifyItems: 'center', gap: t['--os-space-2'], width: 300, maxWidth: '100%' },
});

export default function ToastWithAction() {
  const [queue] = useState(() => createToastQueue());
  const [archived, setArchived] = useState(false);

  function archive() {
    setArchived(true);
    queue.add({
      title: 'Note archived',
      action: { label: 'Undo', onAction: () => setArchived(false) },
    });
  }

  return (
    <div {...stylex.props(s.root)}>
      <ToastRegion queue={queue} inline />
      <Button appearance="secondary" isDisabled={archived} onClick={archive}>
        {archived ? 'Archived' : 'Archive note'}
      </Button>
    </div>
  );
}
```

### Promise

`queue.promise()` shows a loading toast and replaces it with the success or error message.

`src/ui/catalog/docs/toast/promise.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, ToastRegion, createToastQueue } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', justifyItems: 'center', gap: t['--os-space-2'], width: 300, maxWidth: '100%' },
});

function publish() {
  return new Promise<string>(resolve => window.setTimeout(() => resolve('v2.4'), 1600));
}

export default function ToastPromise() {
  const [queue] = useState(() => createToastQueue());

  return (
    <div {...stylex.props(s.root)}>
      <ToastRegion queue={queue} inline />
      <Button
        appearance="secondary"
        onClick={() => queue.promise(publish(), {
          loading: { title: 'Publishing release' },
          success: version => ({ title: `Release ${version} is live` }),
          error: { title: 'Release failed', description: 'Nothing was changed.' },
        })}
      >
        Publish release
      </Button>
    </div>
  );
}
```

### Varying heights

Descriptions wrap to two lines; the stack measures each toast so they fan out without overlap.

`src/ui/catalog/docs/toast/varying-heights.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, ToastRegion, createToastQueue } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', justifyItems: 'center', gap: t['--os-space-2'], width: 300, maxWidth: '100%' },
  buttons: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: t['--os-space-2'] },
});

export default function ToastVaryingHeights() {
  const [queue] = useState(() => createToastQueue());

  return (
    <div {...stylex.props(s.root)}>
      <ToastRegion queue={queue} inline />
      <div {...stylex.props(s.buttons)}>
        <Button appearance="secondary" size="sm" onClick={() => queue.add({ title: 'Link copied' })}>
          Short
        </Button>
        <Button
          appearance="secondary"
          size="sm"
          onClick={() => queue.add({
            kind: 'info',
            title: 'Weekly report scheduled',
            description: 'It goes to the whole design team every Monday at 9:00, starting next week, with the open tasks attached.',
          })}
        >
          Long
        </Button>
      </div>
    </div>
  );
}
```

### Deduplicated

Adding a toast with an `id` that is already showing updates that toast instead of stacking a new one.

`src/ui/catalog/docs/toast/deduplicated.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useRef, useState } from 'react';
import { Button, ToastRegion, createToastQueue } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', justifyItems: 'center', gap: t['--os-space-2'], width: 300, maxWidth: '100%' },
});

export default function ToastDeduplicated() {
  const [queue] = useState(() => createToastQueue());
  const count = useRef(0);

  function sync() {
    count.current += 1;
    queue.add({
      id: 'sync',
      kind: 'success',
      title: 'Calendar synced',
      description: `Synced ${count.current} ${count.current === 1 ? 'time' : 'times'} this session.`,
    });
  }

  return (
    <div {...stylex.props(s.root)}>
      <ToastRegion queue={queue} inline />
      <Button appearance="secondary" onClick={sync}>Sync now</Button>
    </div>
  );
}
```

### Stacked

Up to three toasts stack; hover or focus the stack to fan it out. `timeout: 0` keeps these on screen.

`src/ui/catalog/docs/toast/stacked.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useEffect, useState } from 'react';
import { ToastRegion, createToastQueue } from '../../../components';

const s = stylex.create({
  root: { width: 300, maxWidth: '100%' },
});

export default function ToastStacked() {
  const [queue] = useState(() => createToastQueue());
  // Added once the page is up (each toast gets a random key, which a prerendered page can't have); the ids keep a
  // second run of the effect from adding them twice.
  useEffect(() => {
    queue.add({ id: 'uploaded', kind: 'success', title: 'Logo files uploaded', description: 'Saved to Launch week.' }, { timeout: 0 });
    queue.add({ id: 'joined', kind: 'info', title: 'Dele joined the workspace', description: 'They can comment and edit.' }, { timeout: 0 });
    queue.add({ id: 'declined', kind: 'error', title: 'Payment declined', description: 'Try another card.' }, { timeout: 0 });
  }, [queue]);

  return (
    <div {...stylex.props(s.root)}>
      <ToastRegion queue={queue} inline />
    </div>
  );
}
```

### Placement

The region sits on any corner or edge; top placements stack downward.

`src/ui/catalog/docs/toast/placement.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, ToastRegion, createToastQueue } from '../../../components';
import type { ToastPlacement } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const placements: { value: ToastPlacement; label: string }[] = [
  { value: 'top-start', label: 'Top start' },
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'bottom-end', label: 'Bottom end' },
];

const s = stylex.create({
  root: { display: 'grid', justifyItems: 'center', gap: t['--os-space-2'], width: 320, maxWidth: '100%' },
  buttons: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: t['--os-space-2'] },
});

export default function ToastPlacementExample() {
  const [queue] = useState(() => createToastQueue());
  const [placement, setPlacement] = useState<ToastPlacement>('bottom-end');

  return (
    <div {...stylex.props(s.root)}>
      <ToastRegion queue={queue} inline placement={placement} />
      <div {...stylex.props(s.buttons)}>
        {placements.map(({ value, label }) => (
          <Button
            key={value}
            appearance="secondary"
            size="sm"
            onClick={() => { setPlacement(value); queue.add({ title: `${label} placement` }); }}
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}
```

### Anchored to a control

`AnchoredToast` confirms an action next to the control that caused it, then closes itself.

`src/ui/catalog/docs/toast/anchored.tsx`

```tsx
'use client';

import { useRef, useState } from 'react';
import { AnchoredToast, Button, Icon } from '../../../components';

const link = 'https://notes.example.com/s/q3-plan';

export default function ToastAnchored() {
  const button = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard?.writeText(link).catch(() => undefined);
    setCopied(true);
  }

  return (
    <>
      <Button ref={button} appearance="secondary" leadingIcon={<Icon name="copy" />} onClick={copy}>
        Copy link
      </Button>
      <AnchoredToast triggerRef={button} isOpen={copied} onOpenChange={setCopied} kind="success" title="Link copied" />
    </>
  );
}
```

### Error after submit

A form reports a failed request with an error toast, which stays until it is dismissed.

`src/ui/catalog/docs/toast/submit-error.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button, ToastRegion, createToastQueue } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', justifyItems: 'center', gap: t['--os-space-2'], width: 300, maxWidth: '100%' },
});

export default function ToastSubmitError() {
  const [queue] = useState(() => createToastQueue());
  const [pending, setPending] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    window.setTimeout(() => {
      setPending(false);
      queue.add({ kind: 'error', title: 'Invite not sent', description: 'dele@example.com is already a member.' });
    }, 900);
  }

  return (
    <form onSubmit={submit} {...stylex.props(s.root)}>
      <ToastRegion queue={queue} inline />
      <Button type="submit" isLoading={pending}>Send invite</Button>
    </form>
  );
}
```
