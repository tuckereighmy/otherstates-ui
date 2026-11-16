import * as stylex from '@stylexjs/stylex';
import { tokens as t } from '../../tokens.stylex';

// Shared surfaces, group shells, tracks and the compact controls that sit on them (DESIGN_SPEC 1.5, 1.6, 1.8).

const ring = t['--os-color-focus-ring'];
const reduce = '@media (prefers-reduced-motion: reduce)';
const canHover = '@media (hover: hover)';

export const surfaceStyles = stylex.create({
  /**
   * A surface defined by its fill (bg-surface) and radius lg. It carries no hairline: on canvas a
   * surface needs an opt-in outline (`outline` below) or a subtle section around it (spec 1.6).
   */
  surface: {
    minWidth: 0,
    maxWidth: '100%',
    backgroundColor: t['--os-color-bg-surface'],
    color: t['--os-color-fg-base'],
    borderRadius: t['--os-radius-lg'],
    fontFamily: t['--os-font-family'], letterSpacing: t['--os-tracking-tight'],
  },
  /** Opt-in 1px border-subtle outline (Card and Frame `variant="outline"`, ScrollArea `bordered`). */
  outline: { borderWidth: 1, borderStyle: 'solid', borderColor: t['--os-color-border-subtle'] },
  heading: { margin: 0, fontSize: t['--os-font-size-body'], fontWeight: t['--os-font-weight-medium'], lineHeight: t['--os-line-height-lg'] },
  description: { margin: 0, color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'] },
  copy: { display: 'grid', gap: t['--os-space-1'], minWidth: 0, overflowWrap: 'anywhere' },
  cardSurface: { borderWidth: 0, borderRadius: t['--os-radius-xl'] },
  /**
   * A raised group shell (Group, Toolbar, ToggleGroup outline): shadow-control, padding 6, gap 2, and the
   * control radius plus that inset (lg at every corner ladder, a pill at Round), so the controls inside run concentric.
   */
  group: {
    display: 'inline-flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: t['--os-space-0-5'],
    padding: t['--os-space-1-5'],
    borderRadius: `calc(${t['--os-radius-control']} + ${t['--os-space-1-5']})`, boxShadow: t['--os-shadow-control'],
  },
  vertical: { flexDirection: 'column', alignItems: 'stretch' },
  flush: { padding: 0, backgroundColor: 'transparent', boxShadow: 'none' },
  /**
   * The track of a tile-on-track selection (spec 1.8 Selected 1): bg-muted, padding 4, radius control + 6
   * (lg at every corner ladder, a pill at Round). Tiles inside take `tileRadius`, the nesting rule against it
   * (12 at Standard). ExpandingTabs follows the same track.
   */
  track: {
    display: 'inline-flex', alignItems: 'center', gap: t['--os-space-0-5'], padding: t['--os-space-1'],
    borderRadius: `calc(${t['--os-radius-control']} + ${t['--os-space-1-5']})`, backgroundColor: t['--os-color-bg-muted'],
  },
  /** @deprecated Every track follows the control radius now (a pill at Round); this repeats `track`'s radius. */
  trackPill: { borderRadius: `calc(${t['--os-radius-control']} + ${t['--os-space-1-5']})` },
  /** The selected tile on a track: bg-raised plus shadow-control, text fg-base 500. Lighter than the track in dark. */
  tile: {
    backgroundColor: t['--os-color-bg-raised'], boxShadow: t['--os-shadow-control'],
    color: t['--os-color-fg-base'], fontWeight: t['--os-font-weight-medium'],
  },
  /** Unselected text on a track: fg-muted 500, fg-base on hover. */
  tileIdle: {
    color: { default: t['--os-color-fg-muted'], ':hover': { default: null, [canHover]: t['--os-color-fg-base'] } },
    fontWeight: t['--os-font-weight-medium'],
  },
  /** Radius of a tile inside a 4px-padded track: max(sm, track - 4), which is control + 2 (nesting rule). */
  tileRadius: { borderRadius: `max(${t['--os-radius-sm']}, calc(${t['--os-radius-control']} + ${t['--os-space-0-5']}))` },
  /** A toggled object (spec 1.8 Selected 2): Toggle, ToolbarButton, calendar day. */
  toggled: {
    backgroundColor: { default: t['--os-color-accent-moderate'], ':hover': { default: null, [canHover]: t['--os-color-accent-bold'] } },
    color: t['--os-color-accent-on-accent'],
  },
  /** The current location (spec 1.8 Selected 3): Pagination, nav lists. No shadow. */
  current: {
    backgroundColor: { default: t['--os-color-bg-interactive-primary'], ':hover': { default: null, [canHover]: t['--os-color-bg-interactive-secondary'] } },
    color: t['--os-color-fg-base'], fontWeight: t['--os-font-weight-medium'], boxShadow: 'none',
  },
  control: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: t['--os-space-1'],
    // The default row height (spec 1.2 row scale).
    minWidth: 36,
    minHeight: 36,
    paddingInline: t['--os-space-2'],
    borderRadius: t['--os-radius-control'],
    color: t['--os-color-fg-base'],
    backgroundColor: { default: 'transparent', ':hover': { default: null, [canHover]: t['--os-color-bg-interactive-primary'] } },
    fontFamily: t['--os-font-family'], letterSpacing: t['--os-tracking-tight'],
    fontSize: t['--os-font-size-sm'],
    fontWeight: t['--os-font-weight-medium'],
    lineHeight: 1,
    textDecoration: 'none',
    cursor: 'pointer',
    transitionProperty: 'background-color, color, transform, box-shadow',
    transitionDuration: { default: t['--os-motion-hover'], [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  /**
   * Keyboard focus for compact controls in a group or track: the inset ring (2px, focus-ring color,
   * spec 1.8), because neighbors sit 2px away. It is drawn by a ::before layer rather than an
   * outline so a positioned child (a pill's sliding fill) cannot paint over it. The control's own
   * radius and shadow stay as they are. Keep ::after free for the coarse-pointer hit area (spec 1.14).
   */
  focus: {
    position: 'relative', outlineStyle: 'none',
    '::before': {
      content: '""', position: 'absolute', inset: 0, zIndex: 1, borderRadius: 'inherit',
      boxShadow: `inset 0 0 0 2px ${ring}`, pointerEvents: 'none',
    },
  },
  pressed: { transform: { default: 'scale(.97)', [reduce]: 'none' } },
  disabled: { color: t['--os-color-fg-disabled'], cursor: 'default', backgroundColor: 'transparent' },
  /** @deprecated Legacy selected look (bg-subtle plus shadow-control). Use `tile`, `toggled` or `current` by context (spec 1.8 Selected). */
  selected: {
    backgroundColor: { default: t['--os-color-bg-subtle'], ':hover': { default: null, [canHover]: t['--os-color-bg-muted'] } },
    color: t['--os-color-fg-base'], boxShadow: t['--os-shadow-control'],
  },
});
