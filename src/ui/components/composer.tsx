'use client';

import * as stylex from '@stylexjs/stylex';
import { cloneElement, isValidElement, useCallback, useContext, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, FormEvent, KeyboardEvent, MouseEvent, ReactElement, ReactNode, Ref } from 'react';
import { Button as AriaButton, ListBox, ListBoxItem, Popover, Select as AriaSelect, SelectValue } from 'react-aria-components';
import type { Key } from 'react-aria-components';
import { tokens as t } from '../tokens.stylex';
import { Button } from './button';
import { Icon, type IconProps } from './Icon';
import { Kbd } from './kbd';
import { useIsApple } from './internal/platform';
import { withClassName } from './internal/class-name';
import { controlStyles, FieldContext } from './internal/control';
import { overlayItemStyles, overlayStyles, popupPlacement } from './internal/overlay';
import { pillIconPaddingStartStyles, pillPaddingStyles, textStyles, typeStyles } from './internal/size';
import { disabledStyles, focusStyles, invalidStyles, loadingStyles, pressStyles, transitionStyles } from './internal/states';

// Composer (DESIGN_SPEC 2.2 Composer, 1.20 Chat). 240x48 at rest, 340x116 once focused or filled,
// growing with its text, on a radius-2xl surface; the widths are default max widths (`fullWidth`, or a
// ChatThread, spans its column). The surface grows on the settle
// curve: it is a big object, so it never overshoots (no spring). Everything else follows Part 1: insets on
// the spacing scale, fg-muted placeholder and tools, the edge ring on the surface while the field has focus
// (an inset 2px ring, as the surface has no border), the borderless invalid ring, an RAC listbox for the
// model with 36px rows, sm 32 tools and chips with hover fills and the 2px focus ring, Icons for every
// glyph, color swaps (no opacity) for disabled, and help text on the outer edge (1.11).

const ring = t['--os-color-focus-ring'];
const errorEdge = t['--os-color-border-error'];
const reduce = '@media (prefers-reduced-motion: reduce)';
const canHover = '@media (hover: hover)';
const coarse = '@media (pointer: coarse)';

/** Rest height of the field (xl, 48), and the extra height of the attachment row (one sm chip, 32). */
const restHeight = 48;
const attachmentRow = 32;

/** Tools, chips and the send button sit 8 in from the 2xl surface: the nesting rule, a pill at 32 tall. */
const inner = `max(${t['--os-radius-sm']}, calc(${t['--os-radius-2xl']} - ${t['--os-space-2']}))`;
/** The text starts 20 in (card padding md) and, at rest, stops short of the send button: 32 + its 8 inset + 12. */
const fieldStart = t['--os-space-5'];
const fieldEndRest = `calc(${t['--os-size-sm']} + ${t['--os-space-2']} + ${t['--os-space-3']})`;
const fieldEndOpen = t['--os-space-4'];
/** Block padding that centers one line in the 48px rest height: 14 (12 on touch, where the line is 24). */
const fieldPad = `calc((${t['--os-size-xl']} - ${t['--os-line-height-md']}) / 2)`;
const fieldPadCoarse = `calc((${t['--os-size-xl']} - ${t['--os-line-height-lg']}) / 2)`;

const s = stylex.create({
  root: {
    display: 'grid', gap: t['--os-space-2'], minWidth: 0, width: '100%', maxWidth: 240, marginInline: 'auto', boxSizing: 'border-box',
    transitionProperty: 'max-width', transitionDuration: { default: t['--os-motion-layout'], [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  rootExpanded: { maxWidth: 340 },
  rootFull: { maxWidth: '100%' },
  surface: {
    position: 'relative', boxSizing: 'border-box', width: '100%', minWidth: 0, height: restHeight, margin: 0,
    borderRadius: t['--os-radius-2xl'], backgroundColor: t['--os-color-bg-surface'], color: t['--os-color-fg-base'],
    fontFamily: t['--os-font-family'], boxShadow: 'none',
    transitionProperty: 'height, box-shadow, background-color',
    transitionDuration: { default: `${t['--os-motion-layout']}, ${t['--os-motion-hover']}, ${t['--os-motion-hover']}`, [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  surfaceExpanded: { height: 116 },
  surfaceExpandedAttachments: { height: 116 + attachmentRow },
  surfaceHeight: (height: number) => ({ height }),
  /** On a white canvas the surface needs an edge: a hairline and the control shadow (spec 1.6). */
  outline: { boxShadow: `inset 0 0 0 ${t['--os-stroke']} ${t['--os-color-border-muted']}, ${t['--os-shadow-control']}` },
  /** The edge ring (spec 1.8) while the field has focus: the surface has no border, so a 2px inset ring. */
  focused: { boxShadow: `inset 0 0 0 ${t['--os-stroke-2']} ${ring}` },
  invalid: { boxShadow: `inset 0 0 0 ${t['--os-stroke']} ${errorEdge}` },
  invalidFocused: { boxShadow: `inset 0 0 0 ${t['--os-stroke-2']} ${errorEdge}` },
  disabled: { backgroundColor: t['--os-color-bg-disabled'], color: t['--os-color-fg-disabled'] },
  textarea: {
    position: 'absolute', insetInlineStart: fieldStart, insetInlineEnd: fieldEndRest, top: 0, boxSizing: 'border-box',
    width: `calc(100% - ${fieldStart} - ${fieldEndRest})`, minWidth: 0, height: restHeight, margin: 0,
    paddingBlock: { default: fieldPad, [coarse]: fieldPadCoarse }, paddingInline: 0,
    borderStyle: 'none', outlineStyle: 'none', resize: 'none', overflowY: 'auto',
    // Scrolled text would show through the block padding as a half line; clip it to the content box.
    clipPath: { default: `inset(${fieldPad} 0 ${fieldPad} 0)`, [coarse]: `inset(${fieldPadCoarse} 0 ${fieldPadCoarse} 0)` },
    backgroundColor: 'transparent', color: 'inherit', fontFamily: 'inherit', fontWeight: t['--os-font-weight-regular'],
    fontSize: { default: t['--os-font-size-sm'], [coarse]: t['--os-font-size-body'] },
    lineHeight: { default: t['--os-line-height-md'], [coarse]: t['--os-line-height-lg'] },
    letterSpacing: t['--os-tracking-tight'],
    transitionProperty: 'top', transitionDuration: { default: t['--os-motion-layout'], [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
    '::placeholder': { color: t['--os-color-fg-muted'], opacity: 1 },
  },
  textareaExpanded: { top: t['--os-space-1'], insetInlineEnd: fieldEndOpen, width: `calc(100% - ${fieldStart} - ${fieldEndOpen})` },
  textareaBelowAttachments: { top: `calc(${t['--os-space-1']} + ${t['--os-size-sm']})` },
  textareaDisabled: { cursor: 'default', '::placeholder': { color: t['--os-color-fg-disabled'], opacity: 1 } },
  // Queued messages: a bg-muted wash 8 above the surface (the root's gap), rows 32 tall, 2 apart.
  queue: {
    display: 'grid', gap: t['--os-space-0-5'], margin: 0, padding: t['--os-space-1'],
    listStyleType: 'none', borderRadius: t['--os-radius-lg'], backgroundColor: t['--os-color-bg-muted'],
  },
  queueRow: { display: 'flex', alignItems: 'center', gap: t['--os-space-2'], minHeight: t['--os-size-sm'], paddingInlineStart: t['--os-space-2'], minWidth: 0 },
  queueIcon: { display: 'inline-flex', flexShrink: 0, color: t['--os-color-fg-muted'] },
  queueText: {
    flex: '1 1 auto', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
    color: t['--os-color-fg-base'], fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'], letterSpacing: t['--os-tracking-tight'],
  },
  queueNext: { flexShrink: 0, color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-xs'], lineHeight: t['--os-line-height-xs'] },
  runHint: {
    display: { default: 'flex', '@media (hover: none) and (pointer: coarse)': 'none' }, flexWrap: 'wrap', alignItems: 'center',
    columnGap: t['--os-space-3'], rowGap: t['--os-space-1'],
  },
  hintGroup: { display: 'inline-flex', alignItems: 'center', gap: t['--os-space-1'] },
  attachments: {
    position: 'absolute', insetBlockStart: t['--os-space-2'], insetInlineStart: t['--os-space-2'], insetInlineEnd: t['--os-space-2'],
    display: 'flex', gap: t['--os-space-1-5'], margin: 0, paddingBlock: 0, paddingInline: t['--os-space-1'], listStyleType: 'none',
    overflowX: 'auto', scrollbarWidth: 'none',
  },
  // An attachment is an sm chip (spec 1.2 sm, 1.19 chips): 32 tall, 13/18 500, a 16px icon 6 from the name, the sm
  // pill padding (12) with the icon side's 10 from the shared size maps.
  chip: {
    display: 'inline-flex', alignItems: 'center', gap: t['--os-space-1-5'], flexShrink: 0, boxSizing: 'border-box', maxWidth: 200,
    height: t['--os-size-sm'], borderRadius: inner,
    backgroundColor: t['--os-color-accent-subtle'], color: t['--os-color-fg-base'],
  },
  /** The 20px remove button sits concentric in the 32px chip: (32 - 20) / 2 from its end. */
  chipRemovable: { paddingInlineEnd: t['--os-space-1-5'] },
  chipIcon: { display: 'inline-flex', flexShrink: 0, color: t['--os-color-fg-muted'] },
  chipName: { minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  chipRemove: {
    position: 'relative', display: 'inline-grid', placeItems: 'center', flexShrink: 0, width: 20, height: 20,
    padding: 0, margin: 0, borderRadius: t['--os-radius-full'], cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
    color: { default: t['--os-color-fg-muted'], ':hover': { default: null, [canHover]: t['--os-color-fg-base'] } },
    backgroundColor: {
      default: 'transparent',
      ':hover': { default: null, [canHover]: t['--os-color-accent-muted'] },
      ':active': { default: t['--os-color-accent-dim'], [canHover]: t['--os-color-accent-dim'] },
    },
    transform: { default: 'none', ':active:not(:disabled)': { default: 'scale(.9)', [reduce]: 'none' } },
    '::after': {
      content: '""', position: 'absolute', insetBlockStart: '50%', insetInlineStart: '50%',
      width: { default: 'max(100%, 24px)', [coarse]: 'max(100%, 44px)' },
      height: { default: 'max(100%, 24px)', [coarse]: 'max(100%, 44px)' },
      transform: 'translate(-50%, -50%)',
    },
  },
  actions: {
    position: 'absolute', insetInlineStart: t['--os-space-2'], bottom: t['--os-space-2'], display: 'flex', alignItems: 'center',
    gap: t['--os-space-1'],
    // Clear of the send button: its 32, its 8 inset, an 8 gap, and the row's own 8 inset.
    maxWidth: `calc(100% - ${t['--os-size-sm']} - ${t['--os-space-2']} * 3)`,
    // The row overlaps the field at rest; only revealed tools take pointer events, so a click there focuses the field.
    pointerEvents: 'none',
  },
  reveal: {
    display: 'flex', alignItems: 'center', gap: t['--os-space-1'], minWidth: 0,
    opacity: 0, visibility: 'hidden', transform: { default: `translateY(${t['--os-space-1-5']})`, [reduce]: 'none' },
    transitionProperty: 'opacity, transform, visibility',
    transitionDuration: { default: t['--os-motion-hover'], [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-exit'],
  },
  revealShrink: { flexShrink: 1 },
  revealed: {
    opacity: 1, visibility: 'visible', transform: 'none', pointerEvents: 'auto',
    transitionDuration: { default: t['--os-motion-popup'], [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  revealDelay: (order: number) => ({ transitionDelay: { default: `${order * 40}ms`, [reduce]: '0ms' } }),
  tool: {
    position: 'relative', display: 'inline-flex', alignItems: 'center', gap: t['--os-space-1-5'], flexShrink: 0, boxSizing: 'border-box',
    height: t['--os-size-sm'], paddingInline: t['--os-space-3'], margin: 0, borderRadius: inner,
    fontFamily: 'inherit', whiteSpace: 'nowrap', cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
    color: { default: t['--os-color-fg-muted'], ':hover': { default: null, [canHover]: t['--os-color-fg-base'] } },
    backgroundColor: {
      default: 'transparent',
      ':hover': { default: null, [canHover]: t['--os-color-bg-interactive-primary'] },
      ':active': { default: t['--os-color-bg-interactive-secondary'], [canHover]: t['--os-color-bg-interactive-secondary'] },
    },
    // Hit area (spec 1.14): tools sit 4px apart, so it grows on the block axis only.
    '::after': {
      content: '""', position: 'absolute', insetBlockStart: '50%', insetInlineStart: 0, width: '100%',
      height: { default: 'max(100%, 24px)', [coarse]: 'max(100%, 44px)' },
      transform: 'translateY(-50%)',
    },
  },
  toolIcon: { justifyContent: 'center', width: t['--os-size-sm'], paddingInline: 0 },
  toolOpen: { color: t['--os-color-fg-base'], backgroundColor: t['--os-color-bg-interactive-primary'] },
  picker: { display: 'inline-flex', minWidth: 0, maxWidth: '100%' },
  modelTrigger: { minWidth: 0, maxWidth: '100%', flexShrink: 1 },
  modelLabel: { minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  popover: { display: 'flex', flexDirection: 'column' },
  modelList: {
    minWidth: 200, maxWidth: 'min(320px, calc(100vw - 24px))', maxHeight: 320, minHeight: 0,
    boxSizing: 'border-box', overflowY: 'auto', overscrollBehavior: 'contain',
  },
  modelItem: { cursor: 'pointer' },
  check: { display: 'inline-flex', marginInlineStart: 'auto', flexShrink: 0, color: t['--os-color-fg-base'] },
  bars: { display: 'inline-flex', alignItems: 'flex-end', gap: t['--os-space-0-5'], height: 12 },
  bar: (height: number) => ({ width: 3, height, borderRadius: t['--os-radius-full'], backgroundColor: t['--os-color-border-control'] }),
  barActive: { backgroundColor: 'currentColor' },
  sendPosition: { position: 'absolute', insetInlineEnd: t['--os-space-2'], bottom: t['--os-space-2'] },
  // No `position` here: `sendPosition` places the button absolutely, which also anchors its hit area.
  send: {
    display: 'grid', placeItems: 'center', boxSizing: 'border-box', width: t['--os-size-sm'], height: t['--os-size-sm'],
    padding: 0, margin: 0, borderRadius: inner, cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
    color: t['--os-color-fg-base'],
    backgroundColor: {
      default: t['--os-color-accent-subtle'],
      ':hover': { default: null, [canHover]: t['--os-color-accent-muted'] },
      ':active': { default: t['--os-color-accent-dim'], [canHover]: t['--os-color-accent-dim'] },
    },
    '::after': {
      content: '""', position: 'absolute', insetBlockStart: '50%', insetInlineStart: '50%',
      width: { default: '100%', [coarse]: 'max(100%, 44px)' },
      height: { default: '100%', [coarse]: 'max(100%, 44px)' },
      transform: 'translate(-50%, -50%)',
    },
  },
  sendReady: {
    color: t['--os-color-accent-on-accent'],
    backgroundColor: {
      default: t['--os-color-accent-moderate'],
      ':hover': { default: null, [canHover]: t['--os-color-accent-bold'] },
      ':active': { default: t['--os-color-accent-strong'], [canHover]: t['--os-color-accent-strong'] },
    },
  },
  glyph: {
    gridArea: '1 / 1', display: 'inline-flex',
    transitionProperty: 'opacity, transform', transitionDuration: { default: t['--os-motion-popup'], [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  glyphHidden: { opacity: 0, transform: { default: 'scale(.6)', [reduce]: 'none' } },
  spinner: { gridArea: '1 / 1', borderWidth: t['--os-stroke-2'] },
  suggestions: {
    position: 'absolute', insetInline: 0, insetBlockStart: `calc(100% + ${t['--os-space-1-5']})`, zIndex: `calc(${t['--os-z-tooltip']} - 10)`,
    display: 'grid', gap: t['--os-space-0-5'], boxSizing: 'border-box', width: '100%', margin: 0, listStyleType: 'none',
    maxHeight: 320, overflowY: 'auto', overscrollBehavior: 'contain',
  },
  suggestionsClosing: { pointerEvents: 'none' },
  option: { paddingBlock: t['--os-space-2'] },
  optionContent: { display: 'grid', minWidth: 0, overflowWrap: 'anywhere' },
  optionDescription: { color: t['--os-color-fg-muted'] },
  // Help, error and run keys start at the composer's outer edge, like every field's (spec 1.11 label alignment).
  message: { margin: 0 },
});

export interface ComposerSuggestion {
  id: string;
  label: string;
  description?: string;
  /** The text that replaces the typed token. Default `@id` or `/id`. */
  insertText?: string;
}

export interface ComposerModel { id: string; label: string; }
export type ComposerEffort = 'Low' | 'Medium' | 'High';

/** A file or item attached to the draft, shown as a chip above the text. */
export interface ComposerAttachment {
  id: string;
  name: string;
  /** Replaces the file icon. An `<Icon>` without a size takes the chip's 16. */
  icon?: ReactNode;
}

export type ComposerStatus = 'idle' | 'streaming';
/** A message waiting for the run to end. */
export type ComposerQueued = { id: string; text: string };

const defaultModels: readonly ComposerModel[] = [{ id: 'standard', label: 'Otherstates 1' }, { id: 'mini', label: 'Otherstates 1 Mini' }, { id: 'pro', label: 'Otherstates 1 Pro' }];
const efforts: readonly ComposerEffort[] = ['Low', 'Medium', 'High'];
const defaultFilter = (item: ComposerSuggestion, query: string) => `${item.id} ${item.label}`.toLowerCase().includes(query.toLowerCase());

export interface ComposerProps {
  /** Accessible name of the text field. Default "Message", or the label of a surrounding Field. */
  label?: string;
  placeholder?: string;
  /** The text (controlled). */
  value?: string;
  /** The text at first render (uncontrolled). */
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Called with the trimmed text when the reader sends. Not called with `withinForm`: the enclosing form submits instead. */
  onSubmit?: (message: string) => void;
  /** Replaces the attach button with your own controls. */
  actions?: ReactNode;
  onAttach?: () => void;
  /** Called by the microphone button, shown while the field is empty. */
  onDictate?: () => void;
  models?: readonly ComposerModel[];
  model?: string;
  defaultModel?: string;
  onModelChange?: (model: string) => void;
  effort?: ComposerEffort;
  defaultEffort?: ComposerEffort;
  onEffortChange?: (effort: ComposerEffort) => void;
  showModel?: boolean;
  showEffort?: boolean;
  /** Suggestions after "@". */
  mentions?: readonly ComposerSuggestion[];
  /** Suggestions after "/". */
  commands?: readonly ComposerSuggestion[];
  /** Decides which suggestions match the typed query. Default: the id or label contains it, ignoring case. */
  filter?: (item: ComposerSuggestion, query: string, trigger: '@' | '/') => boolean;
  /** Disables the field and every control. */
  isDisabled?: boolean;
  /** @deprecated Use `isDisabled`. */
  disabled?: boolean;
  /** Enter sends and Shift+Enter adds a line. When false, Enter adds a line and Cmd/Ctrl+Enter sends. Default true. */
  enterToSubmit?: boolean;
  /** Accessible name of the send button. Default "Send message". */
  submitLabel?: string;
  /** Accessible name of the microphone button. Default "Dictate". */
  dictateLabel?: string;
  /** Accessible name of the stop button while streaming. Default "Stop". */
  stopLabel?: string;
  /** `streaming` turns the send button into a stop button and holds new messages. Default `idle`. */
  status?: ComposerStatus;
  /** Called by the stop button, and by Escape in the field, while `status` is `streaming`. */
  onStop?: () => void;
  /**
   * While `status` is `streaming`, Enter and the send button give the message to the running agent now, so a
   * person can redirect a run without stopping it. Without it (and without `onQueue`) messages are held.
   */
  onSteer?: (message: string) => void;
  /** While streaming, Alt+Enter (Option+Enter) queues the message for when the run ends. With no `onSteer`, Enter queues too. */
  onQueue?: (message: string) => void;
  /** Messages waiting for the run to end, shown above the field in the order they will be sent. */
  queued?: readonly ComposerQueued[];
  /** Adds a remove button to each queued message. */
  onRemoveQueued?: (id: string) => void;
  /** Adds "Send now" to each queued message: it steers the run with that message at once. */
  onSendQueuedNow?: (id: string) => void;
  /** Accessible name of the send button while it steers a run. Default "Send to the running agent". */
  steerLabel?: string;
  /** Shows the run keys under the field while streaming: Enter steers, Alt+Enter queues, Escape stops. Default true. */
  showRunHint?: boolean;
  /** `filled` (default) for bg-subtle pages; `outline` adds a hairline and a soft shadow for a white canvas, such as a chat thread. */
  variant?: 'filled' | 'outline';
  /** Shows a spinner on the send button and holds new messages, for example while a message is being sent. */
  isLoading?: boolean;
  /** Files or items attached to the draft, shown as chips above the text. */
  attachments?: readonly ComposerAttachment[];
  /** Adds a remove button to each attachment chip. */
  onRemoveAttachment?: (id: string) => void;
  /** Lines the field grows to before it scrolls. Default 7. */
  maxRows?: number;
  /** Runs before the composer's own key handling. Call `preventDefault()` to skip it. */
  onKeyDown?: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  /** Name of the text field, submitted with its form. */
  name?: string;
  /** The id of the form the text field and send button belong to, with `withinForm`. */
  form?: string;
  /** Render a `div` instead of a `form`, for a composer inside another form. Enter and the send button then submit that form. */
  withinForm?: boolean;
  /** Marks the text field required. */
  isRequired?: boolean;
  /** Shows the invalid ring, and `errorMessage` in place of `description`. */
  isInvalid?: boolean;
  /** The error under the composer while it is invalid. */
  errorMessage?: ReactNode;
  /** Help text under the composer. */
  description?: ReactNode;
  /** Fill the container instead of the default 240 / 340 widths. Defaults to true inside a ChatThread, whose column it spans. */
  fullWidth?: boolean;
  /** Classes for the outer element. */
  className?: string;
  /** Inline styles for the outer element. */
  style?: CSSProperties;
  /** The outer element. */
  ref?: Ref<HTMLDivElement>;
  /** The text field. */
  inputRef?: Ref<HTMLTextAreaElement>;
}

type ShownList = { options: readonly ComposerSuggestion[]; symbol: string | undefined; index: number };
const hasContent = (node: ReactNode) => node != null && node !== false && node !== '';
/** An attachment's own `<Icon>` without a size takes the sm chip's icon size, 16 (spec 1.2). */
const chipIcon = (node: ReactNode) => isValidElement(node) && node.type === Icon && (node.props as IconProps).size === undefined
  ? cloneElement(node as ReactElement<IconProps>, { size: 16 }) : node;

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') ref(value);
  else if (ref) (ref as { current: T | null }).current = value;
}

export function Composer({
  label, placeholder = 'Ask anything…', value, defaultValue = '', onChange, onSubmit,
  actions, onAttach, onDictate, models = defaultModels, model, defaultModel, onModelChange, effort, defaultEffort = 'Medium', onEffortChange, showModel = true, showEffort = true,
  mentions = [], commands = [], filter = defaultFilter, isDisabled, disabled, enterToSubmit = true,
  submitLabel = 'Send message', dictateLabel = 'Dictate', stopLabel = 'Stop', status = 'idle', onStop, isLoading = false,
  onSteer, onQueue, queued = [], onRemoveQueued, onSendQueuedNow, steerLabel = 'Send to the running agent', showRunHint = true, variant = 'filled',
  attachments = [], onRemoveAttachment, maxRows = 7, onKeyDown, name, form, withinForm = false, isRequired, isInvalid,
  errorMessage, description, fullWidth, className, style, ref, inputRef,
}: ComposerProps) {
  const field = useContext(FieldContext);
  const apple = useIsApple();
  const off = !!(isDisabled ?? disabled ?? field?.disabled);
  const invalid = !!(isInvalid ?? field?.invalid);
  const required = isRequired ?? field?.required;
  const streaming = status === 'streaming';
  // A run can take a message when it can be steered or queued; otherwise new messages wait.
  const steerable = streaming && !!(onSteer || onQueue);
  const held = off || (streaming && !steerable) || isLoading;

  const [draft, setDraft] = useState(defaultValue);
  const [fieldHeight, setFieldHeight] = useState(restHeight);
  const [caret, setCaret] = useState(0);
  const [focused, setFocused] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [active, setActive] = useState(0);
  const [dismissed, setDismissed] = useState('');
  const [localModel, setLocalModel] = useState(defaultModel ?? models[0]?.id ?? '');
  const [localEffort, setLocalEffort] = useState<ComposerEffort>(defaultEffort);
  const [modelOpen, setModelOpen] = useState(false);
  const [closingList, setClosingList] = useState<ShownList | null>(null);
  const textarea = useRef<HTMLTextAreaElement | null>(null);
  const suggestionList = useRef<HTMLUListElement>(null);
  const pendingCaret = useRef<number | null>(null);
  const shownList = useRef<ShownList>({ options: [], symbol: undefined, index: 0 });
  const wasOpen = useRef(false);
  const listId = useId();
  const messageId = useId();

  const selectedModel = model ?? localModel;
  const selectedEffort = effort ?? localEffort;
  const effortIndex = efforts.indexOf(selectedEffort);
  const text = value ?? draft;
  const filled = text.trim().length > 0 || attachments.length > 0;
  const expanded = focusWithin || modelOpen || text.length > 0 || attachments.length > 0;
  const match = /(?:^|\s)([@/])([^\s@/]*)$/.exec(text.slice(0, caret));
  const query = match?.[2] ?? '';
  const symbol = match?.[1] as '@' | '/' | undefined;
  const tokenStart = caret - query.length - 1;
  const tokenKey = `${tokenStart}:${symbol}${query}`;
  const allSuggestions = symbol === '@' ? mentions : commands;
  const options = symbol ? allSuggestions.filter(item => filter(item, query, symbol)) : [];
  const menuOpen = !off && focused && options.length > 0 && dismissed !== tokenKey;
  const index = Math.min(active, Math.max(options.length - 1, 0));
  const showError = invalid && hasContent(errorMessage);
  const message = showError ? errorMessage : description;
  const describedBy = [field?.descriptionId, hasContent(message) ? messageId : undefined].filter(Boolean).join(' ') || undefined;
  const extra = attachments.length > 0 ? attachmentRow : 0;

  const setTextarea = useCallback((node: HTMLTextAreaElement | null) => {
    textarea.current = node;
    assignRef(inputRef, node);
  }, [inputRef]);

  useLayoutEffect(() => {
    const element = textarea.current;
    if (!element) return;
    const computed = getComputedStyle(element);
    const line = parseFloat(computed.lineHeight) || 20;
    const padding = (parseFloat(computed.paddingTop) || 0) + (parseFloat(computed.paddingBottom) || 0);
    const max = Math.max(restHeight, padding + line * Math.max(1, Math.floor(maxRows)));
    element.style.height = `${restHeight}px`;
    const nextHeight = Math.min(max, Math.max(restHeight, element.scrollHeight));
    element.style.height = `${nextHeight}px`;
    setFieldHeight(nextHeight);
    if (pendingCaret.current !== null) {
      element.setSelectionRange(pendingCaret.current, pendingCaret.current);
      pendingCaret.current = null;
    }
  }, [text, expanded, maxRows]);

  useLayoutEffect(() => {
    const list = suggestionList.current;
    const item = list?.children[index];
    if (!(item instanceof HTMLElement) || !list || !menuOpen) return;
    const itemTop = item.offsetTop;
    const itemBottom = itemTop + item.offsetHeight;
    if (itemTop < list.scrollTop) list.scrollTop = itemTop;
    if (itemBottom > list.scrollTop + list.clientHeight) list.scrollTop = itemBottom - list.clientHeight;
  }, [index, menuOpen]);

  // The suggestion list plays the one overlay exit (spec 1.9): it stays mounted for 160ms after it closes.
  useLayoutEffect(() => {
    if (menuOpen) shownList.current = { options, symbol, index };
  });
  useEffect(() => {
    if (menuOpen) { wasOpen.current = true; setClosingList(null); return; }
    if (!wasOpen.current) return;
    wasOpen.current = false;
    setClosingList(shownList.current);
    const timer = setTimeout(() => setClosingList(null), 160);
    return () => clearTimeout(timer);
  }, [menuOpen]);

  // Native form reset (spec 3.0 Forms) puts the draft back to `defaultValue`.
  const resetDraft = useRef(() => {});
  resetDraft.current = () => updateText(defaultValue);
  useEffect(() => {
    const owner = textarea.current?.form;
    if (!owner) return;
    const onReset = () => resetDraft.current();
    owner.addEventListener('reset', onReset);
    return () => owner.removeEventListener('reset', onReset);
  }, [withinForm, form]);

  function updateText(next: string) {
    if (value === undefined) setDraft(next);
    onChange?.(next);
  }

  function pick(item: ComposerSuggestion) {
    const afterToken = text.slice(caret).replace(/^[^\s@/]*/, '');
    const insert = item.insertText ?? `${symbol}${item.id}`;
    const separator = /^\s/.test(afterToken) ? '' : ' ';
    const before = text.slice(0, tokenStart) + insert + separator;
    const next = before + afterToken;
    const nextCaret = before.length + (separator ? 0 : 1);
    textarea.current?.focus();
    if (next === text) textarea.current?.setSelectionRange(nextCaret, nextCaret);
    else pendingCaret.current = nextCaret;
    setCaret(nextCaret);
    setActive(0);
    setDismissed(tokenKey);
    updateText(next);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (held || !filled) return;
    send('auto');
  }

  /** Sends the draft: as a new message, or to the running agent (steer), or onto the queue. */
  function send(how: 'auto' | 'queue') {
    const message = text.trim();
    if (!steerable) onSubmit?.(message);
    else if (how === 'queue' && onQueue) onQueue(message);
    else if (onSteer) onSteer(message);
    else onQueue?.(message);
    if (value === undefined) updateText('');
    setCaret(0);
    setDismissed('');
    textarea.current?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented || event.nativeEvent.isComposing) return;
    if (menuOpen) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const delta = event.key === 'ArrowDown' ? 1 : -1;
        setActive((index + delta + options.length) % options.length);
        return;
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        setDismissed(tokenKey);
        return;
      }
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        pick(options[index]);
        return;
      }
    }
    if (event.key === 'Escape' && streaming && onStop) {
      event.preventDefault();
      onStop();
      return;
    }
    if (event.key === 'Enter' && !event.shiftKey && (enterToSubmit || event.metaKey || event.ctrlKey || (steerable && event.altKey))) {
      event.preventDefault();
      if (held || !filled) return;
      // A steered or queued message goes to the run, never to an enclosing form.
      if (steerable) { send(event.altKey && onQueue ? 'queue' : 'auto'); return; }
      event.currentTarget.form?.requestSubmit();
    }
  }

  // While a steerable run streams, a typed message turns Stop into Send; Escape still stops.
  const mode = isLoading ? 'loading' : streaming && !(steerable && filled) ? 'stop' : filled ? 'send' : 'dictate';
  const sendStyles = stylex.props(
    s.sendPosition, s.send, (mode === 'send' || mode === 'stop' || (mode === 'loading' && filled)) && s.sendReady,
    transitionStyles.colorsAndPress, !isLoading && pressStyles.scaleActive, isLoading && loadingStyles.control,
    off && disabledStyles.filled, focusStyles.ringVisible,
  );
  const toolStyles = (...extraStyles: stylex.StyleXStyles[]) => stylex.props(
    s.tool, textStyles.sm, transitionStyles.colorsAndPress, pressStyles.scaleActive, ...extraStyles,
    off && disabledStyles.text, focusStyles.ringVisible,
  );
  const list = menuOpen ? { options, symbol, index } : closingList;
  const surfaceHeight = expanded
    ? (fieldHeight > 64 ? s.surfaceHeight(fieldHeight + 52 + extra) : extra ? s.surfaceExpandedAttachments : s.surfaceExpanded)
    : null;
  const surfaceProps = {
    'data-composer': '',
    'data-expanded': expanded || undefined,
    onClick: (event: MouseEvent<HTMLElement>) => { if (event.target === event.currentTarget) textarea.current?.focus(); },
    ...stylex.props(
      s.surface, surfaceHeight, variant === 'outline' && s.outline,
      focused && s.focused, invalid && (focused ? s.invalidFocused : s.invalid), off && s.disabled,
    ),
  };
  const rootProps = stylex.props(s.root, expanded && s.rootExpanded, fullWidth && s.rootFull);

  const body = <>
    {attachments.length > 0 && <ul aria-label="Attachments" {...stylex.props(s.attachments)}>
      {attachments.map(item => (
        <li key={item.id} {...stylex.props(s.chip, pillPaddingStyles.sm, pillIconPaddingStartStyles.sm, textStyles.sm, onRemoveAttachment && s.chipRemovable)}>
          <span aria-hidden="true" {...stylex.props(s.chipIcon)}>{chipIcon(item.icon) ?? <Icon name="file" size={16} />}</span>
          <span {...stylex.props(s.chipName)}>{item.name}</span>
          {onRemoveAttachment && <button type="button" aria-label={`Remove ${item.name}`} disabled={off}
            {...stylex.props(s.chipRemove, transitionStyles.colorsAndPress, off && disabledStyles.text, focusStyles.ringVisible)}
            onClick={() => { onRemoveAttachment(item.id); textarea.current?.focus(); }}>
            <Icon name="x" size={14} />
          </button>}
        </li>
      ))}
    </ul>}
    <textarea ref={setTextarea} rows={1} value={text} disabled={off} name={name} form={withinForm ? form : undefined}
      id={field?.id} required={required} aria-label={label ?? (field ? undefined : 'Message')}
      aria-invalid={invalid || undefined} aria-describedby={describedBy}
      aria-autocomplete={mentions.length || commands.length ? 'list' : undefined}
      aria-controls={menuOpen ? listId : undefined} aria-activedescendant={menuOpen ? `${listId}-${index}` : undefined}
      placeholder={placeholder}
      {...stylex.props(s.textarea, expanded && s.textareaExpanded, expanded && extra > 0 && s.textareaBelowAttachments, off && s.textareaDisabled)}
      onFocus={event => { setFocused(true); setCaret(event.currentTarget.selectionStart); }}
      onBlur={() => setFocused(false)} onSelect={event => setCaret(event.currentTarget.selectionStart)}
      onChange={event => { updateText(event.currentTarget.value); setCaret(event.currentTarget.selectionStart); setActive(0); setDismissed(''); }}
      onKeyDown={handleKeyDown} />
    <div {...stylex.props(s.actions)} aria-hidden={!expanded}>
      <div {...stylex.props(s.reveal, expanded && s.revealed)}>
        {actions ?? <button type="button" aria-label="Attach a file" tabIndex={expanded ? 0 : -1} disabled={off}
          {...toolStyles(s.toolIcon)} onClick={() => { if (onAttach) onAttach(); else textarea.current?.focus(); }}>
          <Icon name="plus" size={16} />
        </button>}
      </div>
      {showModel && models.length > 0 && <div {...stylex.props(s.reveal, s.revealShrink, expanded && s.revealed, expanded && s.revealDelay(1))}>
        <AriaSelect aria-label="Model" value={selectedModel} isDisabled={off} isOpen={modelOpen} onOpenChange={setModelOpen}
          onChange={(next: Key | null) => { if (next == null) return; setLocalModel(String(next)); onModelChange?.(String(next)); }}
          {...stylex.props(s.picker)}>
          <AriaButton excludeFromTabOrder={!expanded} className={({ isFocusVisible, isDisabled: buttonDisabled }) => stylex.props(
            s.tool, textStyles.sm, s.modelTrigger, transitionStyles.colorsAndPress, pressStyles.scaleActive,
            modelOpen && s.toolOpen, buttonDisabled && disabledStyles.text, isFocusVisible ? focusStyles.ring : focusStyles.none,
          ).className ?? ''}>
            <SelectValue {...stylex.props(s.modelLabel)}>
              {({ isPlaceholder, defaultChildren }) => isPlaceholder ? 'Choose model' : defaultChildren}
            </SelectValue>
          </AriaButton>
          <Popover placement="top start" offset={6} className={({ isExiting, placement }) => stylex.props(
            overlayStyles.surface, overlayStyles.popup, s.popover, overlayStyles.popupMotion, popupPlacement(placement),
            isExiting && overlayStyles.exit,
          ).className ?? ''}>
            <ListBox items={models} {...stylex.props(overlayItemStyles.list, s.modelList)}>
              {item => (
                <ListBoxItem id={item.id} textValue={item.label} className={({ isFocused, isHovered, isPressed, isSelected }) => stylex.props(
                  overlayItemStyles.item, s.modelItem, (isFocused || isHovered) && overlayItemStyles.active,
                  isPressed && overlayItemStyles.pressed, isSelected && overlayItemStyles.selected,
                ).className ?? ''}>
                  {({ isSelected }) => <>
                    {item.label}
                    {isSelected && <span {...stylex.props(s.check)}><Icon name="check" size={16} /></span>}
                  </>}
                </ListBoxItem>
              )}
            </ListBox>
          </Popover>
        </AriaSelect>
      </div>}
      {showEffort && <div {...stylex.props(s.reveal, expanded && s.revealed, expanded && s.revealDelay(2))}>
        <button type="button" aria-label={`Effort: ${selectedEffort}`} title="Cycle reasoning effort" tabIndex={expanded ? 0 : -1} disabled={off}
          {...toolStyles()} onClick={() => { const next = efforts[(effortIndex + 1) % efforts.length]; setLocalEffort(next); onEffortChange?.(next); }}>
          <span aria-hidden="true" {...stylex.props(s.bars)}>
            {[5, 8, 12].map((height, i) => <i key={height} {...stylex.props(s.bar(height), i <= effortIndex && s.barActive)} />)}
          </span>
          {selectedEffort}
        </button>
      </div>}
    </div>
    <button type={mode === 'send' ? 'submit' : 'button'} form={withinForm ? form : undefined} disabled={off}
      aria-label={mode === 'stop' ? stopLabel : mode === 'dictate' ? dictateLabel : steerable ? steerLabel : submitLabel}
      aria-busy={isLoading || undefined} aria-disabled={isLoading || undefined}
      {...sendStyles}
      onClick={event => {
        if (mode === 'loading') { event.preventDefault(); return; }
        if (mode === 'stop') { onStop?.(); return; }
        if (mode === 'send' && steerable) { event.preventDefault(); send('auto'); return; }
        if (mode === 'dictate') { textarea.current?.focus(); onDictate?.(); }
      }}>
      <span aria-hidden="true" {...stylex.props(s.glyph, mode !== 'dictate' && s.glyphHidden)}><Icon name="mic" size={16} /></span>
      <span aria-hidden="true" {...stylex.props(s.glyph, mode !== 'send' && s.glyphHidden)}><Icon name="arrow-up" size={16} /></span>
      <span aria-hidden="true" {...stylex.props(s.glyph, mode !== 'stop' && s.glyphHidden)}><Icon name="stop" size={16} /></span>
      {isLoading && <span aria-hidden="true" {...stylex.props(loadingStyles.spinner, s.spinner, loadingStyles.spinnerSize(16))} />}
    </button>
    {list && <ul id={listId} role="listbox" aria-label={list.symbol === '@' ? 'Mention suggestions' : 'Command suggestions'}
      aria-hidden={!menuOpen || undefined} ref={suggestionList}
      {...stylex.props(controlStyles.popup, s.suggestions, overlayStyles.popupMotion, popupPlacement('bottom'), !menuOpen && [overlayStyles.exit, s.suggestionsClosing])}>
      {list.options.map((option, optionIndex) => <li id={`${listId}-${optionIndex}`} key={option.id} role="option" aria-selected={list.index === optionIndex}
        {...stylex.props(controlStyles.option, s.option, list.index === optionIndex && controlStyles.optionActive)}
        onMouseDown={event => event.preventDefault()} onMouseMove={() => { if (menuOpen) setActive(optionIndex); }}
        onClick={() => { if (menuOpen) pick(option); }}>
        <div {...stylex.props(s.optionContent)}>
          {option.label}
          {option.description && <span {...stylex.props(typeStyles.small13, s.optionDescription)}>{option.description}</span>}
        </div>
      </li>)}
    </ul>}
  </>;

  return (
    <div ref={ref} data-composer-root="" className={withClassName(rootProps, className)} style={{ ...rootProps.style, ...style }}
      onFocusCapture={() => setFocusWithin(true)}
      onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocusWithin(false); }}>
      {queued.length > 0 && (
        <ol aria-label="Queued messages" {...stylex.props(s.queue)}>
          {queued.map((item, position) => (
            <li key={item.id} {...stylex.props(s.queueRow)}>
              <span aria-hidden="true" {...stylex.props(s.queueIcon)}><Icon name="clock" size={14} /></span>
              <span {...stylex.props(s.queueText)}>{item.text}</span>
              {position === 0 && <span {...stylex.props(s.queueNext)}>Next</span>}
              {onSendQueuedNow && streaming && <Button size="xs" appearance="text" onClick={() => onSendQueuedNow(item.id)}>Send now</Button>}
              {onRemoveQueued && <Button size="xs" appearance="text" iconOnly aria-label={`Remove queued message: ${item.text}`} onClick={() => onRemoveQueued(item.id)}><Icon name="x" /></Button>}
            </li>
          ))}
        </ol>
      )}
      {withinForm
        ? <div {...surfaceProps}>{body}</div>
        : <form {...surfaceProps} onSubmit={handleSubmit}>{body}</form>}
      {streaming && showRunHint && !hasContent(message) && (onStop || steerable) && (
        <p {...stylex.props(s.message, controlStyles.description, s.runHint)}>
          {steerable && <span {...stylex.props(s.hintGroup)}><Kbd size="sm" aria-label="Enter">↵</Kbd>{onSteer ? 'steers' : 'queues'}</span>}
          {onSteer && onQueue && <span {...stylex.props(s.hintGroup)}><Kbd size="sm" aria-label={apple ? 'Option' : 'Alt'}>{apple ? '⌥' : 'Alt'}</Kbd><Kbd size="sm" aria-label="Enter">↵</Kbd>queues</span>}
          {onStop && <span {...stylex.props(s.hintGroup)}><Kbd size="sm">Esc</Kbd>stops</span>}
        </p>
      )}
      {hasContent(message) && <p id={messageId} {...stylex.props(
        s.message, showError ? invalidStyles.message : controlStyles.description, !showError && off && disabledStyles.label,
      )}>{message}</p>}
    </div>
  );
}
