# Combobox

Type to filter a list of options, then choose one or several.

Category: Forms · Exports: `Combobox`, `ComboboxProps`, `CatalogOption`, `CatalogSection`, `CatalogEntry`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { Combobox } from '@/ui/components';

<Combobox
  label="Assignee"
  placeholder="Choose a teammate"
  options={[
    { id: 'amara', label: 'Amara' },
    { id: 'jonas', label: 'Jonas' },
  ]}
/>
```

## Combobox

A text field with a list of options. Typing filters the list; the value must be one of the options.

Extends: React Aria ComboBoxProps (without items, children, allowsCustomValue)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` |  | The visible label. Optional inside a Field that has one, or with `aria-label`. |
| `options` (required) | `readonly CatalogEntry[]` |  | Options, or labeled sections of options. |
| `placeholder` | `string` |  | Shown in the empty input. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'small' \| 'medium' \| 'large'` | `'md'` | Height and text size. Legacy names map to `sm`, `md` and `lg`. |
| `hideLabel` | `boolean` | `false` | Keeps the label for assistive tech only. |
| `description` | `ReactNode` |  | Help text under the field. The error replaces it. |
| `errorMessage` | `ReactNode` |  | The error line. It replaces the description and turns the field invalid. |
| `startAddon` | `ReactNode` |  | Content at the start of the shell, usually a 16 px Icon. |
| `isClearable` | `boolean` | `false` | Shows a clear button while the field has text or a value. |
| `isLoading` | `boolean` | `false` | Shows a spinner in the trailing slot, and a loading row while the list is empty. |
| `loadingMessage` | `ReactNode` | `'Loading…'` | The text of the loading row. |
| `emptyMessage` | `ReactNode` | `'No matching options'` | Shown when nothing matches. |
| `showTrigger` | `boolean` | `true` | Shows the chevron button that opens the full list. |
| `autoHighlight` | `boolean` | `false` | Highlights the first matching option while typing, so Enter picks it. |
| `inputPlacement` | `'field' \| 'popup'` | `'field'` | `popup` moves the input into the popup and renders a select-like button as the trigger. |
| `searchPlaceholder` | `string` | `'Search…'` | Placeholder of the search input when `inputPlacement="popup"`. |
| `className` | `string` |  | Class names for the outermost element. |
| `style` | `CSSProperties` |  | Inline styles for the outermost element. |
| `ref` | `Ref<HTMLDivElement>` |  | The outermost element. |
| `error` | `ReactNode` |  | Deprecated alias of `errorMessage`. |

## CatalogOption

One option in `options`.

## CatalogSection

A labeled group of options, separated from the next group by a hairline.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `id` (required) | `string` |  | A unique key for the section. |
| `label` | `string` |  | The group label above the options. |
| `options` (required) | `readonly CatalogOption[]` |  | The options in the group. |

## Accessibility

- The input has the `combobox` role and controls a `listbox` popup. Focus stays in the input; the highlighted option is announced through `aria-activedescendant`.
- Arrow keys open the list and move through it, Enter picks the highlighted option and Escape closes the list, then clears unconfirmed text.
- With multiple selection, Backspace in the empty input removes the last chip. The chip and clear buttons are left out of the tab order; the list and Backspace do the same job from the keyboard.
- Give every Combobox a `label`, hide it with `hideLabel`, or place it in a Field. The description or error is linked with `aria-describedby`.
- With `inputPlacement="popup"` the trigger is a button. Opening it moves focus to the search field; Escape clears the search, a second Escape closes the list and returns focus to the trigger.
- With reduced motion the popup fades in and out over 120 ms, without the scale and offset.

## Examples

### Default

`src/ui/catalog/docs/combobox/default.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Combobox } from '../../../components';

const people = [
  { id: 'amara', label: 'Amara' },
  { id: 'jonas', label: 'Jonas' },
  { id: 'priya', label: 'Priya' },
  { id: 'tomas', label: 'Tomas' },
  { id: 'wren', label: 'Wren' },
];

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function ComboboxDefault() {
  return (
    <div {...stylex.props(s.root)}>
      <Combobox label="Assignee" placeholder="Choose a teammate" options={people} />
    </div>
  );
}
```

### Sizes

The control sizes from 24 to 48 px; md (40) is the default and lines up with Input and Button.

`src/ui/catalog/docs/combobox/sizes.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Combobox } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const labels = [
  { id: 'bug', label: 'Bug' },
  { id: 'feature', label: 'Feature' },
  { id: 'docs', label: 'Documentation' },
];

const sizes = [
  { size: 'sm', label: 'Small, 32 px' },
  { size: 'md', label: 'Medium, 40 px' },
  { size: 'lg', label: 'Large, 44 px' },
] as const;

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-3'], width: 280, maxWidth: '100%' },
});

export default function ComboboxSizes() {
  return (
    <div {...stylex.props(s.root)}>
      {sizes.map(({ size, label }) => (
        <Combobox key={size} size={size} label={label} hideLabel placeholder={label} options={labels} />
      ))}
    </div>
  );
}
```

### With label and description

Inside a Field the Combobox takes its label, description, required marker and error from the Field.

`src/ui/catalog/docs/combobox/in-field.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Combobox, Field } from '../../../components';

const projects = [
  { id: 'atlas', label: 'Atlas' },
  { id: 'harbor', label: 'Harbor' },
  { id: 'meadow', label: 'Meadow' },
];

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function ComboboxInField() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Project" description="Notes move with their project." isRequired>
        <Combobox placeholder="Choose a project" options={projects} />
      </Field>
    </div>
  );
}
```

### Auto highlight

The first match is highlighted while typing, so Enter picks it.

`src/ui/catalog/docs/combobox/auto-highlight.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Combobox } from '../../../components';

const languages = ['Danish', 'Dutch', 'English', 'Finnish', 'French', 'German', 'Italian', 'Norwegian', 'Spanish', 'Swedish']
  .map(name => ({ id: name.toLowerCase(), label: name }));

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function ComboboxAutoHighlight() {
  return (
    <div {...stylex.props(s.root)}>
      <Combobox label="Language" placeholder="Type a language" options={languages} autoHighlight />
    </div>
  );
}
```

### With clear button

`isClearable` shows a clear button while the field has text or a value.

`src/ui/catalog/docs/combobox/clear-button.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Combobox } from '../../../components';

const folders = [
  { id: 'inbox', label: 'Inbox' },
  { id: 'drafts', label: 'Drafts' },
  { id: 'archive', label: 'Archive' },
  { id: 'shared', label: 'Shared with me' },
];

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function ComboboxClearButton() {
  return (
    <div {...stylex.props(s.root)}>
      <Combobox label="Folder" options={folders} defaultSelectedKey="drafts" isClearable />
    </div>
  );
}
```

### Groups

Sections group options under a label; empty groups drop out while filtering.

`src/ui/catalog/docs/combobox/groups.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Combobox } from '../../../components';

const channels = [
  {
    id: 'teams',
    label: 'Teams',
    options: [
      { id: 'design', label: 'Design' },
      { id: 'platform', label: 'Platform' },
      { id: 'support', label: 'Support' },
    ],
  },
  {
    id: 'projects',
    label: 'Projects',
    options: [
      { id: 'atlas', label: 'Atlas launch' },
      { id: 'harbor', label: 'Harbor migration' },
    ],
  },
];

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function ComboboxGroups() {
  return (
    <div {...stylex.props(s.root)}>
      <Combobox label="Post to" placeholder="Choose a channel" options={channels} />
    </div>
  );
}
```

### Multiple selection

Chosen options become chips before the input; Backspace in the empty input removes the last one.

`src/ui/catalog/docs/combobox/multiple.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Combobox } from '../../../components';

const tags = [
  { id: 'research', label: 'Research' },
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'meeting', label: 'Meeting notes' },
  { id: 'decision', label: 'Decision' },
  { id: 'follow-up', label: 'Follow-up' },
];

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function ComboboxMultiple() {
  return (
    <div {...stylex.props(s.root)}>
      <Combobox
        selectionMode="multiple"
        label="Tags"
        placeholder="Add tags"
        options={tags}
        defaultValue={['roadmap', 'decision']}
      />
    </div>
  );
}
```

### With start addon

`startAddon` puts an icon at the start of the field, with single or multiple selection.

`src/ui/catalog/docs/combobox/start-addon.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Combobox, Icon } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const people = [
  { id: 'amara', label: 'Amara' },
  { id: 'jonas', label: 'Jonas' },
  { id: 'priya', label: 'Priya' },
  { id: 'wren', label: 'Wren' },
];

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-4'], width: 320, maxWidth: '100%' },
});

export default function ComboboxStartAddon() {
  return (
    <div {...stylex.props(s.root)}>
      <Combobox label="Owner" placeholder="Find a person" options={people} startAddon={<Icon name="user" size={16} />} />
      <Combobox
        selectionMode="multiple"
        label="Watchers"
        placeholder="Add people"
        options={people}
        defaultValue={['jonas']}
        startAddon={<Icon name="users" size={16} />}
      />
    </div>
  );
}
```

### Input inside the popup

With `inputPlacement="popup"` the trigger is a select-like button and the search field sits at the top of the list.

`src/ui/catalog/docs/combobox/popup-input.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Combobox } from '../../../components';

const timezones = [
  'Auckland', 'Berlin', 'Buenos Aires', 'Cairo', 'Chicago', 'Denver', 'Dubai', 'Helsinki', 'Jakarta', 'Lagos',
  'Lima', 'Lisbon', 'Mumbai', 'Nairobi', 'Seoul', 'Singapore', 'Sydney', 'Toronto', 'Vancouver', 'Warsaw',
].map(city => ({ id: city.toLowerCase().replace(' ', '-'), label: city }));

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function ComboboxPopupInput() {
  return (
    <div {...stylex.props(s.root)}>
      <Combobox
        inputPlacement="popup"
        label="Time zone"
        placeholder="Choose a city"
        searchPlaceholder="Search cities"
        options={timezones}
      />
    </div>
  );
}
```

### Controlled

Pass `value` and `onChange` to own the selected key.

`src/ui/catalog/docs/combobox/controlled.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Combobox } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const statuses = [
  { id: 'todo', label: 'To do' },
  { id: 'doing', label: 'In progress' },
  { id: 'done', label: 'Done' },
];

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-3'], width: 280, maxWidth: '100%' },
  note: { margin: 0, fontSize: tokens['--os-font-size-caption'], lineHeight: tokens['--os-line-height-md'], color: tokens['--os-color-fg-muted'] },
});

export default function ComboboxControlled() {
  const [status, setStatus] = useState<string | number | null>('doing');

  return (
    <div {...stylex.props(s.root)}>
      <Combobox label="Status" options={statuses} value={status} onChange={setStatus} />
      <p {...stylex.props(s.note)}>Selected id: {status ?? 'none'}</p>
    </div>
  );
}
```

### Loading

While `isLoading` is set a spinner sits in the trailing slot and the empty list shows a loading row.

`src/ui/catalog/docs/combobox/loading.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Combobox } from '../../../components';

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function ComboboxLoading() {
  return (
    <div {...stylex.props(s.root)}>
      <Combobox label="Repository" placeholder="Choose a repository" options={[]} isLoading loadingMessage="Loading repositories…" />
    </div>
  );
}
```

### Disabled

A disabled Combobox swaps to the disabled colors; single options can be disabled too.

`src/ui/catalog/docs/combobox/disabled.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Combobox } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const environments = [
  { id: 'production', label: 'Production' },
  { id: 'staging', label: 'Staging' },
  { id: 'preview', label: 'Preview', disabled: true },
];

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-4'], width: 280, maxWidth: '100%' },
});

export default function ComboboxDisabled() {
  return (
    <div {...stylex.props(s.root)}>
      <Combobox label="Environment" options={environments} defaultSelectedKey="production" isDisabled />
      <Combobox label="Environment with a locked option" placeholder="Choose an environment" options={environments} />
    </div>
  );
}
```

### Invalid

An error message marks the field invalid and replaces the description.

`src/ui/catalog/docs/combobox/invalid.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Combobox } from '../../../components';

const reviewers = [
  { id: 'amara', label: 'Amara' },
  { id: 'jonas', label: 'Jonas' },
  { id: 'priya', label: 'Priya' },
];

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function ComboboxInvalid() {
  return (
    <div {...stylex.props(s.root)}>
      <Combobox
        label="Reviewer"
        placeholder="Choose a reviewer"
        description="They get a request when you publish."
        options={reviewers}
        errorMessage="Choose someone to review this change."
      />
    </div>
  );
}
```

### Read-only

The value stays readable and focusable but can’t be changed; the chevron is hidden.

`src/ui/catalog/docs/combobox/read-only.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Combobox } from '../../../components';

const owners = [
  { id: 'amara', label: 'Amara' },
  { id: 'jonas', label: 'Jonas' },
];

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function ComboboxReadOnly() {
  return (
    <div {...stylex.props(s.root)}>
      <Combobox label="Workspace owner" options={owners} defaultSelectedKey="amara" isReadOnly />
    </div>
  );
}
```

### Form integration

With a `name` the chosen key is submitted with the form; multiple selection submits one entry per key.

`src/ui/catalog/docs/combobox/form.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, Combobox, Form, FormActions } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const people = ['Amara', 'Jonas', 'Priya', 'Tomas'].map(name => ({ id: name.toLowerCase(), label: name }));
const labels = ['Bug', 'Feature', 'Design', 'Urgent'].map(name => ({ id: name.toLowerCase(), label: name }));

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-3'], width: 320, maxWidth: '100%' },
  status: { margin: 0, minHeight: 20, fontSize: tokens['--os-font-size-caption'], lineHeight: tokens['--os-line-height-md'], color: tokens['--os-color-fg-muted'] },
});

export default function ComboboxForm() {
  const [result, setResult] = useState('');

  return (
    <div {...stylex.props(s.root)}>
      <Form
        onSubmit={event => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          setResult(`Assigned to ${data.get('assignee')}, labels: ${data.getAll('labels').join(', ') || 'none'}.`);
        }}
      >
        <Combobox name="assignee" label="Assignee" placeholder="Choose a teammate" options={people} isRequired />
        <Combobox name="labels" selectionMode="multiple" label="Labels" placeholder="Add labels" options={labels} />
        <FormActions>
          <Button type="submit">Create issue</Button>
        </FormActions>
      </Form>
      <p role="status" {...stylex.props(s.status)}>{result}</p>
    </div>
  );
}
```
