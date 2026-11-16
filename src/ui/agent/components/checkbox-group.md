# Checkbox Group

Collect several choices under one shared label.

Category: Forms · Exports: `CheckboxGroup`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { CheckboxGroup } from '@/ui/components';

<CheckboxGroup
  label="Notify me by"
  defaultValue={['email']}
  options={[
    { id: 'email', label: 'Email' },
    { id: 'push', label: 'Push notifications' },
  ]}
/>
```

## CheckboxGroup

A labeled list of checkboxes with one value array. It also takes React Aria's `value`, `defaultValue`, `onChange`, `name`, `form`, `isDisabled`, `isReadOnly`, `isRequired`, `isInvalid` and `validate`.

Extends: React Aria CheckboxGroupProps

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` |  | The group's visible label. Without one, pass `aria-label`. |
| `options` | `readonly CheckboxGroupOption[]` |  | The options in order: `{ id, label, description?, disabled?, indeterminate? }`. Or pass Checkbox children. |
| `children` | `ReactNode` |  | Checkbox elements for custom layouts, rendered after `options`. A checkbox with a `value` joins the group. |
| `orientation` | `'horizontal' \| 'vertical'` | `'vertical'` | Stacks the options 4 px apart, or puts them in a wrapping row 16 px apart. |
| `description` | `ReactNode` |  | Help text under the options. The error message replaces it while the group is invalid. |
| `errorMessage` | `ReactNode \| ((validation: ValidationResult) => ReactNode)` |  | Shown under the options while the group is invalid. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'small' \| 'medium' \| 'large'` | `'md'` | Indicator and text size of every option. |
| `variant` | `'default' \| 'card'` | `'default'` | `card` puts each option in a bordered tile. |
| `selectAllLabel` | `ReactNode` |  | Adds a parent checkbox that turns every enabled option on or off. Works with `options`. |
| `className` | `string` |  | Added to the outermost element. |
| `style` | `CSSProperties` |  | Inline styles for the outermost element. |
| `ref` | `Ref<HTMLDivElement>` |  | The outermost element. |
| `error` | `ReactNode` |  | Deprecated: use `isInvalid` with `errorMessage`. Setting it also marks the group invalid. |

## Accessibility

- Renders a `group` named by its label, with a native checkbox per option.
- Tab moves between options and Space toggles the focused one.
- The parent checkbox reports `aria-checked="mixed"` while only some options are on.
- The help text and the error message are linked to the group with `aria-describedby`; the error replaces the help text.
- Without a visible `label`, give the group an `aria-label`.

## Examples

### Default

`src/ui/catalog/docs/checkbox-group/default.tsx`

```tsx
import { CheckboxGroup } from '../../../components';

const channels = [
  { id: 'email', label: 'Email' },
  { id: 'push', label: 'Push notifications' },
  { id: 'sms', label: 'Text message' },
];

export default function CheckboxGroupDefault() {
  return <CheckboxGroup label="Notify me by" defaultValue={['email']} options={channels} />;
}
```

### With description

Each option can carry help text, and the group takes its own under the list.

`src/ui/catalog/docs/checkbox-group/with-description.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { CheckboxGroup } from '../../../components';

const s = stylex.create({
  root: { width: 340, maxWidth: '100%' },
});

const reports = [
  { id: 'weekly', label: 'Weekly summary', description: 'Deployments, incidents and spend for the last 7 days.' },
  { id: 'invoices', label: 'Invoices', description: 'A copy of every invoice when it is issued.' },
];

export default function CheckboxGroupWithDescription() {
  return (
    <div {...stylex.props(s.root)}>
      <CheckboxGroup
        label="Reports"
        description="Sent to the billing contact."
        defaultValue={['weekly']}
        options={reports}
      />
    </div>
  );
}
```

### Horizontal

Short options sit in a row 16 px apart and wrap on narrow screens.

`src/ui/catalog/docs/checkbox-group/horizontal.tsx`

```tsx
import { CheckboxGroup } from '../../../components';

const days = [
  { id: 'mon', label: 'Mon' },
  { id: 'tue', label: 'Tue' },
  { id: 'wed', label: 'Wed' },
  { id: 'thu', label: 'Thu' },
  { id: 'fri', label: 'Fri' },
];

export default function CheckboxGroupHorizontal() {
  return (
    <CheckboxGroup
      label="Backup days"
      orientation="horizontal"
      defaultValue={['mon', 'wed', 'fri']}
      options={days}
    />
  );
}
```

### With disabled item

Disable one option with `disabled`, or the whole group with `isDisabled`.

`src/ui/catalog/docs/checkbox-group/disabled-item.tsx`

```tsx
import { CheckboxGroup } from '../../../components';

const regions = [
  { id: 'eu', label: 'Frankfurt' },
  { id: 'us', label: 'Virginia' },
  { id: 'ap', label: 'Singapore', description: 'Available on the team plan.', disabled: true },
];

export default function CheckboxGroupDisabledItem() {
  return <CheckboxGroup label="Regions" defaultValue={['eu']} options={regions} />;
}
```

### Parent checkbox

`selectAllLabel` adds a parent that turns every enabled option on or off and shows a dash when only some are on.

`src/ui/catalog/docs/checkbox-group/parent.tsx`

```tsx
import { CheckboxGroup } from '../../../components';

const permissions = [
  { id: 'view', label: 'View projects' },
  { id: 'edit', label: 'Edit settings' },
  { id: 'invite', label: 'Invite members' },
];

export default function CheckboxGroupParent() {
  return (
    <CheckboxGroup
      label="Permissions"
      selectAllLabel="All permissions"
      defaultValue={['view']}
      options={permissions}
    />
  );
}
```

### Nested parent checkbox

Compose deeper trees from Checkbox children: a checkbox without a `value` stays out of the group and acts as a parent.

`src/ui/catalog/docs/checkbox-group/nested.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Checkbox, CheckboxGroup } from '../../../components';

const s = stylex.create({
  // os-allow raw-space: lines children up under the parent's label (18px box + 12px gap), not a layout space
  indent: { paddingInlineStart: 30 },
  // os-allow raw-space: two levels of the same label indent
  nestedIndent: { paddingInlineStart: 60 },
});

const mobile = ['ios', 'android'];
const all = ['web', ...mobile, 'desktop'];

export default function CheckboxGroupNested() {
  const [value, setValue] = useState(['ios']);
  const count = (ids: string[]) => ids.filter(id => value.includes(id)).length;
  const toggle = (ids: string[], on: boolean) =>
    setValue(on ? [...new Set([...value, ...ids])] : value.filter(id => !ids.includes(id)));
  const parentState = (ids: string[]) => ({
    isSelected: count(ids) === ids.length,
    isIndeterminate: count(ids) > 0 && count(ids) < ids.length,
    onChange: (on: boolean) => toggle(ids, on),
  });

  return (
    <CheckboxGroup label="Release to" value={value} onChange={setValue}>
      <Checkbox label="All platforms" {...parentState(all)} />
      <Checkbox value="web" label="Web" {...stylex.props(s.indent)} />
      <Checkbox label="Mobile" {...parentState(mobile)} {...stylex.props(s.indent)} />
      <Checkbox value="ios" label="iOS" {...stylex.props(s.nestedIndent)} />
      <Checkbox value="android" label="Android" {...stylex.props(s.nestedIndent)} />
      <Checkbox value="desktop" label="Desktop" {...stylex.props(s.indent)} />
    </CheckboxGroup>
  );
}
```

### Invalid

Every ring turns `border-error`, and the message replaces the group's help text.

`src/ui/catalog/docs/checkbox-group/invalid.tsx`

```tsx
import { CheckboxGroup } from '../../../components';

const channels = [
  { id: 'email', label: 'Email' },
  { id: 'push', label: 'Push notifications' },
];

export default function CheckboxGroupInvalid() {
  return (
    <CheckboxGroup
      label="Alert channels"
      description="Where on-call alerts go."
      isRequired
      isInvalid
      errorMessage="Choose at least one channel."
      options={channels}
    />
  );
}
```

### Read-only

The selection shows and stays focusable but cannot change.

`src/ui/catalog/docs/checkbox-group/read-only.tsx`

```tsx
import { CheckboxGroup } from '../../../components';

const scopes = [
  { id: 'read', label: 'Read repositories' },
  { id: 'write', label: 'Write repositories' },
  { id: 'admin', label: 'Administer the organization' },
];

export default function CheckboxGroupReadOnly() {
  return <CheckboxGroup label="Token scopes" isReadOnly defaultValue={['read', 'write']} options={scopes} />;
}
```

### Card

`variant="card"` puts each option in a bordered tile, 8 px apart.

`src/ui/catalog/docs/checkbox-group/card.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { CheckboxGroup } from '../../../components';

const s = stylex.create({
  root: { width: 380, maxWidth: '100%' },
});

const addons = [
  { id: 'analytics', label: 'Analytics', description: 'Page views and conversion funnels.' },
  { id: 'logs', label: 'Log retention', description: 'Keep request logs for 90 days.' },
  { id: 'support', label: 'Priority support', description: 'Replies within four business hours.' },
];

export default function CheckboxGroupCard() {
  return (
    <div {...stylex.props(s.root)}>
      <CheckboxGroup label="Add-ons" variant="card" defaultValue={['logs']} options={addons} />
    </div>
  );
}
```

### Controlled

Drive the selection with `value` and `onChange`.

`src/ui/catalog/docs/checkbox-group/controlled.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { CheckboxGroup } from '../../../components';
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

const columns = [
  { id: 'status', label: 'Status' },
  { id: 'owner', label: 'Owner' },
  { id: 'due', label: 'Due date' },
];

export default function CheckboxGroupControlled() {
  const [visible, setVisible] = useState(['status', 'owner']);

  return (
    <div {...stylex.props(s.column)}>
      <CheckboxGroup label="Visible columns" value={visible} onChange={setVisible} options={columns} />
      <p {...stylex.props(s.status)}>{visible.length} of {columns.length} columns shown.</p>
    </div>
  );
}
```

### Form integration

Each checked option submits its id under the group's `name`. A required group shows its message on submit.

`src/ui/catalog/docs/checkbox-group/form-integration.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, CheckboxGroup, Form, FormActions } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-3'], width: 320, maxWidth: '100%' },
  status: {
    margin: 0, minHeight: 20, color: tokens['--os-color-fg-muted'],
    fontSize: tokens['--os-font-size-caption'], lineHeight: tokens['--os-line-height-md'],
  },
});

const events = [
  { id: 'deploy', label: 'Deployment finished' },
  { id: 'failure', label: 'Build failed' },
  { id: 'comment', label: 'New comment' },
];

export default function CheckboxGroupFormIntegration() {
  const [saved, setSaved] = useState('');

  return (
    <div {...stylex.props(s.root)}>
      <Form
        onSubmit={event => {
          event.preventDefault();
          setSaved(new FormData(event.currentTarget).getAll('events').join(', '));
        }}
      >
        <CheckboxGroup label="Send a webhook on" name="events" isRequired errorMessage="Choose at least one event." options={events} />
        <FormActions>
          <Button type="submit">Save webhook</Button>
        </FormActions>
      </Form>
      <p role="status" {...stylex.props(s.status)}>{saved && `Saved: ${saved}.`}</p>
    </div>
  );
}
```
