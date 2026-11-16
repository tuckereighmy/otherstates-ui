# Toggle Group

Keep several toggle buttons in one selection group.

Category: Forms · Exports: `ToggleGroup`, `ToggleGroupItem`, `ToggleGroupSeparator`, `FormatToggles`, `FormatIcon`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { Icon, ToggleGroup, ToggleGroupItem } from '@/ui/components';

<ToggleGroup aria-label="Text style" defaultSelectedKeys={['bold']}>
  <ToggleGroupItem id="bold" aria-label="Bold">
    <Icon name="bold" size={16} />
  </ToggleGroupItem>
  <ToggleGroupItem id="italic" aria-label="Italic">
    <Icon name="italic" size={16} />
  </ToggleGroupItem>
</ToggleGroup>
```

## ToggleGroup

A group of toggle buttons that share one selection.

Extends: React Aria ToggleButtonGroupProps

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'pills' \| 'raised' \| 'flush' \| 'outline'` | `'pills'` | `pills`: items on a `bg-muted` track with a raised tile. `raised`: transparent items in a raised group shell. `flush`: the same items with no shell. `outline` is the old name of `raised`. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'sm'` | Item height on the control scale; the track adds 4px around the items. `small`, `medium` and `large` are accepted as aliases. |
| `selectionMode` | `'single' \| 'multiple'` | `'multiple'` | Whether one or several items can be on at once. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | The direction of the items and of arrow-key navigation. |
| `className` | `string` |  | A class added to the group element. |

## ToggleGroupItem

One toggle button in the group. Give it an `id`; icon-only items need an `aria-label`.

Extends: React Aria ToggleButtonProps

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `id` (required) | `Key` |  | Identifies the item in `selectedKeys`. |
| `iconOnly` | `boolean` |  | Draws the item square with no inline padding. Defaults to true when the only child is an element such as an Icon. |
| `className` | `string` |  | A class added to the button. |

## ToggleGroupSeparator

A decorative hairline between runs of items, hidden from assistive tech.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` |  | A class added to the separator. |
| `style` | `CSSProperties` |  | Inline styles merged after the computed length. |

## FormatToggles

A composed text-formatting control with a live preview of the text.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `text` (required) | `string` |  | The preview text the formatting applies to. |
| `value` | `FormatValue` |  | The marks and alignment (controlled): `{ marks: string[]; alignment }`. |
| `defaultValue` | `FormatValue` | `{ marks: ['bold'], alignment: 'left' }` | The starting marks and alignment (uncontrolled). |
| `onChange` | `(value: FormatValue) => void` |  | Called with the new marks and alignment. |
| `label` | `string` | `'Text formatting'` | Names the region for assistive tech. |
| `className` | `string` |  | A class added to the root section. |
| `style` | `CSSProperties` |  | Inline styles on the root section. |

## FormatIcon

A 16px formatting glyph drawn with Icon.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` (required) | `string` |  | `bold`, `italic`, `underline`, `left`, `center`, `right` or `justify`, or any Icon name. |

## Accessibility

- With `selectionMode="multiple"` the group is a `toolbar` of `aria-pressed` buttons; with `single` it is a `radiogroup` of radios.
- Tab moves focus into the group and out again; the arrow keys move between items, and Space or Enter toggles the focused one.
- Name the group with `aria-label` or `aria-labelledby`, and give every icon-only item an `aria-label`.
- Disabled items are skipped by the arrow keys. The separator is decorative and hidden from assistive tech.
- The selected tile springs into place; with reduced motion it only fades.

## Examples

### Default

`src/ui/catalog/docs/toggle-group/default.tsx`

```tsx
import { Icon, ToggleGroup, ToggleGroupItem } from '../../../components';

export default function ToggleGroupDefault() {
  return (
    <ToggleGroup aria-label="Text style" defaultSelectedKeys={['bold']}>
      <ToggleGroupItem id="bold" aria-label="Bold">
        <Icon name="bold" size={16} />
      </ToggleGroupItem>
      <ToggleGroupItem id="italic" aria-label="Italic">
        <Icon name="italic" size={16} />
      </ToggleGroupItem>
      <ToggleGroupItem id="underline" aria-label="Underline">
        <Icon name="underline" size={16} />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
```

### Sizes

`size` sets the item height on the control scale: `xs` 24, `sm` 32 (the default) and `md` 40, each inside a 4px track.

`src/ui/catalog/docs/toggle-group/sizes.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Icon, ToggleGroup, ToggleGroupItem } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const sizes = [
  { size: 'xs', icon: 14 },
  { size: 'sm', icon: 16 },
  { size: 'md', icon: 16 },
] as const;

const s = stylex.create({
  stack: { display: 'grid', justifyItems: 'center', gap: t['--os-space-4'] },
});

export default function ToggleGroupSizes() {
  return (
    <div {...stylex.props(s.stack)}>
      {sizes.map(({ size, icon }) => (
        <ToggleGroup key={size} size={size} aria-label={`Text style, ${size}`} defaultSelectedKeys={['bold']}>
          <ToggleGroupItem id="bold" aria-label="Bold"><Icon name="bold" size={icon} /></ToggleGroupItem>
          <ToggleGroupItem id="italic" aria-label="Italic"><Icon name="italic" size={icon} /></ToggleGroupItem>
          <ToggleGroupItem id="underline" aria-label="Underline"><Icon name="underline" size={icon} /></ToggleGroupItem>
        </ToggleGroup>
      ))}
    </div>
  );
}
```

### With labels

Items can hold an icon and a label. With `selectionMode="single"` and `disallowEmptySelection` one item is always on.

`src/ui/catalog/docs/toggle-group/with-labels.tsx`

```tsx
import { Icon, ToggleGroup, ToggleGroupItem } from '../../../components';

export default function ToggleGroupWithLabels() {
  return (
    <ToggleGroup
      aria-label="Layout"
      selectionMode="single"
      disallowEmptySelection
      defaultSelectedKeys={['list']}
    >
      <ToggleGroupItem id="list">
        <Icon name="list" size={16} />
        List
      </ToggleGroupItem>
      <ToggleGroupItem id="board">
        <Icon name="grid" size={16} />
        Board
      </ToggleGroupItem>
      <ToggleGroupItem id="calendar">
        <Icon name="calendar" size={16} />
        Calendar
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
```

### Raised and flush

`raised` puts transparent items in a raised group shell and fills the items that are on; `flush` drops the shell.

`src/ui/catalog/docs/toggle-group/raised.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Icon, ToggleGroup, ToggleGroupItem } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  stack: { display: 'grid', justifyItems: 'center', gap: t['--os-space-4'] },
});

function Marks({ variant }: { variant: 'raised' | 'flush' }) {
  return (
    <ToggleGroup variant={variant} aria-label={`Text style, ${variant}`} defaultSelectedKeys={['italic']}>
      <ToggleGroupItem id="bold" aria-label="Bold"><Icon name="bold" size={16} /></ToggleGroupItem>
      <ToggleGroupItem id="italic" aria-label="Italic"><Icon name="italic" size={16} /></ToggleGroupItem>
      <ToggleGroupItem id="underline" aria-label="Underline"><Icon name="underline" size={16} /></ToggleGroupItem>
      <ToggleGroupItem id="strikethrough" aria-label="Strikethrough"><Icon name="strikethrough" size={16} /></ToggleGroupItem>
    </ToggleGroup>
  );
}

export default function ToggleGroupRaised() {
  return (
    <div {...stylex.props(s.stack)}>
      <Marks variant="raised" />
      <Marks variant="flush" />
    </div>
  );
}
```

### Vertical

With `orientation="vertical"` the items stack and the arrow keys move up and down.

`src/ui/catalog/docs/toggle-group/vertical.tsx`

```tsx
import { Icon, ToggleGroup, ToggleGroupItem } from '../../../components';

export default function ToggleGroupVertical() {
  return (
    <ToggleGroup
      orientation="vertical"
      aria-label="Panel position"
      selectionMode="single"
      disallowEmptySelection
      defaultSelectedKeys={['left']}
    >
      <ToggleGroupItem id="left">
        <Icon name="panel-left" size={16} />
        Left
      </ToggleGroupItem>
      <ToggleGroupItem id="right">
        <Icon name="panel-right" size={16} />
        Right
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
```

### Disabled

`isDisabled` on the group turns every item off. The selected item keeps its tile so the state stays readable.

`src/ui/catalog/docs/toggle-group/disabled.tsx`

```tsx
import { Icon, ToggleGroup, ToggleGroupItem } from '../../../components';

export default function ToggleGroupDisabled() {
  return (
    <ToggleGroup isDisabled aria-label="Text style" defaultSelectedKeys={['bold']}>
      <ToggleGroupItem id="bold" aria-label="Bold">
        <Icon name="bold" size={16} />
      </ToggleGroupItem>
      <ToggleGroupItem id="italic" aria-label="Italic">
        <Icon name="italic" size={16} />
      </ToggleGroupItem>
      <ToggleGroupItem id="underline" aria-label="Underline">
        <Icon name="underline" size={16} />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
```

### With a disabled item

Set `isDisabled` on one item to skip it; focus and the arrow keys pass over it.

`src/ui/catalog/docs/toggle-group/disabled-item.tsx`

```tsx
import { ToggleGroup, ToggleGroupItem } from '../../../components';

export default function ToggleGroupDisabledItem() {
  return (
    <ToggleGroup
      aria-label="Report period"
      selectionMode="single"
      disallowEmptySelection
      defaultSelectedKeys={['month']}
    >
      <ToggleGroupItem id="week">Week</ToggleGroupItem>
      <ToggleGroupItem id="month">Month</ToggleGroupItem>
      <ToggleGroupItem id="quarter">Quarter</ToggleGroupItem>
      <ToggleGroupItem id="year" isDisabled>Year</ToggleGroupItem>
    </ToggleGroup>
  );
}
```

### Controlled

Pass `selectedKeys` and `onSelectionChange` to own the selection. Several items can be on at once by default.

`src/ui/catalog/docs/toggle-group/controlled.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  stack: { display: 'grid', justifyItems: 'center', gap: t['--os-space-3'] },
  note: { margin: 0, color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-sm'] },
});

export default function ToggleGroupControlled() {
  const [days, setDays] = useState(new Set<string | number>(['mon', 'wed']));
  return (
    <div {...stylex.props(s.stack)}>
      <ToggleGroup aria-label="Reminder days" selectedKeys={days} onSelectionChange={setDays}>
        <ToggleGroupItem id="mon">Mon</ToggleGroupItem>
        <ToggleGroupItem id="tue">Tue</ToggleGroupItem>
        <ToggleGroupItem id="wed">Wed</ToggleGroupItem>
        <ToggleGroupItem id="thu">Thu</ToggleGroupItem>
        <ToggleGroupItem id="fri">Fri</ToggleGroupItem>
      </ToggleGroup>
      <p {...stylex.props(s.note)}>
        {days.size === 0 ? 'No reminders' : `Reminders on ${days.size} ${days.size === 1 ? 'day' : 'days'}`}
      </p>
    </div>
  );
}
```

### With separator

`ToggleGroupSeparator` splits the items into runs; selected neighbors join only within a run.

`src/ui/catalog/docs/toggle-group/with-separator.tsx`

```tsx
import { Icon, ToggleGroup, ToggleGroupItem, ToggleGroupSeparator } from '../../../components';

export default function ToggleGroupWithSeparator() {
  return (
    <ToggleGroup aria-label="Formatting" defaultSelectedKeys={['bold', 'list']}>
      <ToggleGroupItem id="bold" aria-label="Bold"><Icon name="bold" size={16} /></ToggleGroupItem>
      <ToggleGroupItem id="italic" aria-label="Italic"><Icon name="italic" size={16} /></ToggleGroupItem>
      <ToggleGroupItem id="underline" aria-label="Underline"><Icon name="underline" size={16} /></ToggleGroupItem>
      <ToggleGroupSeparator />
      <ToggleGroupItem id="list" aria-label="Bulleted list"><Icon name="list" size={16} /></ToggleGroupItem>
      <ToggleGroupItem id="code" aria-label="Code"><Icon name="code" size={16} /></ToggleGroupItem>
    </ToggleGroup>
  );
}
```

### With tooltips

Wrap an item in a Tooltip to name an icon-only toggle on hover and as the arrow keys move focus to it.

`src/ui/catalog/docs/toggle-group/with-tooltips.tsx`

```tsx
import { Icon, ToggleGroup, ToggleGroupItem, Tooltip } from '../../../components';
import type { IconName } from '../../../components';

const marks: { id: string; label: string; icon: IconName }[] = [
  { id: 'bold', label: 'Bold', icon: 'bold' },
  { id: 'italic', label: 'Italic', icon: 'italic' },
  { id: 'underline', label: 'Underline', icon: 'underline' },
];

export default function ToggleGroupWithTooltips() {
  return (
    <ToggleGroup aria-label="Text style">
      {marks.map(mark => (
        <Tooltip
          key={mark.id}
          trigger={
            <ToggleGroupItem id={mark.id} aria-label={mark.label}>
              <Icon name={mark.icon} size={16} />
            </ToggleGroupItem>
          }
        >
          {mark.label}
        </Tooltip>
      ))}
    </ToggleGroup>
  );
}
```

### Format toggles

A composed editor control: a toggle group for marks and a sliding alignment switch, with the words moving to their new places.

`src/ui/catalog/docs/toggle-group/format-toggles.tsx`

```tsx
import { FormatToggles } from '../../../components';

const note =
  'Notes stay private until you share them. Invite a teammate when a draft is ready, and they can comment right on the page.';

export default function ToggleGroupFormatToggles() {
  return <FormatToggles text={note} />;
}
```
