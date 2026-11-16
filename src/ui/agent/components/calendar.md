# Calendar

Select a date, a date range, or several dates from a month grid.

Category: Forms · Exports: `Calendar`, `useToday`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { Calendar } from '@/ui/components';

<Calendar aria-label="Delivery date" />
```

## Calendar

One or more month grids with previous and next buttons. Which React Aria calendar it renders depends on `mode`.

Extends: React Aria CalendarProps (RangeCalendarProps when mode is range)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `mode` | `'single' \| 'multiple' \| 'range'` | `'single'` | What a press selects. `value` is a `CalendarDate`, a `CalendarDate[]` or a `{ start, end }` range to match. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'small' \| 'medium' \| 'large'` | `'md'` | Day cell size: 32, 36 or 40 px. `small`, `medium` and `large` are legacy aliases. |
| `variant` | `'outline' \| 'plain'` | `'outline'` | `outline` draws a surface with a 1px hairline and 16px padding; `plain` leaves both to the container. |
| `navigation` | `'buttons' \| 'dropdown'` | `'buttons'` | `dropdown` replaces the month heading with month and year lists between the previous and next buttons. |
| `visibleMonths` | `number` | `1` | How many months show side by side. They wrap onto new rows when there is no room. |
| `errorMessage` | `ReactNode` |  | Shown under the grid while the calendar is invalid, and linked to it with `aria-describedby`. |
| `className` | `string` |  | Added to the root element after the calendar's own class. |
| `style` | `CSSProperties` |  | Inline styles for the root element. |
| `ref` | `Ref<HTMLDivElement>` |  | The root element. |

## useToday

Today's date, or null on the server and while hydrating. For "from today" props (`minValue`, `defaultValue`) in a server-rendered app such as Next.js, where reading the clock while a page renders fails the prerender. Calendar and DatePicker show a placeholder of their size until hydration, so they mount with the real date.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `timeZone` | `string` |  | The time zone to read today in. Default: the browser's. |

## Accessibility

- Renders a group with one `grid` per month. Give it an `aria-label`; the month heading is announced as it changes.
- Arrow keys move by day and week, Page Up and Page Down by month (with Shift, by year), Home and End to the first and last day of the month. Enter or Space selects.
- Disabled and unavailable days are announced as such and cannot be selected. Today carries an underline as well as its spoken label.
- The previous and next buttons carry localized labels, and the month and year dropdowns are listboxes with type-ahead.
- Under reduced motion the press scale is removed; color changes stay at 160 ms or less.

## Examples

### Default

`src/ui/catalog/docs/calendar/default.tsx`

```tsx
'use client';

import { parseDate } from '@internationalized/date';
import { Calendar } from '../../../components';

export default function CalendarDefault() {
  return <Calendar aria-label="Delivery date" defaultValue={parseDate('2026-03-02')} />;
}
```

### Date range

With `mode="range"` the first press sets the start and the second sets the end.

`src/ui/catalog/docs/calendar/range.tsx`

```tsx
'use client';

import { parseDate } from '@internationalized/date';
import { Calendar } from '../../../components';

export default function CalendarRange() {
  const start = parseDate('2026-03-02');

  return (
    <Calendar
      mode="range"
      aria-label="Trip dates"
      defaultValue={{ start, end: start.add({ days: 4 }) }}
    />
  );
}
```

### Multiple dates

With `mode="multiple"` each press adds or removes one date.

`src/ui/catalog/docs/calendar/multiple.tsx`

```tsx
'use client';

import { parseDate } from '@internationalized/date';
import { Calendar } from '../../../components';

export default function CalendarMultiple() {
  const first = parseDate('2026-03-02');

  return (
    <Calendar
      mode="multiple"
      aria-label="Review days"
      defaultValue={[first, first.add({ days: 2 }), first.add({ days: 7 })]}
    />
  );
}
```

### Month and year dropdowns

`navigation="dropdown"` puts month and year lists in the header, for dates far from today.

`src/ui/catalog/docs/calendar/dropdown.tsx`

```tsx
'use client';

import { parseDate } from '@internationalized/date';
import { Calendar } from '../../../components';

export default function CalendarDropdown() {
  return (
    <Calendar
      navigation="dropdown"
      aria-label="Contract start"
      defaultValue={parseDate('2019-04-15')}
    />
  );
}
```

### Two months

`visibleMonths` shows months side by side; they stack when the container is narrow.

`src/ui/catalog/docs/calendar/two-months.tsx`

```tsx
'use client';

import { parseDate } from '@internationalized/date';
import { Calendar } from '../../../components';

export default function CalendarTwoMonths() {
  const start = parseDate('2026-03-02');

  return (
    <Calendar
      mode="range"
      visibleMonths={2}
      aria-label="Campaign dates"
      defaultValue={{ start, end: start.add({ days: 10 }) }}
    />
  );
}
```

### Cell sizes

Day cells of 32, 36 (the default) or 40 px, on the row scale.

`src/ui/catalog/docs/calendar/cell-sizes.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { parseDate } from '@internationalized/date';
import { Calendar } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'center', gap: t['--os-space-6'] },
});

export default function CalendarCellSizes() {
  const date = parseDate('2026-03-02');

  return (
    <div {...stylex.props(s.row)}>
      <Calendar size="sm" aria-label="Small calendar" defaultValue={date} />
      <Calendar size="lg" aria-label="Large calendar" defaultValue={date} />
    </div>
  );
}
```

### Unavailable dates

Days before `minValue` are disabled, and `isDateUnavailable` strikes through the days that cannot be booked.

`src/ui/catalog/docs/calendar/unavailable.tsx`

```tsx
'use client';

import { isWeekend } from '@internationalized/date';
import { Calendar, useToday } from '../../../components';

export default function CalendarUnavailable() {
  const today = useToday();
  return (
    <Calendar
      aria-label="Installation day"
      minValue={today ?? undefined}
      isDateUnavailable={date => isWeekend(date, 'en-US')}
    />
  );
}
```

### Controlled

Pass `value` and `onChange` to keep the selected date in your own state.

`src/ui/catalog/docs/calendar/controlled.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { parseDate } from '@internationalized/date';
import { Calendar } from '../../../components';
import { tokens } from '../../../tokens.stylex';

// A calendar date has no time zone, so it's formatted from its fields in UTC: the same day on the server and in
// every browser. (date.toDate() would build a Date, which a prerendered Next.js page counts as reading the clock.)
const formatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeZone: 'UTC' });

const s = stylex.create({
  root: { display: 'grid', justifyItems: 'center', gap: tokens['--os-space-3'] },
  note: {
    margin: 0,
    color: tokens['--os-color-fg-muted'],
    fontSize: tokens['--os-font-size-caption'],
    lineHeight: tokens['--os-line-height-md'],
  },
});

export default function CalendarControlled() {
  const [date, setDate] = useState(() => parseDate('2026-03-02'));

  return (
    <div {...stylex.props(s.root)}>
      <Calendar aria-label="Meeting day" value={date} onChange={setDate} />
      <p {...stylex.props(s.note)}>Meeting on {formatter.format(Date.UTC(date.year, date.month - 1, date.day))}</p>
    </div>
  );
}
```

### Invalid

While `isInvalid` is set the selected day turns red and `errorMessage` shows under the grid.

`src/ui/catalog/docs/calendar/invalid.tsx`

```tsx
'use client';

import { useState } from 'react';
import { isWeekend, parseDate, startOfWeek } from '@internationalized/date';
import { Calendar } from '../../../components';

export default function CalendarInvalid() {
  const [date, setDate] = useState(() => startOfWeek(parseDate('2026-03-02'), 'en-US'));

  return (
    <Calendar
      aria-label="Delivery day"
      value={date}
      onChange={setDate}
      isInvalid={isWeekend(date, 'en-US')}
      errorMessage="Deliveries run on weekdays only."
    />
  );
}
```

### Disabled

`isDisabled` dims the heading, the weekdays and every day, and blocks navigation.

`src/ui/catalog/docs/calendar/disabled.tsx`

```tsx
import { Calendar } from '../../../components';

export default function CalendarDisabled() {
  return <Calendar isDisabled aria-label="Archive date" />;
}
```

### Read-only

`isReadOnly` keeps the selection visible and focusable but ignores presses.

`src/ui/catalog/docs/calendar/read-only.tsx`

```tsx
'use client';

import { parseDate } from '@internationalized/date';
import { Calendar } from '../../../components';

export default function CalendarReadOnly() {
  const start = parseDate('2026-03-02');

  return (
    <Calendar
      mode="range"
      isReadOnly
      aria-label="Booked dates"
      defaultValue={{ start, end: start.add({ days: 2 }) }}
    />
  );
}
```

### Inside a card

`variant="plain"` drops the calendar's own surface and hairline so it can sit inside another container.

`src/ui/catalog/docs/calendar/in-a-card.tsx`

```tsx
'use client';

import { parseDate } from '@internationalized/date';
import { Calendar, Card } from '../../../components';

export default function CalendarInACard() {
  return (
    <Card heading="Release day" description="Ships at 09:00 that day.">
      <Calendar variant="plain" aria-label="Release day" defaultValue={parseDate('2026-03-02').add({ days: 3 })} />
    </Card>
  );
}
```
