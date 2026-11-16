# Alert

Highlight a message in the flow of a page.

Category: Feedback · Exports: `Alert`, `AlertTitle`, `AlertDescription`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { Alert } from '@/ui/components';

<Alert tone="success" heading="Changes published">
  Your site is up to date.
</Alert>
```

## Alert

A tinted container with a status icon, a title, a description and optional actions.

Extends: <div> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `heading` | `ReactNode` |  | The title line, 14/20 at weight 500. |
| `description` | `ReactNode` |  | Supporting text under the title, in `fg-muted`. |
| `children` | `ReactNode` |  | Rendered as the description, or as is when it contains `AlertTitle` or `AlertDescription`. |
| `tone` | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'error'` | `'neutral'` | Colors the fill and picks the status icon. |
| `variant` | `'filled' \| 'outline'` | `'filled'` | `filled` tints the container; `outline` uses bg-surface with a 1px `border-subtle` hairline. |
| `icon` | `ReactNode` |  | Replaces the status icon. Pass `null` for no icon. |
| `action` | `ReactNode` |  | Buttons at the end of the alert, usually `Button size="sm"`. |
| `onDismiss` | `() => void` |  | Shows a close button and calls this when it is pressed. |
| `dismissLabel` | `string` | `'Dismiss'` | The accessible name of the close button. |
| `announce` | `'polite' \| 'assertive'` |  | `polite` sets `role="status"`, `assertive` sets `role="alert"`, so the alert is read when it appears. |

## AlertTitle

The title line, for composing the content by hand.

Extends: <div> attributes

## AlertDescription

The supporting text, for composing the content by hand.

Extends: <div> attributes

## Accessibility

- An Alert is static content and takes no focus; its close button and actions are in the normal tab order.
- Set `announce` only on alerts that appear in response to something. `assertive` interrupts the screen reader, so keep it for errors.
- The status icon is decorative. Say the status in the title, for example "Payment failed", not with color alone.
- The close button is named "Dismiss" by default; pass `dismissLabel` to name what it closes.
- Text keeps at least 4.5:1 against every tint in both themes.

## Examples

### Default

`src/ui/catalog/docs/alert/default.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Alert } from '../../../components';

const s = stylex.create({
  root: { width: 380, maxWidth: '100%' },
});

export default function AlertDefault() {
  return (
    <div {...stylex.props(s.root)}>
      <Alert heading="Scheduled maintenance">
        The workspace is read-only on Sunday from 02:00 to 03:00 UTC.
      </Alert>
    </div>
  );
}
```

### Tones

Info, success, warning and error tint the container and color the status icon.

`src/ui/catalog/docs/alert/tones.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Alert } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-3'], width: 380, maxWidth: '100%' },
});

export default function AlertTones() {
  return (
    <div {...stylex.props(s.root)}>
      <Alert tone="info" heading="New billing page">
        Invoices now live under Settings.
      </Alert>
      <Alert tone="success" heading="Deployment finished">
        Version 2.4 is live in all regions.
      </Alert>
      <Alert tone="warning" heading="Storage almost full">
        You have used 92% of your plan.
      </Alert>
      <Alert tone="error" heading="Payment failed">
        Update the card on file to keep your projects running.
      </Alert>
    </div>
  );
}
```

### Custom icon

Any `Icon` can replace the status icon; `icon={null}` removes it.

`src/ui/catalog/docs/alert/custom-icon.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Alert, Icon } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-3'], width: 380, maxWidth: '100%' },
});

export default function AlertCustomIcon() {
  return (
    <div {...stylex.props(s.root)}>
      <Alert tone="info" icon={<Icon name="sparkle" size={16} />} heading="Smart replies">
        Suggested answers now appear under each thread.
      </Alert>
      <Alert tone="info" icon={null} heading="No icon">
        Pass null to leave the icon out.
      </Alert>
    </div>
  );
}
```

### With actions

The `action` slot sits at the end, and drops below the text when the alert is narrow.

`src/ui/catalog/docs/alert/with-actions.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Alert, Button } from '../../../components';

const s = stylex.create({
  root: { width: 560, maxWidth: '100%' },
});

export default function AlertWithActions() {
  return (
    <div {...stylex.props(s.root)}>
      <Alert
        tone="warning"
        heading="Your trial ends in 3 days"
        action={
          <>
            <Button appearance="tertiary" size="sm">Later</Button>
            <Button size="sm">Choose a plan</Button>
          </>
        }
      >
        Pick a plan to keep your projects and history.
      </Alert>
    </div>
  );
}
```

### Dismissible

`onDismiss` adds a close button; the alert stays until you stop rendering it.

`src/ui/catalog/docs/alert/dismissible.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Alert, Button } from '../../../components';

const s = stylex.create({
  root: { display: 'grid', justifyItems: 'center', width: 380, maxWidth: '100%' },
});

export default function AlertDismissible() {
  const [open, setOpen] = useState(true);

  return (
    <div {...stylex.props(s.root)}>
      {open ? (
        <Alert
          tone="info"
          heading="Two-step sign-in is available"
          onDismiss={() => setOpen(false)}
        >
          Turn it on in Settings to protect your account.
        </Alert>
      ) : (
        <Button appearance="secondary" size="sm" onClick={() => setOpen(true)}>
          Show the alert again
        </Button>
      )}
    </div>
  );
}
```

### Outline

A bg-surface fill with a hairline, for alerts inside cards and dense layouts.

`src/ui/catalog/docs/alert/outline.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Alert } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-3'], width: 380, maxWidth: '100%' },
});

export default function AlertOutline() {
  return (
    <div {...stylex.props(s.root)}>
      <Alert variant="outline" heading="Exports are queued">
        We email you a link when the file is ready.
      </Alert>
      <Alert variant="outline" tone="error" heading="Sync stopped">
        Reconnect your calendar to resume.
      </Alert>
    </div>
  );
}
```

### Composed content

Use `AlertTitle` and `AlertDescription` as children when the body needs its own markup.

`src/ui/catalog/docs/alert/composed.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Alert, AlertDescription, AlertTitle } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { width: 380, maxWidth: '100%' },
  list: { margin: 0, paddingInlineStart: t['--os-space-5'], listStyleType: 'disc' },
});

export default function AlertComposed() {
  return (
    <div {...stylex.props(s.root)}>
      <Alert tone="error">
        <AlertTitle>The invoice could not be sent</AlertTitle>
        <AlertDescription>
          <ul {...stylex.props(s.list)}>
            <li>Add a billing address</li>
            <li>Choose a payment term</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
}
```

### Announced

An alert that appears after an action sets `announce` so screen readers read it out.

`src/ui/catalog/docs/alert/announced.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Alert, Button } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', justifyItems: 'start', gap: t['--os-space-3'], width: 380, maxWidth: '100%' },
});

export default function AlertAnnounced() {
  const [checked, setChecked] = useState(false);

  return (
    <div {...stylex.props(s.root)}>
      <Button appearance="secondary" size="sm" onClick={() => setChecked(true)}>
        Check domain
      </Button>
      {checked && (
        <Alert tone="success" announce="polite" heading="Domain verified">
          notes.example.com now points to your workspace.
        </Alert>
      )}
    </div>
  );
}
```
