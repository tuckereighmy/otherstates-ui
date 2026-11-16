# Popover

Open a small panel beside its trigger.

Category: Overlays · Exports: `Popover`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { Button, Popover } from '@/ui/components';

<Popover
  trigger={<Button appearance="tertiary">Rename</Button>}
  title="Rename note"
  footer={close => <Button size="sm" onClick={close}>Save</Button>}
>
  …
</Popover>
```

## Popover

A panel anchored to its trigger, with a compact header, content and an optional footer.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `trigger` (required) | `ReactNode` |  | The element that opens the popover and anchors it. |
| `title` | `ReactNode` |  | The heading, 14/20 500. Leave it out only with an `aria-label`. |
| `description` | `ReactNode` |  | A line under the title, 13/18 in `fg-muted`. |
| `children` | `ReactNode \| ((close: () => void) => ReactNode)` |  | The content. |
| `footer` | `ReactNode \| ((close: () => void) => ReactNode)` |  | Actions in an end-aligned row, primary action last. |
| `placement` | `Placement` | `'bottom'` | Where the popover opens relative to the trigger, for example `bottom start`. It flips when there is no room; below 480px of viewport, left and right placements open below the trigger. |
| `offset` | `number` | `6 (12 with an arrow)` | Distance from the trigger in px. |
| `width` | `number \| string` | `256` | Width in px or any CSS width. Never wider than the viewport less 24px. |
| `showCloseButton` | `boolean` | `false` | Shows a close button at the top end. |
| `closeLabel` | `string` | `'Close'` | Accessible name of the close button. |
| `showArrow` | `boolean` | `false` | Draws an arrow that points at the trigger. |
| `aria-label` | `string` |  | Names the popover when it has no title. |
| `isOpen` | `boolean` |  | Whether the popover is open (controlled). |
| `defaultOpen` | `boolean` | `false` | Whether the popover starts open (uncontrolled). |
| `onOpenChange` | `(open: boolean) => void` |  | Called when the popover opens or closes. |
| `portalContainer` | `Element` | `document.body` | Where the popover renders. |
| `className` | `string` |  | Classes for the popover surface. |
| `style` | `CSSProperties` |  | Inline styles for the popover surface. |
| `ref` | `Ref<HTMLElement>` |  | The popover surface element. |

## Accessibility

- The trigger gets `aria-expanded` and `aria-controls`; the panel is a `dialog` labeled by its title, or by `aria-label` when there is none.
- Focus moves into the popover when it opens and returns to the trigger when it closes. Escape or a press outside closes it.
- The arrow is decorative and hidden from assistive tech.
- Give an icon-only trigger an `aria-label`.
- With reduced motion the popover only fades, over 120ms.

## Examples

### Default

`src/ui/catalog/docs/popover/default.tsx`

```tsx
'use client';

import { Button, Field, Input, Popover } from '../../../components';

export default function PopoverDefault() {
  return (
    <Popover
      trigger={<Button appearance="tertiary">Rename</Button>}
      title="Rename note"
      description="The new name shows everywhere the note is linked."
      footer={close => <Button size="sm" onClick={close}>Save</Button>}
    >
      <Field label="Name">
        <Input size="sm" defaultValue="Kickoff agenda" />
      </Field>
    </Popover>
  );
}
```

### Close button

`showCloseButton` adds a 24px close button beside the title.

`src/ui/catalog/docs/popover/close-button.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Button, Popover } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  copy: { margin: 0, color: tokens['--os-color-fg-muted'] },
});

export default function PopoverCloseButton() {
  return (
    <Popover
      trigger={<Button appearance="tertiary">Usage</Button>}
      title="Storage"
      showCloseButton
    >
      <p {...stylex.props(s.copy)}>18 of 50 GB used. Files in archived projects still count toward the total.</p>
    </Popover>
  );
}
```

### With arrow

`showArrow` points at the trigger, like a tooltip that can hold richer content.

`src/ui/catalog/docs/popover/with-arrow.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Button, Icon, Popover } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  copy: { margin: 0, fontSize: tokens['--os-font-size-caption'], lineHeight: tokens['--os-line-height-sm'] },
});

export default function PopoverWithArrow() {
  return (
    <Popover
      showArrow
      width={224}
      placement="top"
      aria-label="About retries"
      trigger={
        <Button appearance="text" iconOnly aria-label="About retries">
          <Icon name="help-circle" />
        </Button>
      }
    >
      <p {...stylex.props(s.copy)}>Failed deployments retry twice, one minute apart, before they are marked as failed.</p>
    </Popover>
  );
}
```

### Placement

Each popover enters from 4px toward its trigger and settles away from it. On narrow screens the side placements open below.

`src/ui/catalog/docs/popover/placement.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Button, Popover } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: t['--os-space-2'] },
});

const placements = [
  { placement: 'top', label: 'Top' },
  { placement: 'right', label: 'Right' },
  { placement: 'bottom', label: 'Bottom' },
  { placement: 'left', label: 'Left' },
] as const;

export default function PopoverPlacement() {
  return (
    <div {...stylex.props(s.row)}>
      {placements.map(({ placement, label }) => (
        <Popover
          key={placement}
          placement={placement}
          width={200}
          trigger={<Button appearance="tertiary">{label}</Button>}
          title={`${label} placement`}
          description="It grows out of the trigger and moves away from it."
        />
      ))}
    </div>
  );
}
```

### Width

`width` sets the width in px or any CSS length; the default is 256.

`src/ui/catalog/docs/popover/width.tsx`

```tsx
import { Button, Popover, Switch } from '../../../components';

export default function PopoverWidth() {
  return (
    <Popover
      width={320}
      placement="bottom start"
      trigger={<Button appearance="tertiary">Notifications</Button>}
      title="Project notifications"
      description="Applies to this project only. Your other projects keep their settings."
    >
      <Switch label="New comments" defaultChecked />
      <Switch label="Status changes" defaultChecked />
      <Switch label="Weekly summary" />
    </Popover>
  );
}
```

### Controlled

Close the popover from state once a choice is made.

`src/ui/catalog/docs/popover/controlled.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, Popover, RadioGroup } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-2'], justifyItems: 'center' },
  status: { margin: 0, fontSize: tokens['--os-font-size-caption'], lineHeight: tokens['--os-line-height-sm'], color: tokens['--os-color-fg-muted'] },
});

const sorts = [
  { value: 'updated', label: 'Last updated' },
  { value: 'name', label: 'Name' },
];

export default function PopoverControlled() {
  const [isOpen, setOpen] = useState(false);
  const [sort, setSort] = useState('updated');

  return (
    <div {...stylex.props(s.root)}>
      <Popover isOpen={isOpen} onOpenChange={setOpen} trigger={<Button appearance="tertiary">Sort</Button>} title="Sort projects">
        <RadioGroup aria-label="Sort by" name="sort" value={sort} onChange={value => { setSort(value); setOpen(false); }} options={sorts} />
      </Popover>
      <p {...stylex.props(s.status)}>Sorted by {sort === 'name' ? 'name' : 'last updated'}</p>
    </div>
  );
}
```
