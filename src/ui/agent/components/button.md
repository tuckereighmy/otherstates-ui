# Button

Run an action or submit a form.

Category: Forms · Exports: `Button`, `OverlayButton`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { Button } from '@/ui/components';

<Button onClick={() => console.log('Saved')}>Save changes</Button>
```

## Button

A `<button>` in the shared control shape (a pill by default), or an `<a>` when it has an `href`.

Extends: <button> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `appearance` | `'primary' \| 'secondary' \| 'tertiary' \| 'text' \| 'destructive' \| 'destructive-outline' \| 'link'` | `'primary'` | The visual style. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'small' \| 'medium' \| 'large'` | `'md'` | Height, padding, text and icon size from the control scale. `small`, `medium` and `large` are aliases of `sm`, `md` and `lg`. |
| `fullWidth` | `boolean` | `false` | Stretches the button to the width of its container. |
| `isLoading` | `boolean` | `false` | Shows a centered spinner in place of the label, sets `aria-busy` and ignores presses. |
| `loading` | `boolean` |  | Deprecated alias of `isLoading`. |
| `isDisabled` | `boolean` | `false` | Disables the button. Same as the native `disabled`. |
| `iconOnly` | `boolean` | `false` | Makes the button square for a single icon child. Give it an `aria-label`. |
| `leadingIcon` | `ReactNode` |  | An icon before the label. An `Icon` without a size takes the control's icon size. |
| `trailingIcon` | `ReactNode` |  | An icon after the label. An `Icon` without a size takes the control's icon size. |
| `href` | `string` |  | Renders an `<a>` with the button look. A disabled link drops its `href` and sets `aria-disabled`. |
| `target` | `string` |  | The link's `target`, used with `href`. |
| `rel` | `string` |  | The link's `rel`, used with `href`. |
| `download` | `boolean \| string` |  | The link's `download`, used with `href`. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | The native button type. Set `submit` for the main action of a form. |

## OverlayButton

Deprecated. A React Aria button with the Button look at size `md`, kept for one release where a React Aria trigger needs a pressable child.

Extends: React Aria ButtonProps

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `tone` | `'neutral' \| 'primary' \| 'danger'` | `'neutral'` | Maps to a Button appearance: `neutral` to `tertiary`, `primary` to `primary`, `danger` to `destructive`. |
| `appearanceStyles` | `stylex.StyleXStyles` |  | Extra StyleX styles, merged last. |

## Accessibility

- Renders a native `button`, so Enter and Space activate it and it joins the tab order. With `href` it renders a link, which Enter follows.
- The focus ring shows for keyboard focus only: 2px in the focus-ring color, 2px outside the button.
- An icon-only button needs an `aria-label`; icons inside buttons are hidden from assistive tech.
- While loading, the button sets `aria-busy` and `aria-disabled` and keeps its accessible name, because the label stays in the layout.
- An invisible hit area extends the target to at least 24px, and 44px on touch screens, without changing its size.
- With reduced motion, the press scale is off and the loading spinner stops turning.

## Examples

### Default

`src/ui/catalog/docs/button/default.tsx`

```tsx
import { Button } from '../../../components';

export default function ButtonDefault() {
  return <Button>Save changes</Button>;
}
```

### Secondary

A neutral fill for the actions beside the primary one.

`src/ui/catalog/docs/button/secondary.tsx`

```tsx
import { Button } from '../../../components';

export default function ButtonSecondary() {
  return <Button appearance="secondary">Duplicate</Button>;
}
```

### Tertiary

Transparent with a hairline outline, for a quieter action that still reads as a button.

`src/ui/catalog/docs/button/tertiary.tsx`

```tsx
import { Button } from '../../../components';

export default function ButtonTertiary() {
  return <Button appearance="tertiary">Invite people</Button>;
}
```

### Text

No fill until hover, for low-emphasis actions and toolbars.

`src/ui/catalog/docs/button/text.tsx`

```tsx
import { Button } from '../../../components';

export default function ButtonText() {
  return <Button appearance="text">Skip for now</Button>;
}
```

### Destructive

White text on the danger fill, for the one action that deletes or cannot be undone.

`src/ui/catalog/docs/button/destructive.tsx`

```tsx
import { Button } from '../../../components';

export default function ButtonDestructive() {
  return <Button appearance="destructive">Delete project</Button>;
}
```

### Destructive outline

Error-colored text on a transparent fill, for a destructive action that is not the main one.

`src/ui/catalog/docs/button/destructive-outline.tsx`

```tsx
import { Button } from '../../../components';

export default function ButtonDestructiveOutline() {
  return <Button appearance="destructive-outline">Revoke access</Button>;
}
```

### Link

Looks like a text link and keeps button semantics; it underlines on hover.

`src/ui/catalog/docs/button/link.tsx`

```tsx
import { Button } from '../../../components';

export default function ButtonLink() {
  return <Button appearance="link">Show billing history</Button>;
}
```

### Sizes

Heights of 24, 32, 40, 44 and 48 px. `md` is the default and lines up with fields.

`src/ui/catalog/docs/button/sizes.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Button } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: t['--os-space-2'] },
});

export default function ButtonSizes() {
  return (
    <div {...stylex.props(s.row)}>
      <Button size="xs">Extra small</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra large</Button>
    </div>
  );
}
```

### Disabled

Filled buttons take the disabled fill; transparent ones stay transparent.

`src/ui/catalog/docs/button/disabled.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Button } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: t['--os-space-2'] },
});

export default function ButtonDisabled() {
  return (
    <div {...stylex.props(s.row)}>
      <Button isDisabled>Publish</Button>
      <Button appearance="secondary" isDisabled>Duplicate</Button>
      <Button appearance="tertiary" isDisabled>Invite people</Button>
      <Button appearance="text" isDisabled>Skip for now</Button>
    </div>
  );
}
```

### Icon only

A square button with one icon. Give it an `aria-label`.

`src/ui/catalog/docs/button/icon-only.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Button, Icon } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: t['--os-space-2'] },
});

export default function ButtonIconOnly() {
  return (
    <div {...stylex.props(s.row)}>
      <Button iconOnly aria-label="New note">
        <Icon name="plus" />
      </Button>
      <Button iconOnly appearance="secondary" aria-label="Copy link">
        <Icon name="link" />
      </Button>
      <Button iconOnly appearance="tertiary" aria-label="Settings">
        <Icon name="settings" />
      </Button>
      <Button iconOnly appearance="text" aria-label="More actions">
        <Icon name="more-horizontal" />
      </Button>
    </div>
  );
}
```

### Icon-only sizes

Squares of 24 to 48 px. An `Icon` without a size takes 14, 16, 16, 18 or 20 px to match.

`src/ui/catalog/docs/button/icon-only-sizes.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Button, Icon } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: t['--os-space-2'] },
});

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

export default function ButtonIconOnlySizes() {
  return (
    <div {...stylex.props(s.row)}>
      {sizes.map(size => (
        <Button key={size} size={size} iconOnly appearance="tertiary" aria-label="Edit">
          <Icon name="edit" />
        </Button>
      ))}
    </div>
  );
}
```

### With icon

`leadingIcon` and `trailingIcon` place an icon beside the label and tighten the padding on that side.

`src/ui/catalog/docs/button/with-icon.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Button, Icon } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: t['--os-space-2'] },
});

export default function ButtonWithIcon() {
  return (
    <div {...stylex.props(s.row)}>
      <Button appearance="secondary" leadingIcon={<Icon name="download" />}>
        Export CSV
      </Button>
      <Button trailingIcon={<Icon name="arrow-right" />}>Continue</Button>
    </div>
  );
}
```

### With link

With `href`, the button renders an `<a>` that keeps the button look.

`src/ui/catalog/docs/button/with-link.tsx`

```tsx
import { Button, Icon } from '../../../components';

export default function ButtonWithLink() {
  return (
    <Button href="#" appearance="tertiary" trailingIcon={<Icon name="external-link" />}>
      Open invoice
    </Button>
  );
}
```

### Loading

Press it: `isLoading` swaps the label for a spinner, keeps the size and fill, and ignores presses.

`src/ui/catalog/docs/button/loading.tsx`

```tsx
'use client';

import { useState } from 'react';
import { Button } from '../../../components';

export default function ButtonLoading() {
  const [isPublishing, setPublishing] = useState(false);

  function publish() {
    setPublishing(true);
    window.setTimeout(() => setPublishing(false), 2000);
  }

  return (
    <Button isLoading={isPublishing} onClick={publish}>
      Publish release
    </Button>
  );
}
```

### Loading with a label

A `Spinner` in the leading slot keeps the label visible while the work runs.

`src/ui/catalog/docs/button/loading-custom.tsx`

```tsx
import { Button, Spinner } from '../../../components';

export default function ButtonLoadingCustom() {
  return (
    <Button appearance="secondary" aria-disabled leadingIcon={<Spinner size="sm" tone="current" />}>
      Uploading 3 files
    </Button>
  );
}
```

### Pressed state

`aria-pressed` on a `tertiary` or `text` button shows the toggled fill. For most on and off controls, use Toggle.

`src/ui/catalog/docs/button/pressed.tsx`

```tsx
'use client';

import { useState } from 'react';
import { Button, Icon } from '../../../components';

export default function ButtonPressed() {
  const [isWatching, setWatching] = useState(false);

  return (
    <Button
      appearance="tertiary"
      aria-pressed={isWatching}
      leadingIcon={<Icon name="bell" />}
      onClick={() => setWatching(value => !value)}
    >
      Watch deployments
    </Button>
  );
}
```

### In a form

A full-width submit button under a field.

`src/ui/catalog/docs/button/in-a-form.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, Field, Form, Input } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function ButtonInAForm() {
  const [created, setCreated] = useState('');

  return (
    <div {...stylex.props(s.root)}>
      <Form
        onSubmit={event => {
          event.preventDefault();
          setCreated(String(new FormData(event.currentTarget).get('workspace')));
        }}
      >
        <Field label="Workspace name" description={created ? `Created ${created}.` : 'You can rename it later.'}>
          <Input name="workspace" required />
        </Field>
        <Button type="submit" fullWidth>
          Create workspace
        </Button>
      </Form>
    </div>
  );
}
```
