import * as stylex from '@stylexjs/stylex';
import { tokens as t } from '../../tokens.stylex';

// The control size scale (DESIGN_SPEC 1.2) and the pixel line heights (1.4), in one place.
// Numbers are px. Heights are outer heights: a bordered shell owns its height, and its inner
// <input> fills it. Showcase controls with their own motion sit on this scale too (spec preamble).

export type ControlSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
/** The pre-1.2 names. Accept them on every public `size` prop as aliases. */
export type LegacyControlSize = 'small' | 'medium' | 'large';
export type ControlSizeProp = ControlSize | LegacyControlSize;

export type ControlSizeSpec = {
  /** Outer height. Icon-only controls are square at this size. */
  height: number;
  /** Inline padding of a pill (Button, chips). The icon side uses the next smaller pill padding. */
  padPill: number;
  /** Pill padding on the icon side: the next smaller padding (spec 1.2: md 20 -> 16). */
  padPillIcon: number;
  /** Inline padding of a rectangular control (Toggle, ToolbarButton, list rows). */
  padRect: number;
  /** Rect padding on the icon side: the next smaller padding. */
  padRectIcon: number;
  /** Text inset of a bordered field, measured from the outer edge (border included). */
  fieldInset: number;
  /** Gap between icon and label. */
  gap: number;
  /** Icon box: pass to `<Icon size>`. */
  icon: number;
  fontSize: number;
  lineHeight: number;
  /** Label weight. Field values are 400. */
  fontWeight: number;
  /** The radius-md-ladder token this size matches when --os-radius-control equals radius-md (xs: sm). See `radiusStyles`. */
  radius: 'sm' | 'md';
};

export const sizeScale = {
  xs: { height: 24, padPill: 10, padPillIcon: 8, padRect: 8, padRectIcon: 6, fieldInset: 8, gap: 4, icon: 14, fontSize: 12, lineHeight: 16, fontWeight: 500, radius: 'sm' },
  sm: { height: 32, padPill: 12, padPillIcon: 10, padRect: 10, padRectIcon: 8, fieldInset: 12, gap: 6, icon: 16, fontSize: 13, lineHeight: 18, fontWeight: 500, radius: 'md' },
  md: { height: 40, padPill: 20, padPillIcon: 16, padRect: 12, padRectIcon: 10, fieldInset: 14, gap: 8, icon: 16, fontSize: 14, lineHeight: 20, fontWeight: 500, radius: 'md' },
  lg: { height: 44, padPill: 24, padPillIcon: 20, padRect: 16, padRectIcon: 12, fieldInset: 16, gap: 8, icon: 18, fontSize: 15, lineHeight: 20, fontWeight: 500, radius: 'md' },
  xl: { height: 48, padPill: 28, padPillIcon: 24, padRect: 16, padRectIcon: 12, fieldInset: 16, gap: 8, icon: 20, fontSize: 16, lineHeight: 24, fontWeight: 500, radius: 'md' },
} as const satisfies Record<ControlSize, ControlSizeSpec>;

export const controlSizes: readonly ControlSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];

const legacySizes: Record<LegacyControlSize, ControlSize> = { small: 'sm', medium: 'md', large: 'lg' };

/** Maps legacy `small | medium | large` to `sm | md | lg`, passes the new names through, and falls back for undefined. */
export function normalizeSize(size: ControlSizeProp | undefined, fallback: ControlSize = 'md'): ControlSize {
  if (size === undefined) return fallback;
  return size in legacySizes ? legacySizes[size as LegacyControlSize] : size as ControlSize;
}

/** Pixel line heights (spec 1.4). Unitless 1.2 / 1.35 / 1.4 / 1.5 are banned: they put rows on half pixels. */
export const lineHeights = { xs: 16, sm: 18, md: 20, lg: 24 } as const;

/** The line height for a component font size: 12 -> 16, 13 -> 18, 14 and 15 -> 20, 16 and 18 -> 24. */
export function lineHeightFor(fontSize: number): number {
  if (fontSize <= 12) return lineHeights.xs;
  if (fontSize <= 13) return lineHeights.sm;
  if (fontSize <= 15) return lineHeights.md;
  return lineHeights.lg;
}

/** Row heights inside surfaces (spec 1.2). */
export const rowHeights = { compact: 32, default: 36, comfortable: 40, tableBody: 48 } as const;

// ---------------------------------------------------------------------------------------------
// StyleX style maps, keyed by ControlSize. Compose the ones a control needs, for example
//   stylex.props(base, heightStyles[size], pillPaddingStyles[size], textStyles[size])

/** Fixed outer height. Use on the element that owns the height (the shell, or the button itself). */
export const heightStyles = stylex.create({
  xs: { height: sizeScale.xs.height },
  sm: { height: sizeScale.sm.height },
  md: { height: sizeScale.md.height },
  lg: { height: sizeScale.lg.height },
  xl: { height: sizeScale.xl.height },
});

/** Icon-only controls: square, no padding. */
export const squareStyles = stylex.create({
  xs: { width: sizeScale.xs.height, height: sizeScale.xs.height, padding: 0, flexShrink: 0 },
  sm: { width: sizeScale.sm.height, height: sizeScale.sm.height, padding: 0, flexShrink: 0 },
  md: { width: sizeScale.md.height, height: sizeScale.md.height, padding: 0, flexShrink: 0 },
  lg: { width: sizeScale.lg.height, height: sizeScale.lg.height, padding: 0, flexShrink: 0 },
  xl: { width: sizeScale.xl.height, height: sizeScale.xl.height, padding: 0, flexShrink: 0 },
});

/** Pill padding. A pill with an icon uses the next smaller size's padding on the icon side. */
export const pillPaddingStyles = stylex.create({
  xs: { paddingInline: sizeScale.xs.padPill },
  sm: { paddingInline: sizeScale.sm.padPill },
  md: { paddingInline: sizeScale.md.padPill },
  lg: { paddingInline: sizeScale.lg.padPill },
  xl: { paddingInline: sizeScale.xl.padPill },
});

/** Rectangular control padding. */
export const rectPaddingStyles = stylex.create({
  xs: { paddingInline: sizeScale.xs.padRect },
  sm: { paddingInline: sizeScale.sm.padRect },
  md: { paddingInline: sizeScale.md.padRect },
  lg: { paddingInline: sizeScale.lg.padRect },
  xl: { paddingInline: sizeScale.xl.padRect },
});

/**
 * The icon side of a pill or rect (spec 1.2): the next smaller padding. Compose after the size's
 * padding, `Start` for a leading icon and `End` for a trailing one.
 */
export const pillIconPaddingStartStyles = stylex.create({
  xs: { paddingInlineStart: sizeScale.xs.padPillIcon },
  sm: { paddingInlineStart: sizeScale.sm.padPillIcon },
  md: { paddingInlineStart: sizeScale.md.padPillIcon },
  lg: { paddingInlineStart: sizeScale.lg.padPillIcon },
  xl: { paddingInlineStart: sizeScale.xl.padPillIcon },
});
export const pillIconPaddingEndStyles = stylex.create({
  xs: { paddingInlineEnd: sizeScale.xs.padPillIcon },
  sm: { paddingInlineEnd: sizeScale.sm.padPillIcon },
  md: { paddingInlineEnd: sizeScale.md.padPillIcon },
  lg: { paddingInlineEnd: sizeScale.lg.padPillIcon },
  xl: { paddingInlineEnd: sizeScale.xl.padPillIcon },
});
export const rectIconPaddingStartStyles = stylex.create({
  xs: { paddingInlineStart: sizeScale.xs.padRectIcon },
  sm: { paddingInlineStart: sizeScale.sm.padRectIcon },
  md: { paddingInlineStart: sizeScale.md.padRectIcon },
  lg: { paddingInlineStart: sizeScale.lg.padRectIcon },
  xl: { paddingInlineStart: sizeScale.xl.padRectIcon },
});
export const rectIconPaddingEndStyles = stylex.create({
  xs: { paddingInlineEnd: sizeScale.xs.padRectIcon },
  sm: { paddingInlineEnd: sizeScale.sm.padRectIcon },
  md: { paddingInlineEnd: sizeScale.md.padRectIcon },
  lg: { paddingInlineEnd: sizeScale.lg.padRectIcon },
  xl: { paddingInlineEnd: sizeScale.xl.padRectIcon },
});

/** Icon-to-label gap. */
export const gapStyles = stylex.create({
  xs: { gap: sizeScale.xs.gap },
  sm: { gap: sizeScale.sm.gap },
  md: { gap: sizeScale.md.gap },
  lg: { gap: sizeScale.lg.gap },
  xl: { gap: sizeScale.xl.gap },
});

/** Control label text: size, pixel line height, weight 500, tracking. */
export const textStyles = stylex.create({
  xs: { fontSize: sizeScale.xs.fontSize, lineHeight: `${sizeScale.xs.lineHeight}px`, fontWeight: sizeScale.xs.fontWeight, letterSpacing: 0 },
  sm: { fontSize: sizeScale.sm.fontSize, lineHeight: `${sizeScale.sm.lineHeight}px`, fontWeight: sizeScale.sm.fontWeight, letterSpacing: t['--os-tracking-tight'] },
  md: { fontSize: sizeScale.md.fontSize, lineHeight: `${sizeScale.md.lineHeight}px`, fontWeight: sizeScale.md.fontWeight, letterSpacing: t['--os-tracking-tight'] },
  lg: { fontSize: sizeScale.lg.fontSize, lineHeight: `${sizeScale.lg.lineHeight}px`, fontWeight: sizeScale.lg.fontWeight, letterSpacing: t['--os-tracking-tight'] },
  xl: { fontSize: sizeScale.xl.fontSize, lineHeight: `${sizeScale.xl.lineHeight}px`, fontWeight: sizeScale.xl.fontWeight, letterSpacing: t['--os-tracking-tight'] },
});

/**
 * The control radius per size (spec 1.3): every control size takes --os-radius-control; xs takes it less the
 * md-to-sm step, so a corner ladder gives xs radius-sm (6 at Standard, 2 at Tight) and Round keeps xs a pill.
 */
export const radiusStyles = stylex.create({
  xs: { borderRadius: `calc(${t['--os-radius-control']} - ${t['--os-radius-md']} + ${t['--os-radius-sm']})` },
  sm: { borderRadius: t['--os-radius-control'] },
  md: { borderRadius: t['--os-radius-control'] },
  lg: { borderRadius: t['--os-radius-control'] },
  xl: { borderRadius: t['--os-radius-control'] },
});

/**
 * The inner <input> of a bordered text-entry shell, per size: field inset minus the 1px border,
 * value text at weight 400, and block padding that makes the input's own height equal to the
 * shell's inner height, so the shell measures right with or without an explicit height.
 * On coarse pointers the value renders at 16px (below that iOS zooms on focus).
 * Pair with `controlShellSizeStyles[size]` (from ./control) on the shell.
 */
export const fieldInputSizeStyles = stylex.create({
  xs: { paddingInline: sizeScale.xs.fieldInset - 1, paddingBlock: (sizeScale.xs.height - 2 - sizeScale.xs.lineHeight) / 2, fontSize: { default: sizeScale.xs.fontSize, '@media (pointer: coarse)': t['--os-font-size-body'] }, lineHeight: `${sizeScale.xs.lineHeight}px`, fontWeight: t['--os-font-weight-regular'] },
  sm: { paddingInline: sizeScale.sm.fieldInset - 1, paddingBlock: (sizeScale.sm.height - 2 - sizeScale.sm.lineHeight) / 2, fontSize: { default: sizeScale.sm.fontSize, '@media (pointer: coarse)': t['--os-font-size-body'] }, lineHeight: `${sizeScale.sm.lineHeight}px`, fontWeight: t['--os-font-weight-regular'] },
  md: { paddingInline: sizeScale.md.fieldInset - 1, paddingBlock: (sizeScale.md.height - 2 - sizeScale.md.lineHeight) / 2, fontSize: { default: sizeScale.md.fontSize, '@media (pointer: coarse)': t['--os-font-size-body'] }, lineHeight: `${sizeScale.md.lineHeight}px`, fontWeight: t['--os-font-weight-regular'] },
  lg: { paddingInline: sizeScale.lg.fieldInset - 1, paddingBlock: (sizeScale.lg.height - 2 - sizeScale.lg.lineHeight) / 2, fontSize: { default: sizeScale.lg.fontSize, '@media (pointer: coarse)': t['--os-font-size-body'] }, lineHeight: `${sizeScale.lg.lineHeight}px`, fontWeight: t['--os-font-weight-regular'] },
  xl: { paddingInline: sizeScale.xl.fieldInset - 1, paddingBlock: (sizeScale.xl.height - 2 - sizeScale.xl.lineHeight) / 2, fontSize: sizeScale.xl.fontSize, lineHeight: `${sizeScale.xl.lineHeight}px`, fontWeight: t['--os-font-weight-regular'] },
});

/** Component text that is not a control label (spec 1.4 type scale). Line heights are pixel tokens. */
export const typeStyles = stylex.create({
  /** 12/16: badges, tooltips, group labels, table headers, captions. No tracking. */
  caption12: { fontSize: t['--os-font-size-xs'], lineHeight: t['--os-line-height-xs'], letterSpacing: 0 },
  /** 13/18: secondary lines, sm controls, table body. */
  small13: { fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-sm'], letterSpacing: t['--os-tracking-tight'] },
  /** 13/20: help and error text under a control. */
  help13: { fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-md'], letterSpacing: t['--os-tracking-tight'] },
  /** 14/20: body, labels, md controls, menu items. */
  body14: { fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'], letterSpacing: t['--os-tracking-tight'] },
  /** 15/20: lg controls. */
  body15: { fontSize: t['--os-font-size-md'], lineHeight: t['--os-line-height-md'], letterSpacing: t['--os-tracking-tight'] },
  /** 16/24: xl controls, card and empty headings, touch field values. */
  body16: { fontSize: t['--os-font-size-body'], lineHeight: t['--os-line-height-lg'], letterSpacing: t['--os-tracking-tight'] },
  /** 18/24 with tight tracking (-0.02em is for 20px and up): overlay titles. */
  title18: { fontSize: t['--os-font-size-lg'], lineHeight: t['--os-line-height-lg'], letterSpacing: t['--os-tracking-tight'] },
  /** Every changing number: values, counters, pagination, table numbers, steppers, timers. */
  tabular: { fontVariantNumeric: 'tabular-nums' },
});
