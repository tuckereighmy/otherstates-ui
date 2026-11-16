# Date Picker

Type a date or choose it from a calendar popup.

Category: Forms · Exports: `DatePicker`, `DateRangePicker`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { DatePicker } from '@/ui/components';

<DatePicker label="Due date" />
```

## DatePicker

A labeled date field with a calendar button that opens a Calendar in a popup. Controlled with `value` or uncontrolled with `defaultValue`.

Extends: React Aria DatePickerProps

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `presets` | `{ label: string; value: T \| (() => T) }[]` |  | Shortcuts listed beside the calendar. Picking one sets the value. A function value is read when picked, so relative presets ("Today") stay current and nothing reads the clock while the page renders. |

## DateRangePicker

A start and an end date in one field, with a range calendar in the popup.

Extends: React Aria DateRangePickerProps

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `presets` | `{ label: string; value: RangeValue<T> \| (() => RangeValue<T>) }[]` |  | Shortcuts listed beside the calendar. Picking one sets the range. A function value is read when picked. |

## Accessibility

- Each date part is a spin button: type digits, or use the Up and Down arrows; Left and Right move between parts.
- The calendar button and Alt + Down open the popup, which moves focus into the calendar; Escape closes it and returns focus to the field.
- The `label` names the field group and the popup dialog. Without a visible label, set `aria-label` or place the picker in a `Field`.
- The description and the error message are linked with `aria-describedby`; `isRequired` sets `aria-required` and adds " *" to the label.
- Read-only fields keep their value focusable and set `aria-readonly`. Under reduced motion the popup fades without moving.

## Examples

### Default

`src/ui/catalog/docs/date-picker/default.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { DatePicker } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function DatePickerDefault() {
  return (
    <div {...stylex.props(s.root)}>
      <DatePicker label="Due date" />
    </div>
  );
}
```

### Date range picker

`DateRangePicker` puts a start and an end date in one field, with a range calendar in the popup.

`src/ui/catalog/docs/date-picker/range.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { DateRangePicker } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function DatePickerRange() {
  return (
    <div {...stylex.props(s.root)}>
      <DateRangePicker label="Offsite dates" />
    </div>
  );
}
```

### With dropdown navigation

`navigation="dropdown"` adds month and year lists to the calendar, for dates far from today.

`src/ui/catalog/docs/date-picker/dropdown.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { parseDate } from '@internationalized/date';
import { DatePicker } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function DatePickerDropdown() {
  return (
    <div {...stylex.props(s.root)}>
      <DatePicker label="Contract start" navigation="dropdown" defaultValue={parseDate('2019-04-15')} />
    </div>
  );
}
```

### With presets

`presets` lists shortcuts beside the calendar; picking one sets the value and closes the popup.

`src/ui/catalog/docs/date-picker/presets.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { getLocalTimeZone, today } from '@internationalized/date';
import { DatePicker } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function DatePickerPresets() {
  // Read when picked, so "Today" is today even if the page has been open since yesterday.
  const now = () => today(getLocalTimeZone());
  const presets = [
    { label: 'Today', value: now },
    { label: 'Tomorrow', value: () => now().add({ days: 1 }) },
    { label: 'In a week', value: () => now().add({ weeks: 1 }) },
    { label: 'In a month', value: () => now().add({ months: 1 }) },
  ];

  return (
    <div {...stylex.props(s.root)}>
      <DatePicker label="Publish on" presets={presets} />
    </div>
  );
}
```

### Keep open on select

With `shouldCloseOnSelect={false}` the popup stays open after a pick, so the range can be adjusted.

`src/ui/catalog/docs/date-picker/keep-open.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { DateRangePicker } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function DatePickerKeepOpen() {
  return (
    <div {...stylex.props(s.root)}>
      <DateRangePicker label="Billing period" shouldCloseOnSelect={false} />
    </div>
  );
}
```

### Sizes

The field follows the control scale. The calendar button is 32px from md up, centered in the shell (inset 4px at md); smaller fields shrink it to keep the 4px inset.

`src/ui/catalog/docs/date-picker/sizes.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { DatePicker } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-4'], width: 320, maxWidth: '100%' },
});

export default function DatePickerSizes() {
  return (
    <div {...stylex.props(s.root)}>
      <DatePicker size="sm" label="Small" />
      <DatePicker size="md" label="Medium" />
      <DatePicker size="lg" label="Large" />
    </div>
  );
}
```

### With description

Help text sits 8px under the field and is linked to it.

`src/ui/catalog/docs/date-picker/with-description.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { DatePicker } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function DatePickerWithDescription() {
  return (
    <div {...stylex.props(s.root)}>
      <DatePicker label="Invoice date" description="Invoices are sent at 09:00 on this day." />
    </div>
  );
}
```

### Invalid

`isInvalid` turns the edge red and `errorMessage` replaces the help text.

`src/ui/catalog/docs/date-picker/invalid.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { parseDate } from '@internationalized/date';
import { DatePicker } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function DatePickerInvalid() {
  return (
    <div {...stylex.props(s.root)}>
      <DatePicker
        label="Renewal date"
        defaultValue={parseDate('2026-03-02')}
        isInvalid
        errorMessage="Pick a date after the current term ends."
      />
    </div>
  );
}
```

### Disabled

`isDisabled` dims the label, the value and the calendar button.

`src/ui/catalog/docs/date-picker/disabled.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { parseDate } from '@internationalized/date';
import { DatePicker } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function DatePickerDisabled() {
  return (
    <div {...stylex.props(s.root)}>
      <DatePicker label="Archive date" isDisabled defaultValue={parseDate('2026-01-31')} />
    </div>
  );
}
```

### Read-only

`isReadOnly` keeps the value focusable and hides the calendar button.

`src/ui/catalog/docs/date-picker/read-only.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { parseDate } from '@internationalized/date';
import { DatePicker } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function DatePickerReadOnly() {
  return (
    <div {...stylex.props(s.root)}>
      <DatePicker label="Created on" isReadOnly defaultValue={parseDate('2025-09-08')} />
    </div>
  );
}
```

### Controlled

Pass `value` and `onChange` to keep the date in your own state.

`src/ui/catalog/docs/date-picker/controlled.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import type { CalendarDate } from '@internationalized/date';
import { DatePicker } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-3'], width: 320, maxWidth: '100%' },
  note: {
    margin: 0,
    color: tokens['--os-color-fg-muted'],
    fontSize: tokens['--os-font-size-caption'],
    lineHeight: tokens['--os-line-height-md'],
  },
});

export default function DatePickerControlled() {
  const [date, setDate] = useState<CalendarDate | null>(null);

  return (
    <div {...stylex.props(s.root)}>
      <DatePicker label="Kickoff" value={date} onChange={setDate} />
      <p {...stylex.props(s.note)}>{date ? `Kickoff is set for ${date.toString()}.` : 'No date yet.'}</p>
    </div>
  );
}
```

### Unavailable dates

`minValue` disables past days and `isDateUnavailable` blocks weekends in the calendar and in typed input.

`src/ui/catalog/docs/date-picker/unavailable.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { isWeekend } from '@internationalized/date';
import { DatePicker, useToday } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function DatePickerUnavailable() {
  const today = useToday();
  return (
    <div {...stylex.props(s.root)}>
      <DatePicker
        label="Installation day"
        description="Weekdays from today on."
        minValue={today ?? undefined}
        isDateUnavailable={date => isWeekend(date, 'en-US')}
      />
    </div>
  );
}
```

### With time

`granularity="minute"` adds hour, minute and period segments to the field.

`src/ui/catalog/docs/date-picker/with-time.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { parseDateTime } from '@internationalized/date';
import { DatePicker } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function DatePickerWithTime() {
  return (
    <div {...stylex.props(s.root)}>
      <DatePicker label="Send reminder" granularity="minute" defaultValue={parseDateTime('2026-12-01T09:30')} />
    </div>
  );
}
```

### In a form

With `name` the picker submits its value as an ISO date, and `isRequired` blocks an empty submit.

`src/ui/catalog/docs/date-picker/in-a-form.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState, type FormEvent } from 'react';
import { Button, DatePicker, Form, FormActions } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
  note: {
    margin: 0,
    color: tokens['--os-color-fg-muted'],
    fontSize: tokens['--os-font-size-caption'],
    lineHeight: tokens['--os-line-height-md'],
  },
});

export default function DatePickerInAForm() {
  const [saved, setSaved] = useState<string | null>(null);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(String(new FormData(event.currentTarget).get('deadline')));
  }

  return (
    <div {...stylex.props(s.root)}>
      <Form onSubmit={submit}>
        <DatePicker label="Deadline" name="deadline" isRequired />
        <FormActions>
          <Button type="submit">Save deadline</Button>
          {saved && <p {...stylex.props(s.note)}>Saved {saved}</p>}
        </FormActions>
      </Form>
    </div>
  );
}
```
