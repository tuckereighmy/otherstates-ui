# Checkbox

Turn an independent option on or off.

Category: Forms · Exports: `Checkbox`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { Checkbox } from '@/ui/components';

<Checkbox label="Email me when a deployment fails" />
```

## Checkbox

A labeled checkbox row. It also takes React Aria's `isSelected`, `defaultSelected`, `onChange`, `value`, `name`, `form`, `isDisabled`, `isReadOnly`, `isRequired`, `isInvalid`, `isIndeterminate`, `validate`, `inputRef` and `autoFocus`. Inside a CheckboxGroup, a checkbox with a `value` joins the group.

Extends: React Aria CheckboxFieldProps

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` |  | The visible label. Without one, pass `aria-label`. |
| `description` | `ReactNode` |  | Help text under the label. The error message replaces it while the checkbox is invalid. |
| `errorMessage` | `ReactNode \| ((validation: ValidationResult) => ReactNode)` |  | Shown under the row while the checkbox is invalid. Without it, the browser's validation message shows. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'small' \| 'medium' \| 'large'` | `'md'` | Indicator and text size; rows stay 32 px tall. Legacy names are aliases. Inside a group, the group's size applies. |
| `variant` | `'default' \| 'card'` | `'default'` | `card` puts the row in a bordered tile. Inside a group, the group's variant applies. |
| `hideLabel` | `boolean` | `false` | Hides the label visually and keeps it as the accessible name. |
| `className` | `string` |  | Added to the outermost element. |
| `style` | `CSSProperties` |  | Inline styles for the outermost element. |
| `ref` | `Ref<HTMLDivElement>` |  | The outermost element. Use `inputRef` for the input. |
| `error` | `ReactNode` |  | Deprecated: use `isInvalid` with `errorMessage`. Setting it also marks the checkbox invalid. |
| `checked` | `boolean` |  | Deprecated alias of `isSelected`. |
| `defaultChecked` | `boolean` |  | Deprecated alias of `defaultSelected`. |
| `disabled` | `boolean` |  | Deprecated alias of `isDisabled`. |
| `indeterminate` | `boolean` |  | Deprecated alias of `isIndeterminate`. |
| `required` | `boolean` |  | Deprecated alias of `isRequired`. |
| `readOnly` | `boolean` |  | Deprecated alias of `isReadOnly`. |

## Accessibility

- Renders a native checkbox inside a `label`, so clicking the label toggles it and the label is its accessible name.
- Space toggles the focused checkbox. The 2 px focus ring shows on the indicator only for keyboard focus.
- An indeterminate checkbox reports `aria-checked="mixed"` until it is toggled.
- The description and the error message are linked with `aria-describedby`; the error replaces the description, so only one is read.
- A checkbox without a visible label needs `aria-label`. `hideLabel` keeps the label for assistive technology.
- The check draws with a spring and the press scales to .9; reduced motion skips both.

## Examples

### Default

`src/ui/catalog/docs/checkbox/default.tsx`

```tsx
import { Checkbox } from '../../../components';

export default function CheckboxDefault() {
  return <Checkbox label="Email me when a deployment fails" />;
}
```

### With description

Help text sits under the label in `fg-muted`, and the indicator stays on the first line.

`src/ui/catalog/docs/checkbox/with-description.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Checkbox } from '../../../components';

const s = stylex.create({
  root: { width: 340, maxWidth: '100%' },
});

export default function CheckboxWithDescription() {
  return (
    <div {...stylex.props(s.root)}>
      <Checkbox
        label="Share usage data"
        description="Counts of the features your team opens. Project content is never included."
      />
    </div>
  );
}
```

### States

Unchecked, checked and indeterminate. The dash marks a parent whose children are partly on.

`src/ui/catalog/docs/checkbox/states.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Checkbox } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  column: { display: 'grid', gap: t['--os-space-1'] },
});

export default function CheckboxStates() {
  return (
    <div {...stylex.props(s.column)}>
      <Checkbox label="Unchecked" />
      <Checkbox label="Checked" defaultSelected />
      <Checkbox label="Indeterminate" isIndeterminate />
    </div>
  );
}
```

### Sizes

Indicators of 16, 18 and 20 px with 13, 14 and 15 px labels. Every size keeps the 32 px row.

`src/ui/catalog/docs/checkbox/sizes.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Checkbox } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  column: { display: 'grid', gap: t['--os-space-1'] },
});

export default function CheckboxSizes() {
  return (
    <div {...stylex.props(s.column)}>
      <Checkbox size="sm" label="Small" defaultSelected />
      <Checkbox size="md" label="Medium" defaultSelected />
      <Checkbox size="lg" label="Large" defaultSelected />
    </div>
  );
}
```

### Disabled

The ring, fill and label swap to the disabled tokens; nothing fades.

`src/ui/catalog/docs/checkbox/disabled.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Checkbox } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  column: { display: 'grid', gap: t['--os-space-1'] },
});

export default function CheckboxDisabled() {
  return (
    <div {...stylex.props(s.column)}>
      <Checkbox label="Archive closed invoices" isDisabled />
      <Checkbox label="Keep audit log" isDisabled defaultSelected />
    </div>
  );
}
```

### Read-only

The value shows and stays focusable but cannot change. An unchecked box rests on `bg-subtle`.

`src/ui/catalog/docs/checkbox/read-only.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Checkbox } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  column: { display: 'grid', gap: t['--os-space-1'] },
});

export default function CheckboxReadOnly() {
  return (
    <div {...stylex.props(s.column)}>
      <Checkbox label="Two-step sign-in" isReadOnly defaultSelected />
      <Checkbox label="Single sign-on" isReadOnly />
    </div>
  );
}
```

### Invalid

The ring turns `border-error` and the message sits under the label, linked with `aria-describedby`.

`src/ui/catalog/docs/checkbox/invalid.tsx`

```tsx
import { Checkbox } from '../../../components';

export default function CheckboxInvalid() {
  return (
    <Checkbox
      label="I accept the data processing terms"
      isRequired
      isInvalid
      errorMessage="Accept the terms to continue."
    />
  );
}
```

### Card

`variant="card"` puts the row in a bordered tile; the edge turns `accent-moderate` when checked.

`src/ui/catalog/docs/checkbox/card.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Checkbox } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  column: { display: 'grid', gap: t['--os-space-2'], width: 360, maxWidth: '100%' },
});

export default function CheckboxCard() {
  return (
    <div {...stylex.props(s.column)}>
      <Checkbox
        variant="card"
        label="Preview deployments"
        description="Build every pull request on its own URL."
        defaultSelected
      />
      <Checkbox
        variant="card"
        label="Nightly backups"
        description="Keep a copy of the database for 30 days."
      />
    </div>
  );
}
```

### Controlled

Drive the state with `isSelected` and `onChange` to derive other UI from it.

`src/ui/catalog/docs/checkbox/controlled.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Checkbox } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  column: { display: 'grid', gap: tokens['--os-space-2'] },
  status: {
    margin: 0,
    color: tokens['--os-color-fg-muted'],
    fontSize: tokens['--os-font-size-caption'],
    lineHeight: tokens['--os-line-height-md'],
  },
});

export default function CheckboxControlled() {
  const [pinned, setPinned] = useState(false);

  return (
    <div {...stylex.props(s.column)}>
      <Checkbox label="Pin this note" isSelected={pinned} onChange={setPinned} />
      <p {...stylex.props(s.status)}>{pinned ? 'Shown at the top of the list.' : 'Sorted by date.'}</p>
    </div>
  );
}
```

### Form integration

A checked box submits its `value` under its `name`. A required box shows its message on submit.

`src/ui/catalog/docs/checkbox/form-integration.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, Checkbox, Form, FormActions } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-3'], width: 320, maxWidth: '100%' },
  choices: { display: 'grid', gap: tokens['--os-space-1'] },
  status: {
    margin: 0,
    minHeight: 20,
    color: tokens['--os-color-fg-muted'],
    fontSize: tokens['--os-font-size-caption'],
    lineHeight: tokens['--os-line-height-md'],
  },
});

export default function CheckboxFormIntegration() {
  const [result, setResult] = useState('');

  return (
    <div {...stylex.props(s.root)}>
      <Form
        onSubmit={event => {
          event.preventDefault();
          const backups = new FormData(event.currentTarget).get('backups');
          setResult(backups ? 'Published with daily backups.' : 'Published without backups.');
        }}
      >
        <div {...stylex.props(s.choices)}>
          <Checkbox name="backups" value="daily" label="Keep daily backups" defaultSelected />
          <Checkbox name="confirm" label="I read the release notes" isRequired errorMessage="Confirm before you publish." />
        </div>
        <FormActions>
          <Button type="submit">Publish</Button>
        </FormActions>
      </Form>
      <p role="status" {...stylex.props(s.status)}>{result}</p>
    </div>
  );
}
```
