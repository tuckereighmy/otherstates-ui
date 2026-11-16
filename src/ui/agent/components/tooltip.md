# Tooltip

A short label that appears when a control is hovered or focused.

Category: Overlays · Exports: `Tooltip`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { Button, Icon, Tooltip } from '@/ui/components';

<Tooltip trigger={<Button iconOnly aria-label="Copy link"><Icon name="link" /></Button>}>
  Copy link
</Tooltip>
```

## Tooltip

A trigger and the tooltip that describes it.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `trigger` (required) | `ReactNode` |  | The control the tooltip describes: a Button or any focusable element. |
| `children` (required) | `ReactNode` |  | The tooltip text. Keep it short and non-interactive. |
| `tone` | `'contrast' \| 'subtle' \| 'accent'` | `'contrast'` | The fill. |
| `placement` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'` | The side of the trigger it opens on. |
| `offset` | `number` | `6` | Distance from the trigger in px. |
| `crossOffset` | `number` |  | Shift along the trigger’s edge, in px. |
| `delay` | `number` | `250` | Milliseconds of hover before it opens. |
| `closeDelay` | `number` | `100` | Milliseconds before it closes after the pointer leaves. |
| `isDisabled` | `boolean` | `false` | Never show the tooltip. |
| `focusOnly` | `boolean` | `false` | Open on keyboard focus only, not on hover. |
| `showArrow` | `boolean` | `true` | Draw the arrow that points at the trigger. |
| `isOpen` | `boolean` |  | Whether the tooltip is open, controlled. |
| `defaultOpen` | `boolean` | `false` | Whether the tooltip starts open, uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` |  | Called when the tooltip opens or closes. |
| `className` | `string` |  | Classes for the tooltip. |
| `style` | `CSSProperties` |  | Inline styles for the tooltip. |
| `ref` | `Ref<HTMLDivElement>` |  | The tooltip element. |

## Accessibility

- The tooltip has `role="tooltip"` and is linked to its trigger with `aria-describedby` while it shows.
- It opens on hover after `delay` and at once on keyboard focus; Escape and pressing the trigger close it.
- A tooltip describes; it never names. An icon-only trigger still needs its own `aria-label`.
- Content is text only: people cannot move into a tooltip, so links and buttons belong in a Popover.
- Under reduced motion the tooltip fades without moving or scaling.

## Examples

### Default

`src/ui/catalog/docs/tooltip/default.tsx`

```tsx
import { Button, Icon, Tooltip } from '../../../components';

export default function TooltipDefault() {
  return (
    <Tooltip
      trigger={
        <Button appearance="secondary" iconOnly aria-label="Copy link">
          <Icon name="link" />
        </Button>
      }
    >
      Copy link
    </Tooltip>
  );
}
```

### Placements

Four sides; the tooltip flips when the side has no room.

`src/ui/catalog/docs/tooltip/placements.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Button, Tooltip } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({ row: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: t['--os-space-3'] } });
const sides = [
  { side: 'top', label: 'Top' },
  { side: 'right', label: 'Right' },
  { side: 'bottom', label: 'Bottom' },
  { side: 'left', label: 'Left' },
] as const;

export default function TooltipPlacements() {
  return (
    <div {...stylex.props(s.row)}>
      {sides.map(({ side, label }) => (
        <Tooltip key={side} placement={side} trigger={<Button appearance="secondary">{label}</Button>}>
          Opens on the {side}
        </Tooltip>
      ))}
    </div>
  );
}
```

### Tones

`contrast` inverts the page, `subtle` is a quiet chip with a hairline, `accent` uses the primary fill.

`src/ui/catalog/docs/tooltip/tones.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Button, Tooltip } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({ row: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: t['--os-space-3'] } });

export default function TooltipTones() {
  return (
    <div {...stylex.props(s.row)}>
      <Tooltip trigger={<Button appearance="secondary">Contrast</Button>}>
        The default, inverted
      </Tooltip>
      <Tooltip tone="subtle" trigger={<Button appearance="secondary">Subtle</Button>}>
        A quiet chip with a hairline
      </Tooltip>
      <Tooltip tone="accent" trigger={<Button appearance="secondary">Accent</Button>}>
        The primary fill
      </Tooltip>
      <Tooltip showArrow={false} trigger={<Button appearance="secondary">No arrow</Button>}>
        Without the arrow
      </Tooltip>
    </div>
  );
}
```

### Grouped tooltips

Once one tooltip is showing, its neighbors open at once as the pointer moves along.

`src/ui/catalog/docs/tooltip/grouped.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Button, Icon, Tooltip } from '../../../components';
import type { IconName } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({ toolbar: { display: 'flex', gap: t['--os-space-1'] } });
const tools: { icon: IconName; label: string; keys: string }[] = [
  { icon: 'bold', label: 'Bold', keys: '⌘B' },
  { icon: 'italic', label: 'Italic', keys: '⌘I' },
  { icon: 'underline', label: 'Underline', keys: '⌘U' },
  { icon: 'link', label: 'Add link', keys: '⌘K' },
];

export default function TooltipGrouped() {
  return (
    <div role="toolbar" aria-label="Formatting" {...stylex.props(s.toolbar)}>
      {tools.map(tool => (
        <Tooltip key={tool.icon} trigger={
          <Button appearance="text" size="sm" iconOnly aria-label={tool.label}>
            <Icon name={tool.icon} />
          </Button>
        }>
          {tool.label} · {tool.keys}
        </Tooltip>
      ))}
    </div>
  );
}
```

### Delay

`delay` sets the hover wait and `closeDelay` how long it stays; keyboard focus always opens at once.

`src/ui/catalog/docs/tooltip/delay.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Button, Tooltip } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({ row: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: t['--os-space-3'] } });

export default function TooltipDelay() {
  return (
    <div {...stylex.props(s.row)}>
      <Tooltip delay={0} closeDelay={0} trigger={<Button appearance="secondary">Instant</Button>}>
        Opens with no delay
      </Tooltip>
      <Tooltip trigger={<Button appearance="secondary">Default</Button>}>
        Opens after 250ms
      </Tooltip>
      <Tooltip delay={800} closeDelay={400} trigger={<Button appearance="secondary">Patient</Button>}>
        Opens after 800ms, lingers 400ms
      </Tooltip>
    </div>
  );
}
```

### Controlled and disabled

Control the open state with `isOpen`, and switch tooltips off with `isDisabled`.

`src/ui/catalog/docs/tooltip/controlled.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, Icon, Switch, Tooltip } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({ column: { display: 'grid', justifyItems: 'center', gap: t['--os-space-4'] } });

export default function TooltipControlled() {
  const [open, setOpen] = useState(false);
  const [enabled, setEnabled] = useState(true);

  return (
    <div {...stylex.props(s.column)}>
      <Tooltip
        isOpen={open}
        onOpenChange={setOpen}
        isDisabled={!enabled}
        trigger={
          <Button appearance="secondary" leadingIcon={<Icon name="upload" />}>
            Publish
          </Button>
        }
      >
        Publishes to everyone on the team
      </Tooltip>
      <Switch label="Show tooltips" isSelected={enabled} onChange={setEnabled} />
    </div>
  );
}
```
