# Fieldset

Group related fields under one legend.

Category: Forms · Exports: `Fieldset`, `FieldsetLegend`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { Field, Fieldset, Input } from '@/ui/components';

<Fieldset legend="Billing address">
  <Field label="Street">
    <Input name="street" />
  </Field>
</Fieldset>
```

## Fieldset

A native `<fieldset>` with a legend, one message line and 16px between its fields. Inside a Form, a Fieldset that follows another child starts a section 24px below it.

Extends: <fieldset> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `legend` | `ReactNode` |  | The visible name of the group, rendered as its `<legend>`. |
| `description` | `ReactNode` |  | Help text under the legend, linked with `aria-describedby`. The error replaces it. |
| `errorMessage` | `ReactNode` |  | An error for the whole group, shown under the legend in place of the description while it is set. |
| `variant` | `'outline' \| 'plain'` | `'outline'` | `outline` draws a 1px `border-subtle` frame at radius 16; `plain` keeps the legend and spacing without it. |
| `isDisabled` | `boolean` | `false` | Disables every control inside and dims the legend, the message and each Field. Same as the native `disabled`. |

## FieldsetLegend

The legend of the surrounding Fieldset, for content beyond the `legend` prop. It must be the first child.

Extends: <legend> attributes

## Accessibility

- A native `<fieldset>` has the `group` role, and its `<legend>` names the group, so each control inside is announced with it.
- The description, or the error in its place, is linked to the group with `aria-describedby`.
- A disabled fieldset disables every native control inside it; they leave the tab order.
- Use a fieldset for related controls that share a question or a purpose, such as an address or a time range.

## Examples

### Default

`src/ui/catalog/docs/fieldset/default.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Field, Fieldset, Input } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function FieldsetDefault() {
  return (
    <div {...stylex.props(s.root)}>
      <Fieldset legend="Billing address">
        <Field label="Street">
          <Input name="street" autoComplete="address-line1" />
        </Field>
        <Field label="City">
          <Input name="city" autoComplete="address-level2" />
        </Field>
      </Fieldset>
    </div>
  );
}
```

### With description

A line of help text sits 4px under the legend and describes the whole group.

`src/ui/catalog/docs/fieldset/with-description.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Field, Fieldset, Input } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function FieldsetWithDescription() {
  return (
    <div {...stylex.props(s.root)}>
      <Fieldset legend="Invoice contact" description="Invoices for this workspace go to this person.">
        <Field label="Name">
          <Input name="contactName" autoComplete="name" />
        </Field>
        <Field label="Email">
          <Input type="email" name="contactEmail" autoComplete="email" />
        </Field>
      </Fieldset>
    </div>
  );
}
```

### Plain

`variant="plain"` drops the outline and keeps the legend and the 16px rhythm.

`src/ui/catalog/docs/fieldset/plain.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Field, Fieldset, Input } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function FieldsetPlain() {
  return (
    <div {...stylex.props(s.root)}>
      <Fieldset variant="plain" legend="Deployment window" description="Times are in your workspace time zone.">
        <Field label="Starts">
          <Input type="time" name="start" defaultValue="22:00" />
        </Field>
        <Field label="Ends">
          <Input type="time" name="end" defaultValue="23:30" />
        </Field>
      </Fieldset>
    </div>
  );
}
```

### Disabled

`isDisabled` disables every control inside and dims the legend, the description and each Field.

`src/ui/catalog/docs/fieldset/disabled.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Field, Fieldset, Input } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function FieldsetDisabled() {
  return (
    <div {...stylex.props(s.root)}>
      <Fieldset legend="Single sign-on" description="Available on the Business plan." isDisabled>
        <Field label="Sign-in URL">
          <Input type="url" name="ssoUrl" placeholder="https://" />
        </Field>
        <Field label="Certificate fingerprint">
          <Input name="fingerprint" />
        </Field>
      </Fieldset>
    </div>
  );
}
```

### With error

An `errorMessage` for the group replaces its description; the Fields inside show the invalid edge without repeating it.

`src/ui/catalog/docs/fieldset/with-error.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Field, Fieldset, Input } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function FieldsetWithError() {
  const [start, setStart] = useState('18:00');
  const [end, setEnd] = useState('09:00');
  const invalid = end <= start;

  return (
    <div {...stylex.props(s.root)}>
      <Fieldset
        legend="Quiet hours"
        description="Notifications pause between these times."
        errorMessage={invalid ? 'The end time must be after the start time.' : undefined}
      >
        <Field label="From" isInvalid={invalid}>
          <Input type="time" name="from" value={start} onChange={event => setStart(event.target.value)} />
        </Field>
        <Field label="Until" isInvalid={invalid}>
          <Input type="time" name="until" value={end} onChange={event => setEnd(event.target.value)} />
        </Field>
      </Fieldset>
    </div>
  );
}
```

### Custom legend

Pass a `FieldsetLegend` as the first child when the legend needs more than text.

`src/ui/catalog/docs/fieldset/legend-part.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Badge, Field, Fieldset, FieldsetLegend, Input } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
  legend: { display: 'flex', alignItems: 'center', gap: t['--os-space-2'] },
});

export default function FieldsetLegendPart() {
  return (
    <div {...stylex.props(s.root)}>
      <Fieldset description="Used to sign webhook requests.">
        <FieldsetLegend {...stylex.props(s.legend)}>
          Signing secret <Badge variant="secondary" size="sm">Beta</Badge>
        </FieldsetLegend>
        <Field label="Secret">
          <Input name="secret" defaultValue="4f9a 21c7 9be0 1d55" isReadOnly />
        </Field>
      </Fieldset>
    </div>
  );
}
```
