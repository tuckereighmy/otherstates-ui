import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Range from './range';
import rangeCode from './range.tsx?raw';
import Multiple from './multiple';
import multipleCode from './multiple.tsx?raw';
import Dropdown from './dropdown';
import dropdownCode from './dropdown.tsx?raw';
import TwoMonths from './two-months';
import twoMonthsCode from './two-months.tsx?raw';
import CellSizes from './cell-sizes';
import cellSizesCode from './cell-sizes.tsx?raw';
import Unavailable from './unavailable';
import unavailableCode from './unavailable.tsx?raw';
import Controlled from './controlled';
import controlledCode from './controlled.tsx?raw';
import Invalid from './invalid';
import invalidCode from './invalid.tsx?raw';
import Disabled from './disabled';
import disabledCode from './disabled.tsx?raw';
import ReadOnly from './read-only';
import readOnlyCode from './read-only.tsx?raw';
import InACard from './in-a-card';
import inACardCode from './in-a-card.tsx?raw';

export default defineDoc({
  id: 'calendar',
  title: 'Calendar',
  category: 'Forms',
  description: 'Select a date, a date range, or several dates from a month grid.',
  source: [
    'components/calendar.tsx',
    'components/Icon.tsx',
    'components/internal/class-name.ts',
    'components/internal/overlay.tsx',
    'components/internal/platform.ts',
    'components/internal/size.ts',
    'components/internal/states.ts',
    'tokens.stylex.ts',
  ],
  exports: ['Calendar', 'useToday'],
  usage: `import { Calendar } from '@/ui/components';

<Calendar aria-label="Delivery date" />`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode, minHeight: 400 },
    {
      id: 'range',
      title: 'Date range',
      description: 'With `mode="range"` the first press sets the start and the second sets the end.',
      Component: Range,
      code: rangeCode,
      minHeight: 400,
    },
    {
      id: 'multiple',
      title: 'Multiple dates',
      description: 'With `mode="multiple"` each press adds or removes one date.',
      Component: Multiple,
      code: multipleCode,
      minHeight: 400,
    },
    {
      id: 'dropdown',
      title: 'Month and year dropdowns',
      description: '`navigation="dropdown"` puts month and year lists in the header, for dates far from today.',
      Component: Dropdown,
      code: dropdownCode,
      minHeight: 440,
    },
    {
      id: 'two-months',
      title: 'Two months',
      description: '`visibleMonths` shows months side by side; they stack when the container is narrow.',
      Component: TwoMonths,
      code: twoMonthsCode,
      minHeight: 400,
    },
    {
      id: 'cell-sizes',
      title: 'Cell sizes',
      description: 'Day cells of 32, 36 (the default) or 40 px, on the row scale.',
      Component: CellSizes,
      code: cellSizesCode,
      minHeight: 440,
    },
    {
      id: 'unavailable',
      title: 'Unavailable dates',
      description: 'Days before `minValue` are disabled, and `isDateUnavailable` strikes through the days that cannot be booked.',
      Component: Unavailable,
      code: unavailableCode,
      minHeight: 400,
    },
    {
      id: 'controlled',
      title: 'Controlled',
      description: 'Pass `value` and `onChange` to keep the selected date in your own state.',
      Component: Controlled,
      code: controlledCode,
      minHeight: 440,
    },
    {
      id: 'invalid',
      title: 'Invalid',
      description: 'While `isInvalid` is set the selected day turns red and `errorMessage` shows under the grid.',
      Component: Invalid,
      code: invalidCode,
      minHeight: 440,
    },
    {
      id: 'disabled',
      title: 'Disabled',
      description: '`isDisabled` dims the heading, the weekdays and every day, and blocks navigation.',
      Component: Disabled,
      code: disabledCode,
      minHeight: 400,
    },
    {
      id: 'read-only',
      title: 'Read-only',
      description: '`isReadOnly` keeps the selection visible and focusable but ignores presses.',
      Component: ReadOnly,
      code: readOnlyCode,
      minHeight: 400,
    },
    {
      id: 'in-a-card',
      title: 'Inside a card',
      description: '`variant="plain"` drops the calendar\'s own surface and hairline so it can sit inside another container.',
      Component: InACard,
      code: inACardCode,
      minHeight: 480,
    },
  ],
  api: [
    {
      name: 'Calendar',
      description: 'One or more month grids with previous and next buttons. Which React Aria calendar it renders depends on `mode`.',
      extends: 'React Aria CalendarProps (RangeCalendarProps when mode is range)',
      props: [
        {
          name: 'mode',
          type: "'single' | 'multiple' | 'range'",
          default: "'single'",
          description: 'What a press selects. `value` is a `CalendarDate`, a `CalendarDate[]` or a `{ start, end }` range to match.',
        },
        {
          name: 'size',
          type: "'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large'",
          default: "'md'",
          description: 'Day cell size: 32, 36 or 40 px. `small`, `medium` and `large` are legacy aliases.',
        },
        {
          name: 'variant',
          type: "'outline' | 'plain'",
          default: "'outline'",
          description: '`outline` draws a surface with a 1px hairline and 16px padding; `plain` leaves both to the container.',
        },
        {
          name: 'navigation',
          type: "'buttons' | 'dropdown'",
          default: "'buttons'",
          description: '`dropdown` replaces the month heading with month and year lists between the previous and next buttons.',
        },
        {
          name: 'visibleMonths',
          type: 'number',
          default: '1',
          description: 'How many months show side by side. They wrap onto new rows when there is no room.',
        },
        {
          name: 'errorMessage',
          type: 'ReactNode',
          description: 'Shown under the grid while the calendar is invalid, and linked to it with `aria-describedby`.',
        },
        { name: 'className', type: 'string', description: 'Added to the root element after the calendar\'s own class.' },
        { name: 'style', type: 'CSSProperties', description: 'Inline styles for the root element.' },
        { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'The root element.' },
      ],
    },
    {
      name: 'useToday',
      description: 'Today\'s date, or null on the server and while hydrating. For "from today" props (`minValue`, `defaultValue`) in a server-rendered app such as Next.js, where reading the clock while a page renders fails the prerender. Calendar and DatePicker show a placeholder of their size until hydration, so they mount with the real date.',
      props: [
        { name: 'timeZone', type: 'string', description: 'The time zone to read today in. Default: the browser\'s.' },
      ],
    },
  ],
  accessibility: [
    'Renders a group with one `grid` per month. Give it an `aria-label`; the month heading is announced as it changes.',
    'Arrow keys move by day and week, Page Up and Page Down by month (with Shift, by year), Home and End to the first and last day of the month. Enter or Space selects.',
    'Disabled and unavailable days are announced as such and cannot be selected. Today carries an underline as well as its spoken label.',
    'The previous and next buttons carry localized labels, and the month and year dropdowns are listboxes with type-ahead.',
    'Under reduced motion the press scale is removed; color changes stay at 160 ms or less.',
  ],
});
