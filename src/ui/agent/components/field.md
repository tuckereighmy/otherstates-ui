# Field

Label a control, describe it, and show its validation message.

Category: Forms · Exports: `Field`, `FieldLabel`, `FieldDescription`, `FieldError`, `FieldValidity`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { Field, Input } from '@/ui/components';

<Field label="Work email" description="Use the address your team signs in with.">
  <Input type="email" name="email" />
</Field>
```

## Field

A column of label, control and one message line, wired together through context.

Extends: <div> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` |  | The visible label: a `<label>` that points at a text control, or a span that groups, sliders and pickers are named by. |
| `description` | `ReactNode` |  | Help text under the control, linked with `aria-describedby`. The error replaces it. |
| `errorMessage` | `ReactNode \| ((validity: FieldValidityState) => ReactNode)` |  | A node marks the field invalid while it is set; a function is called with the validity and shows only while the field is invalid. |
| `isInvalid` | `boolean` |  | Forces the invalid state, with or without a message. Overrides native and server validity. |
| `isRequired` | `boolean` | `false` | Adds ` *` to the label and makes the control required. |
| `isOptional` | `boolean` | `false` | Adds "(optional)" to the label. Use it when most fields in the form are required. |
| `isDisabled` | `boolean` | `false` | Disables the control and dims the label and message. A disabled Fieldset sets it for every Field inside. |
| `isReadOnly` | `boolean` | `false` | Makes the control read-only through the field context. |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | `horizontal` puts the label in a column beside the control and its message. |
| `id` | `string` |  | The id of the control. Generated when omitted. |
| `children` | `ReactNode \| ((control: FieldControlProps) => ReactNode)` |  | The control, or a function that receives `id`, `aria-describedby`, `aria-invalid`, `required`, `disabled` and `readOnly` to spread onto a native element. |
| `error` | `ReactNode` |  | Deprecated alias of `errorMessage`. |
| `required` | `boolean` |  | Deprecated alias of `isRequired`. |
| `disabled` | `boolean` |  | Deprecated alias of `isDisabled`. |

## FieldLabel

The label of the surrounding Field, for when you place it yourself. It names the control and shows the required, optional and disabled states: a `<label>` for text controls, a span named through `aria-labelledby` for groups, sliders and pickers.

Extends: LabelProps

## FieldDescription

Help text for the surrounding Field. It is linked to the control, hides while the error shows, and takes the place of the Field `description` when you place it yourself.

Extends: <div> attributes

## FieldError

The error line of the surrounding Field. A Field renders one for you; place your own to move it, and the built-in one steps aside.

Extends: <div> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode \| ((validity: FieldValidityState) => ReactNode)` |  | The message, or a function of the validity. Defaults to the Field `errorMessage`, then the browser message. A server error from the Form always wins. |

## FieldValidity

Renders anything from the validity of the surrounding Field: live hints, rule lists or custom errors.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` (required) | `(validity: FieldValidityState) => ReactNode` |  | Called on every change with `isInvalid`, `isTouched`, `validationDetails` and `validationErrors`. |

## Accessibility

- For text controls the label is a `<label>` whose `for` matches the control, so clicking it focuses the control. Groups, sliders and pickers are named by the label through `aria-labelledby`; clicking it focuses a picker without opening it.
- The description, or the error in its place, is linked with `aria-describedby`; only one is announced at a time.
- An invalid field sets `aria-invalid` on the control. Messages appear after the control is edited and left, or when the form is submitted, never on the first keystroke.
- On submit, the browser bubble is replaced by the Field message and focus moves to the first invalid control.
- The required asterisk is hidden from assistive tech; the control carries `required` instead, which screen readers announce.

## Examples

### Default

`src/ui/catalog/docs/field/default.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Field, Input } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function FieldDefault() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Work email" description="Use the address your team signs in with.">
        <Input type="email" name="email" placeholder="you@example.com" />
      </Field>
    </div>
  );
}
```

### Required

`isRequired` adds a muted asterisk and makes the control required; the message shows once it is left empty after an edit, or on submit.

`src/ui/catalog/docs/field/required.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { Field, Input } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function FieldRequired() {
  return (
    <div {...stylex.props(s.root)}>
      <Field
        label="Project name"
        description="Shown in the sidebar and on invoices."
        isRequired
        errorMessage={({ validationDetails }) => validationDetails.valueMissing && 'Enter a project name.'}
      >
        <Input name="project" placeholder="Untitled project" />
      </Field>
    </div>
  );
}
```

### Optional

When most fields are required, mark the rest with `isOptional` instead.

`src/ui/catalog/docs/field/optional.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Field, Input } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-4'], width: 320, maxWidth: '100%' },
});

export default function FieldOptional() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Full name">
        <Input name="name" autoComplete="name" required />
      </Field>
      <Field label="Company" isOptional>
        <Input name="company" autoComplete="organization" />
      </Field>
    </div>
  );
}
```

### Disabled

`isDisabled` disables the control and dims its label and description.

`src/ui/catalog/docs/field/disabled.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Field, Input } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function FieldDisabled() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Workspace URL" description="Only an owner can change it." isDisabled>
        <Input name="workspace" defaultValue="harbor-notes" />
      </Field>
    </div>
  );
}
```

### Read-only

`isReadOnly` keeps the value focusable and selectable on a bg-subtle shell.

`src/ui/catalog/docs/field/read-only.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Field, Input } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function FieldReadOnly() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Project ID" description="Use it when you call the API." isReadOnly>
        <Input name="projectId" defaultValue="prj-7c41-a2e9" />
      </Field>
    </div>
  );
}
```

### With error

A message in `errorMessage` marks the field invalid and takes the place of the description.

`src/ui/catalog/docs/field/with-error.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Field, Input } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function FieldWithError() {
  return (
    <div {...stylex.props(s.root)}>
      <Field
        label="Invoice number"
        description="Numbers run in sequence."
        errorMessage="An invoice with this number already exists."
      >
        <Input name="invoice" defaultValue="INV-2041" />
      </Field>
    </div>
  );
}
```

### With validity

Native constraints drive the validity; a function in `errorMessage` turns it into words, and `FieldValidity` renders a live hint as you type.

`src/ui/catalog/docs/field/with-validity.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { Field, FieldDescription, FieldValidity, Input, type FieldValidityState } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

function usernameError({ validationDetails }: FieldValidityState) {
  if (validationDetails.valueMissing) return 'Choose a username.';
  if (validationDetails.tooShort) return 'Use at least 3 characters.';
  return 'Use lowercase letters, numbers and dashes.';
}

export default function FieldWithValidity() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Username" isRequired errorMessage={usernameError}>
        <Input name="username" minLength={3} pattern="[a-z0-9\-]+" autoComplete="off" />
        <FieldValidity>
          {({ validationDetails }) => (
            <FieldDescription>
              {validationDetails.valid ? 'Looks good.' : 'Lowercase letters, numbers and dashes, 3 or more.'}
            </FieldDescription>
          )}
        </FieldValidity>
      </Field>
    </div>
  );
}
```

### Horizontal

`orientation="horizontal"` puts the label in a column beside the control, for settings pages.

`src/ui/catalog/docs/field/horizontal.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Field, Input } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-4'], width: 480, maxWidth: '100%' },
});

export default function FieldHorizontal() {
  return (
    <div {...stylex.props(s.root)}>
      <Field orientation="horizontal" label="Display name" description="Shown on comments and mentions.">
        <Input name="displayName" defaultValue="Maya" />
      </Field>
      <Field orientation="horizontal" label="Email">
        <Input type="email" name="email" defaultValue="maya@example.com" />
      </Field>
    </div>
  );
}
```

### Composed from parts

Place `FieldLabel`, `FieldDescription` and `FieldError` yourself to change the order; the error takes the description's place, and the ids and states still come from the Field.

`src/ui/catalog/docs/field/parts.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { Field, FieldDescription, FieldError, FieldLabel, Input } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function FieldParts() {
  return (
    <div {...stylex.props(s.root)}>
      <Field isRequired>
        <FieldLabel>Billing email</FieldLabel>
        <FieldDescription>Invoices and receipts go to this address.</FieldDescription>
        <FieldError>
          {({ validationDetails }) =>
            validationDetails.valueMissing ? 'Enter a billing email.' : 'Enter an address like billing@example.com.'}
        </FieldError>
        <Input type="email" name="billingEmail" placeholder="billing@example.com" />
      </Field>
    </div>
  );
}
```

### Input group

An InputGroup reads the Field like an Input does: the label points at its input and the edge follows the Field state.

`src/ui/catalog/docs/field/input-group.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Field, Input, InputGroup } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function FieldInputGroup() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Project address" description="Lowercase letters, numbers and dashes.">
        <InputGroup start="notes.example.com/">
          <Input name="slug" defaultValue="spring-launch" />
        </InputGroup>
      </Field>
    </div>
  );
}
```

### Textarea field

A Textarea inside a Field leaves the label and help text to it.

`src/ui/catalog/docs/field/textarea.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Field, Textarea } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function FieldTextarea() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Release notes" description="Everyone on the project can read these.">
        <Textarea name="notes" rows={4} placeholder="What changed in this release?" />
      </Field>
    </div>
  );
}
```

### Select field

Inside a Field, a Select takes the field appearance and its label from the Field.

`src/ui/catalog/docs/field/select.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Field, Select } from '../../../components';

const regions = [
  { id: 'eu-west', label: 'Europe (West)' },
  { id: 'us-east', label: 'United States (East)' },
  { id: 'ap-south', label: 'Asia Pacific (South)' },
];

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function FieldSelect() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Region" description="Where new projects store their files.">
        <Select name="region" options={regions} defaultValue="eu-west" />
      </Field>
    </div>
  );
}
```

### Combobox field

The Field label names the combobox input, and `isRequired` reaches it through the context.

`src/ui/catalog/docs/field/combobox.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Combobox, Field } from '../../../components';

const people = ['Ana', 'Bruno', 'Chen', 'Dalia', 'Emil', 'Farah']
  .map(name => ({ id: name.toLowerCase(), label: name }));

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function FieldCombobox() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Reviewer" description="They get a note when the draft is ready." isRequired>
        <Combobox name="reviewer" placeholder="Choose a teammate" options={people} />
      </Field>
    </div>
  );
}
```

### Combobox multiple field

A multiple-selection Combobox in a Field keeps one label and one message line for all its chips.

`src/ui/catalog/docs/field/combobox-multiple.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Combobox, Field } from '../../../components';

const labels = ['Bug', 'Design', 'Docs', 'Performance', 'Security']
  .map(label => ({ id: label.toLowerCase(), label }));

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function FieldComboboxMultiple() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Labels" description="Pick as many as apply.">
        <Combobox selectionMode="multiple" name="labels" placeholder="Add labels" options={labels} defaultValue={['design']} />
      </Field>
    </div>
  );
}
```

### Autocomplete field

An Autocomplete reads the Field the same way: its suggestions open under the shell as you type.

`src/ui/catalog/docs/field/autocomplete.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Autocomplete, Field } from '../../../components';

const zones = ['Auckland', 'Berlin', 'Chicago', 'Lagos', 'Lima', 'Mumbai', 'Seoul']
  .map(city => ({ id: city.toLowerCase(), label: city }));

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function FieldAutocomplete() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Time zone" description="Type a city to find its zone.">
        <Autocomplete name="timezone" placeholder="Search cities" options={zones} />
      </Field>
    </div>
  );
}
```

### Checkbox field

A Field without a label gives a single Checkbox a linked description line, aligned with the checkbox label.

`src/ui/catalog/docs/field/checkbox.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Checkbox, Field } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function FieldCheckbox() {
  return (
    <div {...stylex.props(s.root)}>
      <Field description="One email every Monday with the week's changes.">
        <Checkbox label="Weekly summary" name="weeklySummary" defaultSelected />
      </Field>
    </div>
  );
}
```

### Checkbox group field

The Field label names the whole group and its description sits under the last option.

`src/ui/catalog/docs/field/checkbox-group.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { CheckboxGroup, Field } from '../../../components';

const events = [
  { id: 'deploys', label: 'Deployments' },
  { id: 'comments', label: 'New comments' },
  { id: 'invoices', label: 'Invoices' },
];

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function FieldCheckboxGroup() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Notify me about" description="We send these to your work email.">
        <CheckboxGroup name="events" options={events} defaultValue={['deploys']} />
      </Field>
    </div>
  );
}
```

### Radio group field

A RadioGroup without its own `label` is named and described by the Field.

`src/ui/catalog/docs/field/radio-group.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Field, RadioGroup } from '../../../components';

const visibility = [
  { value: 'team', label: 'Everyone on the team' },
  { value: 'invited', label: 'Only invited people' },
  { value: 'private', label: 'Only me' },
];

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function FieldRadioGroup() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Who can see this project" description="You can change it later in settings.">
        <RadioGroup name="visibility" options={visibility} defaultValue="team" />
      </Field>
    </div>
  );
}
```

### Switch field

Like a single Checkbox, a Switch keeps its own label and takes its help text from the Field.

`src/ui/catalog/docs/field/switch.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Field, Switch } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function FieldSwitch() {
  return (
    <div {...stylex.props(s.root)}>
      <Field description="Anyone with the link can view, not edit.">
        <Switch label="Public link" name="publicLink" defaultSelected />
      </Field>
    </div>
  );
}
```

### Slider field

A Slider without its own `label` is named by the Field label and described by its help text.

`src/ui/catalog/docs/field/slider.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Field, Slider } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function FieldSlider() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Storage alert" description="Warn the team when this much of the plan is used.">
        <Slider
          appearance="rail"
          defaultValue={80}
          minValue={50}
          maxValue={95}
          step={5}
          formatOptions={{ style: 'unit', unit: 'percent' }}
        />
      </Field>
    </div>
  );
}
```

### Number field

A NumberField without its own `label` takes the label, help text and state from the Field.

`src/ui/catalog/docs/field/number-field.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Field, NumberField } from '../../../components';

const s = stylex.create({
  root: { width: 240, maxWidth: '100%' },
});

export default function FieldNumberField() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Seats" description="Billed monthly for each seat.">
        <NumberField name="seats" defaultValue={5} minValue={1} maxValue={50} />
      </Field>
    </div>
  );
}
```

### Complete form

Fields in a Form: submit it empty to see every message at once and land on the first invalid control.

`src/ui/catalog/docs/field/complete-form.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, Field, Form, FormActions, Input, Textarea } from '../../../components';

const s = stylex.create({
  root: { width: 400, maxWidth: '100%' },
});

export default function FieldCompleteForm() {
  const [sent, setSent] = useState(false);

  return (
    <div {...stylex.props(s.root)}>
      <Form onSubmit={event => { event.preventDefault(); setSent(true); }}>
        <Field label="Name" isRequired errorMessage={() => 'Enter your name.'}>
          <Input name="name" autoComplete="name" />
        </Field>
        <Field
          label="Email"
          isRequired
          errorMessage={({ validationDetails }) =>
            validationDetails.valueMissing ? 'Enter your email.' : 'Enter an address like sam@example.com.'}
        >
          <Input type="email" name="email" autoComplete="email" />
        </Field>
        <Field label="Project details" isOptional description="A few lines on scope and timing.">
          <Textarea name="details" rows={3} />
        </Field>
        <FormActions>
          <Button type="submit">{sent ? 'Request sent' : 'Send request'}</Button>
        </FormActions>
      </Form>
    </div>
  );
}
```
