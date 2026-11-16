# Form

Collect fields, validate them and submit them together.

Category: Forms · Exports: `Form`, `FormActions`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { Button, Field, Form, FormActions, Input } from '@/ui/components';

<Form onSubmit={event => event.preventDefault()}>
  <Field label="Email" isRequired>
    <Input type="email" name="email" />
  </Field>
  <FormActions>
    <Button type="submit">Send invite</Button>
  </FormActions>
</Form>
```

## Form

A native `<form>` laid out as a column with 16px between fields.

Extends: React Aria FormProps

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `validationErrors` | `Record<string, string \| string[]>` |  | Errors keyed by control name, usually from a server. Each Field shows the one for its control until the value changes. |
| `validationBehavior` | `'native' \| 'aria'` | `'native'` | `native` lets the browser block submission while a constraint fails; `aria` submits anyway and leaves the checks to you. |
| `ref` | `Ref<HTMLFormElement>` |  | The `<form>` element. |

## FormActions

The row of buttons at the end of a form: 24px under the last field, buttons 8px apart, wrapping on narrow screens.

Extends: <div> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `align` | `'start' \| 'end'` | `'start'` | Where the buttons sit in the row. |

## Accessibility

- Renders a native `<form>`: Enter in a text field submits it, and a reset button restores every value.
- With `validationBehavior="native"`, a failed constraint blocks submission; each Field shows its message and focus moves to the first invalid control.
- Messages from `validationErrors` are linked to their controls with `aria-describedby` through each Field.
- When a page has more than one form, name each with `aria-label` or `aria-labelledby`.

## Examples

### Default

`src/ui/catalog/docs/form/default.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, Field, Form, FormActions, Input } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function FormDefault() {
  const [sent, setSent] = useState(false);

  return (
    <div {...stylex.props(s.root)}>
      <Form onSubmit={event => { event.preventDefault(); setSent(true); }}>
        <Field label="Name">
          <Input name="name" autoComplete="off" />
        </Field>
        <Field label="Email" isRequired>
          <Input type="email" name="email" placeholder="teammate@example.com" autoComplete="off" />
        </Field>
        <FormActions>
          <Button type="submit">{sent ? 'Invite sent' : 'Send invite'}</Button>
        </FormActions>
      </Form>
    </div>
  );
}
```

### Validation errors

Errors returned by a server go in `validationErrors`, keyed by control name, and clear as soon as the value is edited.

`src/ui/catalog/docs/form/validation-errors.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, Field, Form, FormActions, Input } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

const taken = ['maya', 'admin', 'support'];

export default function FormValidationErrors() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  return (
    <div {...stylex.props(s.root)}>
      <Form
        validationErrors={errors}
        onSubmit={event => {
          event.preventDefault();
          const username = String(new FormData(event.currentTarget).get('username'));
          setErrors(taken.includes(username) ? { username: `The username ${username} is taken.` } : {});
        }}
      >
        <Field label="Username" description="Submit as maya to see the error from the server.">
          <Input name="username" defaultValue="maya" autoComplete="off" />
        </Field>
        <FormActions>
          <Button type="submit">Claim username</Button>
        </FormActions>
      </Form>
    </div>
  );
}
```

### Custom validation

Validate every value in one function on submit, the way a schema library would, and pass the result to `validationErrors`.

`src/ui/catalog/docs/form/custom-validation.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, Field, Form, FormActions, Input } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

type Errors = Partial<Record<'title' | 'estimate', string>>;

function validate(data: FormData): Errors {
  const errors: Errors = {};
  if (!String(data.get('title')).trim()) errors.title = 'Give the task a title.';
  const estimate = Number(data.get('estimate'));
  if (!(estimate >= 1 && estimate <= 40)) errors.estimate = 'Estimate between 1 and 40 hours.';
  return errors;
}

export default function FormCustomValidation() {
  const [errors, setErrors] = useState<Errors>({});

  return (
    <div {...stylex.props(s.root)}>
      <Form
        validationBehavior="aria"
        validationErrors={errors}
        onSubmit={event => { event.preventDefault(); setErrors(validate(new FormData(event.currentTarget))); }}
      >
        <Field label="Task title">
          <Input name="title" autoComplete="off" />
        </Field>
        <Field label="Estimate" description="In hours.">
          <Input type="number" name="estimate" />
        </Field>
        <FormActions>
          <Button type="submit">Add task</Button>
        </FormActions>
      </Form>
    </div>
  );
}
```

### Actions row

`FormActions` sits 24px under the last field; `align="end"` moves the buttons to the end, and a reset button clears every Field.

`src/ui/catalog/docs/form/actions.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { Button, Field, Form, FormActions, Input } from '../../../components';

const s = stylex.create({
  root: { width: 400, maxWidth: '100%' },
});

export default function FormActionsRow() {
  return (
    <div {...stylex.props(s.root)}>
      <Form onSubmit={event => event.preventDefault()}>
        <Field label="Note title">
          <Input name="title" defaultValue="Quarterly planning" />
        </Field>
        <Field label="Folder">
          <Input name="folder" defaultValue="Team notes" />
        </Field>
        <FormActions align="end">
          <Button type="reset" appearance="tertiary">Reset</Button>
          <Button type="submit">Save changes</Button>
        </FormActions>
      </Form>
    </div>
  );
}
```

### Sections

Group a long form into Fieldsets: each one after the first starts 24px down, and the actions row follows 24px under the last.

`src/ui/catalog/docs/form/sections.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { Button, Field, Fieldset, Form, FormActions, Input } from '../../../components';

const s = stylex.create({
  root: { width: 400, maxWidth: '100%' },
});

export default function FormSections() {
  return (
    <div {...stylex.props(s.root)}>
      <Form onSubmit={event => event.preventDefault()}>
        <Fieldset legend="Workspace">
          <Field label="Name">
            <Input name="workspace" defaultValue="Harbor notes" />
          </Field>
        </Fieldset>
        <Fieldset legend="Billing contact">
          <Field label="Email" description="Invoices go to this address.">
            <Input type="email" name="billingEmail" defaultValue="ines@example.com" />
          </Field>
        </Fieldset>
        <FormActions align="end">
          <Button type="submit">Save settings</Button>
        </FormActions>
      </Form>
    </div>
  );
}
```
