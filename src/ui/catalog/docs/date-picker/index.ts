import { defineDoc, type DocProp } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Range from './range';
import rangeCode from './range.tsx?raw';
import Dropdown from './dropdown';
import dropdownCode from './dropdown.tsx?raw';
import Presets from './presets';
import presetsCode from './presets.tsx?raw';
import KeepOpen from './keep-open';
import keepOpenCode from './keep-open.tsx?raw';
import Sizes from './sizes';
import sizesCode from './sizes.tsx?raw';
import WithDescription from './with-description';
import withDescriptionCode from './with-description.tsx?raw';
import Invalid from './invalid';
import invalidCode from './invalid.tsx?raw';
import Disabled from './disabled';
import disabledCode from './disabled.tsx?raw';
import ReadOnly from './read-only';
import readOnlyCode from './read-only.tsx?raw';
import Controlled from './controlled';
import controlledCode from './controlled.tsx?raw';
import Unavailable from './unavailable';
import unavailableCode from './unavailable.tsx?raw';
import WithTime from './with-time';
import withTimeCode from './with-time.tsx?raw';
import InAForm from './in-a-form';
import inAFormCode from './in-a-form.tsx?raw';

const shared: DocProp[] = [
  { name: 'label', type: 'ReactNode', description: 'The visible label. Without it, give the picker an `aria-label` or place it in a `Field`.' },
  { name: 'description', type: 'ReactNode', description: 'Help text under the field. The error message replaces it while the field is invalid.' },
  {
    name: 'errorMessage',
    type: 'ReactNode | ((validation: ValidationResult) => ReactNode)',
    description: 'Shown under the field while it is invalid. A function receives the validation result.',
  },
  {
    name: 'size',
    type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'small' | 'medium' | 'large'",
    default: "'md'",
    description: 'Field height: 24, 32, 40, 44 or 48 px. `small`, `medium` and `large` are legacy aliases.',
  },
  {
    name: 'navigation',
    type: "'buttons' | 'dropdown'",
    default: "'buttons'",
    description: '`dropdown` adds month and year lists to the calendar header.',
  },
  { name: 'visibleMonths', type: 'number', default: '1', description: 'How many months the popup calendar shows side by side.' },
  { name: 'className', type: 'string', description: 'Added to the root element after the field\'s own class.' },
  { name: 'style', type: 'CSSProperties', description: 'Inline styles for the root element.' },
  { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'The root element.' },
  { name: 'disabled', type: 'boolean', description: 'Deprecated alias of `isDisabled`.' },
];

export default defineDoc({
  id: 'date-picker',
  title: 'Date Picker',
  category: 'Forms',
  description: 'Type a date or choose it from a calendar popup.',
  source: [
    'components/date-picker.tsx',
    'components/calendar.tsx',
    'components/Icon.tsx',
    'components/internal/class-name.ts',
    'components/internal/control.ts',
    'components/internal/field-styles.ts',
    'components/internal/overlay.tsx',
    'components/internal/platform.ts',
    'components/internal/size.ts',
    'components/internal/states.ts',
    'tokens.stylex.ts',
  ],
  exports: ['DatePicker', 'DateRangePicker'],
  usage: `import { DatePicker } from '@/ui/components';

<DatePicker label="Due date" />`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode, minHeight: 440 },
    {
      id: 'range',
      title: 'Date range picker',
      description: '`DateRangePicker` puts a start and an end date in one field, with a range calendar in the popup.',
      Component: Range,
      code: rangeCode,
      minHeight: 440,
    },
    {
      id: 'dropdown',
      title: 'With dropdown navigation',
      description: '`navigation="dropdown"` adds month and year lists to the calendar, for dates far from today.',
      Component: Dropdown,
      code: dropdownCode,
      minHeight: 440,
    },
    {
      id: 'presets',
      title: 'With presets',
      description: '`presets` lists shortcuts beside the calendar; picking one sets the value and closes the popup.',
      Component: Presets,
      code: presetsCode,
      minHeight: 440,
    },
    {
      id: 'keep-open',
      title: 'Keep open on select',
      description: 'With `shouldCloseOnSelect={false}` the popup stays open after a pick, so the range can be adjusted.',
      Component: KeepOpen,
      code: keepOpenCode,
      minHeight: 440,
    },
    {
      id: 'sizes',
      title: 'Sizes',
      description: 'The field follows the control scale. The calendar button is 32px from md up, centered in the shell (inset 4px at md); smaller fields shrink it to keep the 4px inset.',
      Component: Sizes,
      code: sizesCode,
      minHeight: 360,
    },
    {
      id: 'with-description',
      title: 'With description',
      description: 'Help text sits 8px under the field and is linked to it.',
      Component: WithDescription,
      code: withDescriptionCode,
    },
    {
      id: 'invalid',
      title: 'Invalid',
      description: '`isInvalid` turns the edge red and `errorMessage` replaces the help text.',
      Component: Invalid,
      code: invalidCode,
    },
    {
      id: 'disabled',
      title: 'Disabled',
      description: '`isDisabled` dims the label, the value and the calendar button.',
      Component: Disabled,
      code: disabledCode,
    },
    {
      id: 'read-only',
      title: 'Read-only',
      description: '`isReadOnly` keeps the value focusable and hides the calendar button.',
      Component: ReadOnly,
      code: readOnlyCode,
    },
    {
      id: 'controlled',
      title: 'Controlled',
      description: 'Pass `value` and `onChange` to keep the date in your own state.',
      Component: Controlled,
      code: controlledCode,
      minHeight: 460,
    },
    {
      id: 'unavailable',
      title: 'Unavailable dates',
      description: '`minValue` disables past days and `isDateUnavailable` blocks weekends in the calendar and in typed input.',
      Component: Unavailable,
      code: unavailableCode,
      minHeight: 460,
    },
    {
      id: 'with-time',
      title: 'With time',
      description: '`granularity="minute"` adds hour, minute and period segments to the field.',
      Component: WithTime,
      code: withTimeCode,
      minHeight: 440,
    },
    {
      id: 'in-a-form',
      title: 'In a form',
      description: 'With `name` the picker submits its value as an ISO date, and `isRequired` blocks an empty submit.',
      Component: InAForm,
      code: inAFormCode,
      minHeight: 480,
    },
  ],
  api: [
    {
      name: 'DatePicker',
      description: 'A labeled date field with a calendar button that opens a Calendar in a popup. Controlled with `value` or uncontrolled with `defaultValue`.',
      extends: 'React Aria DatePickerProps',
      props: [
        ...shared,
        { name: 'presets', type: '{ label: string; value: T | (() => T) }[]', description: 'Shortcuts listed beside the calendar. Picking one sets the value. A function value is read when picked, so relative presets ("Today") stay current and nothing reads the clock while the page renders.' },
      ],
    },
    {
      name: 'DateRangePicker',
      description: 'A start and an end date in one field, with a range calendar in the popup.',
      extends: 'React Aria DateRangePickerProps',
      props: [
        ...shared,
        { name: 'presets', type: '{ label: string; value: RangeValue<T> | (() => RangeValue<T>) }[]', description: 'Shortcuts listed beside the calendar. Picking one sets the range. A function value is read when picked.' },
      ],
    },
  ],
  accessibility: [
    'Each date part is a spin button: type digits, or use the Up and Down arrows; Left and Right move between parts.',
    'The calendar button and Alt + Down open the popup, which moves focus into the calendar; Escape closes it and returns focus to the field.',
    'The `label` names the field group and the popup dialog. Without a visible label, set `aria-label` or place the picker in a `Field`.',
    'The description and the error message are linked with `aria-describedby`; `isRequired` sets `aria-required` and adds " *" to the label.',
    'Read-only fields keep their value focusable and set `aria-readonly`. Under reduced motion the popup fades without moving.',
  ],
});
