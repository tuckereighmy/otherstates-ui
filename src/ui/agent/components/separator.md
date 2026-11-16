# Separator

Make a clear break between groups of content.

Category: Layout · Exports: `Separator`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { Separator } from '@/ui/components';

<Separator />
```

## Separator

A 1px line in `border-subtle`, full width or full height.

Extends: <div> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | The direction of the line. A vertical separator stretches to the height of its flex row. |
| `decorative` | `boolean` | `false` | Hides the separator from assistive tech when it only decorates. |

## Accessibility

- Renders `role="separator"` with `aria-orientation`, so screen readers announce the break between groups.
- With `decorative`, it renders `role="none"` and is skipped.
- It is not focusable and has no keyboard interaction.

## Examples

### Default

`src/ui/catalog/docs/separator/default.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Separator } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  column: { display: 'grid', gap: t['--os-space-3'], width: 240, maxWidth: '100%' },
});

export default function SeparatorDefault() {
  return (
    <div {...stylex.props(s.column)}>
      <span>Profile</span>
      <Separator />
      <span>Notifications</span>
      <Separator />
      <span>Billing</span>
    </div>
  );
}
```

### Vertical

In a flex row, a vertical separator stretches to the height of the row.

`src/ui/catalog/docs/separator/vertical.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Separator } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'flex', alignItems: 'center', gap: t['--os-space-3'], height: 24 },
});

export default function SeparatorVertical() {
  return (
    <div {...stylex.props(s.row)}>
      <span>Overview</span>
      <Separator orientation="vertical" />
      <span>Activity</span>
      <Separator orientation="vertical" />
      <span>Settings</span>
    </div>
  );
}
```

### Decorative

Between items of metadata the line is visual only, so `decorative` hides it from assistive tech.

`src/ui/catalog/docs/separator/decorative.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Separator } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens['--os-space-2'],
    height: 16,
    color: tokens['--os-color-fg-muted'],
    fontSize: tokens['--os-font-size-caption'],
  },
});

export default function SeparatorDecorative() {
  return (
    <div {...stylex.props(s.row)}>
      <span>Draft</span>
      <Separator orientation="vertical" decorative />
      <span>Edited 2 minutes ago</span>
      <Separator orientation="vertical" decorative />
      <span>3 comments</span>
    </div>
  );
}
```
