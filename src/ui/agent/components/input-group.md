# Input Group

Add icons, text, buttons or a label to an input or textarea, inside one field shell.

Category: Forms · Exports: `InputGroup`, `InputGroupAddon`, `InputGroupText`, `InputGroupButton`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { Icon, Input, InputGroup, InputGroupAddon } from '@/ui/components';

<InputGroup>
  <InputGroupAddon>
    <Icon name="search" />
  </InputGroupAddon>
  <Input aria-label="Search projects" placeholder="Search projects" />
</InputGroup>
```

## InputGroup

One bordered shell around an Input or a Textarea and its addons. It owns the height, the focus edge and the states.

Extends: <div> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `start` | `ReactNode` |  | Content attached at the start, on a `bg-subtle` fill behind a hairline. |
| `end` | `ReactNode` |  | Content attached at the end, on a `bg-subtle` fill behind a hairline. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'small' \| 'medium' \| 'large'` | `'md'` | Height and type of the group and everything in it: 24, 32, 40, 44 or 48 px. `small`, `medium` and `large` are aliases. |
| `isInvalid` | `boolean` |  | Shows the invalid edge and sets `aria-invalid` on the control inside. Inside a Field, the Field's error sets it. |
| `invalid` | `boolean` |  | Deprecated alias of `isInvalid`. |
| `isDisabled` | `boolean` | `false` | Disables the control and the buttons inside. Inside a Field, the Field sets it. |
| `isReadOnly` | `boolean` | `false` | Makes the control inside read-only; buttons stay usable. Inside a Field, the Field sets it. |
| `isLoading` | `boolean` | `false` | Shows a spinner in the trailing slot and sets `aria-busy`. |
| `children` | `ReactNode` |  | One Input or Textarea, with InputGroupAddon and InputGroupButton parts around it in reading order. |

## InputGroupAddon

Icons, text, buttons, a Kbd or a Badge beside the control, with no fill of their own. An `Icon` without a size takes the group's icon size.

Extends: <div> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `align` | `'start' \| 'end' \| 'block-start' \| 'block-end'` | `'start'` | `start` and `end` sit beside the control (place them before or after it); `block-start` and `block-end` take a full row above or below it. |

## InputGroupText

A prefix, suffix or unit in the group's type size, in `fg-muted`.

Extends: <span> attributes

## InputGroupButton

A compact button inside the group: 32 px at md, 4 px inside the edge, radius 6. An `Icon` child without a size renders at 16.

Extends: React Aria ButtonProps

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `iconOnly` | `boolean` | `false` | A square button for a single icon. Give it an `aria-label`. |
| `variant` | `'ghost' \| 'secondary'` | `'ghost'` | `ghost` is transparent with a hover fill; `secondary` has a neutral fill. |
| `className` | `string` |  | Added to the button's own classes. |
| `style` | `CSSProperties` |  | Inline styles for the button. |
| `ref` | `Ref<HTMLButtonElement>` |  | The `<button>` element. |

## Accessibility

- The group is a plain container: the Input or Textarea inside keeps its own role, and needs a label from a Field, a `Label` or `aria-label`.
- Addon text is visible but not part of the accessible name; when a prefix or unit matters, put it in the label or the description too.
- Icon-only buttons need an `aria-label`. Buttons are reached with Tab and pressed with Enter or Space; a focused button draws its ring inside the shell, and the shell keeps its focus edge for the input or textarea.
- Clicking an addon or the empty part of the shell focuses the control, so the whole shell is one target.
- `isLoading` sets `aria-busy` on the group; the spinner is decorative and stops spinning under reduced motion.

## Examples

### Default

`src/ui/catalog/docs/input-group/default.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Icon, Input, InputGroup, InputGroupAddon } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function InputGroupDefault() {
  return (
    <div {...stylex.props(s.root)}>
      <InputGroup>
        <InputGroupAddon>
          <Icon name="search" />
        </InputGroupAddon>
        <Input aria-label="Search projects" placeholder="Search projects" />
      </InputGroup>
    </div>
  );
}
```

### With end icon

Place an addon with `align="end"` after the input.

`src/ui/catalog/docs/input-group/with-end-icon.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Field, Icon, Input, InputGroup, InputGroupAddon } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function InputGroupWithEndIcon() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Reply-to address">
        <InputGroup>
          <Input type="email" placeholder="support@example.com" />
          <InputGroupAddon align="end">
            <Icon name="mail" />
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </div>
  );
}
```

### With start text

`InputGroupText` sets a prefix in the group's type size, in `fg-muted`.

`src/ui/catalog/docs/input-group/with-start-text.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Field, Input, InputGroup, InputGroupAddon, InputGroupText } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function InputGroupWithStartText() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Profile handle">
        <InputGroup>
          <InputGroupAddon>
            <InputGroupText>@</InputGroupText>
          </InputGroupAddon>
          <Input placeholder="your-name" autoComplete="username" />
        </InputGroup>
      </Field>
    </div>
  );
}
```

### With end text

A unit after the value keeps the number itself clean.

`src/ui/catalog/docs/input-group/with-end-text.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Field, Input, InputGroup, InputGroupAddon, InputGroupText } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function InputGroupWithEndText() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Keep backups for" description="Between 7 and 365 days.">
        <InputGroup>
          <Input type="number" min={7} max={365} defaultValue={30} />
          <InputGroupAddon align="end">
            <InputGroupText>days</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </div>
  );
}
```

### With start and end text

Addons on both sides; the value text sits 8 px from each.

`src/ui/catalog/docs/input-group/with-start-and-end-text.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Field, Input, InputGroup, InputGroupAddon, InputGroupText } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function InputGroupWithStartAndEndText() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Team budget">
        <InputGroup>
          <InputGroupAddon>
            <InputGroupText>$</InputGroupText>
          </InputGroupAddon>
          <Input inputMode="decimal" placeholder="0.00" />
          <InputGroupAddon align="end">
            <InputGroupText>per month</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </div>
  );
}
```

### Attached addons

`start` and `end` attach text on its own fill behind a hairline, for fixed parts of the value.

`src/ui/catalog/docs/input-group/attached-addons.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Field, Input, InputGroup } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function InputGroupAttachedAddons() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Workspace address">
        <InputGroup start="https://" end=".example.com">
          <Input placeholder="team-name" />
        </InputGroup>
      </Field>
    </div>
  );
}
```

### With tooltip

An icon button in the addon can carry a Tooltip that explains the field.

`src/ui/catalog/docs/input-group/with-tooltip.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Field, Icon, Input, InputGroup, InputGroupAddon, InputGroupButton, Tooltip } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function InputGroupWithTooltip() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Signing secret">
        <InputGroup>
          <Input type="password" defaultValue="sig-7f3k-29ad-q81m" />
          <InputGroupAddon align="end">
            <Tooltip
              trigger={
                <InputGroupButton iconOnly aria-label="About the signing secret">
                  <Icon name="info" />
                </InputGroupButton>
              }
            >
              Signs every request we send to your endpoint.
            </Tooltip>
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </div>
  );
}
```

### With icon button

A read-only group keeps its buttons usable: here, copy the link.

`src/ui/catalog/docs/input-group/with-icon-button.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Field, Icon, Input, InputGroup, InputGroupAddon, InputGroupButton } from '../../../components';

const link = 'https://example.com/invite/7hq2';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function InputGroupWithIconButton() {
  const [copied, setCopied] = useState(false);

  return (
    <div {...stylex.props(s.root)}>
      <Field label="Invite link" isReadOnly>
        <InputGroup>
          <Input defaultValue={link} />
          <InputGroupAddon align="end">
            <InputGroupButton
              iconOnly
              aria-label={copied ? 'Copied' : 'Copy link'}
              onPress={() => navigator.clipboard?.writeText(link).then(() => setCopied(true), () => {})}
            >
              <Icon name={copied ? 'check' : 'copy'} />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </div>
  );
}
```

### With button

`InputGroupButton` is 32 px tall at md and sits 4 px inside the edge.

`src/ui/catalog/docs/input-group/with-button.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Input, InputGroup, InputGroupAddon, InputGroupButton } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function InputGroupWithButton() {
  return (
    <div {...stylex.props(s.root)}>
      <InputGroup>
        <Input aria-label="Discount code" placeholder="Discount code" />
        <InputGroupAddon align="end">
          <InputGroupButton variant="secondary">Apply</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
```

### With badge

A Badge in the end addon marks the state of the value.

`src/ui/catalog/docs/input-group/with-badge.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Badge, Field, Input, InputGroup, InputGroupAddon } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function InputGroupWithBadge() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Default branch">
        <InputGroup>
          <Input defaultValue="release/2.4" />
          <InputGroupAddon align="end">
            <Badge variant="secondary" size="sm">Protected</Badge>
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </div>
  );
}
```

### With keyboard shortcut

A Kbd hints at the shortcut; press / anywhere on the page to focus the search.

`src/ui/catalog/docs/input-group/with-keyboard-shortcut.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useEffect, useRef } from 'react';
import { Icon, Input, InputGroup, InputGroupAddon, Kbd } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function InputGroupWithKeyboardShortcut() {
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const typing = event.target instanceof HTMLElement && event.target.closest('input, textarea, [contenteditable]');
      if (event.key !== '/' || typing) return;
      event.preventDefault();
      input.current?.focus();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div {...stylex.props(s.root)}>
      <InputGroup>
        <InputGroupAddon>
          <Icon name="search" />
        </InputGroupAddon>
        <Input ref={input} aria-label="Search notes" aria-keyshortcuts="/" placeholder="Search notes" />
        <InputGroupAddon align="end">
          <Kbd size="sm">/</Kbd>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
```

### With inner label

A `block-start` addon puts the label inside the shell, above the value.

`src/ui/catalog/docs/input-group/with-inner-label.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useId } from 'react';
import { Input, InputGroup, InputGroupAddon, Label } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function InputGroupWithInnerLabel() {
  const id = useId();

  return (
    <div {...stylex.props(s.root)}>
      <InputGroup>
        <InputGroupAddon align="block-start">
          <Label htmlFor={id}>Recipient</Label>
        </InputGroupAddon>
        <Input id={id} type="email" placeholder="name@example.com" />
      </InputGroup>
    </div>
  );
}
```

### Sizes

The group sets the size of the input, the text, the icons and the buttons inside it.

`src/ui/catalog/docs/input-group/sizes.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Icon, Input, InputGroup, InputGroupAddon } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const sizes = [
  { size: 'xs', label: 'Extra small, 24 px' },
  { size: 'sm', label: 'Small, 32 px' },
  { size: 'md', label: 'Medium, 40 px' },
  { size: 'lg', label: 'Large, 44 px' },
  { size: 'xl', label: 'Extra large, 48 px' },
] as const;

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-3'], width: 320, maxWidth: '100%' },
});

export default function InputGroupSizes() {
  return (
    <div {...stylex.props(s.root)}>
      {sizes.map(({ size, label }) => (
        <InputGroup key={size} size={size}>
          <InputGroupAddon>
            <Icon name="search" />
          </InputGroupAddon>
          <Input aria-label={label} placeholder={label} />
        </InputGroup>
      ))}
    </div>
  );
}
```

### Disabled

A disabled group disables the input and its buttons, and the addons go `fg-disabled`.

`src/ui/catalog/docs/input-group/disabled.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Field, Icon, Input, InputGroup, InputGroupAddon, InputGroupButton } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function InputGroupDisabled() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Webhook endpoint" description="Upgrade the plan to add endpoints." isDisabled>
        <InputGroup start="https://">
          <Input placeholder="hooks.example.com" />
          <InputGroupAddon align="end">
            <InputGroupButton iconOnly aria-label="Test endpoint">
              <Icon name="send" />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </div>
  );
}
```

### Invalid

Inside a Field with an error, the whole group takes the `border-error` edge.

`src/ui/catalog/docs/input-group/invalid.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Field, Input, InputGroup, InputGroupAddon, InputGroupText } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function InputGroupInvalid() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Subdomain" errorMessage="Use lowercase letters, numbers and hyphens only.">
        <InputGroup>
          <Input defaultValue="Team_Notes" />
          <InputGroupAddon align="end">
            <InputGroupText>.example.com</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </div>
  );
}
```

### Loading

`isLoading` puts a spinner in the trailing slot and sets `aria-busy`; typing still works.

`src/ui/catalog/docs/input-group/loading.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Icon, Input, InputGroup, InputGroupAddon } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function InputGroupLoading() {
  return (
    <div {...stylex.props(s.root)}>
      <InputGroup isLoading>
        <InputGroupAddon>
          <Icon name="search" />
        </InputGroupAddon>
        <Input aria-label="Search invoices" defaultValue="INV-20" />
      </InputGroup>
    </div>
  );
}
```

### With number input

Buttons placed straight in the group step a numeric input.

`src/ui/catalog/docs/input-group/with-number-input.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Field, Icon, Input, InputGroup, InputGroupButton } from '../../../components';

const s = stylex.create({
  root: { width: 200, maxWidth: '100%' },
});

export default function InputGroupWithNumberInput() {
  const [seats, setSeats] = useState(5);
  const update = (next: number) => setSeats(Math.min(50, Math.max(1, next)));

  return (
    <div {...stylex.props(s.root)}>
      <Field label="Seats" description="From 1 to 50.">
        <InputGroup>
          <InputGroupButton iconOnly aria-label="Remove a seat" isDisabled={seats <= 1} onPress={() => update(seats - 1)}>
            <Icon name="minus" />
          </InputGroupButton>
          <Input inputMode="numeric" value={seats} onChange={event => update(Number(event.currentTarget.value) || 1)} />
          <InputGroupButton iconOnly aria-label="Add a seat" isDisabled={seats >= 50} onPress={() => update(seats + 1)}>
            <Icon name="plus" />
          </InputGroupButton>
        </InputGroup>
      </Field>
    </div>
  );
}
```

### With textarea

With a Textarea, the group grows with the text; a `block-end` addon holds the actions.

`src/ui/catalog/docs/input-group/with-textarea.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Icon, InputGroup, InputGroupAddon, InputGroupButton, Textarea } from '../../../components';

const s = stylex.create({
  root: { width: 380, maxWidth: '100%' },
  spacer: { flexGrow: 1 },
});

export default function InputGroupWithTextarea() {
  return (
    <div {...stylex.props(s.root)}>
      <InputGroup>
        <Textarea aria-label="Reply" placeholder="Write a reply" minRows={2} maxRows={6} />
        <InputGroupAddon align="block-end">
          <InputGroupButton iconOnly aria-label="Attach a file">
            <Icon name="paperclip" />
          </InputGroupButton>
          <span {...stylex.props(s.spacer)} />
          <InputGroupButton variant="secondary">Send</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
```
