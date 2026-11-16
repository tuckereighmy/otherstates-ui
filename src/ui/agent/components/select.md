# Select

Choose one value, or several, from a fixed list.

Category: Forms · Exports: `Select`, `SelectOption`, `SelectSection`, `SelectProps`, `SelectAppearance`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { Select } from '@/ui/components';

<Select
  label="Sort by"
  options={[
    { id: 'newest', label: 'Newest' },
    { id: 'oldest', label: 'Oldest' },
  ]}
  defaultValue="newest"
/>
```

## Select

A labeled control for choosing from a fixed list. Single selection takes `string | null` values; multiple selection takes `string[]`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` |  | The visible label. Optional inside a Field that has one, or with `aria-label`. |
| `options` (required) | `readonly (SelectOption \| SelectSection)[]` |  | The options, or labeled sections of options. |
| `appearance` | `'morph' \| 'field'` | `'morph'` | `morph` is the pill that opens in place around the chosen row; `field` is a bordered field with a list popup. Defaults to `field` inside a Field, with sections or with multiple selection. |
| `selectionMode` | `'single' \| 'multiple'` | `'single'` | Whether one option or several can be chosen. Multiple selection always uses the field appearance. |
| `value` | `string \| null \| string[]` |  | The chosen option id (controlled); an array of ids with multiple selection. |
| `defaultValue` | `string \| null \| string[]` |  | The initially chosen option id (uncontrolled); an array of ids with multiple selection. |
| `onChange` | `(value: string \| null) => void \| (value: string[]) => void` |  | Called with the new id, or the new ids with multiple selection. |
| `placeholder` | `string` | `'Select an option'` | Shown in `fg-muted` while nothing is chosen. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'small' \| 'medium' \| 'large'` | `'md'` | Height of the field appearance. Legacy names map to `sm`, `md` and `lg`. The `morph` appearance is always md (40 px). |
| `hideLabel` | `boolean` | `false` | Keeps the label for assistive tech only. |
| `description` | `ReactNode` |  | Help text under the control. The error replaces it. |
| `errorMessage` | `ReactNode` |  | The error line. It replaces the description and marks the control invalid. |
| `isInvalid` | `boolean` |  | Marks the control invalid, with or without a message. |
| `isDisabled` | `boolean` | `false` | Disables the control and dims its label. |
| `isRequired` | `boolean` | `false` | Adds ` *` to the label and requires a value on submit. |
| `isReadOnly` | `boolean` | `false` | Shows the value without letting it change. |
| `disabledKeys` | `Iterable<string>` |  | Option ids that can’t be chosen, in addition to options with `disabled`. |
| `startAddon` | `ReactNode` |  | Content before the value in the field appearance, usually a 16 px Icon. |
| `floating` | `boolean` | `false` | Morph only: shows the label inside the closed pill, above the value. |
| `fullWidth` | `boolean` | `false` | Removes the 256 px max width of `morph` so it fills its container. |
| `name` | `string` |  | The name the value is submitted under. |
| `form` | `string` |  | The id of a form to belong to, when the Select sits outside it. |
| `id` | `string` |  | The id of the trigger. Inside a Field, the Field sets it. |
| `autoFocus` | `boolean` |  | Focuses the trigger on mount. |
| `onOpenChange` | `(isOpen: boolean) => void` |  | Called when the list opens or closes. |
| `aria-label` | `string` |  | Names the control when there is no visible label. |
| `aria-labelledby` | `string` |  | Names the control from another element. |
| `aria-describedby` | `string` |  | Adds descriptions to the control. |
| `className` | `string` |  | Class names for the outermost element. |
| `style` | `CSSProperties` |  | Inline styles for the outermost element. |
| `ref` | `Ref<HTMLDivElement>` |  | The outermost element. |
| `hint` | `ReactNode` |  | Deprecated alias of `description`. |
| `error` | `ReactNode` |  | Deprecated alias of `errorMessage`. |
| `disabled` | `boolean` |  | Deprecated alias of `isDisabled`. |
| `required` | `boolean` |  | Deprecated alias of `isRequired`. |

## SelectOption

One option in `options`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `id` (required) | `string` |  | The value the option stands for. |
| `label` (required) | `string` |  | The text shown in the list and in the trigger. |
| `icon` | `ReactNode` |  | A 16 px icon before the label. |
| `disabled` | `boolean` |  | Shows the option but stops it being chosen. |

## SelectSection

A labeled group of options. The `morph` appearance lists the options of every section in order.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `id` (required) | `string` |  | A unique key for the section. |
| `label` | `string` |  | The group label above the options. |
| `options` (required) | `readonly SelectOption[]` |  | The options in the group. |

## Accessibility

- The `morph` appearance is a `combobox` button that controls a `listbox`. Focus stays on the button and the highlighted option is announced through `aria-activedescendant`.
- Enter, Space and the arrow keys open the list; the arrows, Home and End move; Enter or Space chooses; Escape closes. Typing letters jumps to a matching option.
- The field appearance is a React Aria Select: focus moves into the list while it is open and returns to the trigger when it closes.
- Give every Select a `label`, hide it with `hideLabel`, or place it in a Field. The description or error is linked with `aria-describedby`.
- A hidden native select carries `name`, so the value is submitted with the form and `isRequired` uses native validation.
- With reduced motion the `morph` appearance opens without the spring and the popup fades in over 120 ms.

## Examples

### Default

`src/ui/catalog/docs/select/default.tsx`

```tsx
import { Select } from '../../../components';

const sortOptions = [
  { id: 'newest', label: 'Newest' },
  { id: 'oldest', label: 'Oldest' },
  { id: 'edited', label: 'Recently edited' },
  { id: 'title', label: 'Title' },
];

export default function SelectDefault() {
  return <Select label="Sort by" options={sortOptions} defaultValue="newest" />;
}
```

### Field appearance

A bordered field that opens its list below the trigger, so it lines up with inputs in a form.

`src/ui/catalog/docs/select/field-appearance.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Select } from '../../../components';

const regions = [
  { id: 'eu-west', label: 'Europe (Dublin)' },
  { id: 'eu-central', label: 'Europe (Frankfurt)' },
  { id: 'us-east', label: 'United States (Virginia)' },
  { id: 'ap-south', label: 'Asia Pacific (Singapore)' },
];

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function SelectFieldAppearance() {
  return (
    <div {...stylex.props(s.root)}>
      <Select appearance="field" label="Region" placeholder="Choose a region" options={regions} />
    </div>
  );
}
```

### Sizes

The field appearance follows the control sizes; md (40) is the default. The `morph` appearance is always md (40 px).

`src/ui/catalog/docs/select/sizes.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Select } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const statuses = [
  { id: 'draft', label: 'Draft' },
  { id: 'review', label: 'In review' },
  { id: 'published', label: 'Published' },
];

const sizes = [
  { size: 'sm', label: 'Small, 32 px' },
  { size: 'md', label: 'Medium, 40 px' },
  { size: 'lg', label: 'Large, 44 px' },
] as const;

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-3'], width: 280, maxWidth: '100%' },
});

export default function SelectSizes() {
  return (
    <div {...stylex.props(s.root)}>
      {sizes.map(({ size, label }) => (
        <Select key={size} appearance="field" size={size} label={label} hideLabel options={statuses} defaultValue="draft" />
      ))}
    </div>
  );
}
```

### With label and description

Inside a Field the Select takes its label, description and error from the Field and uses the field appearance.

`src/ui/catalog/docs/select/in-field.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Field, Select } from '../../../components';

const frequencies = [
  { id: 'instant', label: 'As it happens' },
  { id: 'daily', label: 'Daily summary' },
  { id: 'weekly', label: 'Weekly summary' },
];

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function SelectInField() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Email updates" description="Mentions always arrive right away.">
        <Select options={frequencies} defaultValue="daily" />
      </Field>
    </div>
  );
}
```

### With icon

`startAddon` puts an icon before the value in the field appearance.

`src/ui/catalog/docs/select/with-icon.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Icon, Select } from '../../../components';

const timezones = [
  { id: 'utc', label: 'Coordinated Universal Time' },
  { id: 'cet', label: 'Central European Time' },
  { id: 'est', label: 'Eastern Time' },
  { id: 'pst', label: 'Pacific Time' },
];

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function SelectWithIcon() {
  return (
    <div {...stylex.props(s.root)}>
      <Select
        appearance="field"
        label="Time zone"
        startAddon={<Icon name="globe" size={16} />}
        options={timezones}
        defaultValue="cet"
      />
    </div>
  );
}
```

### Options with icons

An option `icon` shows in the list and next to the chosen value.

`src/ui/catalog/docs/select/options-with-icons.tsx`

```tsx
import { Icon, Select } from '../../../components';

const views = [
  { id: 'list', label: 'List', icon: <Icon name="list" size={16} /> },
  { id: 'board', label: 'Board', icon: <Icon name="grid" size={16} /> },
  { id: 'calendar', label: 'Calendar', icon: <Icon name="calendar" size={16} /> },
  { id: 'timeline', label: 'Timeline', icon: <Icon name="clock" size={16} /> },
];

export default function SelectOptionsWithIcons() {
  return <Select label="View" hideLabel options={views} defaultValue="board" />;
}
```

### Groups

Sections group options under a label, with a hairline between groups.

`src/ui/catalog/docs/select/groups.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Select } from '../../../components';

const owners = [
  {
    id: 'design',
    label: 'Design',
    options: [
      { id: 'amara', label: 'Amara' },
      { id: 'jonas', label: 'Jonas' },
    ],
  },
  {
    id: 'engineering',
    label: 'Engineering',
    options: [
      { id: 'priya', label: 'Priya' },
      { id: 'tomas', label: 'Tomas' },
      { id: 'wren', label: 'Wren' },
    ],
  },
];

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function SelectGroups() {
  return (
    <div {...stylex.props(s.root)}>
      <Select label="Owner" placeholder="Choose an owner" options={owners} />
    </div>
  );
}
```

### Multiple selection

With `selectionMode="multiple"` the list stays open and the trigger lists the chosen options.

`src/ui/catalog/docs/select/multiple.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Select } from '../../../components';

const days = [
  { id: 'mon', label: 'Monday' },
  { id: 'tue', label: 'Tuesday' },
  { id: 'wed', label: 'Wednesday' },
  { id: 'thu', label: 'Thursday' },
  { id: 'fri', label: 'Friday' },
];

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function SelectMultiple() {
  return (
    <div {...stylex.props(s.root)}>
      <Select
        selectionMode="multiple"
        label="Digest days"
        placeholder="Choose days"
        options={days}
        defaultValue={['mon', 'thu']}
      />
    </div>
  );
}
```

### Controlled

Pass `value` and `onChange`, then look up the full option object by its id.

`src/ui/catalog/docs/select/controlled.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Select } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const plans = [
  { id: 'starter', label: 'Starter', seats: 3, storage: 5 },
  { id: 'team', label: 'Team', seats: 20, storage: 100 },
  { id: 'business', label: 'Business', seats: 100, storage: 500 },
];

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-3'], width: 280, maxWidth: '100%' },
  summary: {
    margin: 0,
    fontSize: tokens['--os-font-size-caption'],
    lineHeight: tokens['--os-line-height-md'],
    color: tokens['--os-color-fg-muted'],
    fontVariantNumeric: 'tabular-nums',
  },
});

export default function SelectControlled() {
  const [planId, setPlanId] = useState<string | null>('team');
  const plan = plans.find(item => item.id === planId);

  return (
    <div {...stylex.props(s.root)}>
      <Select appearance="field" label="Plan" options={plans} value={planId} onChange={setPlanId} />
      <p {...stylex.props(s.summary)}>
        {plan ? `Up to ${plan.seats} seats and ${plan.storage} GB of storage.` : 'No plan chosen.'}
      </p>
    </div>
  );
}
```

### Disabled

A disabled Select swaps to the disabled colors; single options can be disabled too.

`src/ui/catalog/docs/select/disabled.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Select } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const roles = [
  { id: 'viewer', label: 'Viewer' },
  { id: 'editor', label: 'Editor' },
  { id: 'admin', label: 'Admin', disabled: true },
];

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-4'], width: 280, maxWidth: '100%' },
});

export default function SelectDisabled() {
  return (
    <div {...stylex.props(s.root)}>
      <Select label="Role" options={roles} defaultValue="viewer" isDisabled />
      <Select appearance="field" label="Role" options={roles} defaultValue="editor" isDisabled />
      <Select appearance="field" label="Role with a locked option" options={roles} placeholder="Choose a role" />
    </div>
  );
}
```

### Invalid

An error message marks the Select invalid and replaces the description.

`src/ui/catalog/docs/select/invalid.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Select } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const projects = [
  { id: 'atlas', label: 'Atlas' },
  { id: 'harbor', label: 'Harbor' },
  { id: 'meadow', label: 'Meadow' },
];

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-4'], width: 280, maxWidth: '100%' },
});

export default function SelectInvalid() {
  return (
    <div {...stylex.props(s.root)}>
      <Select label="Project" options={projects} placeholder="Choose a project" errorMessage="Choose a project to move this note." />
      <Select
        appearance="field"
        label="Project"
        options={projects}
        placeholder="Choose a project"
        errorMessage="Choose a project to move this note."
      />
    </div>
  );
}
```

### Read-only

The value stays readable and focusable but can’t be changed; the chevron is hidden.

`src/ui/catalog/docs/select/read-only.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Select } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const currencies = [
  { id: 'eur', label: 'Euro' },
  { id: 'usd', label: 'US dollar' },
  { id: 'gbp', label: 'Pound sterling' },
];

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-4'], width: 280, maxWidth: '100%' },
});

export default function SelectReadOnly() {
  return (
    <div {...stylex.props(s.root)}>
      <Select label="Billing currency" options={currencies} defaultValue="eur" isReadOnly />
      <Select
        appearance="field"
        label="Billing currency"
        description="Set when the workspace was created."
        options={currencies}
        defaultValue="eur"
        isReadOnly
      />
    </div>
  );
}
```

### Form integration

With a `name` the value is submitted with the form, and `isRequired` blocks an empty submit.

`src/ui/catalog/docs/select/form.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, Form, FormActions, Select } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const priorities = [
  { id: 'low', label: 'Low' },
  { id: 'medium', label: 'Medium' },
  { id: 'high', label: 'High' },
];

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-3'], width: 280, maxWidth: '100%' },
  status: { margin: 0, minHeight: 20, fontSize: tokens['--os-font-size-caption'], lineHeight: tokens['--os-line-height-md'], color: tokens['--os-color-fg-muted'] },
});

export default function SelectForm() {
  const [saved, setSaved] = useState('');

  return (
    <div {...stylex.props(s.root)}>
      <Form
        onSubmit={event => {
          event.preventDefault();
          setSaved(String(new FormData(event.currentTarget).get('priority')));
        }}
      >
        <Select appearance="field" name="priority" label="Priority" placeholder="Choose a priority" options={priorities} isRequired />
        <FormActions>
          <Button type="submit">Save task</Button>
        </FormActions>
      </Form>
      <p role="status" {...stylex.props(s.status)}>{saved && `Saved with priority: ${saved}.`}</p>
    </div>
  );
}
```

### Searchable

For long lists, a Combobox with the input inside the popup keeps the select-like trigger.

`src/ui/catalog/docs/select/searchable.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Combobox } from '../../../components';

const countries = [
  'Argentina', 'Australia', 'Austria', 'Belgium', 'Brazil', 'Canada', 'Chile', 'Denmark', 'Finland', 'France',
  'Germany', 'Iceland', 'Ireland', 'Italy', 'Japan', 'Kenya', 'Mexico', 'Netherlands', 'Norway', 'Portugal',
].map(name => ({ id: name.toLowerCase(), label: name }));

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function SelectSearchable() {
  return (
    <div {...stylex.props(s.root)}>
      <Combobox
        inputPlacement="popup"
        label="Country"
        placeholder="Choose a country"
        searchPlaceholder="Search countries"
        options={countries}
      />
    </div>
  );
}
```
