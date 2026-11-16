'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import type { ComponentPropsWithRef, ReactNode } from 'react';
import { tokens as t } from '../tokens.stylex';
import { Icon } from './Icon';
import type { IconName } from './Icon';
import {
  normalizeSize, sizeScale, heightStyles, squareStyles, gapStyles, textStyles, radiusStyles,
  rectPaddingStyles, rectIconPaddingStartStyles, rectIconPaddingEndStyles,
} from './internal/size';
import type { ControlSize, ControlSizeProp } from './internal/size';
import { disabledStyles, focusStyles, pressStyles, transitionStyles } from './internal/states';

// Pagination (DESIGN_SPEC 2.2 Pagination, 1.2, 1.8, 1.14, 1.15): transparent items, sm 32 by default,
// that fill with bg-interactive-primary on hover. The current page is Selected 3: the same fill at rest,
// fg-base 500, no shadow, bg-interactive-secondary on hover. Focus is the 2px ring at offset 2 (items
// sit 4px apart). The ellipsis is an Icon centered on the item height. Hit areas grow on the block axis
// only, because neighbors are 4px away.

const canHover = '@media (hover: hover)';
const coarse = '@media (pointer: coarse)';

const s = stylex.create({
  list: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: t['--os-space-1'],
    margin: 0, padding: 0, listStyleType: 'none',
  },
  slot: { display: 'flex' },
  item: {
    position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    boxSizing: 'border-box', margin: 0, borderWidth: 0, borderStyle: 'none',
    fontFamily: t['--os-font-family'], fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap',
    color: t['--os-color-fg-base'], textDecorationLine: 'none', userSelect: 'none', cursor: 'pointer',
    WebkitTapHighlightColor: 'transparent',
    // Rest -> hover -> pressed (spec 1.8). The pressed step repeats the hover media query: a
    // media-wrapped :hover compiles with doubled specificity and would beat a plain :active.
    backgroundColor: {
      default: 'transparent',
      ':hover': { default: null, [canHover]: t['--os-color-bg-interactive-primary'] },
      ':active': { default: t['--os-color-bg-interactive-secondary'], [canHover]: t['--os-color-bg-interactive-secondary'] },
    },
    // Hit area (spec 1.14): 24px under a fine pointer, 44px under a coarse one, block axis only.
    '::after': {
      content: '""', position: 'absolute', insetBlockStart: '50%', insetInlineStart: 0, width: '100%',
      height: { default: 'max(100%, 24px)', [coarse]: 'max(100%, 44px)' },
      transform: 'translateY(-50%)',
    },
  },
  current: {
    fontWeight: t['--os-font-weight-medium'],
    backgroundColor: {
      default: t['--os-color-bg-interactive-primary'],
      ':hover': { default: null, [canHover]: t['--os-color-bg-interactive-secondary'] },
      ':active': { default: t['--os-color-bg-interactive-tertiary'], [canHover]: t['--os-color-bg-interactive-tertiary'] },
    },
  },
  icon: { display: 'inline-flex', flexShrink: 0 },
  ellipsis: { display: 'grid', placeItems: 'center', minWidth: t['--os-size-xs'], color: t['--os-color-fg-muted'] },
});

// "Previous" and "Next" with text take the rect padding (spec 1.2: 8 / 10 / 12 / 16 / 16) with the next smaller
// step on the icon side, from the shared maps in ./internal/size.

// Page numbers: a square at one digit (min-width = height), growing for longer numbers by the size's
// icon-to-label gap on each side (spec 1.2: 4 / 6 / 8 / 8 / 8).
const numberStyles = stylex.create({
  xs: { minWidth: t['--os-size-xs'], paddingInline: t['--os-space-1'] },
  sm: { minWidth: t['--os-size-sm'], paddingInline: t['--os-space-1-5'] },
  md: { minWidth: t['--os-size-md'], paddingInline: t['--os-space-2'] },
  lg: { minWidth: t['--os-size-lg'], paddingInline: t['--os-space-2'] },
  xl: { minWidth: t['--os-size-xl'], paddingInline: t['--os-space-2'] },
});


/** Text for the controls, for translation. */
export type PaginationLabels = {
  /** Names the navigation landmark. Default "Pagination". */
  navigation?: string;
  /** Accessible name of the icon-only previous button. Default "Previous page". */
  previous?: string;
  /** Accessible name of the icon-only next button. Default "Next page". */
  next?: string;
  /** Accessible name of the first-page button. Default "First page". */
  first?: string;
  /** Accessible name of the last-page button. Default "Last page". */
  last?: string;
  /** Visible text of the previous button with `controls="text"`. Default "Previous". */
  previousText?: string;
  /** Visible text of the next button with `controls="text"`. Default "Next". */
  nextText?: string;
  /** Accessible name of a page button. Default `Page ${page}`. */
  page?: (page: number) => string;
};

export type PaginationProps = Omit<ComponentPropsWithRef<'nav'>, 'children'> & {
  /** The number of pages. Nothing renders when it is 0. */
  totalPages: number;
  /** The current page, 1-based (controlled). */
  page?: number;
  /** The page shown first (uncontrolled). Default 1. */
  defaultPage?: number;
  /** Called with the page a reader picks. */
  onPageChange?: (page: number) => void;
  /** Renders pages as links to the URL it returns. */
  getPageHref?: (page: number) => string;
  /** Item size (spec 1.2). Default `sm` (32). `small`, `medium` and `large` are aliases of `sm`, `md` and `lg`. */
  size?: ControlSizeProp;
  /** Pages shown on each side of the current one. Default 0. */
  siblingCount?: number;
  /** Adds buttons for the first and last page. */
  showFirstLast?: boolean;
  /** `icon` (default) shows chevrons; `text` adds "Previous" and "Next" beside them. */
  controls?: 'icon' | 'text';
  /** Disables every control. */
  isDisabled?: boolean;
  /** Text for the controls, for translation. */
  labels?: PaginationLabels;
};

type Slot = number | 'start' | 'end';

/** Page numbers with a constant slot count, so the row does not jump; an ellipsis always hides two or more pages. */
function getVisiblePages(total: number, page: number, siblingCount = 0): Slot[] {
  const siblings = Math.max(0, Math.floor(siblingCount));
  const slots = siblings * 2 + 5;
  const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, index) => from + index);
  if (total <= slots) return range(1, total);
  if (page - siblings <= 3) return [...range(1, slots - 2), 'end', total];
  if (page + siblings >= total - 2) return [1, 'start', ...range(total - (slots - 3), total)];
  return [1, 'start', ...range(page - siblings, page + siblings), 'end', total];
}

export function Pagination({
  totalPages, page, defaultPage = 1, onPageChange, getPageHref, size: sizeProp, siblingCount = 0, showFirstLast,
  controls = 'icon', isDisabled, labels, ...props
}: PaginationProps) {
  const [uncontrolledPage, setPage] = useState(defaultPage);
  const size: ControlSize = normalizeSize(sizeProp, 'sm');
  const total = Number.isFinite(totalPages) ? Math.max(0, Math.floor(totalPages)) : 0;
  if (total === 0) return null;

  const requestedPage = page ?? uncontrolledPage;
  const current = Number.isFinite(requestedPage) ? Math.min(total, Math.max(1, Math.floor(requestedPage))) : 1;
  const icon = sizeScale[size].icon;
  const pageLabel = labels?.page ?? ((value: number) => `Page ${value}`);

  function select(next: number) {
    if (next === current) return;
    if (page === undefined) setPage(next);
    onPageChange?.(next);
  }

  function control(target: number, content: ReactNode, shape: stylex.StyleXStyles, label?: string, active = false, unavailable = false) {
    const disabled = !!isDisabled || unavailable || target < 1 || target > total;
    const styles = stylex.props(
      s.item, heightStyles[size], textStyles[size], radiusStyles[size], gapStyles[size], shape,
      transitionStyles.colorsAndPress, pressStyles.scaleActive,
      active && s.current, disabled && (active ? disabledStyles.filled : disabledStyles.text), focusStyles.ringVisible,
    );
    const ariaCurrent = active ? 'page' : undefined;
    if (getPageHref) {
      if (disabled) return <a {...styles} role="link" aria-disabled="true" aria-label={label} aria-current={ariaCurrent}>{content}</a>;
      return <a {...styles} href={getPageHref(target)} aria-label={label} aria-current={ariaCurrent} onClick={event => {
        if (!event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey && !event.defaultPrevented) select(target);
      }}>{content}</a>;
    }
    return <button {...styles} type="button" aria-label={label} aria-current={ariaCurrent} disabled={disabled} onClick={() => select(target)}>{content}</button>;
  }

  const glyph = (name: IconName) => <span aria-hidden="true" {...stylex.props(s.icon)}><Icon name={name} size={icon} /></span>;
  const withText = controls === 'text';

  return (
    <nav {...props} aria-label={props['aria-label'] ?? labels?.navigation ?? 'Pagination'}>
      <ul role="list" {...stylex.props(s.list)}>
        {showFirstLast && <li {...stylex.props(s.slot)}>{control(1, glyph('chevrons-left'), squareStyles[size], labels?.first ?? 'First page', false, current === 1)}</li>}
        <li {...stylex.props(s.slot)}>{withText
          ? control(current - 1, <>{glyph('chevron-left')}{labels?.previousText ?? 'Previous'}</>, [rectPaddingStyles[size], rectIconPaddingStartStyles[size]])
          : control(current - 1, glyph('chevron-left'), squareStyles[size], labels?.previous ?? 'Previous page')}</li>
        {getVisiblePages(total, current, siblingCount).map(item => (
          <li key={item} {...stylex.props(s.slot)}>
            {typeof item === 'number'
              ? control(item, item, numberStyles[size], pageLabel(item), item === current)
              : <span aria-hidden="true" {...stylex.props(s.ellipsis, heightStyles[size], isDisabled && disabledStyles.label)}><Icon name="more-horizontal" size={icon} /></span>}
          </li>
        ))}
        <li {...stylex.props(s.slot)}>{withText
          ? control(current + 1, <>{labels?.nextText ?? 'Next'}{glyph('chevron-right')}</>, [rectPaddingStyles[size], rectIconPaddingEndStyles[size]])
          : control(current + 1, glyph('chevron-right'), squareStyles[size], labels?.next ?? 'Next page')}</li>
        {showFirstLast && <li {...stylex.props(s.slot)}>{control(total, glyph('chevrons-right'), squareStyles[size], labels?.last ?? 'Last page', false, current === total)}</li>}
      </ul>
    </nav>
  );
}
