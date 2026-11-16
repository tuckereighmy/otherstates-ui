# Toggle

A button that turns one option on or off.

Category: Forms · Exports: `Toggle`, `ToggleButton`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { Toggle } from '@/ui/components';

<Toggle defaultSelected>Pin note</Toggle>
```

## Toggle

A rectangular button that stays pressed while it is on. `ToggleButton` is a deprecated alias.

Extends: React Aria ToggleButtonProps

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'small' \| 'medium' \| 'large'` | `'md'` | Height, padding, radius, text and icon size from the control scale. `small`, `medium` and `large` are aliases of `sm`, `md` and `lg`. |
| `variant` | `'ghost' \| 'outline'` | `'ghost'` | `ghost` is transparent while off; `outline` adds a hairline. |
| `iconOnly` | `boolean` | `false` | Makes the toggle square for a single icon child. Give it an `aria-label`. |

## Accessibility

- Renders a `button` with `aria-pressed`, which reflects the on state. Space and Enter toggle it.
- Keep the label the same in both states: `aria-pressed` already says whether it is on.
- An icon-only toggle needs an `aria-label`. Wrap related toggles in an element with `role="group"` and a label.
- The focus ring shows for keyboard focus only, 2px outside the edge.
- An invisible hit area extends the target to at least 24px, and 44px on touch screens. With reduced motion, the press scale is off.

## Examples

### Default

`src/ui/catalog/docs/toggle/default.tsx`

```tsx
import { Toggle } from '../../../components';

export default function ToggleDefault() {
  return <Toggle>Pin note</Toggle>;
}
```

### Outline

`variant="outline"` adds a hairline, so the toggle reads as a control while it is off.

`src/ui/catalog/docs/toggle/outline.tsx`

```tsx
import { Toggle } from '../../../components';

export default function ToggleOutline() {
  return <Toggle variant="outline">Show archived</Toggle>;
}
```

### With icon

An `Icon` without a size takes the toggle's icon size. When on, the toggle fills with the accent.

`src/ui/catalog/docs/toggle/with-icon.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Icon, Toggle } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: t['--os-space-2'] },
});

export default function ToggleWithIcon() {
  return (
    <div {...stylex.props(s.row)}>
      <Toggle>
        <Icon name="star" />
        Star
      </Toggle>
      <Toggle defaultSelected>
        <Icon name="bell" />
        Notify me
      </Toggle>
    </div>
  );
}
```

### Sizes

Heights of 24, 32, 40, 44 and 48 px. `md` is the default and lines up with buttons and fields.

`src/ui/catalog/docs/toggle/sizes.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Icon, Toggle } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: t['--os-space-2'] },
});

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

export default function ToggleSizes() {
  return (
    <div {...stylex.props(s.row)}>
      {sizes.map(size => (
        <Toggle key={size} size={size} variant="outline">
          <Icon name="bookmark" />
          Save
        </Toggle>
      ))}
    </div>
  );
}
```

### Disabled

Off toggles stay transparent with disabled text; on toggles take the disabled fill.

`src/ui/catalog/docs/toggle/disabled.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Toggle } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: t['--os-space-2'] },
});

export default function ToggleDisabled() {
  return (
    <div {...stylex.props(s.row)}>
      <Toggle isDisabled>Pin note</Toggle>
      <Toggle isDisabled defaultSelected>Show grid</Toggle>
      <Toggle isDisabled variant="outline">Show archived</Toggle>
    </div>
  );
}
```

### Icon group

Square icon-only toggles side by side, each with an `aria-label`. For one tab stop and arrow keys, use ToggleGroup.

`src/ui/catalog/docs/toggle/icon-group.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Icon, Toggle } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  group: { display: 'flex', gap: t['--os-space-1-5'] },
});

export default function ToggleIconGroup() {
  return (
    <div role="group" aria-label="Text style" {...stylex.props(s.group)}>
      <Toggle iconOnly aria-label="Bold" defaultSelected>
        <Icon name="bold" />
      </Toggle>
      <Toggle iconOnly aria-label="Italic">
        <Icon name="italic" />
      </Toggle>
      <Toggle iconOnly aria-label="Underline">
        <Icon name="underline" />
      </Toggle>
      <Toggle iconOnly aria-label="Strikethrough">
        <Icon name="strikethrough" />
      </Toggle>
    </div>
  );
}
```

### Controlled

`isSelected` and `onChange` keep the state in your component.

`src/ui/catalog/docs/toggle/controlled.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Icon, Toggle } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  column: { display: 'grid', justifyItems: 'center', gap: tokens['--os-space-3'] },
  status: { margin: 0, color: tokens['--os-color-fg-muted'], fontSize: tokens['--os-font-size-caption'] },
});

export default function ToggleControlled() {
  const [isMuted, setMuted] = useState(false);

  return (
    <div {...stylex.props(s.column)}>
      <Toggle variant="outline" isSelected={isMuted} onChange={setMuted}>
        <Icon name="volume" />
        Mute thread
      </Toggle>
      <p {...stylex.props(s.status)}>{isMuted ? 'You will not get updates from this thread.' : 'You get an update for every reply.'}</p>
    </div>
  );
}
```
