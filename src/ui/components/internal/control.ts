import * as stylex from '@stylexjs/stylex';
import { createContext } from 'react';
import type { ValidationResult } from 'react-aria-components';
import { tokens as t } from '../../tokens.stylex';

// Text-entry fields built from a bordered shell plus an inner input (DESIGN_SPEC 1.2, 1.5, 1.8):
// Input, Combobox, Autocomplete, NumberField, InputGroup. The shell owns the height; the inner
// input fills it. Keys are kept for existing consumers; see internal/README.md for when to use which.

const ring = t['--os-color-focus-ring'];
const reduce = '@media (prefers-reduced-motion: reduce)';
const canHover = '@media (hover: hover)';

// Inline field buttons (spec 1.8): hover steps the icon to fg-base and fills bg-interactive-primary; pressed
// steps the fill to bg-interactive-secondary; disabled gets neither. The press and disabled cases are nested
// under :hover so they outrank the hover rule (StyleX orders :active:hover and :disabled:hover after :hover).
const inlineButtonColor = {
  default: t['--os-color-fg-muted'],
  ':hover': { default: null, [canHover]: { default: t['--os-color-fg-base'], ':disabled': t['--os-color-fg-disabled'] } },
  ':disabled': t['--os-color-fg-disabled'],
} as const;
const inlineButtonFill = {
  default: 'transparent',
  ':hover': { default: null, [canHover]: { default: t['--os-color-bg-interactive-primary'], ':active': t['--os-color-bg-interactive-secondary'], ':disabled': 'transparent' } },
  ':active': { default: t['--os-color-bg-interactive-secondary'], ':disabled': 'transparent' },
} as const;

export const controlStyles = stylex.create({
  stack: { display: 'grid', gap: t['--os-space-2'], minWidth: 0, width: '100%' },
  /** Field label: 14/20 500. */
  label: {
    color: t['--os-color-fg-base'], fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'],
    fontWeight: t['--os-font-weight-medium'], letterSpacing: t['--os-tracking-tight'],
  },
  /** Help text: 13/20 fg-muted. Combine with `error` for the error line (it replaces the help text). */
  description: {
    display: 'block', color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-caption'],
    lineHeight: t['--os-line-height-md'], letterSpacing: t['--os-tracking-tight'], margin: 0,
  },
  error: { color: t['--os-color-fg-error'] },
  /**
   * The bordered shell: border-subtle at rest, border-muted on hover, and the edge ring on every
   * focus (border plus a 1px inset shadow in --os-color-focus-ring, reading as a 2px edge).
   * Add `controlShellSizeStyles[size]` for an explicit height; without it the shell takes its
   * height from the inner input (md: 38 + 2 = 40).
   */
  shell: {
    minWidth: 0, width: '100%', borderWidth: 1, borderStyle: 'solid',
    borderColor: {
      default: t['--os-color-border-subtle'],
      ':hover:not(:focus-within)': { default: null, [canHover]: t['--os-color-border-muted'] },
      ':focus-within': ring,
    },
    boxShadow: { default: 'none', ':focus-within': `inset 0 0 0 1px ${ring}` },
    borderRadius: t['--os-radius-control'], backgroundColor: t['--os-color-bg-surface'],
    color: t['--os-color-fg-base'],
    transitionProperty: 'border-color, box-shadow, background-color',
    transitionDuration: { default: t['--os-motion-hover'], [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  /** Invalid shell: 1px border-error at rest and on hover, the edge ring in border-error on focus, no tint. */
  invalid: {
    borderColor: t['--os-color-border-error'],
    boxShadow: { default: 'none', ':focus-within': `inset 0 0 0 1px ${t['--os-color-border-error']}` },
  },
  /** Invalid for a shell without a border (Select morph, OTP cells, Composer): an inset 1px ring. */
  invalidBorderless: { boxShadow: `inset 0 0 0 1px ${t['--os-color-border-error']}` },
  /** Disabled: swap colors (bg-disabled, fg-disabled, border-disabled), no hover change. */
  disabled: {
    backgroundColor: t['--os-color-bg-disabled'], color: t['--os-color-fg-disabled'],
    borderColor: t['--os-color-border-disabled'], cursor: 'default',
  },
  /** Read-only: bg-subtle, border-subtle with no hover change, text fg-base; the focus edge still shows. */
  readOnly: {
    backgroundColor: t['--os-color-bg-subtle'], color: t['--os-color-fg-base'],
    borderColor: { default: t['--os-color-border-subtle'], ':focus-within': ring },
  },
  row: { display: 'flex', alignItems: 'stretch', minWidth: 0 },
  /**
   * Value text of a field (md): inset 14 minus the 1px border, 14/20 at weight 400, 16px on coarse
   * pointers. The block padding gives the input an intrinsic md height, so a standalone Input that
   * is its own shell measures 40. No minHeight. For other sizes add `fieldInputSizeStyles[size]` (./size).
   */
  input: {
    minWidth: 0, width: '100%',
    // (height - 2px border - line height) / 2 centers one line: 9 at md.
    paddingBlock: `calc((${t['--os-size-md']} - 2px - ${t['--os-line-height-md']}) / 2)`,
    // os-allow raw-space: spec 1.2 md field inset 14 less the 1px border (14 has no space token)
    paddingInline: 13,
    color: 'inherit', backgroundColor: 'transparent', fontFamily: 'inherit',
    fontSize: { default: t['--os-font-size-sm'], '@media (pointer: coarse)': t['--os-font-size-body'] },
    fontWeight: t['--os-font-weight-regular'], lineHeight: t['--os-line-height-md'], letterSpacing: t['--os-tracking-tight'],
    '::placeholder': { color: t['--os-color-fg-muted'], opacity: 1 },
  },
  /**
   * The inner input of a bordered shell: no own edge or ring, no minHeight, and it fills the shell's
   * height by stretching (a percentage height does not resolve while the shell's height is auto,
   * and Chrome then sizes the input on its normal line height, 3px short).
   */
  inputInner: { outline: 'none', borderStyle: 'none', alignSelf: 'stretch' },
  /** @deprecated The edge ring is part of `shell` now. Kept so existing compositions stay valid; it repeats the shell's focus shadow. */
  focusShell: { boxShadow: { default: 'none', ':focus-within': `inset 0 0 0 1px ${ring}` } },
  /** Legacy inline button (NumberField steppers, Calendar navigation). New work uses `fieldButton`. Same states. */
  iconButton: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: t['--os-size-sm'],
    paddingInline: t['--os-space-1-5'], flexShrink: 0, borderRadius: `max(${t['--os-radius-sm']}, calc(${t['--os-radius-control']} - 4px))`,
    cursor: { default: 'pointer', ':disabled': 'default' },
    color: inlineButtonColor,
    backgroundColor: inlineButtonFill,
    transitionProperty: 'background-color, color, transform',
    transitionDuration: { default: `${t['--os-motion-hover']}, ${t['--os-motion-hover']}, ${t['--os-motion-press']}`, [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
    transform: { default: 'none', '@media (prefers-reduced-motion: no-preference)': { default: 'none', ':active:not(:disabled)': 'scale(.97)' } },
  },
  buttonInset: { margin: t['--os-space-0-5'] },
  /**
   * Inline button inside a field (chevron, clear, steppers, calendar): size sm 32x32, inset 4px from
   * the shell's outer edge (3px inside its 1px border), radius max(sm, control - 4): 6 at Standard, a circle
   * at Round. In lg and xl shells it stays 32 and centers (inset 6 / 8); in sm and xs shells it shrinks to
   * keep the 4px inset (24 / 16). States (spec 1.8): icon fg-muted -> fg-base and fill bg-interactive-primary
   * on hover, bg-interactive-secondary and scale .97 while pressed, fg-disabled with no hover or press when
   * disabled. Hit area at least 24px, 44px on coarse pointers (spec 1.14).
   * Put an `<Icon size={16}>` inside. Hide it on read-only fields.
   */
  fieldButton: {
    position: 'relative', display: 'inline-grid', placeItems: 'center', alignSelf: 'center', flexShrink: 0,
    width: t['--os-size-sm'], height: t['--os-size-sm'], padding: 0,
    // The 4px inset less the shell's 1px border.
    marginInline: `calc(${t['--os-space-1']} - 1px)`,
    borderRadius: `max(${t['--os-radius-sm']}, calc(${t['--os-radius-control']} - 4px))`,
    cursor: { default: 'pointer', ':disabled': 'default' },
    color: inlineButtonColor,
    backgroundColor: inlineButtonFill,
    transitionProperty: 'background-color, color, transform',
    transitionDuration: { default: `${t['--os-motion-hover']}, ${t['--os-motion-hover']}, ${t['--os-motion-press']}`, [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
    transform: { default: 'none', '@media (prefers-reduced-motion: no-preference)': { default: 'none', ':active:not(:disabled)': 'scale(.97)' } },
    '::after': {
      content: '""', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      width: { default: 'max(100%, 24px)', '@media (pointer: coarse)': 'max(100%, 44px)' },
      height: { default: 'max(100%, 24px)', '@media (pointer: coarse)': 'max(100%, 44px)' },
    },
  },
  /** Anchored list popup (Combobox, Autocomplete, Composer suggestions): spec 1.9 surface, list padding 6. */
  popup: {
    '--os-color-bg-surface': t['--os-color-bg-elevated'],
    width: 'var(--trigger-width)', maxWidth: 'calc(100vw - 24px)',
    padding: t['--os-space-1-5'], backgroundColor: t['--os-color-bg-elevated'], color: t['--os-color-fg-base'],
    borderWidth: 1, borderStyle: 'solid', borderColor: t['--os-color-border-subtle'],
    borderRadius: t['--os-radius-lg'], boxShadow: t['--os-shadow-popup'], transformOrigin: 'top center',
    fontFamily: t['--os-font-family'], fontSize: t['--os-font-size-sm'], fontWeight: t['--os-font-weight-regular'],
    lineHeight: t['--os-line-height-md'], letterSpacing: t['--os-tracking-tight'],
  },
  /** List option: 36 tall, radius 10 (16 - 6), padding-inline 10, 14/20 at 400. */
  option: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: t['--os-space-2'], minHeight: 36,
    // os-allow raw-space: spec 1.9 item padding 10, so text sits 16 from the surface edge with the 6px list padding
    paddingInline: 10,
    borderRadius: t['--os-radius-md'], cursor: 'pointer',
    fontSize: t['--os-font-size-sm'], fontWeight: t['--os-font-weight-regular'], lineHeight: t['--os-line-height-md'],
    letterSpacing: t['--os-tracking-tight'], outline: 'none',
  },
  /** Hover and virtual focus share this fill (spec 1.8). */
  optionActive: { backgroundColor: t['--os-color-bg-interactive-primary'] },
  /** The selected option: weight 500 and a 16px check at the end, no fill. */
  optionSelected: { color: t['--os-color-fg-base'], fontWeight: t['--os-font-weight-medium'] },
  optionDisabled: { color: t['--os-color-fg-disabled'], cursor: 'default' },
  /** The focus ring (spec 1.8). Same as `focusStyles.ring` in ./states. */
  focus: { outlineWidth: 2, outlineStyle: 'solid', outlineColor: ring, outlineOffset: 2 },
});

/**
 * The inline field button per shell size (spec 1.2), composed after `controlStyles.fieldButton`: sm 32 from md up,
 * centered in the shell (inset 4 at md, 6 at lg, 8 at xl, so a circle stays concentric with a pill shell); shorter
 * shells shrink it to keep the 4px inset (sm 24, xs 16). marginInline is the inset less the 1px border. Every
 * field's chevron, clear button, spinner slot, steppers and calendar button use it.
 */
export const fieldButtonSizeStyles = stylex.create({
  xs: { width: t['--os-size-2xs'], height: t['--os-size-2xs'], marginInline: `calc(${t['--os-space-1']} - 1px)` },
  sm: { width: t['--os-size-xs'], height: t['--os-size-xs'], marginInline: `calc(${t['--os-space-1']} - 1px)` },
  md: { width: t['--os-size-sm'], height: t['--os-size-sm'], marginInline: `calc(${t['--os-space-1']} - 1px)` },
  lg: { width: t['--os-size-sm'], height: t['--os-size-sm'], marginInline: `calc((${t['--os-size-lg']} - ${t['--os-size-sm']}) / 2 - 1px)` },
  xl: { width: t['--os-size-sm'], height: t['--os-size-sm'], marginInline: `calc((${t['--os-size-xl']} - ${t['--os-size-sm']}) / 2 - 1px)` },
});

/** Explicit shell heights per size (spec 1.2). The inner input (with `inputInner`) fills them. */
export const controlShellSizeStyles = stylex.create({
  xs: { height: t['--os-size-xs'] },
  sm: { height: t['--os-size-sm'] },
  md: { height: t['--os-size-md'] },
  lg: { height: t['--os-size-lg'] },
  xl: { height: t['--os-size-xl'] },
});

/**
 * The validity a Field shows (spec 1.8 Invalid). `isInvalid` is what the field displays: an explicit
 * `isInvalid`, a static error message, a server error from Form `validationErrors`, or a failed
 * native constraint once the control has been touched. `validationDetails` is the control's live
 * native ValidityState; `validationErrors` holds the server messages, or the browser's messages.
 */
export interface FieldValidityState extends ValidationResult {
  /** True once the control was edited and blurred, or its form was submitted. */
  isTouched: boolean;
}

/**
 * Provided by Field (spec 1.11, one field system). Every control inside a Field reads it:
 * - `id` goes on the control; the label's `htmlFor` points at it.
 * - `descriptionId` goes in the control's `aria-describedby`: the visible message (the error when
 *   one shows, otherwise the description), or undefined when there is none.
 * - `invalid`, `required`, `disabled`, `readOnly` drive the control's state and its ARIA.
 * - `labelId` names controls that cannot use a `<label for>` (groups, RAC composites) through
 *   `aria-labelledby`. Undefined when the field has no visible label.
 */
export interface FieldContextValue {
  id: string;
  descriptionId?: string;
  invalid: boolean;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  labelId?: string;
  validation?: FieldValidityState;
}

export const FieldContext = createContext<FieldContextValue | null>(null);

/** Provided by Fieldset: a disabled fieldset dims its legend and every Field inside it. */
export interface FieldsetContextValue {
  disabled?: boolean;
  variant?: 'outline' | 'plain';
}

export const FieldsetContext = createContext<FieldsetContextValue | null>(null);
export const InputGroupContext = createContext(false);
