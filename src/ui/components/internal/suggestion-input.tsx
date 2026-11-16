import * as stylex from '@stylexjs/stylex';
import { useContext, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode, type Ref, type RefObject } from 'react';
import {
  Autocomplete as AriaAutocomplete, Button as AriaButton, ComboBox as AriaComboBox, ComboBoxStateContext, FieldError,
  Group, Header, Input as AriaInput, Label as AriaLabel, ListBox, ListBoxItem, ListBoxSection, Popover, SearchField,
  Select as AriaSelect, SelectValue, Text, useFilter,
  type ComboBoxProps as AriaComboboxProps, type Key,
} from 'react-aria-components';
import { tokens as t } from '../../tokens.stylex';
import { Icon } from '../Icon';
import { withClassName } from './class-name';
import { controlShellSizeStyles, controlStyles, FieldContext, fieldButtonSizeStyles, type FieldContextValue } from './control';
import { fieldStyles } from './field-styles';
import { overlayItemStyles, overlayStyles, popupPlacement } from './overlay';
import { fieldInputSizeStyles, gapStyles, normalizeSize, radiusStyles, sizeScale, type ControlSize, type ControlSizeProp } from './size';
import { loadingStyles } from './states';

// The pickers' shared body (DESIGN_SPEC 1.2, 1.5, 1.8, 1.9, 1.11):
// - SuggestionInput: Combobox and Autocomplete. A bordered shell in a React Aria Group (so the popup
//   takes the shell's width), the edge ring on focus, inline buttons (chevron, clear) inset 4px,
//   a spinner in the trailing slot while loading, chips for multiple selection.
// - ButtonPicker: a select-like trigger (the same shell, as a button) with a list popup, optionally
//   with a search field inside the popup. Select `appearance="field"` and Combobox
//   `inputPlacement="popup"` render it.
// - The list popup: bg-elevated, hairline, shadow-popup, padding 6, 36px rows, labeled sections,
//   a 16px check on selected rows, max height 320 with the list scrolling inside.
// Every picker reads the surrounding Field (id, label, description, validity, disabled, read-only).

const canHover = '@media (hover: hover)';
const coarse = '@media (pointer: coarse)';
const reduce = '@media (prefers-reduced-motion: reduce)';
const ring = t['--os-color-focus-ring'];
const errorEdge = t['--os-color-border-error'];

const s = stylex.create({
  hidden: { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)', whiteSpace: 'nowrap' },
  root: { position: 'relative' },
  labelDisabled: { color: t['--os-color-fg-disabled'] },
  trackingXs: { letterSpacing: 0 },
  placeholderDisabled: { '::placeholder': { color: t['--os-color-fg-disabled'] } },
  popup: { display: 'flex', flexDirection: 'column', minWidth: 0 },
  // 320 max: 306 of list + 2 x 6 padding + 2 x 1 border. The popover's own max height (available space) wins below that.
  list: {
    outline: 'none', display: 'grid', alignContent: 'start', gap: t['--os-space-0-5'], flexGrow: 1, minHeight: 0,
    maxHeight: 306, overflowY: 'auto', overscrollBehavior: 'contain',
  },
  // With the search field on top: 320 - 40 search - 6 gap - 2 x 6 padding - 2 x 1 border.
  listWithSearch: { maxHeight: 260 },
  // The hairline sits 4px from the rows on both sides (spec 1.9 separator): the list gap 2 plus 2 above, 4 below.
  section: {
    display: 'grid', gap: t['--os-space-0-5'],
    marginTop: { default: 0, ':not(:first-child)': t['--os-space-0-5'] },
    paddingTop: { default: 0, ':not(:first-child)': t['--os-space-1'] },
    borderTopWidth: { default: 0, ':not(:first-child)': 1 },
    borderTopStyle: 'solid', borderTopColor: t['--os-color-border-subtle'],
  },
  option: { justifyContent: 'flex-start' },
  optionIcon: { display: 'inline-flex', flexShrink: 0, color: t['--os-color-fg-muted'] },
  optionIconDisabled: { color: t['--os-color-fg-disabled'] },
  optionLabel: { minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  check: { display: 'inline-flex', flexShrink: 0, marginInlineStart: 'auto', color: t['--os-color-fg-base'] },
  // Empty and loading rows (spec 1.9 Items), the same row as overlayItemStyles.empty: 36 tall, 14/20 fg-muted, text 16px
  // from the surface edge like the options (16 - 6 list padding), a 16px spinner 8 before it.
  status: {
    display: 'flex', alignItems: 'center', gap: t['--os-space-2'], minHeight: 36, paddingBlock: t['--os-space-2'],
    paddingInline: `calc(${t['--os-space-4']} - ${t['--os-space-1-5']})`,
    color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'],
    letterSpacing: t['--os-tracking-tight'],
  },
  addon: { display: 'inline-flex', alignItems: 'center', flexShrink: 0, color: t['--os-color-fg-muted'] },
  inputBeforeButton: { paddingInlineEnd: t['--os-space-1'] },
  /**
   * Hit area (spec 1.14): at least 24px on fine pointers and 44px tall on coarse ones. Inline buttons
   * sit side by side, so they only grow along the free (vertical) axis on touch.
   */
  hit: {
    position: 'relative',
    '::after': {
      content: '""', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      width: 'max(100%, 24px)', height: { default: 'max(100%, 24px)', [coarse]: 'max(100%, 44px)' },
    },
  },
  slot: { display: 'inline-grid', placeItems: 'center', alignSelf: 'center', flexShrink: 0, color: t['--os-color-fg-muted'] },
  // Multiple selection: chips before the input, wrapping onto new rows.
  chipShell: { height: 'auto' },
  // Chip rows wrap, so the shell caps the control radius at lg and never becomes a stadium (spec 1.3).
  chipShellRadius: { borderRadius: `min(${t['--os-radius-control']}, ${t['--os-radius-lg']})` },
  chipShellRadiusXs: { borderRadius: `min(calc(${t['--os-radius-control']} - ${t['--os-radius-md']} + ${t['--os-radius-sm']}), ${t['--os-radius-lg']})` },
  chipWrap: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: t['--os-space-1'], flexGrow: 1, minWidth: 0 },
  // A chip is a Badge md (24 tall, 12/16 500, padding 8); in an xs shell it is a Badge sm (20, padding 6).
  chip: {
    display: 'inline-flex', alignItems: 'center', gap: t['--os-space-0-5'], height: t['--os-size-xs'], maxWidth: '100%', minWidth: 0,
    paddingInlineStart: t['--os-space-2'], paddingInlineEnd: t['--os-space-0-5'], borderRadius: `max(${t['--os-radius-sm']}, calc(${t['--os-radius-control']} - 8px))`,
    backgroundColor: t['--os-color-accent-subtle'], color: t['--os-color-fg-base'],
    fontSize: t['--os-font-size-xs'], lineHeight: t['--os-line-height-xs'], fontWeight: t['--os-font-weight-medium'], letterSpacing: 0,
  },
  chipXs: { height: 20, paddingInlineStart: t['--os-space-1-5'] },
  chipStatic: { paddingInlineEnd: t['--os-space-2'] },
  chipStaticXs: { paddingInlineEnd: t['--os-space-1-5'] },
  chipDisabled: { backgroundColor: t['--os-color-bg-disabled'], color: t['--os-color-fg-disabled'] },
  chipText: { minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  // The remove button: a 20px indicator inset 2 in the chip. Hover and press step the chip's neutral fill (spec 1.8).
  chipRemove: {
    position: 'relative', display: 'inline-grid', placeItems: 'center', flexShrink: 0, width: 20, height: 20, padding: 0,
    borderRadius: `max(${t['--os-radius-xs']}, calc(${t['--os-radius-control']} - 10px))`, color: t['--os-color-fg-muted'], cursor: 'pointer',
    backgroundColor: {
      default: 'transparent',
      ':hover': { default: null, [canHover]: t['--os-color-accent-muted'] },
      ':active': t['--os-color-accent-dim'],
    },
    transform: { default: 'none', ':active': { default: 'scale(.9)', [reduce]: 'none' } },
    transitionProperty: 'background-color, color, transform',
    transitionDuration: { default: `${t['--os-motion-hover']}, ${t['--os-motion-hover']}, ${t['--os-motion-press']}`, [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
    '::after': {
      content: '""', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      width: 24, height: { default: 24, [coarse]: 44 },
    },
  },
  chipRemoveXs: { width: t['--os-size-2xs'], height: t['--os-size-2xs'] },
  chipInput: { flexGrow: 1, flexBasis: 80, minWidth: 80, height: t['--os-size-xs'], paddingBlock: 0 },
  chipInputXs: { height: 20 },
  chipInputAfterChips: { paddingInlineStart: t['--os-space-1'] },
  chipInputAfterAddon: { paddingInlineStart: 0 },
  // ButtonPicker trigger: the field shell as a button. The value starts at the field inset; the chevron
  // sits in an inline-button box, so it lines up with the Combobox chevron by construction.
  trigger: {
    position: 'relative', display: 'flex', alignItems: 'center', textAlign: 'start', cursor: 'pointer',
    outlineStyle: { default: 'none', '@media (forced-colors: active)': 'solid' }, fontFamily: 'inherit',
    '::after': {
      content: '""', position: 'absolute', insetInline: 0, top: '50%', transform: 'translateY(-50%)',
      height: { default: '100%', [coarse]: 'max(100%, 44px)' },
    },
  },
  triggerOpen: { borderColor: ring, boxShadow: `inset 0 0 0 1px ${ring}` },
  triggerOpenInvalid: { borderColor: errorEdge, boxShadow: `inset 0 0 0 1px ${errorEdge}` },
  // With the chevron the end padding is the chevron box's own margin; read-only (no chevron) ends at the field inset.
  triggerWithChevron: { paddingInlineEnd: 0 },
  triggerReadOnly: { cursor: 'default' },
  // A row, so an option's icon keeps the same 8px gap before its label as it has in the list.
  value: { display: 'flex', alignItems: 'center', gap: t['--os-space-2'], flexGrow: 1, minWidth: 0, overflow: 'hidden', whiteSpace: 'nowrap' },
  placeholder: { color: t['--os-color-fg-muted'] },
  muted: { color: t['--os-color-fg-disabled'] },
  chevron: { display: 'inline-grid', placeItems: 'center', flexShrink: 0, color: t['--os-color-fg-muted'] },
  // Search field inside the popup: a structural divider separates it from the results (spec 1.5). It
  // bleeds over the 6px list padding so the divider runs edge to edge; the icon sits 16px in, like the option text.
  search: {
    display: 'flex', alignItems: 'center', gap: t['--os-space-2'], flexShrink: 0, height: 40,
    marginInline: `calc(-1 * ${t['--os-space-1-5']})`, marginTop: `calc(-1 * ${t['--os-space-1-5']})`,
    marginBottom: t['--os-space-1-5'], paddingInline: t['--os-space-4'], color: t['--os-color-fg-muted'],
    borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: t['--os-color-border-subtle'],
  },
  searchInput: {
    flexGrow: 1, minWidth: 0, height: '100%', outlineStyle: 'none', backgroundColor: 'transparent',
    color: t['--os-color-fg-base'], fontFamily: 'inherit',
    fontSize: { default: t['--os-font-size-sm'], [coarse]: t['--os-font-size-body'] },
    fontWeight: t['--os-font-weight-regular'], lineHeight: t['--os-line-height-md'], letterSpacing: t['--os-tracking-tight'],
    '::placeholder': { color: t['--os-color-fg-muted'], opacity: 1 },
    '::-webkit-search-cancel-button': { appearance: 'none' },
  },
});

/** Where the text starts: the field inset (spec 1.2: 8 / 12 / 14 / 16 / 16) less the 1px border. */
const fieldInset = stylex.create({
  xs: { paddingInlineStart: `calc(${t['--os-space-2']} - 1px)` },
  sm: { paddingInlineStart: `calc(${t['--os-space-3']} - 1px)` },
  // os-allow raw-space: spec 1.2 md field inset 14 less the 1px border; 14 has no spacing step
  md: { paddingInlineStart: 13 },
  lg: { paddingInlineStart: `calc(${t['--os-space-4']} - 1px)` },
  xl: { paddingInlineStart: `calc(${t['--os-space-4']} - 1px)` },
});

/** The same inset at the end, for a read-only trigger that hides its chevron. */
const fieldInsetEnd = stylex.create({
  xs: { paddingInlineEnd: `calc(${t['--os-space-2']} - 1px)` },
  sm: { paddingInlineEnd: `calc(${t['--os-space-3']} - 1px)` },
  // os-allow raw-space: spec 1.2 md field inset 14 less the 1px border; 14 has no spacing step
  md: { paddingInlineEnd: 13 },
  lg: { paddingInlineEnd: `calc(${t['--os-space-4']} - 1px)` },
  xl: { paddingInlineEnd: `calc(${t['--os-space-4']} - 1px)` },
});

/** A start addon's gap before the text: the size's icon gap (spec 1.2: 4 / 6 / 8 / 8 / 8). */
const addonGap = stylex.create({
  xs: { paddingInlineStart: t['--os-space-1'] },
  sm: { paddingInlineStart: t['--os-space-1-5'] },
  md: { paddingInlineStart: t['--os-space-2'] },
  lg: { paddingInlineStart: t['--os-space-2'] },
  xl: { paddingInlineStart: t['--os-space-2'] },
});

/** Multiple mode, no chips yet: the placeholder keeps the field inset (field inset - 1 border - chip row padding). */
const chipInputStart = stylex.create({
  xs: { paddingInlineStart: t['--os-space-1-5'] },
  sm: { paddingInlineStart: t['--os-space-2'] },
  md: { paddingInlineStart: t['--os-space-1-5'] },
  lg: { paddingInlineStart: t['--os-space-1-5'] },
  xl: { paddingInlineStart: t['--os-space-1'] },
});

const minHeight = stylex.create({
  xs: { minHeight: t['--os-size-xs'] }, sm: { minHeight: t['--os-size-sm'] }, md: { minHeight: t['--os-size-md'] },
  lg: { minHeight: t['--os-size-lg'] }, xl: { minHeight: t['--os-size-xl'] },
});

/**
 * Chip rows (nesting rule, spec 1.3): the inset that centers a chip in the shell, less the 1px border,
 * (shell - chip) / 2 - 1, at the top, bottom and start, so the first chip is concentric with the shell.
 * xs holds a 20px chip: (24 - 20) / 2 - 1 = 1.
 */
const chipWrapPad = stylex.create({
  xs: { paddingBlock: 1, paddingInlineStart: 1 },
  sm: { paddingBlock: `calc((${t['--os-size-sm']} - ${t['--os-size-xs']}) / 2 - 1px)`, paddingInlineStart: `calc((${t['--os-size-sm']} - ${t['--os-size-xs']}) / 2 - 1px)` },
  md: { paddingBlock: `calc((${t['--os-size-md']} - ${t['--os-size-xs']}) / 2 - 1px)`, paddingInlineStart: `calc((${t['--os-size-md']} - ${t['--os-size-xs']}) / 2 - 1px)` },
  lg: { paddingBlock: `calc((${t['--os-size-lg']} - ${t['--os-size-xs']}) / 2 - 1px)`, paddingInlineStart: `calc((${t['--os-size-lg']} - ${t['--os-size-xs']}) / 2 - 1px)` },
  xl: { paddingBlock: `calc((${t['--os-size-xl']} - ${t['--os-size-xs']}) / 2 - 1px)`, paddingInlineStart: `calc((${t['--os-size-xl']} - ${t['--os-size-xs']}) / 2 - 1px)` },
});

/** Value text of the trigger: the size's text at weight 400, 16px on coarse pointers like every field value. */
const triggerText = stylex.create({
  xs: { fontSize: { default: t['--os-font-size-xs'], [coarse]: t['--os-font-size-body'] }, lineHeight: t['--os-line-height-xs'], fontWeight: t['--os-font-weight-regular'], letterSpacing: 0 },
  sm: { fontSize: { default: t['--os-font-size-caption'], [coarse]: t['--os-font-size-body'] }, lineHeight: t['--os-line-height-sm'], fontWeight: t['--os-font-weight-regular'], letterSpacing: t['--os-tracking-tight'] },
  md: { fontSize: { default: t['--os-font-size-sm'], [coarse]: t['--os-font-size-body'] }, lineHeight: t['--os-line-height-md'], fontWeight: t['--os-font-weight-regular'], letterSpacing: t['--os-tracking-tight'] },
  lg: { fontSize: { default: t['--os-font-size-md'], [coarse]: t['--os-font-size-body'] }, lineHeight: t['--os-line-height-md'], fontWeight: t['--os-font-weight-regular'], letterSpacing: t['--os-tracking-tight'] },
  xl: { fontSize: t['--os-font-size-body'], lineHeight: t['--os-line-height-lg'], fontWeight: t['--os-font-weight-regular'], letterSpacing: t['--os-tracking-tight'] },
});

// ---------------------------------------------------------------------------------------------
// Options

export type SelectionMode = 'single' | 'multiple';

export interface CatalogOption {
  id: string;
  label: string;
  disabled?: boolean;
  /** A 16px icon before the label, in fg-muted. */
  icon?: ReactNode;
}

/** A labeled group of options. Sections are separated by a hairline. */
export interface CatalogSection {
  id: string;
  label?: string;
  options: readonly CatalogOption[];
}

export type CatalogEntry = CatalogOption | CatalogSection;

export function isCatalogSection(entry: CatalogEntry): entry is CatalogSection {
  return Array.isArray((entry as CatalogSection).options);
}

export function flattenCatalog(entries: readonly CatalogEntry[]): CatalogOption[] {
  return entries.flatMap(entry => isCatalogSection(entry) ? [...entry.options] : [entry]);
}

function disabledKeysOf(entries: readonly CatalogEntry[], extra?: Iterable<Key>) {
  const keys = new Set<Key>(extra);
  for (const option of flattenCatalog(entries)) if (option.disabled) keys.add(option.id);
  return keys;
}

/** Keeps the options that pass `keep`, drops empty sections, and stops after `limit` options. */
function filterCatalog(entries: readonly CatalogEntry[], keep: (option: CatalogOption) => boolean, limit = Infinity) {
  let left = limit;
  const out: CatalogEntry[] = [];
  for (const entry of entries) {
    if (left <= 0) break;
    if (isCatalogSection(entry)) {
      const options = entry.options.filter(keep).slice(0, left);
      left -= options.length;
      if (options.length) out.push({ ...entry, options });
    } else if (keep(entry)) {
      out.push(entry);
      left -= 1;
    }
  }
  return out;
}

function CatalogItem({ option }: { option: CatalogOption }) {
  return <ListBoxItem id={option.id} textValue={option.label}
    className={({ isFocused, isHovered, isPressed, isSelected, isDisabled }) => stylex.props(
      controlStyles.option, s.option,
      (isFocused || isHovered) && !isDisabled && controlStyles.optionActive,
      isPressed && !isDisabled && overlayItemStyles.pressed,
      isSelected && controlStyles.optionSelected,
      isDisabled && controlStyles.optionDisabled,
    ).className ?? ''}>
    {({ isSelected, isDisabled }) => <>
      {option.icon && <span {...stylex.props(s.optionIcon, isDisabled && s.optionIconDisabled)}>{option.icon}</span>}
      <span {...stylex.props(s.optionLabel)}>{option.label}</span>
      {isSelected && <span {...stylex.props(s.check)}><Icon name="check" size={16} /></span>}
    </>}
  </ListBoxItem>;
}

/** The list's children: options and labeled sections, as static collection nodes. */
export function catalogItems(entries: readonly CatalogEntry[]) {
  return entries.map(entry => isCatalogSection(entry)
    ? <ListBoxSection key={entry.id} id={entry.id} {...stylex.props(s.section)}>
      {entry.label && <Header {...stylex.props(overlayItemStyles.groupLabel)}>{entry.label}</Header>}
      {entry.options.map(option => <CatalogItem key={option.id} option={option} />)}
    </ListBoxSection>
    : <CatalogItem key={entry.id} option={entry} />);
}

function StatusRow({ loading, children }: { loading?: boolean; children: ReactNode }) {
  return <div {...stylex.props(s.status)}>
    {loading && <span aria-hidden="true" {...stylex.props(loadingStyles.spinner, loadingStyles.spinnerSize(16))} />}
    {children}
  </div>;
}

function CatalogList({ entries, emptyMessage, isLoading, loadingMessage, withSearch }: {
  entries: readonly CatalogEntry[]; emptyMessage: ReactNode; isLoading?: boolean; loadingMessage: ReactNode; withSearch?: boolean;
}) {
  return <ListBox {...stylex.props(s.list, withSearch && s.listWithSearch)} aria-busy={isLoading || undefined}
    renderEmptyState={() => isLoading ? <StatusRow loading>{loadingMessage}</StatusRow> : <StatusRow>{emptyMessage}</StatusRow>}>
    {catalogItems(entries)}
  </ListBox>;
}

function popupClassName({ isExiting, placement }: { isExiting: boolean; placement: string | null }) {
  return stylex.props(controlStyles.popup, s.popup, overlayStyles.popupMotion, popupPlacement(placement), isExiting && overlayStyles.exit).className ?? '';
}

function Spinner({ size }: { size: ControlSize }) {
  return <span {...stylex.props(s.slot, fieldButtonSizeStyles[size])}>
    <span aria-hidden="true" {...stylex.props(loadingStyles.spinner, loadingStyles.spinnerSize(sizeScale[size].icon))} />
  </span>;
}

/** The visible label: 14/20 500, dimmed when disabled, ` *` when required (spec 1.11). */
function PickerLabel({ label, hidden, disabled, required }: { label?: string; hidden?: boolean; disabled: boolean; required?: boolean }) {
  if (label == null) return null;
  return <AriaLabel {...stylex.props(hidden ? s.hidden : controlStyles.label, disabled && s.labelDisabled)}>
    {label}{required && !hidden && <span aria-hidden="true" {...stylex.props(fieldStyles.required)}> *</span>}
  </AriaLabel>;
}

const hasContent = (node: ReactNode) => node != null && node !== false && node !== '';

/** The props a picker takes from its surrounding Field (spec 1.11): the Field's own label and messages name and describe it. */
export function bindField(field: FieldContextValue | null, own: {
  id?: string; label?: string; labelledBy?: string; describedBy?: string;
  isInvalid?: boolean; message?: ReactNode; isRequired?: boolean; isDisabled?: boolean; isReadOnly?: boolean;
}) {
  return {
    id: own.id ?? field?.id,
    labelledBy: own.labelledBy ?? (own.label == null ? field?.labelId : undefined),
    describedBy: [own.describedBy, field?.descriptionId].filter(Boolean).join(' ') || undefined,
    // undefined (not false) when nothing marks it invalid: React Aria treats a defined isInvalid as
    // controlled and would then never show native (required) validation after a submit.
    invalid: own.isInvalid ?? (hasContent(own.message) || field?.invalid ? true : undefined),
    required: own.isRequired ?? field?.required,
    disabled: own.isDisabled ?? field?.disabled ?? false,
    readOnly: own.isReadOnly ?? field?.readOnly ?? false,
  };
}

/** A value that is controlled when `value` is defined and kept here otherwise. */
export function useControlledValue<V>(value: V | undefined, defaultValue: V, onChange?: (value: V) => void): [V, (value: V) => void] {
  const [inner, setInner] = useState(defaultValue);
  const controlled = value !== undefined;
  return [controlled ? value : inner, next => {
    if (!controlled) setInner(next);
    onChange?.(next);
  }];
}

// ---------------------------------------------------------------------------------------------
// Combobox and Autocomplete

export interface SuggestionBaseProps<M extends SelectionMode = 'single'> extends Omit<AriaComboboxProps<CatalogOption, M>, 'children' | 'className' | 'style' | 'items' | 'defaultItems' | 'allowsCustomValue'> {
  /** The visible label. Optional inside a Field that has one, or with `aria-label`. */
  label?: string;
  /** Options, or labeled sections of options. */
  options: readonly CatalogEntry[];
  placeholder?: string;
  emptyMessage?: ReactNode;
  description?: ReactNode;
  /** The error line. It replaces the description and turns the field invalid. */
  errorMessage?: ReactNode;
  /** @deprecated Use `errorMessage`. */
  error?: ReactNode;
  hideLabel?: boolean;
  size?: ControlSizeProp;
  /** Content at the start of the shell, usually a 16px Icon. */
  startAddon?: ReactNode;
  /** Shows a clear button while the field has text or a value. */
  isClearable?: boolean;
  /** Shows a spinner in the trailing slot, and a loading row while the list is empty. */
  isLoading?: boolean;
  loadingMessage?: ReactNode;
  /** Shows the chevron button that opens the full list. */
  showTrigger?: boolean;
  /** Highlights the first matching option while typing, so Enter picks it. */
  autoHighlight?: boolean;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLDivElement>;
}

export interface ComboboxProps<M extends SelectionMode = 'single'> extends SuggestionBaseProps<M> {
  /** `popup` moves the input into the popup and renders a select-like button as the trigger. */
  inputPlacement?: 'field' | 'popup';
  /** Placeholder of the search input when `inputPlacement="popup"`. */
  searchPlaceholder?: string;
}

export interface AutocompleteFieldProps extends Omit<SuggestionBaseProps<'single'>, 'selectionMode'> {
  /** Shows at most this many matches. */
  limit?: number;
  /** Completes the input with the first option that starts with the typed text, selecting the added part. */
  inlineComplete?: boolean;
}

type SuggestionInputProps = SuggestionBaseProps<SelectionMode> & {
  limit?: number;
  inlineComplete?: boolean;
  freeform: boolean;
};

/** Moves virtual focus to the first enabled option whenever nothing in the open list is focused. */
function AutoHighlight() {
  const state = useContext(ComboBoxStateContext);
  const focusedKey = state?.selectionManager.focusedKey ?? null;
  useEffect(() => {
    if (!state?.isOpen) return;
    const { collection, disabledKeys, selectionManager } = state;
    if (focusedKey != null && collection.getItem(focusedKey)) return;
    const first = [...collection].flatMap(node => node.type === 'section' ? [...(collection.getChildren?.(node.key) ?? [])] : [node])
      .find(node => node.type === 'item' && !disabledKeys.has(node.key));
    if (first) selectionManager.setFocusedKey(first.key);
  });
  return null;
}

function ClearButton({ size, inputRef }: { size: ControlSize; inputRef: RefObject<HTMLInputElement | null> }) {
  const state = useContext(ComboBoxStateContext);
  if (!state || (state.inputValue === '' && state.selectedItems.length === 0)) return null;
  return <AriaButton slot={null} aria-label="Clear" excludeFromTabOrder preventFocusOnPress
    onPress={() => {
      state.setValue(Array.isArray(state.value) ? [] : null);
      state.setInputValue('');
      inputRef.current?.focus();
    }}
    {...stylex.props(controlStyles.fieldButton, fieldButtonSizeStyles[size], s.hit)}>
    <Icon name="x" size={sizeScale[size].icon} />
  </AriaButton>;
}

function Chips({ removable, disabled, size }: { removable: boolean; disabled: boolean; size: ControlSize }) {
  const state = useContext(ComboBoxStateContext);
  if (!state || !Array.isArray(state.value)) return null;
  const keys = state.value as readonly Key[];
  const xs = size === 'xs';
  return <>{state.selectedItems.map(item => <span key={item.key} {...stylex.props(s.chip, xs && s.chipXs, !removable && (xs ? s.chipStaticXs : s.chipStatic), disabled && s.chipDisabled)}>
    <span {...stylex.props(s.chipText)}>{item.textValue}</span>
    {removable && <AriaButton slot={null} excludeFromTabOrder preventFocusOnPress aria-label={`Remove ${item.textValue}`}
      onPress={() => state.setValue(keys.filter(key => key !== item.key))} {...stylex.props(s.chipRemove, xs && s.chipRemoveXs)}>
      <Icon name="x" size={xs ? 12 : 14} />
    </AriaButton>}
  </span>)}</>;
}

/** The text input; in multiple mode Backspace on an empty input removes the last chip. */
function FieldInput({ placeholder, inputRef, multiple, inputStyle }: {
  placeholder?: string; inputRef: RefObject<HTMLInputElement | null>; multiple: boolean; inputStyle: stylex.StyleXStyles[];
}) {
  const state = useContext(ComboBoxStateContext);
  const hasChips = multiple && Array.isArray(state?.value) && (state.value as readonly Key[]).length > 0;
  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!multiple || !state || event.key !== 'Backspace' || event.currentTarget.value !== '' || event.currentTarget.readOnly) return;
    const keys = state.value as readonly Key[];
    if (keys.length) state.setValue(keys.slice(0, -1));
  }
  return <AriaInput ref={inputRef} placeholder={hasChips ? undefined : placeholder} onKeyDown={onKeyDown}
    {...stylex.props(...inputStyle, hasChips && s.chipInputAfterChips)} />;
}

/**
 * Combobox (`freeform: false`) and Autocomplete (`freeform: true`). Combobox filters with React Aria
 * (the full list stays in the collection, so the selection survives filtering); Autocomplete filters
 * here, which makes `limit` and inline completion possible.
 */
export function SuggestionInput({
  label, options, placeholder, emptyMessage = 'No matching options', loadingMessage = 'Loading…', description,
  errorMessage, error, hideLabel, size: sizeProp, startAddon, isClearable, isLoading, showTrigger, autoHighlight,
  limit, inlineComplete, isInvalid, isDisabled, isReadOnly, isRequired, disabledKeys, freeform, className, style, ref,
  onOpenChange, onInputChange, inputValue: inputValueProp, defaultInputValue, defaultFilter, id,
  'aria-labelledby': ariaLabelledBy, 'aria-describedby': ariaDescribedBy, ...props
}: SuggestionInputProps) {
  const field = useContext(FieldContext);
  const size = normalizeSize(sizeProp);
  const message = errorMessage ?? error;
  const bound = bindField(field, {
    id, label, labelledBy: ariaLabelledBy, describedBy: ariaDescribedBy,
    isInvalid, message, isRequired, isDisabled, isReadOnly,
  });
  const multiple = props.selectionMode === 'multiple';
  const trigger = showTrigger ?? !freeform;
  const inputRef = useRef<HTMLInputElement>(null);
  const { contains } = useFilter({ sensitivity: 'base' });

  // Freeform: the input value lives here so the list can be filtered, limited and completed.
  const [innerInput, setInnerInput] = useState(defaultInputValue ?? '');
  const inputValue = inputValueProp ?? innerInput;
  const [typed, setTyped] = useState(inputValue);
  const [showAll, setShowAll] = useState(false);
  const pendingSelection = useRef<[number, number] | null>(null);

  // Runs after every render: a completion can produce the same value twice in a row (the typed
  // character replaced the selected part), and React then rewrites the input, moving the caret.
  useLayoutEffect(() => {
    const range = pendingSelection.current;
    pendingSelection.current = null;
    if (range && inputRef.current && document.activeElement === inputRef.current) inputRef.current.setSelectionRange(range[0], range[1]);
  });

  function changeInput(next: string) {
    let value = next;
    const growing = next.length > typed.length && next.toLocaleLowerCase().startsWith(typed.toLocaleLowerCase());
    if (inlineComplete && growing) {
      const match = flattenCatalog(options).find(option => !option.disabled && option.label.toLocaleLowerCase().startsWith(next.toLocaleLowerCase()));
      if (match && match.label.length > next.length) {
        value = match.label;
        pendingSelection.current = [next.length, value.length];
      }
    }
    setTyped(next);
    setShowAll(false);
    if (inputValueProp === undefined) setInnerInput(value);
    onInputChange?.(value);
  }

  const query = inlineComplete ? typed : inputValue;
  const filter = defaultFilter ?? contains;
  const entries = freeform
    ? filterCatalog(options, option => showAll || filter(option.label, query), limit)
    : options;

  const { disabled, readOnly } = bound;
  const inputStyle: stylex.StyleXStyles[] = [
    controlStyles.input, fieldInputSizeStyles[size], controlStyles.inputInner,
    size === 'xs' && s.trackingXs, disabled && s.placeholderDisabled,
    !!startAddon && addonGap[size], (trigger || isClearable || isLoading) && s.inputBeforeButton,
    multiple && s.chipInput, multiple && size === 'xs' && s.chipInputXs,
    multiple && (startAddon ? s.chipInputAfterAddon : chipInputStart[size]),
  ];
  const rootProps = stylex.props(controlStyles.stack, s.root);
  const ownMessages = !field || hasContent(description) || hasContent(message);

  return <AriaComboBox<CatalogOption, SelectionMode> {...props}
    ref={ref}
    id={bound.id}
    aria-labelledby={bound.labelledBy}
    aria-describedby={bound.describedBy}
    className={withClassName(rootProps, className)}
    style={{ ...rootProps.style, ...style }}
    disabledKeys={disabledKeysOf(options, disabledKeys)}
    isInvalid={bound.invalid}
    isRequired={bound.required}
    isDisabled={disabled}
    isReadOnly={readOnly}
    allowsCustomValue={freeform}
    allowsEmptyCollection
    {...(freeform
      ? { inputValue, onInputChange: changeInput, defaultFilter: () => true }
      : { inputValue: inputValueProp, defaultInputValue, onInputChange, defaultFilter })}
    onOpenChange={(isOpen, menuTrigger) => {
      setShowAll(isOpen && menuTrigger === 'manual');
      onOpenChange?.(isOpen, menuTrigger);
    }}>
    {({ isInvalid: invalid }) => <>
      <PickerLabel label={label} hidden={hideLabel} disabled={disabled} required={bound.required} />
      <Group aria-busy={isLoading || undefined} className={stylex.props(
        controlStyles.shell, controlStyles.row, multiple ? [s.chipShell, minHeight[size]] : controlShellSizeStyles[size],
        radiusStyles[size], multiple && (size === 'xs' ? s.chipShellRadiusXs : s.chipShellRadius), invalid && controlStyles.invalid, readOnly && controlStyles.readOnly, disabled && controlStyles.disabled,
      ).className ?? ''}>
        {startAddon && <span aria-hidden="true" {...stylex.props(s.addon, fieldInset[size], disabled && s.muted)}>{startAddon}</span>}
        {multiple
          ? <div {...stylex.props(s.chipWrap, chipWrapPad[size], !!startAddon && addonGap[size])}>
            <Chips removable={!disabled && !readOnly} disabled={disabled} size={size} />
            <FieldInput placeholder={placeholder} inputRef={inputRef} multiple inputStyle={inputStyle} />
          </div>
          : <FieldInput placeholder={placeholder} inputRef={inputRef} multiple={false} inputStyle={inputStyle} />}
        {isLoading
          ? <Spinner size={size} />
          : isClearable && !readOnly && !disabled && <ClearButton size={size} inputRef={inputRef} />}
        {trigger && !readOnly && <AriaButton {...stylex.props(controlStyles.fieldButton, fieldButtonSizeStyles[size], s.hit)}>
          <Icon name="chevron-down" size={sizeScale[size].icon} />
        </AriaButton>}
      </Group>
      {autoHighlight && <AutoHighlight />}
      <Popover offset={6} placement="bottom start" className={popupClassName}>
        <CatalogList entries={entries} emptyMessage={emptyMessage} isLoading={isLoading} loadingMessage={loadingMessage} />
      </Popover>
      {ownMessages && hasContent(description) && !invalid && <Text slot="description" {...stylex.props(controlStyles.description, disabled && s.muted)}>{description}</Text>}
      {ownMessages && <FieldError {...stylex.props(controlStyles.description, controlStyles.error)}>{message}</FieldError>}
    </>}
  </AriaComboBox>;
}

// ---------------------------------------------------------------------------------------------
// Select-like trigger with a list popup (Select appearance="field", Combobox inputPlacement="popup")

export interface ButtonPickerProps {
  label?: string;
  hideLabel?: boolean;
  placeholder?: ReactNode;
  entries: readonly CatalogEntry[];
  size?: ControlSize;
  selectionMode?: SelectionMode;
  /** Controlled: the picker never keeps its own value. */
  value: Key | readonly Key[] | null;
  onChange: (value: Key | Key[] | null) => void;
  name?: string;
  form?: string;
  id?: string;
  autoFocus?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
  isRequired?: boolean;
  isReadOnly?: boolean;
  validationBehavior?: 'native' | 'aria';
  disabledKeys?: Iterable<Key>;
  description?: ReactNode;
  errorMessage?: ReactNode;
  startAddon?: ReactNode;
  /** Puts a search field at the top of the popup. */
  searchable?: boolean;
  searchPlaceholder?: string;
  searchLabel?: string;
  inputValue?: string;
  defaultInputValue?: string;
  onInputChange?: (value: string) => void;
  filter?: (textValue: string, inputValue: string) => boolean;
  emptyMessage?: ReactNode;
  isLoading?: boolean;
  loadingMessage?: ReactNode;
  onOpenChange?: (isOpen: boolean) => void;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLDivElement>;
}

export function ButtonPicker({
  label, hideLabel, placeholder = 'Select an option', entries, size = 'md', selectionMode = 'single', value, onChange,
  isReadOnly, isDisabled, isInvalid, isRequired, disabledKeys, description, errorMessage, startAddon, searchable,
  searchPlaceholder = 'Search…', searchLabel, inputValue, defaultInputValue, onInputChange, filter,
  emptyMessage = 'No matching options', isLoading, loadingMessage = 'Loading…', onOpenChange, id, className, style, ref,
  'aria-labelledby': ariaLabelledBy, 'aria-describedby': ariaDescribedBy, ...props
}: ButtonPickerProps) {
  const field = useContext(FieldContext);
  const bound = bindField(field, {
    id, label, labelledBy: ariaLabelledBy, describedBy: ariaDescribedBy,
    isInvalid, message: errorMessage, isRequired, isDisabled, isReadOnly,
  });
  const { disabled, readOnly } = bound;
  const [open, setOpen] = useState(false);
  const { contains } = useFilter({ sensitivity: 'base' });
  const rootProps = stylex.props(controlStyles.stack, s.root);
  const list = <CatalogList entries={entries} emptyMessage={emptyMessage} isLoading={isLoading} loadingMessage={loadingMessage} withSearch={searchable} />;
  const ownMessages = !field || hasContent(description) || hasContent(errorMessage);

  return <AriaSelect<object, SelectionMode> {...props}
    ref={ref}
    id={bound.id}
    aria-labelledby={bound.labelledBy}
    aria-describedby={bound.describedBy}
    className={withClassName(rootProps, className)}
    style={{ ...rootProps.style, ...style }}
    selectionMode={selectionMode}
    value={value as never}
    onChange={(next: Key | Key[] | null) => { if (!readOnly) onChange(next); }}
    isOpen={open && !readOnly}
    onOpenChange={next => {
      if (readOnly && next) return;
      setOpen(next);
      onOpenChange?.(next);
    }}
    isDisabled={disabled}
    isInvalid={bound.invalid}
    isRequired={bound.required}
    disabledKeys={disabledKeysOf(entries, disabledKeys)}
    allowsEmptyCollection>
    {({ isInvalid: invalid, isOpen }) => <>
      <PickerLabel label={label} hidden={hideLabel} disabled={disabled} required={bound.required} />
      <AriaButton className={stylex.props(
        controlStyles.shell, controlShellSizeStyles[size], radiusStyles[size], s.trigger, fieldInset[size], gapStyles[size], triggerText[size],
        readOnly ? fieldInsetEnd[size] : s.triggerWithChevron,
        isOpen && (invalid ? s.triggerOpenInvalid : s.triggerOpen),
        invalid && controlStyles.invalid, readOnly && controlStyles.readOnly, readOnly && s.triggerReadOnly,
        disabled && controlStyles.disabled,
      ).className ?? ''}>
        {startAddon && <span aria-hidden="true" {...stylex.props(s.addon, disabled && s.muted)}>{startAddon}</span>}
        <SelectValue {...stylex.props(s.value)}>
          {({ isPlaceholder, defaultChildren }) => isPlaceholder
            ? <span {...stylex.props(s.placeholder, disabled && s.muted)}>{placeholder}</span>
            : defaultChildren}
        </SelectValue>
        {!readOnly && <span aria-hidden="true" {...stylex.props(s.chevron, fieldButtonSizeStyles[size], disabled && s.muted)}>
          <Icon name="chevron-down" size={sizeScale[size].icon} />
        </span>}
      </AriaButton>
      <Popover offset={6} placement="bottom start" className={popupClassName}>
        {searchable
          ? <AriaAutocomplete filter={filter ?? contains} inputValue={inputValue} defaultInputValue={defaultInputValue} onInputChange={onInputChange}>
            <SearchField aria-label={searchLabel ?? (label ? `Search ${label.toLocaleLowerCase()}` : 'Search')} autoFocus {...stylex.props(s.search)}>
              <Icon name="search" size={16} />
              <AriaInput placeholder={searchPlaceholder} {...stylex.props(s.searchInput)} />
            </SearchField>
            {list}
          </AriaAutocomplete>
          : list}
      </Popover>
      {ownMessages && hasContent(description) && !invalid && <Text slot="description" {...stylex.props(controlStyles.description, disabled && s.muted)}>{description}</Text>}
      {ownMessages && <FieldError {...stylex.props(controlStyles.description, controlStyles.error)}>{errorMessage}</FieldError>}
    </>}
  </AriaSelect>;
}

// ---------------------------------------------------------------------------------------------
// Combobox with the input inside the popup (inputPlacement="popup")

/** Maps Combobox props onto ButtonPicker: a select-like trigger, the search field inside the popup. */
export function PopupSuggestionInput({
  label, hideLabel, options, placeholder, searchPlaceholder, size, selectionMode = 'single', value, defaultValue, onChange,
  selectedKey, defaultSelectedKey, onSelectionChange, errorMessage, error, isInvalid, defaultFilter, inputValue,
  defaultInputValue, onInputChange, onOpenChange, name, form, id, autoFocus, isDisabled, isRequired, isReadOnly,
  validationBehavior, disabledKeys, description, startAddon, emptyMessage, isLoading, loadingMessage, className, style, ref,
  'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, 'aria-describedby': ariaDescribedBy,
}: ComboboxProps<SelectionMode>) {
  const multiple = selectionMode === 'multiple';
  const initial = (defaultValue ?? defaultSelectedKey ?? (multiple ? [] : null)) as Key | readonly Key[] | null;
  const controlledValue = (value !== undefined ? value : selectedKey) as Key | readonly Key[] | null | undefined;
  const [current, setCurrent] = useControlledValue<Key | readonly Key[] | null>(controlledValue, initial, next => {
    (onChange as ((value: Key | Key[] | null) => void) | undefined)?.(next as Key | Key[] | null);
    if (!multiple) onSelectionChange?.(next as Key | null);
  });
  const message = errorMessage ?? error;
  return <ButtonPicker
    label={label} hideLabel={hideLabel} placeholder={placeholder} entries={options} size={normalizeSize(size)}
    selectionMode={selectionMode} value={current} onChange={setCurrent} name={name} form={form} id={id} autoFocus={autoFocus}
    isDisabled={isDisabled} isInvalid={isInvalid} isRequired={isRequired}
    isReadOnly={isReadOnly} validationBehavior={validationBehavior} disabledKeys={disabledKeys} description={description}
    errorMessage={message} startAddon={startAddon} searchable searchPlaceholder={searchPlaceholder}
    inputValue={inputValue} defaultInputValue={defaultInputValue} onInputChange={onInputChange} filter={defaultFilter}
    emptyMessage={emptyMessage} isLoading={isLoading} loadingMessage={loadingMessage}
    onOpenChange={open => onOpenChange?.(open, 'manual')}
    aria-label={ariaLabel} aria-labelledby={ariaLabelledBy} aria-describedby={ariaDescribedBy}
    className={className} style={style} ref={ref} />;
}
