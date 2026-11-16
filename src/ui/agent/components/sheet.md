# Sheet

Open a side panel for details or settings.

Category: Overlays · Exports: `Sheet`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { Button, Sheet } from '@/ui/components';

<Sheet
  trigger={<Button appearance="tertiary">Settings</Button>}
  title="Settings"
  description="Changes apply to this workspace."
  footer={close => <Button onClick={close}>Done</Button>}
>
  …
</Sheet>
```

## Sheet

A modal panel on one edge of the viewport, with a header, a scrolling body and a footer pinned to the far end.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` (required) | `ReactNode` |  | The heading. It names the sheet for assistive tech. |
| `trigger` | `ReactNode` |  | The element that opens the sheet. Leave it out to control the sheet with `isOpen`. |
| `description` | `ReactNode` |  | One or two sentences under the title, linked with `aria-describedby`. |
| `children` | `ReactNode \| ((close: () => void) => ReactNode)` |  | The body. It scrolls between the header and the footer. |
| `footer` | `ReactNode \| ((close: () => void) => ReactNode)` |  | Actions pinned to the far end, end-aligned, primary action last. They stack below 480px of viewport. |
| `edge` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'right'` | The viewport edge the sheet opens from. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'small' \| 'medium' \| 'large'` | `'md'` | Left and right: 320, 384 or 480 wide. Top and bottom: up to 480, 640 or 800 wide. |
| `variant` | `'flush' \| 'inset'` | `'flush'` | `flush` meets the viewport edge; `inset` floats 8px away with every corner rounded. |
| `showCloseButton` | `boolean` | `false` | Shows a close button at the top end of the sheet. |
| `closeLabel` | `string` | `'Close'` | Accessible name of the close button. |
| `isDismissable` | `boolean` | `true` | Close when the backdrop is pressed. |
| `dismissable` | `boolean` |  | Deprecated. Use `isDismissable`; `false` also turns off Escape. |
| `isKeyboardDismissDisabled` | `boolean` | `false` | Ignore Escape. |
| `isOpen` | `boolean` |  | Whether the sheet is open (controlled). |
| `defaultOpen` | `boolean` | `false` | Whether the sheet starts open (uncontrolled). |
| `onOpenChange` | `(open: boolean) => void` |  | Called when the sheet opens or closes. |
| `portalContainer` | `Element` | `document.body` | Where the sheet renders. |
| `className` | `string` |  | Classes for the sheet surface. |
| `style` | `CSSProperties` |  | Inline styles for the sheet surface. |
| `ref` | `Ref<HTMLDivElement>` |  | The sheet surface element. |

## Accessibility

- The sheet has `role="dialog"` and `aria-modal`; the title labels it and the description is linked with `aria-describedby`.
- Focus moves into the sheet when it opens, stays inside while it is open, and returns to the trigger when it closes.
- Escape and a press on the backdrop close it, unless `isKeyboardDismissDisabled` or `isDismissable={false}` is set.
- Content behind the sheet is hidden from assistive tech and page scrolling is locked.
- With reduced motion the sheet fades instead of sliding, over 120ms.

## Examples

### Default

`src/ui/catalog/docs/sheet/default.tsx`

```tsx
'use client';

import { Button, Checkbox, Sheet } from '../../../components';

export default function SheetDefault() {
  return (
    <Sheet
      trigger={<Button appearance="tertiary">Notifications</Button>}
      title="Notification preferences"
      description="Choose what your workspace sends by email."
      footer={close => (
        <>
          <Button appearance="tertiary" onClick={close}>Cancel</Button>
          <Button onClick={close}>Save</Button>
        </>
      )}
    >
      <Checkbox label="Weekly activity digest" defaultChecked />
      <Checkbox label="Mentions and replies" defaultChecked />
      <Checkbox label="Invoice reminders" />
    </Sheet>
  );
}
```

### Edges

`edge` picks the side: left and right sheets are full height, top and bottom ones span up to 640px.

`src/ui/catalog/docs/sheet/edges.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { Button, Sheet } from '../../../components';
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

export default function SheetEdges() {
  return (
    <div {...stylex.props(s.row)}>
      {edges.map(({ edge, label }) => (
        <Sheet
          key={edge}
          edge={edge}
          trigger={<Button appearance="tertiary">{label}</Button>}
          title={`${label} sheet`}
          description="Sheets slide in from the edge you choose and slide back out when closed."
          footer={close => <Button onClick={close}>Done</Button>}
        />
      ))}
    </div>
  );
}
```

### Inset

`variant="inset"` floats the sheet 8px from the viewport with every corner rounded.

`src/ui/catalog/docs/sheet/inset.tsx`

```tsx
'use client';

import { Button, Field, Input, Sheet, Textarea } from '../../../components';

export default function SheetInset() {
  return (
    <Sheet
      variant="inset"
      trigger={<Button appearance="tertiary">New project</Button>}
      title="New project"
      description="Projects group notes, files and deployments."
      footer={close => (
        <>
          <Button appearance="tertiary" onClick={close}>Cancel</Button>
          <Button onClick={close}>Create project</Button>
        </>
      )}
    >
      <Field label="Name">
        <Input placeholder="Quarterly report" />
      </Field>
      <Field label="Description" description="Optional. Shown on the project card.">
        <Textarea />
      </Field>
    </Sheet>
  );
}
```

### Sizes

Left and right sheets are 320, 384 (the default) or 480 wide.

`src/ui/catalog/docs/sheet/sizes.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { Button, Sheet } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: t['--os-space-2'] },
});

const sizes = [
  { size: 'sm', label: 'Small', width: 320 },
  { size: 'md', label: 'Medium', width: 384 },
  { size: 'lg', label: 'Large', width: 480 },
] as const;

export default function SheetSizes() {
  return (
    <div {...stylex.props(s.row)}>
      {sizes.map(({ size, label, width }) => (
        <Sheet
          key={size}
          size={size}
          trigger={<Button appearance="tertiary">{label}</Button>}
          title={`${label} sheet`}
          description={`This sheet is ${width}px wide, or the full viewport on small screens.`}
          footer={close => <Button onClick={close}>Done</Button>}
        />
      ))}
    </div>
  );
}
```

### Close button

A sheet without a footer, closed by its close button. Long content scrolls under the header.

`src/ui/catalog/docs/sheet/close-button.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Button, Sheet } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  entry: { display: 'grid', gap: tokens['--os-space-0-5'], margin: 0 },
  time: { fontSize: tokens['--os-font-size-caption'], lineHeight: tokens['--os-line-height-sm'], color: tokens['--os-color-fg-muted'] },
});

const activity = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  text: ['Lena deployed the billing service', 'Omar commented on Invoice 1042', 'Priya renamed Roadmap notes', 'Theo invited two members'][i % 4],
  time: `${(i + 1) * 7} minutes ago`,
}));

export default function SheetCloseButton() {
  return (
    <Sheet trigger={<Button appearance="tertiary">Activity</Button>} title="Activity" showCloseButton>
      {activity.map(item => (
        <p key={item.id} {...stylex.props(s.entry)}>
          {item.text}
          <span {...stylex.props(s.time)}>{item.time}</span>
        </p>
      ))}
    </Sheet>
  );
}
```

### Controlled

Open and close the sheet from state with `isOpen` and `onOpenChange`.

`src/ui/catalog/docs/sheet/controlled.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, Sheet } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-2'], justifyItems: 'center' },
  status: { margin: 0, fontSize: tokens['--os-font-size-caption'], lineHeight: tokens['--os-line-height-sm'], color: tokens['--os-color-fg-muted'] },
  copy: { margin: 0, color: tokens['--os-color-fg-muted'] },
});

export default function SheetControlled() {
  const [isOpen, setOpen] = useState(false);

  return (
    <div {...stylex.props(s.root)}>
      <Button appearance="tertiary" onClick={() => setOpen(true)}>Show deployment</Button>
      <p {...stylex.props(s.status)}>{isOpen ? 'Sheet open' : 'Sheet closed'}</p>
      <Sheet
        isOpen={isOpen}
        onOpenChange={setOpen}
        title="Deployment 214"
        description="Started by Lena 12 minutes ago."
        showCloseButton
      >
        <p {...stylex.props(s.copy)}>Build finished in 48 seconds. All checks passed and traffic moved to the new version.</p>
      </Sheet>
    </div>
  );
}
```
