'use client';

import * as stylex from '@stylexjs/stylex';
import { createContext, useContext, type ComponentPropsWithRef, type CSSProperties, type ReactNode } from 'react';
import { tokens as t } from '../tokens.stylex';
import { Icon } from './Icon';
import { withClassName } from './internal/class-name';
import { focusStyles, hoverStyles, transitionStyles } from './internal/states';
import { surfaceStyles } from './internal/surface';

// Table (DESIGN_SPEC 1.12 density, 1.5 one hairline under the head and none between body rows,
// 1.8 row hover bg-subtle, 1.14 sort button hit area, 1.15 sort icons).
// Comfortable: header 40, body rows 48. Compact: header 32, body rows 36. Header 12/16 500 fg-muted,
// body 13/20 fg-base (wrapping body text keeps the 20px line, like help text). Cells pad 12, and 16 at the
// row ends to line up with the 16px wrapper radius; the caption takes the same edge inset.

export type TableDensity = 'comfortable' | 'compact';
export type TableVariant = 'filled' | 'outline' | 'plain';
export type TableCellWrap = 'wrap' | 'nowrap' | 'truncate';

type Section = 'head' | 'body' | 'foot';
const TableContext = createContext<{ density: TableDensity; stickyHeader: boolean }>({ density: 'comfortable', stickyHeader: false });
const SectionContext = createContext<Section>('body');

const coarse = '@media (pointer: coarse)';

const s = stylex.create({
  outer: { overflowX: 'auto' },
  plainOuter: { minWidth: 0, maxWidth: '100%', fontFamily: t['--os-font-family'] },
  scrollY: { overflowY: 'auto' },
  table: {
    width: '100%',
    // Separate borders keep the head's hairline on the header cells, so it stays with a sticky head.
    borderCollapse: 'separate', borderSpacing: 0,
    color: t['--os-color-fg-base'],
    fontFamily: t['--os-font-family'], fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-md'],
    letterSpacing: t['--os-tracking-tight'],
  },
  caption: {
    captionSide: 'bottom', paddingBlock: t['--os-space-3'], paddingInline: `var(--os-table-edge, ${t['--os-space-4']})`, textAlign: 'start',
    color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-xs'], lineHeight: t['--os-line-height-xs'], letterSpacing: 0,
  },
  head: { color: t['--os-color-fg-muted'] },
  cell: {
    // The outer cells align with their container: 16 for the table's own wrapper, or the inset a CardPanel provides.
    paddingInlineStart: { default: t['--os-space-3'], ':first-child': `var(--os-table-edge, ${t['--os-space-4']})` },
    paddingInlineEnd: { default: t['--os-space-3'], ':last-child': `var(--os-table-edge, ${t['--os-space-4']})` },
    textAlign: 'start', verticalAlign: 'middle',
  },
  header: {
    paddingBlock: 0, whiteSpace: 'nowrap',
    color: t['--os-color-fg-muted'],
    fontSize: t['--os-font-size-xs'], lineHeight: t['--os-line-height-xs'], fontWeight: t['--os-font-weight-medium'], letterSpacing: 0,
    borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: t['--os-color-border-subtle'],
  },
  // Row scale (spec 1.2): header comfortable 40, compact 32.
  headerComfortable: { height: t['--os-size-md'] },
  headerCompact: { height: t['--os-size-sm'] },
  sticky: { position: 'sticky', insetBlockStart: 0, zIndex: 1, backgroundColor: t['--os-color-bg-surface'] },
  body: { fontWeight: t['--os-font-weight-regular'] },
  // Body rows 48 comfortable, 36 compact (the default row). A cell's height is its minimum: wrapped text grows it.
  bodyComfortable: { height: t['--os-size-xl'], paddingBlock: t['--os-space-2'] },
  bodyCompact: { height: 36, paddingBlock: t['--os-space-1'] },
  footer: {
    fontWeight: t['--os-font-weight-medium'],
    borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: t['--os-color-border-subtle'],
  },
  nowrap: { whiteSpace: 'nowrap' },
  // max-width 0 lets the column shrink below its text, so the text truncates instead of widening the table,
  // and width 100% hands it the space the other columns leave.
  truncate: { width: '100%', maxWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  // Numbers: end-aligned in tabular figures (spec 1.12). Kept off text columns, where tabular
  // figures would space out IDs such as INV-012.
  alignEnd: { textAlign: 'end', fontVariantNumeric: 'tabular-nums' },
  row: { backgroundColor: 'transparent' },
  selected: {
    backgroundColor: { default: t['--os-color-bg-muted'], ':hover': { default: null, '@media (hover: hover)': t['--os-color-bg-interactive-secondary'] } },
  },
  sortButton: {
    position: 'relative', display: 'inline-flex', alignItems: 'center', gap: t['--os-space-1'],
    minHeight: t['--os-size-xs'], padding: 0, borderWidth: 0, borderRadius: t['--os-radius-xs'], backgroundColor: 'transparent',
    fontFamily: 'inherit', fontSize: 'inherit', lineHeight: 'inherit', fontWeight: 'inherit', letterSpacing: 'inherit',
    textAlign: 'inherit', cursor: 'pointer',
    // Hit area (spec 1.14): at least 24px under a fine pointer, 44px under a coarse one.
    '::after': {
      content: '""', position: 'absolute', insetBlockStart: '50%', insetInlineStart: '50%', transform: 'translate(-50%, -50%)',
      width: { default: 'max(100%, 24px)', [coarse]: 'max(100%, 44px)' },
      height: { default: 'max(100%, 24px)', [coarse]: 'max(100%, 44px)' },
    },
  },
  // In an end-aligned column the icon leads, so the label lines up with the numbers below it.
  sortButtonEnd: { flexDirection: 'row-reverse' },
  sortIcon: { display: 'inline-flex', flexShrink: 0 },
});

export type TableProps = ComponentPropsWithRef<'table'> & {
  /** A note under the table, 12/16 fg-muted. It is also the table's accessible caption. */
  caption?: ReactNode;
  /** Row heights: `comfortable` (default) header 40 and rows 48, `compact` header 32 and rows 36. */
  density?: TableDensity;
  /** `filled` (default) is a bg-surface wrapper for bg-subtle sections, `outline` adds a 1px hairline for canvas, `plain` has no wrapper surface, for use inside a Card or Frame. */
  variant?: TableVariant;
  /** Keeps the header row in view while the body scrolls. Pair it with `maxHeight`. */
  stickyHeader?: boolean;
  /** The wrapper's maximum height. Taller content scrolls inside it. */
  maxHeight?: CSSProperties['maxHeight'];
};

export function Table({
  caption, density = 'comfortable', variant = 'filled', stickyHeader = false, maxHeight,
  className, children, ...props
}: TableProps) {
  const outer = variant === 'plain'
    ? stylex.props(s.plainOuter, s.outer, maxHeight != null && s.scrollY)
    : stylex.props(surfaceStyles.surface, variant === 'outline' && surfaceStyles.outline, s.outer, maxHeight != null && s.scrollY);
  return (
    <TableContext.Provider value={{ density, stickyHeader }}>
      <div {...outer} style={maxHeight != null ? { maxHeight } : undefined}>
        <table {...props} className={withClassName(stylex.props(s.table), className)}>
          {caption != null && <TableCaption>{caption}</TableCaption>}
          {children}
        </table>
      </div>
    </TableContext.Provider>
  );
}

export type TableCaptionProps = ComponentPropsWithRef<'caption'>;

/** The table's caption, shown under it. Use it in place of the `caption` prop for custom content. */
export function TableCaption({ className, ...props }: TableCaptionProps) {
  return <caption {...props} className={withClassName(stylex.props(s.caption), className)} />;
}

export function TableHead({ className, ...props }: ComponentPropsWithRef<'thead'>) {
  return (
    <SectionContext.Provider value="head">
      <thead {...props} className={withClassName(stylex.props(s.head), className)} />
    </SectionContext.Provider>
  );
}

export function TableBody(props: ComponentPropsWithRef<'tbody'>) {
  return <SectionContext.Provider value="body"><tbody {...props} /></SectionContext.Provider>;
}

/** Totals or a summary under the body, set off by a hairline. */
export function TableFooter(props: ComponentPropsWithRef<'tfoot'>) {
  return <SectionContext.Provider value="foot"><tfoot {...props} /></SectionContext.Provider>;
}

export type TableRowProps = ComponentPropsWithRef<'tr'> & {
  /** Marks the row as selected: a bg-muted fill and `data-selected`. Pair it with a checkbox in the row. */
  isSelected?: boolean;
};

export function TableRow({ isSelected, className, ...props }: TableRowProps) {
  const section = useContext(SectionContext);
  const body = section === 'body';
  const styles = stylex.props(
    s.row,
    body && transitionStyles.colors,
    body && hoverStyles.row,
    body && isSelected && s.selected,
  );
  return <tr data-selected={isSelected || undefined} {...props} className={withClassName(styles, className)} />;
}

export type TableColumnHeaderProps = ComponentPropsWithRef<'th'> & {
  /** End-aligns the column header, to sit over a column of numbers. */
  alignEnd?: boolean;
  /** The current sort of this column. Sets `aria-sort` and the arrow icon. */
  sortDirection?: 'ascending' | 'descending';
  /** Makes the header a sort button. Called when it is pressed. */
  onSort?: () => void;
};

export function TableColumnHeader({ alignEnd, sortDirection, onSort, className, children, ...props }: TableColumnHeaderProps) {
  const { density, stickyHeader } = useContext(TableContext);
  const styles = stylex.props(
    s.cell, s.header, density === 'compact' ? s.headerCompact : s.headerComfortable,
    stickyHeader && s.sticky, alignEnd && s.alignEnd,
  );
  const icon = sortDirection === 'ascending' ? 'arrow-up' : sortDirection === 'descending' ? 'arrow-down' : 'chevrons-up-down';
  return (
    <th scope="col" aria-sort={sortDirection} {...props} className={withClassName(styles, className)}>
      {onSort ? (
        <button
          type="button"
          onClick={onSort}
          {...stylex.props(s.sortButton, alignEnd && s.sortButtonEnd, hoverStyles.text, transitionStyles.colors, focusStyles.ringVisible)}
        >
          {children}
          <span aria-hidden="true" {...stylex.props(s.sortIcon)}><Icon name={icon} size={14} /></span>
        </button>
      ) : children}
    </th>
  );
}

export type TableCellProps = ComponentPropsWithRef<'td'> & {
  /** End-aligns the cell in tabular figures, for numbers. */
  alignEnd?: boolean;
  /** `wrap` (default) lets text wrap, `nowrap` keeps it on one line, `truncate` cuts it off with an ellipsis. */
  wrap?: TableCellWrap;
};

export function TableCell({ alignEnd, wrap = 'wrap', className, ...props }: TableCellProps) {
  const { density } = useContext(TableContext);
  const section = useContext(SectionContext);
  const styles = stylex.props(
    s.cell, s.body, density === 'compact' ? s.bodyCompact : s.bodyComfortable,
    section === 'foot' && s.footer,
    wrap === 'nowrap' && s.nowrap, wrap === 'truncate' && s.truncate,
    alignEnd && s.alignEnd,
  );
  return <td {...props} className={withClassName(styles, className)} />;
}
