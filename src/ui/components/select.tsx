'use client';

import * as stylex from '@stylexjs/stylex';
import { useContext, useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode, type Ref } from 'react';
import type { Key } from 'react-aria-components';
import { tokens as t } from '../tokens.stylex';
import { Icon } from './Icon';
import { withClassName } from './internal/class-name';
import { controlStyles, FieldContext } from './internal/control';
import { fieldStyles } from './internal/field-styles';
import { normalizeSize, type ControlSizeProp } from './internal/size';
import { springs, useChoiceSpring } from './internal/spring';
import { bindField, ButtonPicker, flattenCatalog, isCatalogSection, useControlledValue } from './internal/suggestion-input';

// Select (DESIGN_SPEC 2.2 Select, 1.2, 1.8, 1.9). Two appearances:
// - `morph`: a borderless md (40) control whose surface morphs open around the chosen row, driven by
//   a physical spring that settles without bouncing (springs.surfaceOpen / surfaceClose, under 1%
//   overshoot). Fluid, up to 256 wide by default. Open, it is a 1.9 list popup: 6px padding, 40px
//   comfortable rows 2 apart, text 16px from the surface edge at 14/20, the chosen row 500 with a check.
// - `field`: the 1.2 text-entry shell (40 by default, radius 10, hairline, chevron) with a 1.9 list
//   popup. The default inside a Field, with sections, and with multiple selection.

const coarse = '@media (pointer: coarse)';
const reduce = '@media (prefers-reduced-motion: reduce)';
const ring = t['--os-color-focus-ring'];

// Morph geometry in px for the spring math (spec 1.2 rows, 1.9 list popups): comfortable 40px rows,
// 2px apart, inside the surface's 6px padding.
const ROW = 40;
const ROW_GAP = 2;
const PITCH = ROW + ROW_GAP;
const INSET = 6;
/** Spec 1.9 Items: text 16px from the surface edge, less the 6px padding (10). */
const itemInset = `calc(${t['--os-space-4']} - ${t['--os-space-1-5']})`;

// Morph radius (spec 1.3). Closed, the morph is a control: it takes the control radius like Button and Input (6, 10
// or 14 on a ladder; capped at radius-xl 20, which is already a pill on the 40px morph, so Round needs no 9999 to
// animate from). Open, it is a popup: control + 10, capped at radius-xl, so it never becomes a stadium.
const closedRadius = `min(${t['--os-radius-control']}, ${t['--os-radius-xl']})`;
const openRadius = `min(calc(${t['--os-radius-control']} + 10px), ${t['--os-radius-xl']})`;

const s = stylex.create({
  /** Fluid, up to the spec 1.9 popover width by default; `fullWidth` lifts the cap. */
  root: { maxWidth: 256 },
  full: { maxWidth: 'none' },
  hidden: { position: 'absolute', width: 1, height: 1, padding: 0, borderWidth: 0, overflow: 'hidden', clipPath: 'inset(50%)', whiteSpace: 'nowrap' },
  labelDisabled: { color: t['--os-color-fg-disabled'] },
  anchor: { position: 'relative', height: t['--os-size-md'], isolation: 'isolate' },
  /** While open the anchor floats over the content after it (spec 1.9 layering: non-RAC layers use z-tooltip − 10). */
  elevated: { zIndex: `calc(${t['--os-z-tooltip']} - 10)` },
  surface: {
    position: 'absolute', insetInline: 0, top: 0, borderRadius: closedRadius, pointerEvents: 'none',
    backgroundColor: t['--os-color-bg-surface'], boxShadow: 'none',
    transitionProperty: 'background-color, box-shadow, border-radius',
    transitionDuration: { default: t['--os-motion-hover'], [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  surfaceMotion: (height: number, y: number) => ({ height, transform: `translateY(${y}px)` }),
  surfaceHover: { backgroundColor: t['--os-color-bg-interactive-primary'] },
  /** Open, it is an overlay surface: elevated fill, hairline (drawn inset so the size holds) and shadow-popup. */
  surfaceOpen: { borderRadius: openRadius, backgroundColor: t['--os-color-bg-elevated'], boxShadow: `${t['--os-shadow-popup']}, inset 0 0 0 1px ${t['--os-color-border-subtle']}` },
  surfaceInvalid: { boxShadow: `inset 0 0 0 1px ${t['--os-color-border-error']}` },
  surfaceOpenInvalid: { borderRadius: openRadius, backgroundColor: t['--os-color-bg-elevated'], boxShadow: `${t['--os-shadow-popup']}, inset 0 0 0 1px ${t['--os-color-border-error']}` },
  surfaceReadOnly: { backgroundColor: t['--os-color-bg-subtle'], boxShadow: `inset 0 0 0 1px ${t['--os-color-border-subtle']}` },
  surfaceDisabled: { backgroundColor: t['--os-color-bg-disabled'], boxShadow: 'none' },
  trigger: {
    position: 'absolute', inset: 0, width: '100%', height: t['--os-size-md'], padding: 0, borderWidth: 0, borderRadius: closedRadius,
    backgroundColor: 'transparent', color: t['--os-color-fg-base'], cursor: 'pointer', zIndex: 2,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' }, outlineWidth: 2, outlineColor: ring, outlineOffset: 2,
    '::after': {
      content: '""', position: 'absolute', insetInline: 0, top: '50%', transform: 'translateY(-50%)',
      height: { default: '100%', [coarse]: 'max(100%, 44px)' },
    },
  },
  /** Open, the hot row's fill is the focus (virtual focus, spec 1.8): no ring around the top row. */
  triggerOpen: { outlineStyle: 'none' },
  triggerStatic: { cursor: 'default' },
  /** A comfortable 40px row: the spec 1.9 item geometry (inset 6, text 16 from the edge, icon gap 8), 14/20 at 400. */
  row: {
    position: 'absolute', top: 0, insetInline: t['--os-space-1-5'], height: t['--os-size-md'], display: 'flex', alignItems: 'center', gap: t['--os-space-2'],
    paddingInline: itemInset, boxSizing: 'border-box', borderRadius: `max(${t['--os-radius-sm']}, calc(${openRadius} - ${t['--os-space-1-5']}))`,
    fontSize: t['--os-font-size-sm'], fontWeight: t['--os-font-weight-regular'], lineHeight: t['--os-line-height-md'], letterSpacing: t['--os-tracking-tight'],
    color: t['--os-color-fg-base'], cursor: 'pointer', backgroundColor: 'transparent',
    transitionProperty: 'background-color, color',
    transitionDuration: { default: t['--os-motion-hover'], [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'], zIndex: 3,
  },
  /** Closed, the value stops 8 short of the 16px chevron, so a long label ellipsizes before it. */
  rowClosed: { paddingInlineEnd: `calc(${itemInset} + ${t['--os-size-2xs']} + ${t['--os-space-2']})` },
  rowMotion: (y: number, scale: number, opacity: number) => ({ transform: `translateY(${y}px) scale(${scale})`, opacity }),
  selected: { fontWeight: t['--os-font-weight-medium'] },
  inactive: { pointerEvents: 'none' },
  hot: { backgroundColor: t['--os-color-bg-interactive-primary'] },
  placeholder: { color: t['--os-color-fg-muted'] },
  rowDisabled: { color: t['--os-color-fg-disabled'], cursor: 'default' },
  text: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 },
  icon: { display: 'flex', flexShrink: 0, color: t['--os-color-fg-muted'] },
  iconDisabled: { color: t['--os-color-fg-disabled'] },
  check: { marginInlineStart: 'auto', display: 'flex', flexShrink: 0, color: t['--os-color-fg-base'] },
  /** 16px from the end, where the chosen row's check appears; centered on the 40px row. */
  chevron: { display: 'flex', position: 'absolute', insetInlineEnd: t['--os-space-4'], top: t['--os-space-3'], pointerEvents: 'none', zIndex: 4, color: t['--os-color-fg-muted'] },
  chevronDisabled: { color: t['--os-color-fg-disabled'] },
  opacity: (opacity: number) => ({ opacity }),
  list: { position: 'absolute', insetInline: 0, top: 0, zIndex: 3 },
  listExtent: (height: number) => ({ height }),
  messageDisabled: { color: t['--os-color-fg-disabled'] },
});

export type SelectOption = { id: string; label: string; icon?: ReactNode; disabled?: boolean };
/** A labeled group of options (field appearance). The morph lists their options in order. */
export type SelectSection = { id: string; label?: string; options: readonly SelectOption[] };
export type SelectAppearance = 'morph' | 'field';

type SelectBaseProps = {
  /** The visible label. Optional inside a Field that has one, or with `aria-label`. */
  label?: string;
  /** Keeps the label for assistive tech only. */
  hideLabel?: boolean;
  /** Options, or labeled sections of options. */
  options: readonly (SelectOption | SelectSection)[];
  placeholder?: string;
  /** `morph`: the pill that morphs open in place. `field`: a bordered field with a list popup. */
  appearance?: SelectAppearance;
  /** Height of the field appearance. The morph is always md (40px). */
  size?: ControlSizeProp;
  /** Help text under the control. The error replaces it. */
  description?: ReactNode;
  /** @deprecated Use `description`. */
  hint?: ReactNode;
  /** The error line. It replaces the description and marks the control invalid. */
  errorMessage?: ReactNode;
  /** @deprecated Use `errorMessage`. */
  error?: ReactNode;
  isInvalid?: boolean;
  isDisabled?: boolean;
  /** @deprecated Use `isDisabled`. */
  disabled?: boolean;
  isRequired?: boolean;
  /** @deprecated Use `isRequired`. */
  required?: boolean;
  /** Shows the value without letting it change. */
  isReadOnly?: boolean;
  /** Option ids that can't be chosen, in addition to options with `disabled`. */
  disabledKeys?: Iterable<string>;
  /** Content before the value in the field appearance, usually a 16px Icon. */
  startAddon?: ReactNode;
  /** Morph only: shows the label inside the closed pill, above the value. */
  floating?: boolean;
  /** Removes the morph's 256px max width so it fills its container. */
  fullWidth?: boolean;
  name?: string;
  form?: string;
  id?: string;
  autoFocus?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLDivElement>;
};

export type SingleSelectProps = SelectBaseProps & {
  selectionMode?: 'single';
  /** The chosen option id (controlled). */
  value?: string | null;
  /** The initially chosen option id (uncontrolled). */
  defaultValue?: string | null;
  onChange?: (value: string | null) => void;
};

export type MultipleSelectProps = SelectBaseProps & {
  /** Multiple selection always uses the field appearance. */
  selectionMode: 'multiple';
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
};

export type SelectProps = SingleSelectProps | MultipleSelectProps;

/**
 * A labeled control for choosing from a fixed list. Defaults to the morph outside a Field; inside a
 * Field, with sections, or with multiple selection it uses the field appearance.
 */
export function Select(props: SelectProps) {
  const field = useContext(FieldContext);
  const multiple = props.selectionMode === 'multiple';
  const appearance = props.appearance ?? (field || multiple || props.options.some(isCatalogSection) ? 'field' : 'morph');
  if (appearance === 'field' || multiple) return <FieldSelect {...props} />;
  return <MorphSelect {...props as SingleSelectProps} />;
}

function FieldSelect({
  options, value, defaultValue, onChange, selectionMode, size, hint, description, error, errorMessage, disabled, isDisabled,
  required, isRequired, placeholder = 'Select an option', disabledKeys, floating: _floating, fullWidth: _fullWidth,
  appearance: _appearance, ...props
}: SelectProps) {
  const multiple = selectionMode === 'multiple';
  const [current, setCurrent] = useControlledValue<string | string[] | null>(
    value, defaultValue ?? (multiple ? [] : null), onChange as ((value: string | string[] | null) => void) | undefined,
  );
  return <ButtonPicker {...props}
    entries={options}
    size={normalizeSize(size)}
    selectionMode={selectionMode}
    placeholder={placeholder}
    value={current}
    onChange={(next: Key | Key[] | null) => setCurrent(Array.isArray(next) ? next.map(String) : next == null ? null : String(next))}
    description={description ?? hint}
    errorMessage={errorMessage ?? error}
    isDisabled={isDisabled ?? disabled}
    isRequired={isRequired ?? required}
    disabledKeys={disabledKeys} />;
}

function MorphSelect({
  label, hideLabel, name, form, id: idProp, placeholder = 'Select an option', options: entries, value, defaultValue, onChange,
  description, hint, errorMessage, error, isInvalid, isDisabled, disabled: disabledAlias, isRequired, required: requiredAlias,
  isReadOnly, disabledKeys, floating, fullWidth, autoFocus, onOpenChange, className, style, ref,
  'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, 'aria-describedby': ariaDescribedBy,
}: SingleSelectProps) {
  const field = useContext(FieldContext);
  const generatedId = useId();
  const message = errorMessage ?? error;
  const help = description ?? hint;
  const bound = bindField(field, {
    id: idProp, label, labelledBy: ariaLabelledBy, describedBy: ariaDescribedBy, isInvalid, message,
    isRequired: isRequired ?? requiredAlias, isDisabled: isDisabled ?? disabledAlias, isReadOnly,
  });
  const { disabled, readOnly } = bound;
  const invalid = !!bound.invalid;
  const id = bound.id ?? generatedId;
  const labelId = `${id}-label`;
  const helpId = `${id}-help`;
  const blocked = new Set(disabledKeys);
  const options = flattenCatalog(entries).map(option => blocked.has(option.id) ? { ...option, disabled: true } : option);
  const [current, setCurrent] = useControlledValue(value, defaultValue ?? null, onChange);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const nativeSelect = useRef<HTMLSelectElement>(null);
  const initialValue = useRef(current);
  const [open, setOpenState] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [order, setOrder] = useState<string[]>([]);
  const [hot, setHot] = useState<string | null>(null);
  const search = useRef({ text: '', time: 0 });
  // No bounce on a surface this size (spec 1.10): both directions settle with under 1% overshoot.
  const spring = open ? springs.surfaceOpen : springs.surfaceClose;
  const p = useChoiceSpring(open ? 1 : 0, spring.stiffness, spring.damping);
  const chosen = options.find(option => option.id === current);
  const slotOf = (key: string) => { const index = order.indexOf(key); return index < 0 ? Number.MAX_SAFE_INTEGER : index; };
  const arranged = order.length ? [...options].sort((a, b) => slotOf(a.id) - slotOf(b.id)) : options;
  const extent = ROW + Math.max(0, options.length - 1) * PITCH * p + 2 * INSET * p;
  const expanded = open || Math.abs(p) > .001;
  const interactive = !disabled && !readOnly;
  const showHelp = !invalid && help != null && help !== false && help !== '';
  const showError = invalid && message != null && message !== false && message !== '';
  const describedBy = [showHelp || showError ? helpId : undefined, bound.describedBy].filter(Boolean).join(' ') || undefined;
  const latest = useRef({ setCurrent, onOpenChange });
  latest.current = { setCurrent, onOpenChange };
  const setRoot = (node: HTMLDivElement | null) => {
    root.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  function setOpen(next: boolean) {
    setOpenState(previous => {
      if (previous !== next) latest.current.onOpenChange?.(next);
      return next;
    });
  }
  function show() {
    if (!interactive || !options.length) return;
    setOrder([...(chosen ? [chosen.id] : []), ...options.filter(option => option.id !== chosen?.id).map(option => option.id)]);
    setHot(chosen?.id ?? options.find(option => !option.disabled)?.id ?? null);
    setOpen(true);
  }
  function choose(key: string) {
    const option = options.find(option => option.id === key);
    if (!interactive || !option || option.disabled) return;
    setCurrent(key); setOpen(false); button.current?.focus();
  }
  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, [open]);
  const optionIds = options.map(option => option.id).join('\n');
  useEffect(() => {
    const formElement = nativeSelect.current?.form;
    if (!formElement) return;
    let mounted = true;
    const reset = (event: Event) => queueMicrotask(() => {
      if (!mounted || event.defaultPrevented) return;
      const restored = optionIds.split('\n').includes(initialValue.current ?? '') ? initialValue.current : null;
      setOpen(false); setHot(null); setOrder([]);
      // Reset fires before the browser restores native defaults; synchronizing
      // afterward keeps FormData consistent even when the parent value is equal.
      if (nativeSelect.current) nativeSelect.current.value = restored ?? '';
      latest.current.setCurrent(restored);
    });
    formElement.addEventListener('reset', reset);
    return () => { mounted = false; formElement.removeEventListener('reset', reset); };
  }, [optionIds]);
  useEffect(() => { if (!interactive || !options.length) setOpen(false); }, [interactive, options.length]);
  useEffect(() => {
    if (open && !options.some(option => option.id === hot && !option.disabled)) {
      setHot(options.find(option => option.id === current && !option.disabled)?.id ?? options.find(option => !option.disabled)?.id ?? null);
    }
  }, [open, optionIds, hot, current]);

  function keyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;
    if (event.key === 'Tab') { setOpen(false); return; }
    if (readOnly) return;
    const enabled = (open ? arranged : options).filter(option => !option.disabled);
    if (event.key === 'Escape') { if (open) event.preventDefault(); setOpen(false); return; }
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      if (!open) { show(); return; }
      if (!enabled.length) return;
      const index = enabled.findIndex(option => option.id === hot);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? enabled.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + enabled.length) % enabled.length;
      setHot(enabled[next]?.id ?? null); return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); if (open && hot) choose(hot); else show(); return;
    }
    if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
      const now = performance.now();
      search.current.text = (now - search.current.time < 700 ? search.current.text : '') + event.key.toLocaleLowerCase();
      search.current.time = now;
      const match = enabled.find(option => option.label.toLocaleLowerCase().startsWith(search.current.text));
      if (match) { event.preventDefault(); if (open) setHot(match.id); else setCurrent(match.id); }
    }
  }

  const rootProps = stylex.props(controlStyles.stack, s.root, fullWidth && s.full);
  const surfaceState = disabled ? s.surfaceDisabled
    : expanded ? (invalid ? s.surfaceOpenInvalid : s.surfaceOpen)
      : [readOnly && s.surfaceReadOnly, hovered && interactive && s.surfaceHover, invalid && s.surfaceInvalid];

  return <div ref={setRoot} className={withClassName({ className: rootProps.className }, className)} style={{ ...rootProps.style, ...style }}>
    {label != null && <label id={labelId} htmlFor={id} {...stylex.props((floating || hideLabel) ? s.hidden : controlStyles.label, disabled && s.labelDisabled)}>
      {label}{bound.required && !floating && !hideLabel && <span aria-hidden="true" {...stylex.props(fieldStyles.required)}> *</span>}
    </label>}
    <select ref={nativeSelect} aria-hidden="true" tabIndex={-1} name={name} form={form} value={current ?? ''} disabled={disabled} required={bound.required}
      onChange={event => setCurrent(event.target.value || null)} onInvalid={() => button.current?.focus()} {...stylex.props(s.hidden)}>
      <option value="" disabled={bound.required}>{placeholder}</option>
      {options.map(option => <option key={option.id} value={option.id} disabled={option.disabled}>{option.label}</option>)}
    </select>
    <div {...stylex.props(s.anchor, expanded && s.elevated)}
      onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(true); }}
      onPointerLeave={() => setHovered(false)}>
      <div aria-hidden="true" {...stylex.props(s.surface, s.surfaceMotion(extent, -INSET * p), surfaceState)} />
      <button id={id} ref={button} type="button" role="combobox" autoFocus={autoFocus}
        aria-label={ariaLabel} aria-labelledby={label != null ? labelId : bound.labelledBy}
        aria-expanded={open} aria-haspopup="listbox" aria-controls={`${id}-list`}
        aria-activedescendant={open && hot ? `${id}-${hot}` : undefined} aria-required={bound.required || undefined}
        aria-invalid={invalid || undefined} aria-readonly={readOnly || undefined} aria-describedby={describedBy}
        disabled={disabled} onClick={() => open ? setOpen(false) : show()} onKeyDown={keyDown}
        onBlur={event => { if (!root.current?.contains(event.relatedTarget)) setOpen(false); }}
        {...stylex.props(s.trigger, expanded && s.triggerOpen, !interactive && s.triggerStatic)}>
        <span {...stylex.props(s.hidden)}>{chosen?.label ?? placeholder}</span>
      </button>
      <div id={`${id}-list`} role={open ? 'listbox' : undefined} aria-label={open ? (label ?? ariaLabel) : undefined} aria-labelledby={open && label == null ? bound.labelledBy : undefined}
        aria-hidden={!open || undefined} {...stylex.props(s.list, s.listExtent(expanded ? extent : ROW), !open && s.inactive)}>
        {arranged.map((option, slot) => {
          const selected = option.id === current;
          const visible = open || selected || Math.abs(p) > .001;
          return <div key={option.id} id={`${id}-${option.id}`} role={open ? 'option' : undefined} aria-selected={open ? selected : undefined}
            aria-disabled={option.disabled || undefined} onPointerDown={event => event.preventDefault()}
            onPointerMove={() => !option.disabled && setHot(option.id)} onClick={() => open && choose(option.id)}
            {...stylex.props(s.row, selected && s.selected, !expanded && !readOnly && s.rowClosed, s.rowMotion(slot * PITCH * p, selected ? 1 : .92 + .08 * p, selected ? 1 : open ? Math.min(1, Math.max(0, p * 3)) : 0),
              (!open || !visible || option.disabled) && s.inactive, open && hot === option.id && s.hot,
              (option.disabled || (disabled && selected)) && s.rowDisabled)}>
            {option.icon && <span {...stylex.props(s.icon, (option.disabled || disabled) && s.iconDisabled)}>{option.icon}</span>}
            <span {...stylex.props(s.text)}>
              {floating && selected && !open && label != null && <span {...stylex.props(fieldStyles.smallLabel)}>{label}<br /></span>}
              {option.label}
            </span>
            {open && selected && <span {...stylex.props(s.check)}><Icon name="check" size={16} /></span>}
          </div>;
        })}
        {!chosen && !open && <div {...stylex.props(s.row, !expanded && !readOnly && s.rowClosed, s.inactive, disabled ? s.rowDisabled : s.placeholder)}>
          <span {...stylex.props(s.text)}>{placeholder}</span>
        </div>}
      </div>
      {!readOnly && <span aria-hidden="true" {...stylex.props(s.chevron, disabled && s.chevronDisabled, s.opacity(Math.max(0, 1 - p * 5)))}>
        <Icon name="chevron-down" size={16} />
      </span>}
    </div>
    {(showHelp || showError) && <span id={helpId} {...stylex.props(showError ? fieldStyles.error : fieldStyles.help, !showError && disabled && s.messageDisabled)}>
      {showError ? message : help}
    </span>}
  </div>;
}
