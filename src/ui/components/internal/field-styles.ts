import * as stylex from '@stylexjs/stylex';
import { createContext } from 'react';
import { tokens as t } from '../../tokens.stylex';
import type { ControlSize } from './size';

// The field shell of TextField and DatePicker (and the label/help/error lines of Select, Textarea,
// OtpField and Slider). Same rules as controlStyles.shell (./control); this shell defaults to the
// xl size (48, 16/24 value text), which is TextField's. DatePicker sets its size with fieldShellSizeStyles.

const ring = t['--os-color-focus-ring'];
// Field text inset per size (spec 1.2) less the shell's 1px border: 8 / 12 / 14 / 16 / 16 -> 7 / 11 / 13 / 15 / 15.
const insetXs = `calc(${t['--os-space-2']} - 1px)`;
const insetSm = `calc(${t['--os-space-3']} - 1px)`;
const insetLg = `calc(${t['--os-space-4']} - 1px)`;
const reduce = '@media (prefers-reduced-motion: reduce)';
const canHover = '@media (hover: hover)';

export const fieldStyles = stylex.create({
  root: { display: 'flex', flexDirection: 'column', gap: t['--os-space-2'], minWidth: 0 },
  /** Field label: 14/20 500. */
  label: { fontSize: t['--os-font-size-sm'], fontWeight: t['--os-font-weight-medium'], letterSpacing: t['--os-tracking-tight'], lineHeight: t['--os-line-height-md'] },
  /**
   * Bordered shell, xl by default: it owns the 48px height. border-subtle at rest, border-muted on
   * hover, the edge ring on focus. For another size add `fieldShellSizeStyles[size]`.
   */
  shell: {
    position: 'relative', display: 'flex', alignItems: 'center', gap: t['--os-space-2'], width: '100%', height: t['--os-size-xl'], minWidth: 0,
    paddingInline: insetLg, borderRadius: t['--os-radius-control'], borderStyle: 'solid', borderWidth: 1,
    borderColor: {
      default: t['--os-color-border-subtle'],
      ':hover:not(:focus-within)': { default: null, [canHover]: t['--os-color-border-muted'] },
      ':focus-within': ring,
    },
    backgroundColor: t['--os-color-bg-surface'],
    boxShadow: { default: 'none', ':focus-within': `inset 0 0 0 1px ${ring}` },
    color: t['--os-color-fg-base'], fontFamily: t['--os-font-family'], fontSize: t['--os-font-size-body'],
    lineHeight: t['--os-line-height-lg'], letterSpacing: t['--os-tracking-tight'], textAlign: 'start',
    transitionProperty: 'border-color, box-shadow, background-color',
    transitionDuration: { default: t['--os-motion-hover'], [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  /** Invalid shell: 1px border-error at rest and on hover, the edge ring in border-error on focus, no tint. */
  invalid: {
    borderColor: t['--os-color-border-error'],
    boxShadow: { default: 'none', ':focus-within': `inset 0 0 0 1px ${t['--os-color-border-error']}` },
  },
  /** Invalid for a borderless shell (Select morph, OTP cells, Composer): an inset 1px border-error ring. */
  invalidBorderless: { boxShadow: `inset 0 0 0 1px ${t['--os-color-border-error']}` },
  /** Disabled: border-disabled, bg-disabled, fg-disabled, no hover change. */
  disabled: {
    borderColor: t['--os-color-border-disabled'], backgroundColor: t['--os-color-bg-disabled'],
    color: t['--os-color-fg-disabled'], cursor: 'default',
  },
  /** Read-only: bg-subtle, border-subtle with no hover change; the focus edge still shows. */
  readOnly: {
    backgroundColor: t['--os-color-bg-subtle'], color: t['--os-color-fg-base'],
    borderColor: { default: t['--os-color-border-subtle'], ':focus-within': ring },
  },
  /** Help text under a control: 13/20 fg-muted. */
  help: { margin: 0, fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-md'], letterSpacing: t['--os-tracking-tight'], color: t['--os-color-fg-muted'] },
  /** Error line: 13/20 fg-error. It replaces the help text. */
  error: { margin: 0, fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-md'], letterSpacing: t['--os-tracking-tight'], color: t['--os-color-fg-error'] },
  /** The ` *` after the label of a required field: fg-muted, hidden from assistive tech (spec 1.11). */
  required: { color: t['--os-color-fg-muted'], fontWeight: t['--os-font-weight-regular'] },
  /** The label of a disabled control (spec 1.8). */
  labelDisabled: { color: t['--os-color-fg-disabled'] },
  /** A help or error line with a character count at its end. */
  messageRow: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: t['--os-space-3'], minWidth: 0 },
  /** A character count: 13/20 fg-muted, tabular figures, end-aligned. */
  count: {
    flexShrink: 0, marginInlineStart: 'auto', fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-md'],
    letterSpacing: t['--os-tracking-tight'], color: t['--os-color-fg-muted'], fontVariantNumeric: 'tabular-nums',
  },
  /** The raised label of a floating field: 12/16 500 fg-muted, stacked straight on the value (16 + 24 at xl, 16 + 20 in the Select morph). */
  smallLabel: { display: 'block', fontSize: t['--os-font-size-xs'], lineHeight: t['--os-line-height-xs'], letterSpacing: 0, color: t['--os-color-fg-muted'], fontWeight: t['--os-font-weight-medium'], marginBottom: 0 },
});

/**
 * Shell height, text inset and value size per size (spec 1.2) for `fieldStyles.shell`, whose
 * children sit directly in the shell (padding lives on the shell, not on the input).
 * The 16px value on coarse pointers stops iOS from zooming on focus.
 */
export const fieldShellSizeStyles = stylex.create({
  xs: {
    height: t['--os-size-xs'], paddingInline: insetXs, gap: t['--os-space-1'], borderRadius: `calc(${t['--os-radius-control']} - ${t['--os-radius-md']} + ${t['--os-radius-sm']})`,
    fontSize: { default: t['--os-font-size-xs'], '@media (pointer: coarse)': t['--os-font-size-body'] }, lineHeight: t['--os-line-height-xs'], letterSpacing: 0,
  },
  sm: {
    height: t['--os-size-sm'], paddingInline: insetSm, gap: t['--os-space-1-5'],
    fontSize: { default: t['--os-font-size-caption'], '@media (pointer: coarse)': t['--os-font-size-body'] }, lineHeight: t['--os-line-height-sm'],
  },
  md: {
    height: t['--os-size-md'],
    // os-allow raw-space: spec 1.2 md field inset 14 less the 1px border (14 has no space token)
    paddingInline: 13,
    fontSize: { default: t['--os-font-size-sm'], '@media (pointer: coarse)': t['--os-font-size-body'] }, lineHeight: t['--os-line-height-md'],
  },
  lg: {
    height: t['--os-size-lg'], paddingInline: insetLg,
    fontSize: { default: t['--os-font-size-md'], '@media (pointer: coarse)': t['--os-font-size-body'] }, lineHeight: t['--os-line-height-md'],
  },
  xl: { height: t['--os-size-xl'], paddingInline: insetLg, fontSize: t['--os-font-size-body'], lineHeight: t['--os-line-height-lg'] },
});


/**
 * What an InputGroup tells the controls inside it: the size they take, and the group's invalid,
 * disabled and read-only state. Input and Textarea read it and render as the group's inner
 * control (no edge of their own). `registerMultiline` is called by a Textarea or a block addon
 * so the group lets its height follow the content; it returns the unregister function.
 */
export interface FieldGroupContextValue {
  size: ControlSize;
  invalid: boolean;
  disabled: boolean;
  readOnly: boolean;
  registerMultiline?: () => () => void;
}

export const FieldGroupContext = createContext<FieldGroupContextValue | null>(null);
