'use client';

import * as stylex from '@stylexjs/stylex';
import { getLocalTimeZone, parseDate, today, type CalendarDate } from '@internationalized/date';
import { useMemo, useSyncExternalStore, type CSSProperties, type ReactNode, type Ref } from 'react';
import {
  Button as AriaButton, Calendar as AriaCalendar, CalendarCell, CalendarGrid, CalendarGridBody, CalendarGridHeader,
  CalendarHeaderCell, CalendarHeading, CalendarMonthPicker, CalendarYearPicker, ListBox, ListBoxItem, Popover,
  RangeCalendar, Select, SelectValue, Text,
  type CalendarCellRenderProps, type CalendarProps as AriaCalendarProps, type Key,
  type RangeCalendarProps as AriaRangeCalendarProps,
} from 'react-aria-components';
import { tokens as t } from '../tokens.stylex';
import { Icon } from './Icon';
import { withClassName } from './internal/class-name';
import { overlayItemStyles, overlayStyles, popupPlacement } from './internal/overlay';
import { useHydrated } from './internal/platform';
import { disabledStyles, focusStyles, hoverStyles, invalidStyles, pressStyles, transitionStyles } from './internal/states';
import { rectIconPaddingEndStyles, rectPaddingStyles } from './internal/size';

// Calendar (DESIGN_SPEC 2.2 Calendar, 1.2 row scale, 1.8 states). Day cells 36 x 36 with the control
// radius, a 2px row gap (border-spacing) and no column gap, so a range reads as one band. Navigation is
// size sm (32 x 32) with chevron-left / chevron-right; weekdays 12/16 500 fg-muted in a 32px header row
// (the compact table header, spec 1.12); days 13/18 tabular; the month 14/20 500. A standalone
// calendar wears the opt-in outline (spec 1.5, item 4); `plain` drops the surface so DatePicker can
// place the same calendar inside its popup.

const coarse = '@media (pointer: coarse)';

const s = stylex.create({
  root: {
    display: 'grid', gap: t['--os-space-2'], width: 'fit-content', maxWidth: '100%', minWidth: 0,
    color: t['--os-color-fg-base'], fontFamily: t['--os-font-family'], letterSpacing: t['--os-tracking-tight'],
  },
  outline: {
    padding: t['--os-space-4'], borderWidth: 1, borderStyle: 'solid', borderColor: t['--os-color-border-subtle'],
    borderRadius: t['--os-radius-lg'], backgroundColor: t['--os-color-bg-surface'],
  },
  months: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: t['--os-space-6'], rowGap: t['--os-space-4'], minWidth: 0 },
  month: { display: 'grid', gap: t['--os-space-2'], alignContent: 'start', minWidth: 0 },
  header: { display: 'grid', gridTemplateColumns: `${t['--os-size-sm']} minmax(0, 1fr) ${t['--os-size-sm']}`, alignItems: 'center', minWidth: 0 },
  heading: {
    margin: 0, minWidth: 0, overflow: 'hidden', textAlign: 'center', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
    color: t['--os-color-fg-base'], fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'],
    fontWeight: t['--os-font-weight-medium'], letterSpacing: t['--os-tracking-tight'],
  },
  muted: { color: t['--os-color-fg-disabled'] },
  nav: {
    position: 'relative', display: 'inline-grid', placeItems: 'center', width: 32, height: 32, padding: 0,
    borderRadius: t['--os-radius-control'], color: t['--os-color-fg-muted'], backgroundColor: 'transparent',
    cursor: 'pointer', outlineStyle: 'none',
    '::after': {
      content: '""', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      width: { default: '100%', [coarse]: 'max(100%, 44px)' }, height: { default: '100%', [coarse]: 'max(100%, 44px)' },
    },
  },
  // 2px between rows; the negative margin cancels the spacing above the first row and below the last.
  table: {
    width: '100%', tableLayout: 'fixed', borderCollapse: 'separate', borderSpacing: `0 ${t['--os-space-0-5']}`,
    marginBlock: `calc(-1 * ${t['--os-space-0-5']})`,
  },
  weekday: {
    height: t['--os-size-sm'], padding: 0, textAlign: 'center', verticalAlign: 'middle', color: t['--os-color-fg-muted'],
    fontSize: t['--os-font-size-xs'], lineHeight: t['--os-line-height-xs'], fontWeight: t['--os-font-weight-medium'], letterSpacing: 0,
  },
  day: {
    position: 'relative', display: 'grid', placeItems: 'center', borderRadius: t['--os-radius-control'],
    color: t['--os-color-fg-base'], backgroundColor: 'transparent', fontWeight: t['--os-font-weight-regular'],
    fontVariantNumeric: 'tabular-nums', letterSpacing: t['--os-tracking-tight'], textAlign: 'center',
    cursor: 'pointer', outlineStyle: 'none', userSelect: 'none', WebkitTapHighlightColor: 'transparent',
  },
  outside: { color: t['--os-color-fg-muted'] },
  hidden: { visibility: 'hidden' },
  today: { textDecorationLine: 'underline', textUnderlineOffset: 3 },
  selected: { backgroundColor: t['--os-color-accent-moderate'], color: t['--os-color-accent-on-accent'] },
  selectedHover: { backgroundColor: t['--os-color-accent-bold'] },
  selectedPressed: { backgroundColor: t['--os-color-accent-strong'] },
  rangeMiddle: { borderRadius: 0, backgroundColor: t['--os-color-accent-subtle'], color: t['--os-color-accent-bold'] },
  rangeMiddleHover: { backgroundColor: t['--os-color-accent-muted'] },
  rangeMiddlePressed: { backgroundColor: t['--os-color-accent-dim'] },
  rangeStart: { borderStartEndRadius: 0, borderEndEndRadius: 0 },
  rangeEnd: { borderStartStartRadius: 0, borderEndStartRadius: 0 },
  invalid: { backgroundColor: t['--os-color-bg-danger-secondary'], color: t['--os-color-fg-static-light'] },
  invalidHover: { backgroundColor: t['--os-color-bg-danger-tertiary'] },
  invalidMiddle: { backgroundColor: t['--os-color-bg-error'], color: t['--os-color-fg-error'] },
  unavailable: { color: t['--os-color-fg-muted'], textDecorationLine: 'line-through', cursor: 'default' },
  selectedDisabled: { backgroundColor: t['--os-color-bg-disabled'], color: t['--os-color-fg-disabled'] },
  error: { width: 0, minWidth: '100%' },
  // Two ghost tools side by side in the header: 2 apart, like tools in a toolbar.
  pickers: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: t['--os-space-0-5'], minWidth: 0 },
  // A size sm (32) ghost control: rect padding 10 with the chevron side 8 (the shared sm rect and icon-side maps),
  // gap 6 (spec 1.2). The month text keeps the heading's 14/20 500 so switching `navigation` does not change it.
  pickerTrigger: {
    position: 'relative', display: 'inline-flex', alignItems: 'center', gap: t['--os-space-1-5'], height: t['--os-size-sm'], minWidth: 0,
    borderRadius: t['--os-radius-control'],
    color: t['--os-color-fg-base'], backgroundColor: 'transparent', fontSize: t['--os-font-size-sm'],
    lineHeight: t['--os-line-height-md'], fontWeight: t['--os-font-weight-medium'], letterSpacing: t['--os-tracking-tight'],
    whiteSpace: 'nowrap', cursor: 'pointer', outlineStyle: 'none',
    '::after': {
      content: '""', position: 'absolute', top: '50%', left: 0, width: '100%', transform: 'translateY(-50%)',
      height: { default: '100%', [coarse]: 'max(100%, 44px)' },
    },
  },
  pickerIcon: { display: 'inline-flex', flexShrink: 0, color: t['--os-color-fg-muted'] },
  pickerIconActive: { color: t['--os-color-fg-base'] },
  pickerPopover: { minWidth: 'var(--trigger-width)', overflow: 'hidden' },
  pickerList: { maxHeight: 'min(320px, var(--available-height, 320px))', overflowY: 'auto', boxSizing: 'border-box' },
  check: { display: 'inline-flex', marginInlineStart: 'auto', flexShrink: 0, color: t['--os-color-fg-base'] },
});

/** Cell sizes on the row scale (spec 1.2): sm 32, md 36 (default), lg 40. */
// Days are square and shrink with the column on narrow screens (seven columns must fit a 320 px viewport),
// up to their size: sm 32, md 36, lg 40. The month is never wider than seven full-size days.
const cellSizes = stylex.create({
  sm: { width: '100%', maxWidth: 32, aspectRatio: '1 / 1', marginInline: 'auto', fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-sm'] },
  md: { width: '100%', maxWidth: 36, aspectRatio: '1 / 1', marginInline: 'auto', fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-sm'] },
  lg: { width: '100%', maxWidth: 40, aspectRatio: '1 / 1', marginInline: 'auto', fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'] },
});

export type CalendarCellSize = 'sm' | 'md' | 'lg';
/** `small`, `medium` and `large` are the legacy names of `sm`, `md` and `lg`. */
export type CalendarSize = CalendarCellSize | 'small' | 'medium' | 'large';

const monthSizes = stylex.create({
  sm: { width: 224, maxWidth: '100%' },
  md: { width: 252, maxWidth: '100%' },
  lg: { width: 280, maxWidth: '100%' },
});

// Before hydration a month is an empty box its own size: the header row, 8 apart from the grid, then the
// weekday row and six weeks of cells, 2 apart (the grid's row gap).
const pendingHeights = stylex.create({
  sm: { height: `calc(${t['--os-size-sm']} * 2 + ${t['--os-space-2']} + 32px * 6 + 14px)` },
  md: { height: `calc(${t['--os-size-sm']} * 2 + ${t['--os-space-2']} + 36px * 6 + 14px)` },
  lg: { height: `calc(${t['--os-size-sm']} * 2 + ${t['--os-space-2']} + 40px * 6 + 14px)` },
});

const legacyCellSizes = { small: 'sm', medium: 'md', large: 'lg' } as const;
function cellSize(size: CalendarSize | undefined): CalendarCellSize {
  if (!size) return 'md';
  return size in legacyCellSizes ? legacyCellSizes[size as keyof typeof legacyCellSizes] : size as CalendarCellSize;
}

type CalendarOwnProps = {
  /** Day cell size: sm 32, md 36, lg 40. */
  size?: CalendarSize;
  /** `outline` draws the calendar's own surface and hairline; `plain` leaves it to the container. */
  variant?: 'outline' | 'plain';
  /** `dropdown` adds month and year lists to the header, between the previous and next buttons. */
  navigation?: 'buttons' | 'dropdown';
  /** How many months show side by side. They wrap on narrow screens. */
  visibleMonths?: number;
  /** Shown under the grid while the value is invalid. */
  errorMessage?: ReactNode;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLDivElement>;
};

type Replaced = 'children' | 'className' | 'style' | 'visibleDuration';

export type CalendarProps =
  | (Omit<AriaCalendarProps<CalendarDate>, Replaced | 'selectionMode'> & CalendarOwnProps & { mode?: 'single' })
  | (Omit<AriaCalendarProps<CalendarDate, 'multiple'>, Replaced | 'selectionMode'> & CalendarOwnProps & { mode: 'multiple' })
  | (Omit<AriaRangeCalendarProps<CalendarDate>, Replaced> & CalendarOwnProps & { mode: 'range' });

type BodyState = { isDisabled: boolean; isInvalid: boolean; isReadOnly: boolean };
type BodyProps = BodyState & {
  range: boolean;
  size: CalendarCellSize;
  months: number;
  navigation: 'buttons' | 'dropdown';
  errorMessage?: ReactNode;
};

function NavButton({ slot }: { slot: 'previous' | 'next' }) {
  return <AriaButton slot={slot} className={({ isHovered, isPressed, isFocusVisible, isDisabled }) => stylex.props(
    s.nav, transitionStyles.colorsAndPress,
    isHovered && hoverStyles.fillActive, isHovered && hoverStyles.textActive,
    isPressed && pressStyles.fill, isPressed && pressStyles.scale,
    isDisabled && disabledStyles.text, isFocusVisible && focusStyles.ring,
  ).className ?? ''}>
    <Icon name={slot === 'previous' ? 'chevron-left' : 'chevron-right'} size={16} />
  </AriaButton>;
}

type PickerProps = {
  'aria-label': string;
  value: Key;
  onChange: (key: Key | null) => void;
  items: { id: number; formatted: string }[];
  isDisabled: boolean;
};

function Picker({ 'aria-label': label, value, onChange, items, isDisabled }: PickerProps) {
  return <Select aria-label={label} value={value} onChange={key => onChange(key as Key | null)} isDisabled={isDisabled}>
    <AriaButton className={({ isHovered, isPressed, isFocusVisible, isDisabled }) => stylex.props(
      s.pickerTrigger, rectPaddingStyles.sm, rectIconPaddingEndStyles.sm, transitionStyles.colorsAndPress,
      isHovered && hoverStyles.fillActive, isPressed && pressStyles.fill, isPressed && pressStyles.scale,
      isDisabled && disabledStyles.text, isFocusVisible && focusStyles.ring,
    ).className ?? ''}>
      {({ isHovered, isDisabled }) => <>
        <SelectValue />
        <span {...stylex.props(s.pickerIcon, isHovered && s.pickerIconActive, isDisabled && s.muted)}><Icon name="chevron-down" size={16} /></span>
      </>}
    </AriaButton>
    <Popover offset={6} className={({ isExiting, placement }) => stylex.props(
      overlayStyles.surface, overlayStyles.popup, overlayStyles.popupMotion, popupPlacement(placement), s.pickerPopover,
      isExiting && overlayStyles.exit,
    ).className ?? ''}>
      <ListBox items={items} {...stylex.props(overlayItemStyles.list, s.pickerList)}>
        {item => <ListBoxItem id={item.id} textValue={item.formatted} className={({ isFocused, isHovered, isPressed, isSelected, isDisabled }) => stylex.props(
          overlayItemStyles.item, (isFocused || isHovered) && overlayItemStyles.active, isPressed && overlayItemStyles.pressed,
          isSelected && overlayItemStyles.selected, isDisabled && overlayItemStyles.disabled,
        ).className ?? ''}>
          {({ isSelected }) => <>
            {item.formatted}
            {isSelected && <span {...stylex.props(s.check)}><Icon name="check" size={16} /></span>}
          </>}
        </ListBoxItem>}
      </ListBox>
    </Popover>
  </Select>;
}

function MonthYearPickers({ isDisabled, short }: { isDisabled: boolean; short: boolean }) {
  return <div {...stylex.props(s.pickers)}>
    <CalendarMonthPicker format={short ? 'short' : 'long'}>{picker => <Picker {...picker} isDisabled={isDisabled} />}</CalendarMonthPicker>
    <CalendarYearPicker>{picker => <Picker {...picker} isDisabled={isDisabled} />}</CalendarYearPicker>
  </div>;
}

function CalendarBody({ range, size, months, navigation, isDisabled, isInvalid, isReadOnly, errorMessage }: BodyProps) {
  const dayClass = ({ isSelected, isSelectionStart, isSelectionEnd, isToday, isOutsideMonth, isDisabled: off, isUnavailable, isHovered, isPressed, isFocusVisible, isInvalid: wrong }: CalendarCellRenderProps) => {
    const active = !off && !isUnavailable && !isReadOnly;
    const middle = range && isSelected && !isSelectionStart && !isSelectionEnd;
    const edge = isSelected && !middle;
    return stylex.props(
      s.day, cellSizes[size], transitionStyles.colorsAndPress,
      isOutsideMonth && (months > 1 ? s.hidden : s.outside), isToday && s.today,
      active && isHovered && !isSelected && hoverStyles.fillActive,
      active && isPressed && !isSelected && pressStyles.fill,
      edge && s.selected, edge && active && isHovered && s.selectedHover, edge && active && isPressed && s.selectedPressed,
      middle && s.rangeMiddle, middle && active && isHovered && s.rangeMiddleHover, middle && active && isPressed && s.rangeMiddlePressed,
      range && isSelected && isSelectionStart && !isSelectionEnd && s.rangeStart,
      range && isSelected && isSelectionEnd && !isSelectionStart && s.rangeEnd,
      wrong && isSelected && (middle ? s.invalidMiddle : s.invalid), wrong && edge && active && isHovered && s.invalidHover,
      active && isPressed && pressStyles.scale,
      isUnavailable && s.unavailable,
      off && disabledStyles.text, off && isSelected && s.selectedDisabled,
      isFocusVisible && focusStyles.ring,
    ).className ?? '';
  };

  return <>
    <div {...stylex.props(s.months)}>
      {Array.from({ length: months }, (_, index) => <div key={index} {...stylex.props(s.month, monthSizes[size])}>
        <header {...stylex.props(s.header)}>
          {index === 0 ? <NavButton slot="previous" /> : <span />}
          {navigation === 'dropdown' && index === 0
            ? <MonthYearPickers isDisabled={isDisabled} short={size === 'sm'} />
            : <CalendarHeading offset={{ months: index }} {...stylex.props(s.heading, isDisabled && s.muted)} />}
          {index === months - 1 ? <NavButton slot="next" /> : <span />}
        </header>
        <CalendarGrid offset={{ months: index }} weekdayStyle="short" {...stylex.props(s.table)}>
          <CalendarGridHeader>{day => <CalendarHeaderCell {...stylex.props(s.weekday, isDisabled && s.muted)}>{day}</CalendarHeaderCell>}</CalendarGridHeader>
          <CalendarGridBody>{date => <CalendarCell date={date} className={dayClass} />}</CalendarGridBody>
        </CalendarGrid>
      </div>)}
    </div>
    {isInvalid && errorMessage != null && <Text slot="errorMessage" {...stylex.props(invalidStyles.message, s.error)}>{errorMessage}</Text>}
  </>;
}

const never = () => () => {};

/**
 * Today's date in the browser's time zone (or `timeZone`), or null on the server and while hydrating. Use it for
 * "from today" props (minValue, defaultValue) in a server-rendered app, where reading the clock as a page renders
 * fails the prerender (Next.js Cache Components) or bakes in the day it was built. Calendar and DatePicker wait
 * for hydration as well, so they mount with the real date.
 */
export function useToday(timeZone?: string): CalendarDate | null {
  const day = useSyncExternalStore(never, () => today(timeZone ?? getLocalTimeZone()).toString(), () => null);
  return useMemo(() => (day ? parseDate(day) : null), [day]);
}

/**
 * A month grid for picking one date, several dates (`mode="multiple"`) or a range (`mode="range"`).
 * Arrow keys move between days, Page Up and Page Down change the month, Enter or Space selects.
 */
export function Calendar(props: CalendarProps) {
  const months = Math.max(1, Math.floor(props.visibleMonths ?? 1));
  const duration = useMemo(() => ({ months }), [months]);
  const size = cellSize(props.size);
  const navigation = props.navigation ?? 'buttons';
  const rootClass = withClassName(stylex.props(s.root, (props.variant ?? 'outline') === 'outline' && s.outline), props.className);
  const body = (range: boolean, state: BodyState) =>
    <CalendarBody range={range} size={size} months={months} navigation={navigation} errorMessage={props.errorMessage} {...state} />;

  // React Aria reads today's date as it renders, so the grid waits for the browser (see useHydrated).
  const hydrated = useHydrated();
  if (!hydrated) {
    return <div aria-busy="true" className={rootClass} style={props.style} ref={props.ref}>
      <div {...stylex.props(s.months)}>
        {Array.from({ length: months }, (_, index) => <div key={index} {...stylex.props(s.month, monthSizes[size], pendingHeights[size])} />)}
      </div>
    </div>;
  }

  if (props.mode === 'range') {
    const { mode, size: _size, variant, navigation: _navigation, visibleMonths, errorMessage, className, ...rangeProps } = props;
    return <RangeCalendar<CalendarDate> {...rangeProps} visibleDuration={duration} className={rootClass}>
      {({ isDisabled, isInvalid, state }) => body(true, { isDisabled, isInvalid, isReadOnly: state.isReadOnly })}
    </RangeCalendar>;
  }

  if (props.mode === 'multiple') {
    const { mode, size: _size, variant, navigation: _navigation, visibleMonths, errorMessage, className, ...multipleProps } = props;
    return <AriaCalendar<CalendarDate, 'multiple'> {...multipleProps} selectionMode="multiple" visibleDuration={duration} className={rootClass}>
      {({ isDisabled, isInvalid, state }) => body(false, { isDisabled, isInvalid, isReadOnly: state.isReadOnly })}
    </AriaCalendar>;
  }

  const { mode, size: _size, variant, navigation: _navigation, visibleMonths, errorMessage, className, ...singleProps } = props;
  return <AriaCalendar<CalendarDate> {...singleProps} visibleDuration={duration} className={rootClass}>
    {({ isDisabled, isInvalid, state }) => body(false, { isDisabled, isInvalid, isReadOnly: state.isReadOnly })}
  </AriaCalendar>;
}
