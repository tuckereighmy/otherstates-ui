# Input

Enter a single line of text.

Category: Forms · Exports: `Input`, `TextField`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { Field, Input } from '@/ui/components';

<Field label="Project name">
  <Input placeholder="Untitled project" />
</Field>
```

## Input

A native `<input>`. On its own it is a bordered field; inside an InputGroup the group draws the edge.

Extends: <input> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'small' \| 'medium' \| 'large'` | `'md'` | Height and text size: 24, 32, 40, 44 or 48 px. `small`, `medium` and `large` are aliases of `sm`, `md` and `lg`. Inside an InputGroup the group's size wins. |
| `isInvalid` | `boolean` |  | Shows the invalid edge and sets `aria-invalid`. Inside a Field, the Field's error sets it. |
| `isDisabled` | `boolean` | `false` | Disables the input. `disabled` is an alias; inside a Field, the Field sets it. |
| `isReadOnly` | `boolean` | `false` | Keeps the value selectable but not editable. `readOnly` is an alias; inside a Field, the Field sets it. |
| `isRequired` | `boolean` | `false` | Marks the input required for native validation. `required` is an alias. |
| `htmlSize` | `number` |  | The native `size` attribute: the visible width in characters. |

## TextField

A label, an input shell and a help or error line in one component. `ref` and the input attributes go to the `<input>`.

Extends: <input> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` |  | Names the field. Shown above the shell, or inside it with `floating`. |
| `description` | `ReactNode` |  | Help text under the field. The error message replaces it while the field is invalid. |
| `hint` | `ReactNode` |  | Deprecated alias of `description`. |
| `errorMessage` | `ReactNode` |  | Shown under the field in place of the description; marks the field invalid while set. |
| `error` | `ReactNode` |  | Deprecated alias of `errorMessage`. |
| `isInvalid` | `boolean` |  | Shows the invalid edge. Defaults to true while an error message is set. |
| `isDisabled` | `boolean` | `false` | Disables the field and dims its label. `disabled` is an alias. |
| `isReadOnly` | `boolean` | `false` | Keeps the value selectable but not editable. `readOnly` is an alias. |
| `isRequired` | `boolean` | `false` | Makes the input required and adds ` *` to the label. `required` is an alias. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'small' \| 'medium' \| 'large'` | `'xl'` | Height and text size of the shell. The floating and notch fields are always `xl` (48 px). |
| `leadingIcon` | `ReactNode` |  | An icon before the value, in `fg-muted`. An `Icon` without a size takes the field's icon size. |
| `trailingIcon` | `ReactNode` |  | An icon after the value, in `fg-muted`. An `Icon` without a size takes the field's icon size. |
| `floating` | `boolean \| 'notch'` | `false` | `true` floats the label inside the shell; `'notch'` is the 48 px notch field, whose stroke opens around the raised label. |
| `className` | `string` |  | Added to the root element, not to the `<input>`. |
| `style` | `CSSProperties` |  | Applied to the root element, not to the `<input>`. |

## Accessibility

- Renders a native `<input>`. Give it a visible label through a Field, a `Label` with `htmlFor`, or `TextField`; use `aria-label` only when no visible label fits. A placeholder is not a label.
- Inside a Field the input takes the field's id, `aria-describedby` points at the help or error text, and `aria-invalid` is set while the field is invalid.
- Every focus, by keyboard or pointer, draws a 2 px edge in the focus-ring color; forced-colors mode gets the system outline instead.
- `isReadOnly` keeps the input in the tab order with a selectable value; `isDisabled` takes it out of the tab order.
- On touch screens the value renders at 16 px, so iOS does not zoom the page when the input takes focus.
- The notch field animates its label and stroke; with reduced motion the label moves without animation.

## Examples

### Default

`src/ui/catalog/docs/input/default.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Field, Input } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function InputDefault() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Project name">
        <Input placeholder="Untitled project" />
      </Field>
    </div>
  );
}
```

### Sizes

Five heights from 24 to 48 px; md (40) is the default and lines up with Button.

`src/ui/catalog/docs/input/sizes.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Input } from '../../../components';
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

export default function InputSizes() {
  return (
    <div {...stylex.props(s.root)}>
      {sizes.map(({ size, label }) => (
        <Input key={size} size={size} aria-label={label} placeholder={label} />
      ))}
    </div>
  );
}
```

### Disabled

A disabled Field disables the input and dims its label and help text.

`src/ui/catalog/docs/input/disabled.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Field, Input } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function InputDisabled() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Workspace ID" description="Set when the workspace was created." isDisabled>
        <Input defaultValue="ws-4821" />
      </Field>
    </div>
  );
}
```

### Invalid

The error message replaces the help text, and the edge turns `border-error`.

`src/ui/catalog/docs/input/invalid.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Field, Input } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function InputInvalid() {
  return (
    <div {...stylex.props(s.root)}>
      <Field
        label="Billing email"
        description="Invoices are sent here."
        errorMessage="Enter an email address that includes an @."
      >
        <Input type="email" defaultValue="maya.billing" />
      </Field>
    </div>
  );
}
```

### Read-only

The value stays focusable and selectable on a `bg-subtle` shell.

`src/ui/catalog/docs/input/read-only.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Field, Input } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function InputReadOnly() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Invoice number" description="Assigned when the invoice is issued." isReadOnly>
        <Input defaultValue="INV-2048" />
      </Field>
    </div>
  );
}
```

### File

`type="file"` keeps the field shell; the picker button reads as the action.

`src/ui/catalog/docs/input/file.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Field, Input } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function InputFile() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Receipt" description="PDF or PNG, up to 10 MB.">
        <Input type="file" name="receipt" accept=".pdf,.png" />
      </Field>
    </div>
  );
}
```

### With label

Outside a Field, pair the input with a `Label` through a shared id.

`src/ui/catalog/docs/input/with-label.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useId } from 'react';
import { Input, Label } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-2'], width: 320, maxWidth: '100%' },
});

export default function InputWithLabel() {
  const id = useId();

  return (
    <div {...stylex.props(s.root)}>
      <Label htmlFor={id}>Display name</Label>
      <Input id={id} placeholder="How teammates see you" autoComplete="nickname" />
    </div>
  );
}
```

### With button

An md input and an md Button share the 40 px height, so they sit on one line.

`src/ui/catalog/docs/input/with-button.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Button, Input } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'flex', gap: t['--os-space-2'], width: 380, maxWidth: '100%' },
});

export default function InputWithButton() {
  return (
    <div {...stylex.props(s.root)}>
      <Input type="email" aria-label="Teammate email" placeholder="teammate@example.com" />
      <Button>Invite</Button>
    </div>
  );
}
```

### Controlled

Drive the value with `value` and `onChange` to derive other UI from it.

`src/ui/catalog/docs/input/controlled.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Field, Input } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

const toSlug = (text: string) =>
  text.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default function InputControlled() {
  const [title, setTitle] = useState('Quarterly planning');

  return (
    <div {...stylex.props(s.root)}>
      <Field label="Page title" description={`Address: /notes/${toSlug(title) || 'untitled'}`}>
        <Input value={title} onChange={event => setTitle(event.currentTarget.value)} />
      </Field>
    </div>
  );
}
```

### Form integration

Inside a Form, a required Field shows the browser message under the input on submit.

`src/ui/catalog/docs/input/form-integration.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, Field, Form, FormActions, Input } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-3'], width: 320, maxWidth: '100%' },
  status: {
    margin: 0,
    minHeight: 20,
    fontSize: tokens['--os-font-size-caption'],
    lineHeight: tokens['--os-line-height-md'],
    color: tokens['--os-color-fg-muted'],
  },
});

export default function InputFormIntegration() {
  const [sentTo, setSentTo] = useState('');

  return (
    <div {...stylex.props(s.root)}>
      <Form
        onSubmit={event => {
          event.preventDefault();
          setSentTo(String(new FormData(event.currentTarget).get('email')));
        }}
      >
        <Field label="Email" description="We send the invite to this address." isRequired>
          <Input name="email" type="email" placeholder="name@example.com" />
        </Field>
        <FormActions>
          <Button type="submit">Send invite</Button>
        </FormActions>
      </Form>
      <p role="status" {...stylex.props(s.status)}>{sentTo && `Invite sent to ${sentTo}.`}</p>
    </div>
  );
}
```

### Text field

`TextField` bundles the label, a 48 px shell, an optional icon and the help or error line.

`src/ui/catalog/docs/input/text-field.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Icon, TextField } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function InputTextField() {
  return (
    <div {...stylex.props(s.root)}>
      <TextField
        label="Work email"
        type="email"
        description="Used for sign-in and receipts."
        placeholder="name@example.com"
        leadingIcon={<Icon name="mail" />}
        autoComplete="email"
        isRequired
      />
    </div>
  );
}
```

### Floating label

With `floating`, the label sits inside the shell and moves up once the field has focus or a value.

`src/ui/catalog/docs/input/floating-label.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { TextField } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function InputFloatingLabel() {
  return (
    <div {...stylex.props(s.root)}>
      <TextField label="Team name" floating defaultValue="Field research" />
    </div>
  );
}
```

### Notch field

The `floating="notch"` field is 48 px like every xl field; it draws its own stroke and lifts the label into a notch on focus.

`src/ui/catalog/docs/input/notch-field.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { TextField } from '../../../components';

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function InputNotchField() {
  return (
    <div {...stylex.props(s.root)}>
      <TextField label="Email" type="email" floating="notch" autoComplete="email" />
    </div>
  );
}
```
