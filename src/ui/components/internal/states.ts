import * as stylex from '@stylexjs/stylex';
import { tokens as t } from '../../tokens.stylex';

// Interaction states from DESIGN_SPEC 1.8, written once. Compose them after a control's base style.
//
// StyleX merges whole properties: a later style that sets `backgroundColor` replaces every
// condition (default, :hover, media) of an earlier `backgroundColor`. So each helper below owns a
// complete property, and state helpers meant to win (disabled, invalid, read-only) come last.
//
// StyleX 0.19 sorts `:focus-within` and `:focus-visible` *before* `:hover` (its priority table has
// camel-case keys), so a hover rule would beat a focus rule on the same property. Hover rules that
// share a property with a focus rule are written `:hover:not(:focus-within)` to keep them apart.

const ring = t['--os-color-focus-ring'];
const reduce = '@media (prefers-reduced-motion: reduce)';
const canHover = '@media (hover: hover)';

/**
 * Focus (spec 1.8): one 2px ring in --os-color-focus-ring.
 * - `ring` / `ringInset`: apply on React Aria `isFocusVisible` (render-prop className).
 * - `ringVisible` / `ringInsetVisible`: the same, for native elements, on `:focus-visible`.
 * - `ringInset` (offset -2) only for items whose neighbors are under 4px away or that sit in an
 *   `overflow: hidden` parent: tabs in a track, pills, toolbar tools, checklist rows, table cells.
 * - `ringInsetOverlay`: the inset ring for controls with positioned children that cover an outline.
 * - `none`: remove the ring where another pattern replaces it (text-entry edge ring, virtual focus fill).
 * Text-entry shells use the edge ring, which lives in `controlStyles.shell` (./control).
 */
export const focusStyles = stylex.create({
  ring: { outlineStyle: 'solid', outlineWidth: 2, outlineColor: ring, outlineOffset: 2 },
  ringInset: { outlineStyle: 'solid', outlineWidth: 2, outlineColor: ring, outlineOffset: -2 },
  ringVisible: {
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2, outlineColor: ring, outlineOffset: 2,
  },
  ringInsetVisible: {
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2, outlineColor: ring, outlineOffset: -2,
  },
  /**
   * The inset ring drawn on a ::before layer (z-index 1) instead of an outline, for controls whose
   * positioned children (a sliding fill, an indicator) would paint over an outline. Sets
   * `position: relative`. Leaves ::after free for the coarse-pointer hit area.
   */
  ringInsetOverlay: {
    position: 'relative', outlineStyle: 'none',
    '::before': {
      content: '""', position: 'absolute', inset: 0, zIndex: 1, borderRadius: 'inherit',
      boxShadow: `inset 0 0 0 2px ${ring}`, pointerEvents: 'none',
    },
  },
  none: { outlineStyle: 'none' },
});

/** Color transitions (hover, focus, selection). Never longer than --os-motion-hover. */
export const transitionStyles = stylex.create({
  colors: {
    // No outline-color: the focus ring appears at once in its own color (spec 1.8), never fading in from currentColor.
    transitionProperty: 'color, background-color, border-color, box-shadow, opacity',
    transitionDuration: { default: t['--os-motion-hover'], [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  /** Colors plus the press scale. */
  colorsAndPress: {
    transitionProperty: 'color, background-color, border-color, box-shadow, opacity, transform',
    transitionDuration: { default: `${t['--os-motion-hover']}, ${t['--os-motion-hover']}, ${t['--os-motion-hover']}, ${t['--os-motion-hover']}, ${t['--os-motion-hover']}, ${t['--os-motion-press']}`, [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
});

/**
 * Hover fills (spec 1.8 table), each wrapped in `@media (hover: hover)`.
 * The `*Active` variants are the same fill without the pseudo-class: apply them on React Aria
 * `isHovered`, or on `isFocused` for virtual-focus items (menu, listbox, command, Select morph),
 * whose focus state *is* the hover fill.
 */
export const hoverStyles = stylex.create({
  /** Transparent compact controls and list items: ghost Button, Toggle, ToolbarButton, inline field buttons, menu/listbox/command items, Pagination, calendar days. */
  fill: { backgroundColor: { default: 'transparent', ':hover': { default: null, [canHover]: t['--os-color-bg-interactive-primary'] } } },
  fillActive: { backgroundColor: t['--os-color-bg-interactive-primary'] },
  /** Large rows: table row, Collapsible header. */
  row: { backgroundColor: { default: 'transparent', ':hover': { default: null, [canHover]: t['--os-color-bg-subtle'] } } },
  rowActive: { backgroundColor: t['--os-color-bg-subtle'] },
  /** Neutral filled (Button secondary, chips): accent-subtle -> accent-muted, pressed accent-dim. */
  // The pressed fill is nested under the media hover rule too: StyleX doubles the class for the media
  // rule, so a plain `:active` beside it loses while the pointer is over the control.
  neutral: {
    backgroundColor: {
      default: t['--os-color-accent-subtle'],
      ':hover': { default: null, [canHover]: { default: t['--os-color-accent-muted'], ':active': t['--os-color-accent-dim'] } },
      ':active': t['--os-color-accent-dim'],
    },
  },
  /** Primary: accent-moderate -> accent-bold, pressed accent-strong. Content stays accent-on-accent. */
  primary: {
    backgroundColor: {
      default: t['--os-color-accent-moderate'],
      ':hover': { default: null, [canHover]: { default: t['--os-color-accent-bold'], ':active': t['--os-color-accent-strong'] } },
      ':active': t['--os-color-accent-strong'],
    },
    color: t['--os-color-accent-on-accent'],
  },
  /** Text-only (inactive tabs, segments, pills, breadcrumb, sort header, accordion icon): fg-muted -> fg-base. */
  text: { color: { default: t['--os-color-fg-muted'], ':hover': { default: null, [canHover]: t['--os-color-fg-base'] } } },
  textActive: { color: t['--os-color-fg-base'] },
});

/**
 * Pressed (spec 1.8): the fill steps once more over --os-motion-press, and the control scales.
 * `scale` (.97) for controls of 24px and up, `scaleIndicator` (.9) for indicators of 20px or less.
 * Apply on React Aria `isPressed`; the `*Active` variants carry `:active` for native buttons.
 * No scale on list rows. Reduced motion removes the scale.
 */
export const pressStyles = stylex.create({
  scale: { transform: { default: 'scale(.97)', [reduce]: 'none' } },
  scaleIndicator: { transform: { default: 'scale(.9)', [reduce]: 'none' } },
  scaleActive: { transform: { default: 'none', ':active:not(:disabled):not([aria-disabled=true])': { default: 'scale(.97)', [reduce]: 'none' } } },
  /** Fill step for transparent controls (after hover's bg-interactive-primary). */
  fill: { backgroundColor: t['--os-color-bg-interactive-secondary'] },
});

/**
 * Disabled (spec 1.8): swap colors, don't fade. `cursor: default`, no hover, no press.
 * - `text`: transparent controls stay transparent; text goes fg-disabled.
 * - `filled`: filled controls take bg-disabled.
 * - `shell`: bordered shells take border-disabled and bg-disabled, with no hover change.
 * - `label`: the label of a disabled control.
 * - `composite`: opacity .4, only for visuals with no tokenized parts (StretchSwitch, Slider ticks, ToolPalette tools, avatars).
 */
export const disabledStyles = stylex.create({
  text: { color: t['--os-color-fg-disabled'], backgroundColor: 'transparent', cursor: 'default', transform: 'none' },
  filled: { color: t['--os-color-fg-disabled'], backgroundColor: t['--os-color-bg-disabled'], cursor: 'default', transform: 'none' },
  shell: {
    color: t['--os-color-fg-disabled'], backgroundColor: t['--os-color-bg-disabled'],
    borderColor: t['--os-color-border-disabled'], boxShadow: 'none', cursor: 'default',
  },
  label: { color: t['--os-color-fg-disabled'] },
  composite: { opacity: 0.4, cursor: 'default' },
});

/**
 * Invalid (spec 1.8). Show it on blur or submit (`validationBehavior="aria"`), never on first keystroke.
 * - `shell`: bordered text-entry shell: 1px border-error at rest and on hover, the edge ring in
 *   border-error on focus, no background tint.
 * - `borderless`: Select morph, OtpField cells, Composer: an inset 1px border-error ring.
 * - `indicator`: checkbox and radio ring (1.5px, inset).
 * - `message`: the error line, 13/20 fg-error. It replaces the help text and is linked with aria-describedby.
 */
export const invalidStyles = stylex.create({
  shell: {
    borderColor: t['--os-color-border-error'],
    boxShadow: { default: 'none', ':focus-within': `inset 0 0 0 1px ${t['--os-color-border-error']}` },
  },
  borderless: { boxShadow: `inset 0 0 0 1px ${t['--os-color-border-error']}` },
  indicator: { boxShadow: `inset 0 0 0 1.5px ${t['--os-color-border-error']}` },
  message: {
    margin: 0, color: t['--os-color-fg-error'], fontSize: t['--os-font-size-caption'],
    lineHeight: t['--os-line-height-md'], letterSpacing: t['--os-tracking-tight'],
  },
});

/**
 * Read-only (spec 1.8): the shell goes bg-subtle with a border-subtle edge and no hover change;
 * text stays fg-base, the value stays selectable, and the focus ring still shows.
 * Hide steppers, chevrons and clear buttons, and set aria-readonly.
 */
export const readOnlyStyles = stylex.create({
  shell: {
    backgroundColor: t['--os-color-bg-subtle'], color: t['--os-color-fg-base'],
    borderColor: { default: t['--os-color-border-subtle'], ':focus-within': ring },
  },
  /** For the steppers, chevrons and clear buttons of a read-only field. */
  hidden: { display: 'none' },
});

const spin = stylex.keyframes({ to: { transform: 'rotate(360deg)' } });

/**
 * Loading (spec 1.8): the control keeps its size and fill; the label goes opacity 0 and stays in
 * layout; a spinner sized like the control's icon (sizeScale[size].icon) sits centered in currentColor.
 * Set aria-busy="true" and ignore presses. The cursor is the plain arrow: the spinner already shows the wait,
 * and the native progress cursor (an arrow with a spinning wheel) would show it twice.
 */
export const loadingStyles = stylex.create({
  control: { position: 'relative', cursor: 'default' },
  label: { opacity: 0 },
  /** Centered over the control. Size it with `spinnerSize(px)`. */
  spinnerCentered: { position: 'absolute', insetBlockStart: '50%', insetInlineStart: '50%', marginBlockStart: 'calc(var(--os-spinner-size, 16px) / -2)', marginInlineStart: 'calc(var(--os-spinner-size, 16px) / -2)' },
  /** A three-quarter ring in currentColor. One period: --os-motion-spin. Reduced motion stops it and keeps the static ring. */
  spinner: {
    display: 'inline-block', flexShrink: 0, boxSizing: 'border-box',
    width: 'var(--os-spinner-size, 16px)', height: 'var(--os-spinner-size, 16px)',
    borderWidth: 'max(1.5px, calc(var(--os-spinner-size, 16px) / 9))', borderStyle: 'solid', borderColor: 'currentColor',
    borderInlineEndColor: 'transparent', borderRadius: t['--os-radius-full'],
    animationName: { default: spin, [reduce]: 'none' }, animationDuration: t['--os-motion-spin'],
    animationTimingFunction: 'linear', animationIterationCount: 'infinite',
  },
  spinnerSize: (size: number) => ({ '--os-spinner-size': `${size}px` }),
});
