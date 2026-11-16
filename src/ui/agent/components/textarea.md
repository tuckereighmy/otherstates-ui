# Textarea

Write and edit multiple lines of text.

Category: Forms · Exports: `Textarea`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { Textarea } from '@/ui/components';

<Textarea label="Release notes" placeholder="What changed in this version?" />
```

## Textarea

A native `<textarea>` in a text-entry shell, with an optional label, help text and character count.

Extends: <textarea> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` |  | A label above the textarea. Leave it out inside a Field or an InputGroup, and name the textarea there. |
| `description` | `ReactNode` |  | Help text under the textarea. The error message replaces it while the textarea is invalid. |
| `hint` | `ReactNode` |  | Deprecated alias of `description`. |
| `errorMessage` | `ReactNode` |  | Shown under the textarea in place of the description; marks it invalid while set. |
| `error` | `ReactNode` |  | Deprecated alias of `errorMessage`. |
| `isInvalid` | `boolean` |  | Shows the invalid edge and sets `aria-invalid`. Defaults to true while an error message is set. |
| `isDisabled` | `boolean` | `false` | Disables the textarea, dims its label and turns off resizing. `disabled` is an alias. |
| `isReadOnly` | `boolean` | `false` | Keeps the text selectable but not editable. `readOnly` is an alias. |
| `isRequired` | `boolean` | `false` | Makes the textarea required and adds ` *` to the label. `required` is an alias. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'small' \| 'medium' \| 'large'` | `'md'` | Text size and insets; the minimum height is 48, 64, 80, 88 or 96 px. Inside an InputGroup the group's size wins. |
| `minRows` | `number` |  | Turns on auto-resize: the textarea is never shorter than this many lines. |
| `maxRows` | `number` |  | Turns on auto-resize: the textarea grows to this many lines, then scrolls. |
| `showCount` | `boolean` | `false` | Shows the character count under the textarea, against `maxLength` when it is set. |
| `className` | `string` |  | Added to the root element when a label, help text or count renders around the textarea; otherwise to the `<textarea>`. |
| `style` | `CSSProperties` |  | Applied to the same element as `className`. |

## Accessibility

- Renders a native `<textarea>`. Name it with `label`, a surrounding Field, or `aria-label`; a placeholder is not a label.
- `aria-describedby` points at the help or error text and the character count; `aria-invalid` is set while the textarea is invalid.
- Every focus draws a 2 px edge in the focus-ring color; forced-colors mode gets the system outline instead.
- Enter adds a new line and Tab moves focus out, as in any native textarea.
- `isReadOnly` keeps the textarea in the tab order with selectable text; `isDisabled` takes it out of the tab order.

## Examples

### Default

`src/ui/catalog/docs/textarea/default.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Textarea } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function TextareaDefault() {
  return (
    <div {...stylex.props(s.root)}>
      <Textarea label="Release notes" placeholder="What changed in this version?" />
    </div>
  );
}
```

### Sizes

Text and insets follow the input of the same size; the minimum height is two control heights.

`src/ui/catalog/docs/textarea/sizes.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Textarea } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const sizes = [
  { size: 'sm', label: 'Small' },
  { size: 'md', label: 'Medium' },
  { size: 'lg', label: 'Large' },
] as const;

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-4'], width: 360, maxWidth: '100%' },
});

export default function TextareaSizes() {
  return (
    <div {...stylex.props(s.root)}>
      {sizes.map(({ size, label }) => (
        <Textarea key={size} size={size} label={label} placeholder="Add a comment" />
      ))}
    </div>
  );
}
```

### Disabled

Colors swap to the disabled tokens, the label dims, and resizing turns off.

`src/ui/catalog/docs/textarea/disabled.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Textarea } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function TextareaDisabled() {
  return (
    <div {...stylex.props(s.root)}>
      <Textarea
        label="Handover notes"
        description="Notes lock once the shift is closed."
        defaultValue="Two orders are waiting on stock. Call the supplier before noon."
        isDisabled
      />
    </div>
  );
}
```

### Invalid

The error message replaces the help text, and the edge turns `border-error`.

`src/ui/catalog/docs/textarea/invalid.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Textarea } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function TextareaInvalid() {
  return (
    <div {...stylex.props(s.root)}>
      <Textarea
        label="Reason for refund"
        description="Shared with the customer."
        errorMessage="Write at least 20 characters so the customer understands the refund."
        defaultValue="Damaged"
      />
    </div>
  );
}
```

### Read-only

The text stays focusable and selectable on a `bg-subtle` shell.

`src/ui/catalog/docs/textarea/read-only.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Textarea } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function TextareaReadOnly() {
  return (
    <div {...stylex.props(s.root)}>
      <Textarea
        label="Original request"
        defaultValue="Please move the review to Thursday afternoon and add Priya to the invite."
        isReadOnly
      />
    </div>
  );
}
```

### With label

`label`, `description` and `isRequired` render the label, help text and required marker.

`src/ui/catalog/docs/textarea/with-label.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Textarea } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function TextareaWithLabel() {
  return (
    <div {...stylex.props(s.root)}>
      <Textarea
        label="Project summary"
        description="Two or three sentences for the overview page."
        placeholder="What is this project about?"
        isRequired
      />
    </div>
  );
}
```

### Field integration

Without a `label`, a Textarea inside a Field takes the field's id, label, help text and state.

`src/ui/catalog/docs/textarea/field-integration.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Field, Textarea } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function TextareaFieldIntegration() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Feedback" description="Only your team lead can read this." isOptional>
        <Textarea placeholder="What went well, and what would you change?" />
      </Field>
    </div>
  );
}
```

### Auto-resize

`minRows` and `maxRows` make the height follow the text between those line counts.

`src/ui/catalog/docs/textarea/auto-resize.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Textarea } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function TextareaAutoResize() {
  return (
    <div {...stylex.props(s.root)}>
      <Textarea
        label="Comment"
        description="Grows from two to six lines, then scrolls."
        placeholder="Reply to the thread"
        minRows={2}
        maxRows={6}
      />
    </div>
  );
}
```

### Character count

`showCount` adds a live count at the end of the help line, measured against `maxLength`.

`src/ui/catalog/docs/textarea/character-count.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Textarea } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function TextareaCharacterCount() {
  const [bio, setBio] = useState('Product designer working on billing and invoices.');

  return (
    <div {...stylex.props(s.root)}>
      <Textarea
        label="Short bio"
        description="Shown on your profile card."
        value={bio}
        onChange={event => setBio(event.currentTarget.value)}
        maxLength={160}
        showCount
      />
    </div>
  );
}
```

### Form integration

Inside a Form, a required Field shows the browser message under the textarea on submit.

`src/ui/catalog/docs/textarea/form-integration.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, Field, Form, FormActions, Textarea } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-3'], width: 360, maxWidth: '100%' },
  status: {
    margin: 0,
    minHeight: 20,
    fontSize: tokens['--os-font-size-caption'],
    lineHeight: tokens['--os-line-height-md'],
    color: tokens['--os-color-fg-muted'],
  },
});

export default function TextareaFormIntegration() {
  const [saved, setSaved] = useState(0);

  return (
    <div {...stylex.props(s.root)}>
      <Form
        onSubmit={event => {
          event.preventDefault();
          setSaved(String(new FormData(event.currentTarget).get('note')).length);
        }}
      >
        <Field label="Deployment note" isRequired>
          <Textarea name="note" placeholder="Why is this going out today?" />
        </Field>
        <FormActions>
          <Button type="submit">Save note</Button>
        </FormActions>
      </Form>
      <p role="status" {...stylex.props(s.status)}>{saved > 0 && `Saved ${saved} characters.`}</p>
    </div>
  );
}
```
