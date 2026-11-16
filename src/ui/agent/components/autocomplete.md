# Autocomplete

A text field that suggests matches while someone types, and still accepts any text.

Category: Forms · Exports: `Autocomplete`, `AutocompleteProps`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { Autocomplete } from '@/ui/components';

<Autocomplete
  label="Office"
  placeholder="Search cities"
  options={[
    { id: 'lisbon', label: 'Lisbon' },
    { id: 'oslo', label: 'Oslo' },
  ]}
/>
```

## Autocomplete

A text field with suggestions. The value is the text; a suggestion fills it in.

Extends: React Aria ComboBoxProps (single selection, without items, children, allowsCustomValue)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` |  | The visible label. Optional inside a Field that has one, or with `aria-label`. |
| `options` (required) | `readonly CatalogEntry[]` |  | Suggestions, or labeled sections of suggestions. |
| `placeholder` | `string` |  | Shown in the empty input. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'small' \| 'medium' \| 'large'` | `'md'` | Height and text size. Legacy names map to `sm`, `md` and `lg`. |
| `hideLabel` | `boolean` | `false` | Keeps the label for assistive tech only. |
| `description` | `ReactNode` |  | Help text under the field. The error replaces it. |
| `errorMessage` | `ReactNode` |  | The error line. It replaces the description and turns the field invalid. |
| `limit` | `number` |  | Shows at most this many matches. |
| `inlineComplete` | `boolean` | `false` | Completes the input with the first option that starts with the typed text, selecting the added part. |
| `autoHighlight` | `boolean` | `false` | Highlights the first match while typing, so Enter picks it. |
| `startAddon` | `ReactNode` |  | Content at the start of the shell, usually a 16 px Icon. |
| `isClearable` | `boolean` | `false` | Shows a clear button while the field has text. |
| `showTrigger` | `boolean` | `false` | Shows the chevron button that opens every suggestion. |
| `isLoading` | `boolean` | `false` | Shows a spinner in the trailing slot, and a loading row while the list is empty. |
| `loadingMessage` | `ReactNode` | `'Loading…'` | The text of the loading row. |
| `emptyMessage` | `ReactNode` | `'No matching options'` | Shown when nothing matches. |
| `className` | `string` |  | Class names for the outermost element. |
| `style` | `CSSProperties` |  | Inline styles for the outermost element. |
| `ref` | `Ref<HTMLDivElement>` |  | The outermost element. |
| `error` | `ReactNode` |  | Deprecated alias of `errorMessage`. |

## Accessibility

- The input has the `combobox` role and controls a `listbox` of suggestions. Focus stays in the input; the highlighted suggestion is announced through `aria-activedescendant`.
- Arrow keys open and move through the suggestions, Enter fills in the highlighted one, and Escape closes the list. Any typed text is a valid value.
- Inline completion selects only the added text, so typing on replaces it and Backspace removes it.
- The clear and chevron buttons are left out of the tab order; the clear button is labeled "Clear".
- Give every Autocomplete a `label`, hide it with `hideLabel`, or place it in a Field. The description or error is linked with `aria-describedby`.
- With reduced motion the popup fades in and out over 120 ms, without the scale and offset.

## Examples

### Default

`src/ui/catalog/docs/autocomplete/default.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Autocomplete } from '../../../components';

const cities = ['Amsterdam', 'Berlin', 'Copenhagen', 'Lisbon', 'Madrid', 'Oslo', 'Prague', 'Vienna']
  .map(city => ({ id: city.toLowerCase(), label: city }));

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function AutocompleteDefault() {
  return (
    <div {...stylex.props(s.root)}>
      <Autocomplete label="Office" placeholder="Search cities" options={cities} />
    </div>
  );
}
```

### Sizes

The control sizes from 24 to 48 px; md (40) is the default and lines up with Input and Button.

`src/ui/catalog/docs/autocomplete/sizes.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Autocomplete } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const topics = ['Billing', 'Integrations', 'Permissions', 'Reports'].map(topic => ({ id: topic.toLowerCase(), label: topic }));

const sizes = [
  { size: 'sm', label: 'Small, 32 px' },
  { size: 'md', label: 'Medium, 40 px' },
  { size: 'lg', label: 'Large, 44 px' },
] as const;

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-3'], width: 280, maxWidth: '100%' },
});

export default function AutocompleteSizes() {
  return (
    <div {...stylex.props(s.root)}>
      {sizes.map(({ size, label }) => (
        <Autocomplete key={size} size={size} label={label} hideLabel placeholder={label} options={topics} />
      ))}
    </div>
  );
}
```

### Inline completion

The rest of the first match is filled in and selected as you type, so Tab or the arrow keys accept it.

`src/ui/catalog/docs/autocomplete/inline-complete.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Autocomplete } from '../../../components';

const commands = ['Archive note', 'Assign to me', 'Copy link', 'Duplicate note', 'Move to project', 'Pin to top']
  .map(command => ({ id: command.toLowerCase().replace(/ /g, '-'), label: command }));

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function AutocompleteInlineComplete() {
  return (
    <div {...stylex.props(s.root)}>
      <Autocomplete label="Action" placeholder="Type an action" options={commands} inlineComplete />
    </div>
  );
}
```

### Auto highlight

The first match is highlighted while typing, so Enter picks it.

`src/ui/catalog/docs/autocomplete/auto-highlight.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Autocomplete } from '../../../components';

const fruits = ['Apple', 'Apricot', 'Banana', 'Blackberry', 'Cherry', 'Fig', 'Grape', 'Lemon', 'Mango', 'Peach']
  .map(fruit => ({ id: fruit.toLowerCase(), label: fruit }));

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function AutocompleteAutoHighlight() {
  return (
    <div {...stylex.props(s.root)}>
      <Autocomplete label="Snack" placeholder="Type a fruit" options={fruits} autoHighlight />
    </div>
  );
}
```

### With clear button

`isClearable` shows a clear button while the field has text.

`src/ui/catalog/docs/autocomplete/clear-button.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Autocomplete } from '../../../components';

const searches = ['Open invoices', 'Overdue invoices', 'Paid this month', 'Drafts'].map(search => ({ id: search.toLowerCase().replace(/ /g, '-'), label: search }));

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function AutocompleteClearButton() {
  return (
    <div {...stylex.props(s.root)}>
      <Autocomplete label="Search invoices" options={searches} defaultInputValue="Overdue invoices" isClearable />
    </div>
  );
}
```

### With trigger and clear buttons

`showTrigger` adds the chevron that opens every suggestion; it sits after the clear button.

`src/ui/catalog/docs/autocomplete/trigger-and-clear.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Autocomplete } from '../../../components';

const units = ['Hours', 'Days', 'Weeks', 'Sprints'].map(unit => ({ id: unit.toLowerCase(), label: unit }));

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function AutocompleteTriggerAndClear() {
  return (
    <div {...stylex.props(s.root)}>
      <Autocomplete label="Estimate unit" placeholder="Type or choose" options={units} showTrigger isClearable />
    </div>
  );
}
```

### With start addon

`startAddon` puts an icon at the start of the field.

`src/ui/catalog/docs/autocomplete/start-addon.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Autocomplete, Icon } from '../../../components';

const pages = ['Getting started', 'Billing settings', 'Team members', 'Integrations', 'Security']
  .map(page => ({ id: page.toLowerCase().replace(/ /g, '-'), label: page }));

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function AutocompleteStartAddon() {
  return (
    <div {...stylex.props(s.root)}>
      <Autocomplete label="Search help" hideLabel placeholder="Search help" options={pages} startAddon={<Icon name="search" size={16} />} />
    </div>
  );
}
```

### Groups

Sections group suggestions under a label; empty groups drop out while filtering.

`src/ui/catalog/docs/autocomplete/groups.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Autocomplete } from '../../../components';

const recipients = [
  { id: 'people', label: 'People', options: ['Amara', 'Jonas', 'Priya'].map(name => ({ id: name.toLowerCase(), label: name })) },
  { id: 'teams', label: 'Teams', options: ['Design', 'Finance', 'Support'].map(team => ({ id: team.toLowerCase(), label: team })) },
];

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function AutocompleteGroups() {
  return (
    <div {...stylex.props(s.root)}>
      <Autocomplete label="Share with" placeholder="Name or team" options={recipients} showTrigger />
    </div>
  );
}
```

### Limit results

`limit` caps the number of suggestions shown at once.

`src/ui/catalog/docs/autocomplete/limit.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Autocomplete } from '../../../components';

const words = [
  'Account', 'Activity', 'Address', 'Agenda', 'Alert', 'Analytics', 'Approval', 'Archive', 'Asset', 'Audit',
  'Backup', 'Balance', 'Billing', 'Board', 'Budget', 'Calendar', 'Campaign', 'Channel', 'Checklist', 'Client',
].map(word => ({ id: word.toLowerCase(), label: word }));

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function AutocompleteLimit() {
  return (
    <div {...stylex.props(s.root)}>
      <Autocomplete label="Keyword" placeholder="Type a keyword" description="Shows the first five matches." options={words} limit={5} />
    </div>
  );
}
```

### Async search

Own `inputValue`, fetch matches, and set `isLoading` while they arrive.

`src/ui/catalog/docs/autocomplete/async.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useEffect, useState } from 'react';
import { Autocomplete } from '../../../components';

const directory = ['Ada', 'Alma', 'Arlo', 'Bea', 'Cyrus', 'Dalia', 'Elio', 'Freya', 'Gus', 'Hana', 'Ines', 'Jun'];

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function AutocompleteAsync() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ id: string; label: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const matches = directory.filter(name => name.toLowerCase().includes(query.toLowerCase()));
      setResults(matches.map(name => ({ id: name.toLowerCase(), label: name })));
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div {...stylex.props(s.root)}>
      <Autocomplete label="Invite" placeholder="Search the directory" options={results} isLoading={loading}
        inputValue={query} onInputChange={setQuery} emptyMessage="No one by that name" />
    </div>
  );
}
```

### Disabled

A disabled Autocomplete swaps to the disabled colors and can’t take focus.

`src/ui/catalog/docs/autocomplete/disabled.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Autocomplete } from '../../../components';

const domains = ['example.com', 'example.org', 'example.net'].map(domain => ({ id: domain, label: domain }));

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function AutocompleteDisabled() {
  return (
    <div {...stylex.props(s.root)}>
      <Autocomplete label="Domain" options={domains} defaultInputValue="example.com" isDisabled />
    </div>
  );
}
```

### Invalid

An error message replaces the description while the field is invalid.

`src/ui/catalog/docs/autocomplete/invalid.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Autocomplete } from '../../../components';

const tags = ['Planning', 'Retrospective', 'Roadmap'].map(tag => ({ id: tag.toLowerCase(), label: tag }));

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function AutocompleteInvalid() {
  return (
    <div {...stylex.props(s.root)}>
      <Autocomplete
        label="Tag"
        options={tags}
        defaultInputValue="Planing"
        description="Tags come from your workspace."
        errorMessage="Choose one of the existing tags."
        isInvalid
      />
    </div>
  );
}
```

### Read-only

The text stays readable and selectable but can’t be changed.

`src/ui/catalog/docs/autocomplete/read-only.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Autocomplete } from '../../../components';

const cities = ['Lisbon', 'Porto', 'Faro'].map(city => ({ id: city.toLowerCase(), label: city }));

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function AutocompleteReadOnly() {
  return (
    <div {...stylex.props(s.root)}>
      <Autocomplete label="Billing city" options={cities} defaultInputValue="Lisbon" isReadOnly />
    </div>
  );
}
```

### Form integration

With a `name` the typed or chosen text is submitted with the form.

`src/ui/catalog/docs/autocomplete/form.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Autocomplete, Button, Form, FormActions } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const categories = ['Hosting', 'Software', 'Travel', 'Office supplies'].map(name => ({ id: name.toLowerCase(), label: name }));

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-3'], width: 280, maxWidth: '100%' },
  status: { margin: 0, minHeight: 20, fontSize: tokens['--os-font-size-caption'], lineHeight: tokens['--os-line-height-md'], color: tokens['--os-color-fg-muted'] },
});

export default function AutocompleteForm() {
  const [saved, setSaved] = useState('');

  return (
    <div {...stylex.props(s.root)}>
      <Form
        onSubmit={event => {
          event.preventDefault();
          setSaved(String(new FormData(event.currentTarget).get('category')));
        }}
      >
        <Autocomplete name="category" label="Expense category" description="Pick one or type your own." options={categories} isRequired />
        <FormActions>
          <Button type="submit">Save expense</Button>
        </FormActions>
      </Form>
      <p role="status" {...stylex.props(s.status)}>{saved && `Filed under ${saved}.`}</p>
    </div>
  );
}
```
