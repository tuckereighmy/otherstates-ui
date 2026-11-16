'use client';

import * as stylex from '@stylexjs/stylex';
import type { CalendarDate } from '@internationalized/date';
import { useContext, type CSSProperties, type ReactNode, type Ref } from 'react';
import {
  Button as AriaButton, DateInput, DatePicker as AriaDatePicker, DatePickerStateContext,
  DateRangePicker as AriaDateRangePicker, DateRangePickerStateContext, DateSegment, Dialog, FieldError, Group, Label,
  Popover, Text,
  type DatePickerProps as AriaDatePickerProps, type DateRangePickerProps as AriaDateRangePickerProps, type DateValue,
  type RangeValue, type ValidationResult,
} from 'react-aria-components';
import { tokens as t } from '../tokens.stylex';
import { Calendar } from './calendar';
import { Icon } from './Icon';
import { withClassName } from './internal/class-name';
import { controlStyles, FieldContext, fieldButtonSizeStyles } from './internal/control';
import { fieldShellSizeStyles, fieldStyles } from './internal/field-styles';
import { overlayItemStyles, overlayStyles, popupPlacement } from './internal/overlay';
import { useHydrated } from './internal/platform';
import { normalizeSize, radiusStyles, sizeScale, type ControlSize, type ControlSizeProp } from './internal/size';
import { disabledStyles, focusStyles, pressStyles, readOnlyStyles } from './internal/states';

// DatePicker and DateRangePicker (DESIGN_SPEC 2.2 DatePicker, 1.2, 1.8, 1.9). A bordered text-entry
// shell (md 40 by default) holds the date segments and a calendar button: size sm 32 x 32, centered
// (inset 4 at md), radius max(sm, control - 4), Icon `calendar`. The popup is the spec 1.9 surface with anchored motion, and it holds
// the library's Calendar (`variant="plain"`), so there is one calendar implementation.

const canHover = '@media (hover: hover)';
const coarse = '@media (pointer: coarse)';

const s = stylex.create({
  root: { width: '100%' },
  shell: { paddingInlineEnd: 0, gap: 0, cursor: 'text' },
  // The segments pull back by their own 2px padding, so the first digit starts at the field inset.
  input: {
    display: 'flex', alignItems: 'center', flexGrow: 1, flexShrink: 1, minWidth: 0, marginInlineStart: `calc(-1 * ${t['--os-space-0-5']})`,
    whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums',
  },
  rangeInputs: { display: 'flex', alignItems: 'center', flexGrow: 1, minWidth: 0, marginInlineStart: `calc(-1 * ${t['--os-space-0-5']})` },
  rangeInput: { flexGrow: 0, marginInlineStart: 0 },
  dash: { paddingInline: t['--os-space-1'], color: t['--os-color-fg-muted'] },
  dashDisabled: { color: t['--os-color-fg-disabled'] },
  segment: { paddingInline: t['--os-space-0-5'], borderRadius: t['--os-radius-xs'], outlineStyle: 'none', fontVariantNumeric: 'tabular-nums' },
  /** Spaces and the comma before a time sit tight; the date separators keep their 2px. */
  literalTight: { paddingInline: 0 },
  placeholder: { color: t['--os-color-fg-muted'] },
  segmentFocus: { backgroundColor: t['--os-color-accent-subtle'], color: t['--os-color-accent-bold'] },
  segmentDisabled: { color: t['--os-color-fg-disabled'] },
  button: {
    position: 'relative', outlineStyle: 'none',
    color: {
      default: t['--os-color-fg-muted'],
      ':hover': { default: null, [canHover]: t['--os-color-fg-base'] },
      ':disabled': t['--os-color-fg-disabled'],
    },
    '::after': {
      content: '""', position: 'absolute', top: '50%', left: 0, width: '100%', transform: 'translateY(-50%)',
      height: { default: '100%', [coarse]: 'max(100%, 44px)' },
    },
  },
  // A content popup (spec 1.9): padding 16, 16 between the presets and the calendar.
  popup: { padding: t['--os-space-4'], overflowY: 'auto', overscrollBehavior: 'contain' },
  dialog: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: t['--os-space-4'], outlineStyle: 'none' },
  // Presets are list items: they bleed back to a list popup's 6px padding, so their text sits 16px in (16 - 10 item padding).
  presets: {
    display: 'grid', alignContent: 'start', gap: t['--os-space-0-5'], flexGrow: 1, flexShrink: 1, flexBasis: 128, minWidth: 128,
    marginInlineStart: `calc(${t['--os-space-1-5']} - ${t['--os-space-4']})`,
  },
  preset: { width: '100%', textAlign: 'start', backgroundColor: 'transparent', cursor: 'pointer' },
});

type PickerOwnProps = {
  /** Names the field. Without it, give the picker an `aria-label`. */
  label?: ReactNode;
  /** Help text under the field. The error message replaces it while the value is invalid. */
  description?: ReactNode;
  /** Shown under the field while it is invalid. A function receives the validation result. */
  errorMessage?: ReactNode | ((validation: ValidationResult) => ReactNode);
  /** Field height: xs 24, sm 32, md 40, lg 44, xl 48. */
  size?: ControlSizeProp;
  /** `dropdown` adds month and year lists to the calendar header. */
  navigation?: 'buttons' | 'dropdown';
  /** How many months the popup calendar shows side by side. */
  visibleMonths?: number;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLDivElement>;
  /** @deprecated Use `isDisabled`. */
  disabled?: boolean;
};

export type DatePreset<T extends DateValue = CalendarDate> = { label: string; value: T };
export type DateRangePreset<T extends DateValue = CalendarDate> = { label: string; value: RangeValue<T> };
/** A preset whose value is read when it is picked: "Today" stays right past midnight, and nothing reads the clock
 *  while the page renders. `presets` takes these alongside plain ones. */
type Lazy<P> = P extends { value: infer V } ? Omit<P, 'value'> & { value: V | (() => V) } : never;

const presetValue = <V,>(value: V | (() => V)): V => typeof value === 'function' ? (value as () => V)() : value;

export type DatePickerProps<T extends DateValue = CalendarDate> =
  Omit<AriaDatePickerProps<T>, 'children' | 'className' | 'style'> & PickerOwnProps & {
    /** Shortcuts listed beside the calendar. Picking one sets the value. */
    presets?: Lazy<DatePreset<T>>[];
  };

export type DateRangePickerProps<T extends DateValue = CalendarDate> =
  Omit<AriaDateRangePickerProps<T>, 'children' | 'className' | 'style'> & PickerOwnProps & {
    /** Shortcuts listed beside the calendar. Picking one sets the range. */
    presets?: Lazy<DateRangePreset<T>>[];
  };

type FieldState = { isDisabled: boolean; isInvalid: boolean; isReadOnly: boolean };

type FieldDefaultsInput = {
  label?: ReactNode; isDisabled?: boolean; disabled?: boolean; isInvalid?: boolean; isRequired?: boolean; isReadOnly?: boolean;
  'aria-label'?: string; 'aria-labelledby'?: string; 'aria-describedby'?: string;
};

/** Inside a Field with no `label` of its own, the picker takes the Field's label, message and state. */
function useFieldDefaults(props: FieldDefaultsInput) {
  const context = useContext(FieldContext);
  const field = props.label == null ? context : null;
  const named = props['aria-label'] != null || props['aria-labelledby'] != null;
  return {
    isDisabled: props.isDisabled ?? props.disabled ?? field?.disabled,
    isInvalid: props.isInvalid ?? (field?.invalid || undefined),
    isRequired: props.isRequired ?? field?.required,
    isReadOnly: props.isReadOnly ?? field?.readOnly,
    'aria-labelledby': props['aria-labelledby'] ?? (named ? undefined : field?.labelId),
    'aria-describedby': [props['aria-describedby'], field?.descriptionId].filter(Boolean).join(' ') || undefined,
  };
}

function closesOnPick(value: boolean | (() => boolean) | undefined) {
  return typeof value === 'function' ? value() : value ?? true;
}

function Segments({ slot }: { slot?: 'start' | 'end' }) {
  return <DateInput slot={slot} {...stylex.props(s.input, slot && s.rangeInput)}>
    {segment => <DateSegment segment={segment} className={({ isPlaceholder, isFocused, isDisabled }) => stylex.props(
      s.segment, segment.type === 'literal' && /[\s,]/.test(segment.text) && s.literalTight,
      isPlaceholder && s.placeholder, isFocused && s.segmentFocus, isDisabled && s.segmentDisabled,
    ).className ?? ''} />}
  </DateInput>;
}

function PresetList({ labels, onPick }: { labels: string[]; onPick: (index: number) => void }) {
  return <div role="group" aria-label="Presets" {...stylex.props(s.presets)}>
    {labels.map((label, index) => <AriaButton key={label} onPress={() => onPick(index)} className={({ isHovered, isPressed, isFocusVisible }) => stylex.props(
      overlayItemStyles.item, s.preset, isHovered && overlayItemStyles.active, isPressed && overlayItemStyles.pressed,
      isFocusVisible && focusStyles.ringInset,
    ).className ?? ''}>{label}</AriaButton>)}
  </div>;
}

function SinglePresets({ presets, close }: { presets: Lazy<DatePreset<DateValue>>[]; close: boolean }) {
  const state = useContext(DatePickerStateContext);
  return <PresetList labels={presets.map(preset => preset.label)} onPick={index => {
    state?.setValue(presetValue(presets[index].value));
    if (close) state?.close();
  }} />;
}

function RangePresets({ presets, close }: { presets: Lazy<DateRangePreset<DateValue>>[]; close: boolean }) {
  const state = useContext(DateRangePickerStateContext);
  return <PresetList labels={presets.map(preset => preset.label)} onPick={index => {
    state?.setValue(presetValue(presets[index].value));
    if (close) state?.close();
  }} />;
}

type FieldBodyProps = {
  label?: ReactNode;
  description?: ReactNode;
  errorMessage?: PickerOwnProps['errorMessage'];
  size: ControlSize;
  state: FieldState;
  isRequired: boolean;
  inputs: ReactNode;
  panel: ReactNode;
};

function FieldBody({ label, description, errorMessage, size, state, isRequired, inputs, panel }: FieldBodyProps) {
  return <>
    {label != null && <Label {...stylex.props(fieldStyles.label, state.isDisabled && disabledStyles.label)}>
      {label}{isRequired && <span aria-hidden="true" {...stylex.props(fieldStyles.required)}> *</span>}
    </Label>}
    <Group {...stylex.props(
      fieldStyles.shell, fieldShellSizeStyles[size], radiusStyles[size], !state.isReadOnly && s.shell,
      state.isInvalid && fieldStyles.invalid, state.isReadOnly && fieldStyles.readOnly, state.isDisabled && fieldStyles.disabled,
    )}>
      {inputs}
      <AriaButton className={({ isPressed, isFocusVisible }) => stylex.props(
        controlStyles.fieldButton, s.button, fieldButtonSizeStyles[size], isPressed && pressStyles.fill,
        state.isReadOnly && readOnlyStyles.hidden, isFocusVisible && focusStyles.ringInset,
      ).className ?? ''}>
        <Icon name="calendar" size={sizeScale[size].icon} />
      </AriaButton>
    </Group>
    {description != null && !state.isInvalid && <Text slot="description" {...stylex.props(fieldStyles.help)}>{description}</Text>}
    <FieldError {...stylex.props(fieldStyles.error)}>{errorMessage}</FieldError>
    <Popover placement="bottom start" offset={6} className={({ isExiting, placement }) => stylex.props(
      overlayStyles.surface, overlayStyles.popup, overlayStyles.popupMotion, popupPlacement(placement), s.popup,
      isExiting && overlayStyles.exit,
    ).className ?? ''}>
      <Dialog {...stylex.props(s.dialog)}>{panel}</Dialog>
    </Popover>
  </>;
}

/** Before hydration: the field's label, shell and button, standing still. React Aria's date fields read today's
 *  date as they render (for the placeholder), so the real field waits for the browser (see useHydrated). */
function PendingField({ label, description, size, isRequired, isDisabled, isReadOnly, className, style, ref }: {
  label?: ReactNode; description?: ReactNode; size: ControlSize; isRequired: boolean; isDisabled: boolean; isReadOnly: boolean;
  className?: string; style?: CSSProperties; ref?: Ref<HTMLDivElement>;
}) {
  return <div aria-busy="true" ref={ref} style={style} className={withClassName(stylex.props(fieldStyles.root, s.root), className)}>
    {label != null && <span {...stylex.props(fieldStyles.label, isDisabled && disabledStyles.label)}>
      {label}{isRequired && <span aria-hidden="true" {...stylex.props(fieldStyles.required)}> *</span>}
    </span>}
    <div {...stylex.props(
      fieldStyles.shell, fieldShellSizeStyles[size], radiusStyles[size], !isReadOnly && s.shell,
      isReadOnly && fieldStyles.readOnly, isDisabled && fieldStyles.disabled,
    )}>
      <span {...stylex.props(s.input)} />
      <span {...stylex.props(controlStyles.fieldButton, s.button, fieldButtonSizeStyles[size], isReadOnly && readOnlyStyles.hidden)}>
        <Icon name="calendar" size={sizeScale[size].icon} />
      </span>
    </div>
    {description != null && <span {...stylex.props(fieldStyles.help)}>{description}</span>}
  </div>;
}

/**
 * A date field with a calendar popup. Type the date segment by segment, or press the calendar
 * button (or Alt + Down) to pick it from a month grid. Controlled (`value`) or uncontrolled
 * (`defaultValue`); `granularity` adds time segments.
 */
export function DatePicker<T extends DateValue = CalendarDate>(props: DatePickerProps<T>) {
  const { label, description, errorMessage, size, navigation, visibleMonths, presets, className, disabled, ...rest } = props;
  const defaults = useFieldDefaults(props);
  const fieldSize = normalizeSize(size);
  const hydrated = useHydrated();
  if (!hydrated) return <PendingField label={label} description={description} size={fieldSize} isRequired={!!defaults.isRequired} isDisabled={!!defaults.isDisabled} isReadOnly={!!defaults.isReadOnly} className={className} style={props.style} ref={props.ref} />;
  return <AriaDatePicker<T> {...rest} {...defaults} className={withClassName(stylex.props(fieldStyles.root, s.root), className)}>
    {({ isDisabled, isInvalid, isReadOnly }) => <FieldBody
      label={label} description={description} errorMessage={errorMessage} size={fieldSize}
      state={{ isDisabled, isInvalid, isReadOnly }} isRequired={!!defaults.isRequired} inputs={<Segments />}
      panel={<>
        {presets && presets.length > 0 && <SinglePresets presets={presets} close={closesOnPick(rest.shouldCloseOnSelect)} />}
        <Calendar variant="plain" navigation={navigation} visibleMonths={visibleMonths} />
      </>}
    />}
  </AriaDatePicker>;
}

/** Two date fields (start and end) sharing one shell, with a range calendar in the popup. */
export function DateRangePicker<T extends DateValue = CalendarDate>(props: DateRangePickerProps<T>) {
  const { label, description, errorMessage, size, navigation, visibleMonths, presets, className, disabled, ...rest } = props;
  const defaults = useFieldDefaults(props);
  const fieldSize = normalizeSize(size);
  const hydrated = useHydrated();
  if (!hydrated) return <PendingField label={label} description={description} size={fieldSize} isRequired={!!defaults.isRequired} isDisabled={!!defaults.isDisabled} isReadOnly={!!defaults.isReadOnly} className={className} style={props.style} ref={props.ref} />;
  return <AriaDateRangePicker<T> {...rest} {...defaults} className={withClassName(stylex.props(fieldStyles.root, s.root), className)}>
    {({ isDisabled, isInvalid, isReadOnly }) => <FieldBody
      label={label} description={description} errorMessage={errorMessage} size={fieldSize}
      state={{ isDisabled, isInvalid, isReadOnly }} isRequired={!!defaults.isRequired}
      inputs={<div {...stylex.props(s.rangeInputs)}>
        <Segments slot="start" />
        <span aria-hidden="true" {...stylex.props(s.dash, isDisabled && s.dashDisabled)}>–</span>
        <Segments slot="end" />
      </div>}
      panel={<>
        {presets && presets.length > 0 && <RangePresets presets={presets} close={closesOnPick(rest.shouldCloseOnSelect)} />}
        <Calendar mode="range" variant="plain" navigation={navigation} visibleMonths={visibleMonths} />
      </>}
    />}
  </AriaDateRangePicker>;
}
