'use client';

import * as stylex from '@stylexjs/stylex';
import { Children, cloneElement, createContext, isValidElement, useCallback, useContext, useLayoutEffect, useMemo, useState, type ComponentPropsWithRef, type CSSProperties, type ReactElement, type ReactNode, type Ref } from 'react';
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from 'react-aria-components';
import { tokens as t } from '../tokens.stylex';
import { Icon, type IconProps } from './Icon';
import { withClassName } from './internal/class-name';
import { controlShellSizeStyles, controlStyles, FieldContext, InputGroupContext } from './internal/control';
import { FieldGroupContext, type FieldGroupContextValue } from './internal/field-styles';
import { normalizeSize, sizeScale, type ControlSize, type ControlSizeProp } from './internal/size';
import { disabledStyles, focusStyles, hoverStyles, loadingStyles, pressStyles } from './internal/states';

// One bordered shell (spec 1.5 text-entry shell) holding an Input or Textarea plus addons.
// The shell owns the height (spec 1.2), the edge ring, and the invalid, disabled and read-only
// states; the control inside renders without an edge of its own (FieldGroupContext).
//
// Every inset below comes from three spec 1.2 quantities per size, written once here:
//   pad    the field text inset less the 1px border (insets 8 / 12 / 14 / 16 / 16): where text and icons start
//   gap    the icon-to-text gap (4 / 6 / 8 / 8 / 8): addon content to the value text
//   btn    the inline-button inset less the 1px border. Inline buttons are xs 16 / sm 24 / md 32 / lg 32 /
//          xl 32 tall (spec 1.2: sm 32 from md up), 4 from the edge through md and centered in lg and xl
//          (6 / 8), so a round button stays concentric with a pill shell. Every field's inline buttons
//          (Combobox, NumberField, DatePicker) use the same sizes and insets.

const pad = {
  xs: `calc(${t['--os-space-2']} - 1px)`,
  sm: `calc(${t['--os-space-3']} - 1px)`,
  // os-allow raw-space: spec 1.2 md field inset 14 less the 1px border (14 has no space token)
  md: '13px',
  lg: `calc(${t['--os-space-4']} - 1px)`,
  xl: `calc(${t['--os-space-4']} - 1px)`,
} as const;
const gap = {
  xs: t['--os-space-1'], sm: t['--os-space-1-5'], md: t['--os-space-2'], lg: t['--os-space-2'], xl: t['--os-space-2'],
} as const;
const btn = {
  xs: `calc(${t['--os-space-1']} - 1px)`,
  sm: `calc(${t['--os-space-1']} - 1px)`,
  md: `calc(${t['--os-space-1']} - 1px)`,
  lg: `calc((${t['--os-size-lg']} - ${t['--os-size-sm']}) / 2 - 1px)`,
  xl: `calc((${t['--os-size-xl']} - ${t['--os-size-sm']}) / 2 - 1px)`,
} as const;
// The block padding that centers one line of value text in the shell, (height - 2px border - line) / 2:
// a block-start addon (an inner label) starts where a single-line value would.
const valueTop = {
  xs: `calc((${t['--os-size-xs']} - 2px - ${t['--os-line-height-xs']}) / 2)`,
  sm: `calc((${t['--os-size-sm']} - 2px - ${t['--os-line-height-sm']}) / 2)`,
  md: `calc((${t['--os-size-md']} - 2px - ${t['--os-line-height-md']}) / 2)`,
  lg: `calc((${t['--os-size-lg']} - 2px - ${t['--os-line-height-md']}) / 2)`,
  xl: `calc((${t['--os-size-xl']} - 2px - ${t['--os-line-height-lg']}) / 2)`,
} as const;
const xsRadius = `calc(${t['--os-radius-control']} - ${t['--os-radius-md']} + ${t['--os-radius-sm']})`;

const reduce = '@media (prefers-reduced-motion: reduce)';
const coarse = '@media (pointer: coarse)';
const canHover = '@media (hover: hover)';
const forced = '@media (forced-colors: active)';
const tight = t['--os-tracking-tight'];
const ring = t['--os-color-focus-ring'];
// The edge ring follows the text control's focus. A focused InputGroupButton draws its own inset
// ring, so the shell does not light up as well (one ring per focus, spec 1.8).
const typing = ':has(:focus:not(button))';

const s = stylex.create({
  group: {
    position: 'relative', display: 'flex', flexWrap: 'wrap', alignItems: 'stretch', cursor: 'text',
  },
  /** Replaces the shell's `:focus-within` edge with one tied to the input or textarea. Forced colors get an outline. */
  edge: {
    borderColor: {
      default: t['--os-color-border-subtle'],
      ':hover:not(:focus-within)': { default: null, [canHover]: t['--os-color-border-muted'] },
      [typing]: ring,
    },
    boxShadow: { default: 'none', [typing]: `inset 0 0 0 1px ${ring}` },
    outlineStyle: { default: 'none', [forced]: { default: 'none', [typing]: 'solid' } },
    outlineWidth: 2, outlineOffset: 2, outlineColor: ring,
  },
  edgeReadOnly: {
    backgroundColor: t['--os-color-bg-subtle'], color: t['--os-color-fg-base'],
    borderColor: { default: t['--os-color-border-subtle'], [typing]: ring },
  },
  edgeInvalid: {
    borderColor: t['--os-color-border-error'],
    boxShadow: { default: 'none', [typing]: `inset 0 0 0 1px ${t['--os-color-border-error']}` },
  },
  // A multiline group never becomes a stadium (spec 1.3, as Textarea): min(control, lg).
  multiline: { height: 'auto', borderRadius: `min(${t['--os-radius-control']}, ${t['--os-radius-lg']})` },
  xsRadius: { borderRadius: xsRadius },
  multilineXs: { borderRadius: `min(${xsRadius}, ${t['--os-radius-lg']})` },
  attached: {
    display: 'flex', alignItems: 'center', flexShrink: 0, whiteSpace: 'nowrap', cursor: 'default',
    color: t['--os-color-fg-muted'], backgroundColor: t['--os-color-bg-subtle'], fontWeight: t['--os-font-weight-regular'],
  },
  attachedStart: {
    borderInlineEndWidth: 1, borderInlineEndStyle: 'solid', borderInlineEndColor: t['--os-color-border-subtle'],
    borderStartStartRadius: `calc(${t['--os-radius-control']} - 1px)`, borderEndStartRadius: `calc(${t['--os-radius-control']} - 1px)`,
  },
  attachedEnd: {
    borderInlineStartWidth: 1, borderInlineStartStyle: 'solid', borderInlineStartColor: t['--os-color-border-subtle'],
    borderStartEndRadius: `calc(${t['--os-radius-control']} - 1px)`, borderEndEndRadius: `calc(${t['--os-radius-control']} - 1px)`,
  },
  attachedStartXs: { borderStartStartRadius: `calc(${xsRadius} - 1px)`, borderEndStartRadius: `calc(${xsRadius} - 1px)` },
  attachedEndXs: { borderStartEndRadius: `calc(${xsRadius} - 1px)`, borderEndEndRadius: `calc(${xsRadius} - 1px)` },
  attachedDisabled: {
    color: t['--os-color-fg-disabled'], backgroundColor: 'transparent',
    borderInlineStartColor: t['--os-color-border-disabled'], borderInlineEndColor: t['--os-color-border-disabled'],
  },
  addon: { display: 'flex', alignItems: 'center', flexShrink: 0, minWidth: 0, whiteSpace: 'nowrap', color: t['--os-color-fg-muted'] },
  addonBlock: { flexBasis: '100%', flexWrap: 'wrap' },
  addonDisabled: { color: t['--os-color-fg-disabled'] },
  text: { color: 'inherit', fontWeight: t['--os-font-weight-regular'], whiteSpace: 'nowrap' },
  button: {
    position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    padding: 0, borderRadius: `max(${t['--os-radius-sm']}, calc(${t['--os-radius-control']} - 4px))`, cursor: 'pointer', outlineStyle: 'none',
    color: t['--os-color-fg-muted'], backgroundColor: 'transparent', fontFamily: 'inherit', fontWeight: t['--os-font-weight-medium'], whiteSpace: 'nowrap',
    transitionProperty: 'color, background-color, transform',
    transitionDuration: { default: `${t['--os-motion-hover']}, ${t['--os-motion-hover']}, ${t['--os-motion-press']}`, [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
    // Hit area (spec 1.14): at least 24 x 24, and 44 x 44 on coarse pointers. The visual size does not change.
    '::after': {
      content: '""', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      width: { default: 'max(100%, 24px)', [coarse]: 'max(100%, 44px)' },
      height: { default: 'max(100%, 24px)', [coarse]: 'max(100%, 44px)' },
    },
  },
  buttonHovered: { color: t['--os-color-fg-base'] },
  secondary: { color: t['--os-color-fg-base'], backgroundColor: t['--os-color-accent-subtle'] },
  secondaryHovered: { backgroundColor: t['--os-color-accent-muted'] },
  secondaryPressed: { backgroundColor: t['--os-color-accent-dim'] },
  spinner: { color: t['--os-color-fg-muted'] },
});

/** Text in the group (addons, attached parts): the size scale's type, per size. */
const textSizes = stylex.create({
  xs: { fontSize: t['--os-font-size-xs'], lineHeight: t['--os-line-height-xs'], letterSpacing: 0 },
  sm: { fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-sm'], letterSpacing: tight },
  md: { fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'], letterSpacing: tight },
  lg: { fontSize: t['--os-font-size-md'], lineHeight: t['--os-line-height-md'], letterSpacing: tight },
  xl: { fontSize: t['--os-font-size-body'], lineHeight: t['--os-line-height-lg'], letterSpacing: tight },
});
/** Attached start/end parts: their content sits at the field inset on both sides. */
const attachedSizes = stylex.create({
  xs: { paddingInline: pad.xs }, sm: { paddingInline: pad.sm }, md: { paddingInline: pad.md }, lg: { paddingInline: pad.lg }, xl: { paddingInline: pad.xl },
});
const gapSizes = stylex.create({
  xs: { gap: gap.xs }, sm: { gap: gap.sm }, md: { gap: gap.md }, lg: { gap: gap.lg }, xl: { gap: gap.xl },
});
/**
 * Inline start addon: content at the field inset. The control after it has its own inset padding, so the
 * negative end margin (gap - pad) brings the value text to `gap` from the addon content.
 */
const addonStart = stylex.create({
  xs: { paddingInlineStart: pad.xs, marginInlineEnd: `calc(${gap.xs} - ${pad.xs})` },
  sm: { paddingInlineStart: pad.sm, marginInlineEnd: `calc(${gap.sm} - ${pad.sm})` },
  md: { paddingInlineStart: pad.md, marginInlineEnd: `calc(${gap.md} - ${pad.md})` },
  lg: { paddingInlineStart: pad.lg, marginInlineEnd: `calc(${gap.lg} - ${pad.lg})` },
  xl: { paddingInlineStart: pad.xl, marginInlineEnd: `calc(${gap.xl} - ${pad.xl})` },
});
const addonEnd = stylex.create({
  xs: { paddingInlineEnd: pad.xs, marginInlineStart: `calc(${gap.xs} - ${pad.xs})` },
  sm: { paddingInlineEnd: pad.sm, marginInlineStart: `calc(${gap.sm} - ${pad.sm})` },
  md: { paddingInlineEnd: pad.md, marginInlineStart: `calc(${gap.md} - ${pad.md})` },
  lg: { paddingInlineEnd: pad.lg, marginInlineStart: `calc(${gap.lg} - ${pad.lg})` },
  xl: { paddingInlineEnd: pad.xl, marginInlineStart: `calc(${gap.xl} - ${pad.xl})` },
});
/** Block start addon (an inner label): starts where a single-line value would. */
const addonBlockStart = stylex.create({
  xs: { paddingInline: pad.xs, paddingBlockStart: valueTop.xs },
  sm: { paddingInline: pad.sm, paddingBlockStart: valueTop.sm },
  md: { paddingInline: pad.md, paddingBlockStart: valueTop.md },
  lg: { paddingInline: pad.lg, paddingBlockStart: valueTop.lg },
  xl: { paddingInline: pad.xl, paddingBlockStart: valueTop.xl },
});
/**
 * Block end addon (a toolbar row): buttons sit as far from the bottom edge as from the side, so the row is
 * a single-line shell's inner height (button + 2 x btn = height - 2px).
 */
const addonBlockEnd = stylex.create({
  xs: { paddingInline: pad.xs, paddingBlock: btn.xs, minHeight: `calc(${t['--os-size-xs']} - 2px)` },
  sm: { paddingInline: pad.sm, paddingBlock: btn.sm, minHeight: `calc(${t['--os-size-sm']} - 2px)` },
  md: { paddingInline: pad.md, paddingBlock: btn.md, minHeight: `calc(${t['--os-size-md']} - 2px)` },
  lg: { paddingInline: pad.lg, paddingBlock: btn.lg, minHeight: `calc(${t['--os-size-lg']} - 2px)` },
  xl: { paddingInline: pad.xl, paddingBlock: btn.xl, minHeight: `calc(${t['--os-size-xl']} - 2px)` },
});
/**
 * Inline buttons (spec 1.2): sm 32 with sm text in md, lg and xl groups; xs 24 with xs text in an sm group;
 * 16 (the xs shell less 4 each side) in an xs group. Padding is the rect pad-x of the button's own size.
 */
const buttonSizes = stylex.create({
  xs: { height: t['--os-size-2xs'], paddingInline: t['--os-space-1-5'], gap: t['--os-space-1'], fontSize: t['--os-font-size-xs'], lineHeight: t['--os-line-height-xs'], letterSpacing: 0 },
  sm: { height: t['--os-size-xs'], paddingInline: t['--os-space-2'], gap: t['--os-space-1'], fontSize: t['--os-font-size-xs'], lineHeight: t['--os-line-height-xs'], letterSpacing: 0 },
  // os-allow raw-space: spec 1.2 rect pad-x of an sm button
  md: { height: t['--os-size-sm'], paddingInline: 10, gap: t['--os-space-1-5'], fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-sm'], letterSpacing: tight },
  // os-allow raw-space: spec 1.2 rect pad-x of an sm button
  lg: { height: t['--os-size-sm'], paddingInline: 10, gap: t['--os-space-1-5'], fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-sm'], letterSpacing: tight },
  // os-allow raw-space: spec 1.2 rect pad-x of an sm button
  xl: { height: t['--os-size-sm'], paddingInline: 10, gap: t['--os-space-1-5'], fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-sm'], letterSpacing: tight },
});
const iconButtonSizes = stylex.create({
  xs: { width: t['--os-size-2xs'], paddingInline: 0 }, sm: { width: t['--os-size-xs'], paddingInline: 0 }, md: { width: t['--os-size-sm'], paddingInline: 0 },
  lg: { width: t['--os-size-sm'], paddingInline: 0 }, xl: { width: t['--os-size-sm'], paddingInline: 0 },
});
/**
 * The outer edge of a button at the end of an addon moves from the field inset to the button inset (btn - pad).
 * "First" and "last" skip hidden siblings: a Tooltip or other trigger leaves a hidden node beside its button.
 */
const firstShown = ':nth-child(1 of :not([hidden]))';
const lastShown = ':nth-last-child(1 of :not([hidden]))';
const buttonEdgeStart = stylex.create({
  xs: { marginInlineStart: { default: 0, [firstShown]: `calc(${btn.xs} - ${pad.xs})` } },
  sm: { marginInlineStart: { default: 0, [firstShown]: `calc(${btn.sm} - ${pad.sm})` } },
  md: { marginInlineStart: { default: 0, [firstShown]: `calc(${btn.md} - ${pad.md})` } },
  lg: { marginInlineStart: { default: 0, [firstShown]: `calc(${btn.lg} - ${pad.lg})` } },
  xl: { marginInlineStart: { default: 0, [firstShown]: `calc(${btn.xl} - ${pad.xl})` } },
});
const buttonEdgeEnd = stylex.create({
  xs: { marginInlineEnd: { default: 0, [lastShown]: `calc(${btn.xs} - ${pad.xs})` } },
  sm: { marginInlineEnd: { default: 0, [lastShown]: `calc(${btn.sm} - ${pad.sm})` } },
  md: { marginInlineEnd: { default: 0, [lastShown]: `calc(${btn.md} - ${pad.md})` } },
  lg: { marginInlineEnd: { default: 0, [lastShown]: `calc(${btn.lg} - ${pad.lg})` } },
  xl: { marginInlineEnd: { default: 0, [lastShown]: `calc(${btn.xl} - ${pad.xl})` } },
});
/** A button placed straight in the group, with no addon around it: the button inset, centered on the cross axis. */
const buttonBare = stylex.create({
  xs: { marginInline: btn.xs, alignSelf: 'center' }, sm: { marginInline: btn.sm, alignSelf: 'center' }, md: { marginInline: btn.md, alignSelf: 'center' },
  lg: { marginInline: btn.lg, alignSelf: 'center' }, xl: { marginInline: btn.xl, alignSelf: 'center' },
});

/** An `<Icon>` placed straight in an addon or a button, with no size of its own, takes the group's icon size (spec 1.15). */
function sizeIcons(children: ReactNode, px: number): ReactNode {
  return Children.map(children, child => isValidElement(child) && child.type === Icon && (child.props as IconProps).size === undefined
    ? cloneElement(child as ReactElement<IconProps>, { size: px })
    : child);
}

type AddonAlign = 'start' | 'end' | 'block-start' | 'block-end';
const AddonContext = createContext<AddonAlign | null>(null);

function useGroupSize(): ControlSize {
  return normalizeSize(useContext(FieldGroupContext)?.size);
}

export type InputGroupProps = ComponentPropsWithRef<'div'> & {
  /** Text or nodes attached at the start, on their own fill behind a divider. */
  start?: ReactNode;
  /** Text or nodes attached at the end, on their own fill behind a divider. */
  end?: ReactNode;
  /** Height and text size of the group and everything in it (spec 1.2). Legacy `small | medium | large` map to `sm | md | lg`. */
  size?: ControlSizeProp;
  /** Shows the invalid edge and sets `aria-invalid` on the control inside. Inside a Field, the Field's error sets it. */
  isInvalid?: boolean;
  /** @deprecated Use `isInvalid`. */
  invalid?: boolean;
  /** Disables the control and the buttons inside. */
  isDisabled?: boolean;
  /** Makes the control inside read-only; buttons stay usable. */
  isReadOnly?: boolean;
  /** Shows a spinner in the trailing slot and sets `aria-busy`. Typing still works. */
  isLoading?: boolean;
};

export function InputGroup({
  start, end, size, isInvalid, invalid, isDisabled, isReadOnly, isLoading, children, className, onPointerDown, ...props
}: InputGroupProps) {
  const field = useContext(FieldContext);
  const sz = normalizeSize(size);
  const [blocks, setBlocks] = useState(0);
  const registerMultiline = useCallback(() => { setBlocks(count => count + 1); return () => setBlocks(count => count - 1); }, []);
  const isBad = isInvalid ?? invalid ?? field?.invalid ?? false;
  const isOff = isDisabled ?? field?.disabled ?? false;
  const isLocked = isReadOnly ?? field?.readOnly ?? false;
  const context = useMemo<FieldGroupContextValue>(
    () => ({ size: sz, invalid: isBad, disabled: isOff, readOnly: isLocked, registerMultiline }),
    [sz, isBad, isOff, isLocked, registerMultiline],
  );
  const xs = sz === 'xs';
  const sx = stylex.props(
    controlStyles.shell, s.group, s.edge, blocks > 0 ? s.multiline : controlShellSizeStyles[sz], xs && (blocks > 0 ? s.multilineXs : s.xsRadius),
    isLocked && s.edgeReadOnly, isBad && s.edgeInvalid, isOff && controlStyles.disabled,
  );
  const attached = (side: 'start' | 'end') => stylex.props(
    s.attached, textSizes[sz], attachedSizes[sz], side === 'start' ? s.attachedStart : s.attachedEnd,
    xs && (side === 'start' ? s.attachedStartXs : s.attachedEndXs), isOff && s.attachedDisabled,
  );

  return <InputGroupContext.Provider value>
    <FieldGroupContext.Provider value={context}>
      <div
        {...props}
        {...sx}
        className={withClassName(sx, className)}
        aria-busy={isLoading || undefined}
        onPointerDown={event => {
          onPointerDown?.(event);
          if (event.defaultPrevented || isOff) return;
          const interactive = (event.target as Element).closest('input, textarea, button, a, select, label, [tabindex]');
          if (interactive && event.currentTarget.contains(interactive)) return;
          const control = event.currentTarget.querySelector<HTMLElement>('input:not([type=hidden]), textarea');
          if (!control) return;
          event.preventDefault();
          control.focus();
        }}
      >
        {start != null && <div {...attached('start')}>{start}</div>}
        {children}
        {isLoading && <div {...stylex.props(s.addon, addonEnd[sz], s.spinner)}>
          <span aria-hidden="true" {...stylex.props(loadingStyles.spinner, loadingStyles.spinnerSize(sizeScale[sz].icon))} />
        </div>}
        {end != null && <div {...attached('end')}>{end}</div>}
      </div>
    </FieldGroupContext.Provider>
  </InputGroupContext.Provider>;
}

export type InputGroupAddonProps = ComponentPropsWithRef<'div'> & {
  /**
   * Where the addon sits. `start` and `end` sit beside the control (place them before or after it,
   * in reading order); `block-start` and `block-end` take a full row above or below it.
   */
  align?: AddonAlign;
};

/**
 * Icons, buttons, Kbd, badges or text beside the control, with no fill of their own. An `<Icon>`
 * placed straight inside with no size takes the group's icon size (16 at md).
 */
export function InputGroupAddon({ align = 'start', className, children, ...props }: InputGroupAddonProps) {
  const group = useContext(FieldGroupContext);
  const sz = normalizeSize(group?.size);
  const off = Boolean(group?.disabled);
  const block = align === 'block-start' || align === 'block-end';
  const register = group?.registerMultiline;
  useMultiline(block ? register : undefined);
  const sx = stylex.props(
    s.addon, gapSizes[sz], textSizes[sz],
    align === 'start' && addonStart[sz], align === 'end' && addonEnd[sz],
    block && s.addonBlock, align === 'block-start' && addonBlockStart[sz], align === 'block-end' && addonBlockEnd[sz],
    off && s.addonDisabled,
  );
  return <AddonContext.Provider value={align}>
    <div {...props} {...sx} className={withClassName(sx, className)}>{sizeIcons(children, sizeScale[sz].icon)}</div>
  </AddonContext.Provider>;
}

function useMultiline(register: (() => () => void) | undefined) {
  useLayoutEffect(() => register?.(), [register]);
}

export type InputGroupTextProps = ComponentPropsWithRef<'span'>;

/** Text in an addon: a prefix, a suffix or a unit, in the group's type size, `fg-muted`. */
export function InputGroupText({ className, ...props }: InputGroupTextProps) {
  const sz = useGroupSize();
  const sx = stylex.props(s.text, textSizes[sz]);
  return <span {...props} {...sx} className={withClassName(sx, className)} />;
}

export type InputGroupButtonProps = Omit<AriaButtonProps, 'className' | 'style'> & {
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLButtonElement>;
  /** Square button for a single icon. Give it an `aria-label`. */
  iconOnly?: boolean;
  /** `ghost` is transparent with a hover fill; `secondary` has a neutral fill. */
  variant?: 'ghost' | 'secondary';
};

/**
 * A compact button inside the group: 32px at md, inset 4 from the edge, radius max(sm, control - 4): 6 at
 * Standard (spec 1.2). An `<Icon>` child with no size renders at 16 (14 in an xs group).
 */
export function InputGroupButton({ className, iconOnly, variant = 'ghost', isDisabled, children, ...props }: InputGroupButtonProps) {
  const group = useContext(FieldGroupContext);
  const align = useContext(AddonContext);
  const sz = normalizeSize(group?.size);
  const secondary = variant === 'secondary';
  const edge = align === 'start' ? buttonEdgeStart[sz]
    : align === 'end' ? buttonEdgeEnd[sz]
      : align === null ? buttonBare[sz] : [buttonEdgeStart[sz], buttonEdgeEnd[sz]];
  return <AriaButton
    {...props}
    isDisabled={isDisabled ?? group?.disabled}
    className={({ isHovered, isPressed, isFocusVisible, isDisabled: off }) => withClassName(stylex.props(
      s.button, buttonSizes[sz], iconOnly && iconButtonSizes[sz], edge,
      secondary && s.secondary,
      isHovered && !off && (secondary ? s.secondaryHovered : [hoverStyles.fillActive, s.buttonHovered]),
      isPressed && !off && (secondary ? s.secondaryPressed : pressStyles.fill), isPressed && !off && pressStyles.scale,
      isFocusVisible && focusStyles.ringInset,
      off && (secondary ? disabledStyles.filled : disabledStyles.text),
    ), className)}
  >
    {typeof children === 'function' ? children : sizeIcons(children, sz === 'xs' ? 14 : 16)}
  </AriaButton>;
}
