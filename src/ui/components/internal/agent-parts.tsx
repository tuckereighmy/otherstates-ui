import * as stylex from '@stylexjs/stylex';
import type { KeyboardEvent, ReactNode } from 'react';
import { tokens as t } from '../../tokens.stylex';
import { isApplePlatform, useIsApple } from './platform';

// The agent card language (spec 1.19), shared by every agent component:
// - one object: a Card with no header or footer strips and no lines inside; space and washes separate parts;
// - a head row: the title (16, medium) and, on the end, the state or the one action;
// - one hero: a big figure, the question or the data itself;
// - washes, not lines: tiles, chips and rows sit on bg-muted;
// - point to inspect: the part under the pointer holds and the rest fall back to 22%;
// - actions at the foot of the body, quiet until they commit.

const reduce = '@media (prefers-reduced-motion: reduce)';

export const cardStyles = stylex.create({
  stack: { display: 'grid', gap: t['--os-space-4'], minWidth: 0 },
  head: { display: 'flex', alignItems: 'center', gap: t['--os-space-3'], minWidth: 0, minHeight: t['--os-size-sm'] },
  /** The title and a second line under it, 2 apart. */
  headText: { display: 'grid', gap: t['--os-space-0-5'], minWidth: 0, flex: '1 1 auto' },
  headEnd: { display: 'flex', alignItems: 'center', gap: t['--os-space-2'], flexShrink: 0, marginInlineStart: 'auto' },
  /** A title and its description, 4 apart. */
  titleBlock: { display: 'grid', gap: t['--os-space-1'], minWidth: 0 },
  title: {
    margin: 0, color: t['--os-color-fg-base'], fontSize: t['--os-font-size-body'], fontWeight: t['--os-font-weight-medium'],
    lineHeight: t['--os-line-height-lg'], letterSpacing: t['--os-tracking-tight'], overflowWrap: 'anywhere',
  },
  eyebrow: {
    color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-sm'],
    letterSpacing: t['--os-tracking-tight'], overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
  strong: { color: t['--os-color-fg-base'], fontWeight: t['--os-font-weight-medium'] },
  lead: {
    margin: 0, color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'],
    letterSpacing: t['--os-tracking-tight'],
  },

  figureRow: { display: 'flex', alignItems: 'baseline', gap: t['--os-space-2'], minWidth: 0 },
  figure: {
    color: t['--os-color-fg-base'], fontSize: t['--os-font-size-2xl'], fontWeight: t['--os-font-weight-medium'],
    lineHeight: 1.1, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums',
  },
  unit: {
    color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-sm'],
    letterSpacing: t['--os-tracking-tight'], fontVariantNumeric: 'tabular-nums',
  },

  tiles: { display: 'grid', gap: t['--os-space-1'], gridTemplateColumns: 'repeat(auto-fit, minmax(96px, 1fr))', margin: 0 },
  /** Tiles drawn inside a wash: the wash is their surface, so they lose their own fill and padding. */
  tilesFlat: { columnGap: t['--os-space-3'], rowGap: t['--os-space-3'] },
  tile: {
    display: 'grid', gap: t['--os-space-1'], alignContent: 'space-between', minWidth: 0,
    paddingBlock: t['--os-space-2'], paddingInline: t['--os-space-3'], borderRadius: t['--os-radius-md'],
    backgroundColor: t['--os-color-bg-muted'],
  },
  tileFlat: { paddingBlock: 0, paddingInline: 0, borderRadius: 0, backgroundColor: 'transparent' },
  tileLabel: {
    color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-xs'], lineHeight: t['--os-line-height-xs'],
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
  tileValue: {
    margin: 0, color: t['--os-color-fg-base'], fontSize: t['--os-font-size-sm'], fontWeight: t['--os-font-weight-medium'],
    lineHeight: t['--os-line-height-md'], letterSpacing: t['--os-tracking-tight'], fontVariantNumeric: 'tabular-nums',
    overflowWrap: 'anywhere',
  },

  /**
   * Washes, not lines: rows, tiles and notes sit on bg-muted with radius md and 12 in from the side, 4 apart.
   * - `washRow`: one or two lines that don't wrap, 48 tall;
   * - `washRich`: content that wraps, 12 all round.
   */
  washList: { listStyleType: 'none', margin: 0, padding: 0, display: 'grid', gap: t['--os-space-1'], minWidth: 0 },
  wash: {
    boxSizing: 'border-box', minWidth: 0, paddingInline: t['--os-space-3'], borderRadius: t['--os-radius-md'],
    backgroundColor: t['--os-color-bg-muted'],
  },
  washRow: { minHeight: t['--os-size-xl'], paddingBlock: t['--os-space-1'] },
  washRich: { paddingBlock: t['--os-space-3'] },
  /** The two lines of a row: a 14/20 title over a 13/18 line, 2 apart. */
  rowText: { display: 'grid', gap: t['--os-space-0-5'], minWidth: 0, flex: '1 1 auto' },
  rowTitle: {
    minWidth: 0, color: t['--os-color-fg-base'], fontSize: t['--os-font-size-sm'], fontWeight: t['--os-font-weight-medium'],
    lineHeight: t['--os-line-height-md'], letterSpacing: t['--os-tracking-tight'],
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
  /** Meta text: 13/18 muted, tabular. */
  meta: {
    minWidth: 0, color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-sm'],
    letterSpacing: t['--os-tracking-tight'], fontVariantNumeric: 'tabular-nums',
  },
  ellipsis: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  /** An empty list or column: one muted caption line. */
  empty: {
    margin: 0, color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-sm'],
    letterSpacing: t['--os-tracking-tight'],
  },

  actions: { display: 'flex', alignItems: 'center', gap: t['--os-space-2'], flexWrap: 'wrap' },
  actionsFill: { display: 'grid', gridAutoColumns: 'minmax(0, 1fr)', gridAutoFlow: 'column', gap: t['--os-space-2'] },
  /** A decided card's outcome, on a wash as tall as the actions it replaces. */
  outcome: {
    display: 'flex', alignItems: 'center', gap: t['--os-space-2'], minHeight: t['--os-size-sm'], paddingInline: t['--os-space-3'],
    borderRadius: t['--os-radius-md'], backgroundColor: t['--os-color-bg-muted'], color: t['--os-color-fg-muted'],
    fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'], letterSpacing: t['--os-tracking-tight'],
  },
  outcomeIcon: { display: 'flex', flexShrink: 0 },
  approved: { color: t['--os-color-fg-success'] },
  denied: { color: t['--os-color-fg-muted'] },

  /** Point to inspect: everything but the held part falls back. */
  dimmable: {
    transitionProperty: 'opacity', transitionDuration: { default: t['--os-motion-hover'], [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  dim: { opacity: 0.22 },
});

export type DetailItem = { label: ReactNode; value: ReactNode };

/**
 * Label and value pairs as wash tiles: the secondary numbers of a card. `flat` drops the tiles' own fill for
 * figures that already sit inside a wash.
 */
export function DetailTiles({ items, flat = false }: { items: DetailItem[]; flat?: boolean }) {
  return (
    <dl {...stylex.props(cardStyles.tiles, flat && cardStyles.tilesFlat)}>
      {items.map((item, index) => (
        <div key={index} {...stylex.props(cardStyles.tile, flat && cardStyles.tileFlat)}>
          <dt {...stylex.props(cardStyles.tileLabel)}>{item.label}</dt>
          <dd {...stylex.props(cardStyles.tileValue)}>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export const isMac = isApplePlatform;

/** Shortcut names for aria-keyshortcuts. */
export function useShortcutNames() {
  return { primary: useIsApple() ? 'Meta+Enter' : 'Control+Enter', dismiss: 'Escape' };
}

/** Mod+Enter runs the primary action and Escape the dismiss action, while focus is inside the element. */
export function decisionKeys(onPrimary?: () => void, onDismiss?: () => void, enabled = true) {
  return (event: KeyboardEvent) => {
    if (!enabled || event.defaultPrevented || event.nativeEvent.isComposing) return;
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey) && onPrimary) { event.preventDefault(); onPrimary(); }
    else if (event.key === 'Escape' && onDismiss) { event.preventDefault(); onDismiss(); }
  };
}
