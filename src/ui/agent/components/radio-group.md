# Radio Group

Choose exactly one option from a set.

Category: Forms · Exports: `RadioGroup`, `Radio`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { RadioGroup } from '@/ui/components';

<RadioGroup
  label="Send receipts by"
  defaultValue="email"
  options={[
    { value: 'email', label: 'Email' },
    { value: 'sms', label: 'Text message' },
  ]}
/>
```

## RadioGroup

A labeled set of radios with one value. It also takes React Aria's `value`, `defaultValue`, `onChange`, `name`, `form`, `orientation`, `isDisabled`, `isReadOnly`, `isRequired`, `isInvalid` and `validate`.

Extends: React Aria RadioGroupProps

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` |  | The group's visible label. Without one, pass `aria-label`. |
| `options` | `readonly RadioGroupOption[]` |  | The options in order: `{ value, label, description?, disabled? }`. Or pass Radio children. |
| `children` | `ReactNode` |  | Radio elements for custom layouts, rendered after `options`. |
| `description` | `ReactNode` |  | Help text under the options. The error message replaces it while the group is invalid. |
| `errorMessage` | `ReactNode \| ((validation: ValidationResult) => ReactNode)` |  | Shown under the options while the group is invalid. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'small' \| 'medium' \| 'large'` | `'md'` | Indicator and text size of every option. |
| `variant` | `'default' \| 'card'` | `'default'` | `card` puts each option in a bordered tile. |
| `className` | `string` |  | Added to the outermost element. |
| `style` | `CSSProperties` |  | Inline styles for the outermost element. |
| `ref` | `Ref<HTMLDivElement>` |  | The outermost element. |
| `error` | `ReactNode` |  | Deprecated: use `isInvalid` with `errorMessage`. Setting it also marks the group invalid. |
| `disabled` | `boolean` |  | Deprecated alias of `isDisabled`. |
| `required` | `boolean` |  | Deprecated alias of `isRequired`. |

## Radio

One option, for custom layouts inside a RadioGroup. It takes the group's size and variant, and React Aria's `value`, `isDisabled`, `inputRef` and `autoFocus`.

Extends: React Aria RadioFieldProps

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` (required) | `string` |  | The value the group reports and submits when this option is chosen. |
| `label` | `ReactNode` |  | The visible label. Without one, pass `aria-label`. |
| `description` | `ReactNode` |  | Help text under the label. |
| `hideLabel` | `boolean` | `false` | Hides the label visually and keeps it as the accessible name. |
| `className` | `string` |  | Added to the outermost element. |
| `style` | `CSSProperties` |  | Inline styles for the outermost element. |
| `ref` | `Ref<HTMLDivElement>` |  | The outermost element. |
| `disabled` | `boolean` |  | Deprecated alias of `isDisabled`. |

## Accessibility

- Renders a `radiogroup` named by its label, with a native radio input per option.
- Tab moves into the group to the chosen option; the arrow keys move and choose within it.
- The 2 px focus ring shows on the indicator only for keyboard focus.
- The help text and the error message are linked to the group with `aria-describedby`; the error replaces the help text.
- Without a visible `label`, give the group an `aria-label`.
- The press scales the indicator to .9; reduced motion skips it.

## Examples

### Default

`src/ui/catalog/docs/radio-group/default.tsx`

```tsx
import { RadioGroup } from '../../../components';

const delivery = [
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'Text message' },
  { value: 'none', label: 'Do not send' },
];

export default function RadioGroupDefault() {
  return <RadioGroup label="Send receipts by" defaultValue="email" options={delivery} />;
}
```

### With description

Each option can carry help text, and the group takes its own under the list.

`src/ui/catalog/docs/radio-group/with-description.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { RadioGroup } from '../../../components';

const s = stylex.create({
  root: { width: 340, maxWidth: '100%' },
});

const visibility = [
  { value: 'private', label: 'Private', description: 'Only invited members can open the project.' },
  { value: 'team', label: 'Team', description: 'Everyone in the workspace can view it.' },
  { value: 'public', label: 'Public', description: 'Anyone with the link can view it.' },
];

export default function RadioGroupWithDescription() {
  return (
    <div {...stylex.props(s.root)}>
      <RadioGroup label="Visibility" description="You can change this later." defaultValue="team" options={visibility} />
    </div>
  );
}
```

### Horizontal

`orientation="horizontal"` puts short options in a row 16 px apart; the arrow keys follow it.

`src/ui/catalog/docs/radio-group/horizontal.tsx`

```tsx
import { RadioGroup } from '../../../components';

const intervals = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
];

export default function RadioGroupHorizontal() {
  return <RadioGroup label="Billing interval" orientation="horizontal" defaultValue="monthly" options={intervals} />;
}
```

### Sizes

Indicators of 16, 18 and 20 px with 13, 14 and 15 px labels, on the same 32 px rows.

`src/ui/catalog/docs/radio-group/sizes.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { RadioGroup } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'flex', flexWrap: 'wrap', gap: t['--os-space-10'] },
});

const density = [
  { value: 'compact', label: 'Compact' },
  { value: 'comfortable', label: 'Comfortable' },
];

export default function RadioGroupSizes() {
  return (
    <div {...stylex.props(s.row)}>
      <RadioGroup size="sm" label="Small" defaultValue="compact" options={density} />
      <RadioGroup size="md" label="Medium" defaultValue="compact" options={density} />
      <RadioGroup size="lg" label="Large" defaultValue="compact" options={density} />
    </div>
  );
}
```

### Disabled

Disable one option with `disabled`, or the whole group with `isDisabled`.

`src/ui/catalog/docs/radio-group/disabled.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { RadioGroup } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'flex', flexWrap: 'wrap', gap: t['--os-space-10'] },
});

const plans = [
  { value: 'starter', label: 'Starter' },
  { value: 'team', label: 'Team' },
  { value: 'scale', label: 'Scale', disabled: true },
];

export default function RadioGroupDisabled() {
  return (
    <div {...stylex.props(s.row)}>
      <RadioGroup label="Plan" defaultValue="team" options={plans} />
      <RadioGroup label="Plan (locked)" isDisabled defaultValue="team" options={plans} />
    </div>
  );
}
```

### Invalid

Every ring turns `border-error`, and the message replaces the group's help text.

`src/ui/catalog/docs/radio-group/invalid.tsx`

```tsx
import { RadioGroup } from '../../../components';

const roles = [
  { value: 'viewer', label: 'Viewer' },
  { value: 'editor', label: 'Editor' },
  { value: 'admin', label: 'Admin' },
];

export default function RadioGroupInvalid() {
  return (
    <RadioGroup
      label="Role"
      description="What the new member can do."
      isRequired
      isInvalid
      errorMessage="Choose a role for Priya."
      options={roles}
    />
  );
}
```

### Read-only

The choice shows and stays focusable but cannot change.

`src/ui/catalog/docs/radio-group/read-only.tsx`

```tsx
import { RadioGroup } from '../../../components';

const regions = [
  { value: 'eu', label: 'Frankfurt' },
  { value: 'us', label: 'Virginia' },
];

export default function RadioGroupReadOnly() {
  return <RadioGroup label="Data region" description="Set when the workspace was created." isReadOnly defaultValue="eu" options={regions} />;
}
```

### Card

`variant="card"` puts each option in a bordered tile; the chosen tile's edge turns `accent-moderate`.

`src/ui/catalog/docs/radio-group/card.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { RadioGroup } from '../../../components';

const s = stylex.create({
  root: { width: 380, maxWidth: '100%' },
});

const plans = [
  { value: 'starter', label: 'Starter', description: 'Three projects and community support.' },
  { value: 'team', label: 'Team', description: 'Unlimited projects and shared environments.' },
  { value: 'scale', label: 'Scale', description: 'Audit logs, single sign-on and a support contact.' },
];

export default function RadioGroupCard() {
  return (
    <div {...stylex.props(s.root)}>
      <RadioGroup label="Plan" variant="card" defaultValue="team" options={plans} />
    </div>
  );
}
```

### Custom layout

Pass `Radio` children to lay options out yourself; they keep the group's size, variant and keyboard behavior.

`src/ui/catalog/docs/radio-group/custom-layout.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Radio, RadioGroup } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  grid: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', columnGap: tokens['--os-space-4'], rowGap: tokens['--os-space-1'] },
  heading: {
    gridColumnStart: 1,
    gridColumnEnd: -1,
    marginBlockStart: tokens['--os-space-2'],
    color: tokens['--os-color-fg-muted'],
    fontSize: tokens['--os-font-size-xs'],
    lineHeight: tokens['--os-line-height-xs'],
  },
});

export default function RadioGroupCustomLayout() {
  return (
    <RadioGroup label="Instance size" defaultValue="s">
      <div {...stylex.props(s.grid)}>
        <span {...stylex.props(s.heading)}>Shared</span>
        <Radio value="xs" label="Nano" description="0.5 vCPU" />
        <Radio value="s" label="Small" description="1 vCPU" />
        <span {...stylex.props(s.heading)}>Dedicated</span>
        <Radio value="m" label="Medium" description="2 vCPU" />
        <Radio value="l" label="Large" description="4 vCPU" />
      </div>
    </RadioGroup>
  );
}
```

### Controlled

Drive the choice with `value` and `onChange`.

`src/ui/catalog/docs/radio-group/controlled.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { RadioGroup } from '../../../components';
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

const sorts = [
  { value: 'updated', label: 'Last updated' },
  { value: 'name', label: 'Name' },
  { value: 'owner', label: 'Owner' },
];

export default function RadioGroupControlled() {
  const [sort, setSort] = useState('updated');

  return (
    <div {...stylex.props(s.column)}>
      <RadioGroup label="Sort notes by" value={sort} onChange={setSort} options={sorts} />
      <p {...stylex.props(s.status)}>Sorted by {sorts.find(option => option.value === sort)?.label.toLowerCase()}.</p>
    </div>
  );
}
```

### Form integration

The chosen option submits its value under the group's `name`. A required group shows its message on submit.

`src/ui/catalog/docs/radio-group/form-integration.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, Form, FormActions, RadioGroup } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-3'], width: 320, maxWidth: '100%' },
  status: {
    margin: 0,
    minHeight: 20,
    color: tokens['--os-color-fg-muted'],
    fontSize: tokens['--os-font-size-caption'],
    lineHeight: tokens['--os-line-height-md'],
  },
});

const environments = [
  { value: 'preview', label: 'Preview' },
  { value: 'staging', label: 'Staging' },
  { value: 'production', label: 'Production' },
];

export default function RadioGroupFormIntegration() {
  const [target, setTarget] = useState('');

  return (
    <div {...stylex.props(s.root)}>
      <Form
        onSubmit={event => {
          event.preventDefault();
          setTarget(String(new FormData(event.currentTarget).get('environment')));
        }}
      >
        <RadioGroup label="Deploy to" name="environment" isRequired options={environments} />
        <FormActions>
          <Button type="submit">Deploy</Button>
        </FormActions>
      </Form>
      <p role="status" {...stylex.props(s.status)}>{target && `Deploying to ${target}.`}</p>
    </div>
  );
}
```
