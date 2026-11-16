'use client';

import * as stylex from '@stylexjs/stylex';
import { cloneElement, isValidElement } from 'react';
import type { ComponentPropsWithRef, ElementType, ReactElement, ReactNode } from 'react';
import { Button as AriaButton, Dialog, DialogTrigger, Popover } from 'react-aria-components';
import { tokens as t } from '../tokens.stylex';
import { Icon } from './Icon';
import type { IconProps } from './Icon';
import { overlayItemStyles, overlayStyles, popupPlacement } from './internal/overlay';
import { radiusStyles } from './internal/size';
import { focusStyles, pressStyles, transitionStyles } from './internal/states';

// Breadcrumb (DESIGN_SPEC 2.2 Breadcrumb, 1.8, 1.14): 14/20 links in fg-muted that step to fg-base on
// hover, 24 tall (padding 2) with radius xs so the focus ring has room, and a 24/44 hit area. The
// current page is fg-base 500 and is not a link. Separators are fg-subtle and hidden from assistive tech.
// With `maxItems`, the middle of a long trail folds into a "more" button: an xs (24) icon-only control
// with the xs control radius, a 14px icon, the hover fill and the press scale.

const canHover = '@media (hover: hover)';
const coarse = '@media (pointer: coarse)';

const s = stylex.create({
  list: {
    display: 'flex', alignItems: 'center', flexWrap: 'wrap', columnGap: t['--os-space-2'], rowGap: t['--os-space-1'], minWidth: 0,
    margin: 0, padding: 0, listStyleType: 'none',
    fontFamily: t['--os-font-family'], fontSize: t['--os-font-size-sm'], fontWeight: t['--os-font-weight-regular'],
    lineHeight: t['--os-line-height-md'], letterSpacing: t['--os-tracking-tight'],
  },
  item: { display: 'inline-flex', alignItems: 'center', gap: t['--os-space-2'], minWidth: 0 },
  crumb: {
    position: 'relative', display: 'inline-flex', alignItems: 'center', gap: t['--os-space-1'], minWidth: 0,
    paddingBlock: t['--os-space-0-5'], borderRadius: t['--os-radius-xs'], color: t['--os-color-fg-muted'],
    textDecorationLine: 'none', overflowWrap: 'anywhere',
  },
  link: {
    color: { default: t['--os-color-fg-muted'], ':hover': { default: null, [canHover]: t['--os-color-fg-base'] } },
    cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
    // Hit area (spec 1.14): at least 24px under a fine pointer and 44px under a coarse one.
    '::after': {
      content: '""', position: 'absolute', insetBlockStart: '50%', insetInlineStart: '50%',
      width: { default: 'max(100%, 24px)', [coarse]: 'max(100%, 44px)' },
      height: { default: 'max(100%, 24px)', [coarse]: 'max(100%, 44px)' },
      transform: 'translate(-50%, -50%)',
    },
  },
  current: { color: t['--os-color-fg-base'], fontWeight: t['--os-font-weight-medium'] },
  icon: { display: 'inline-flex', flexShrink: 0 },
  separator: { display: 'inline-flex', alignItems: 'center', flexShrink: 0, color: t['--os-color-fg-subtle'], userSelect: 'none' },
  more: {
    position: 'relative', display: 'inline-grid', placeItems: 'center', flexShrink: 0, width: t['--os-size-xs'], height: t['--os-size-xs'],
    padding: 0, margin: 0, borderWidth: 0, cursor: 'pointer',
    color: t['--os-color-fg-muted'], backgroundColor: 'transparent', WebkitTapHighlightColor: 'transparent',
    '::after': {
      content: '""', position: 'absolute', insetBlockStart: '50%', insetInlineStart: '50%',
      width: { default: '100%', [coarse]: 'max(100%, 44px)' },
      height: { default: '100%', [coarse]: 'max(100%, 44px)' },
      transform: 'translate(-50%, -50%)',
    },
  },
  moreActive: { color: t['--os-color-fg-base'], backgroundColor: t['--os-color-bg-interactive-primary'] },
  morePressed: { color: t['--os-color-fg-base'], backgroundColor: t['--os-color-bg-interactive-secondary'] },
  popover: { minWidth: 200, maxWidth: 'min(320px, calc(100vw - 24px))' },
  dialog: { outlineStyle: 'none' },
  menu: { margin: 0, listStyleType: 'none', maxHeight: 'min(var(--available-height, 320px), 320px)', overflowY: 'auto' },
  menuLink: {
    backgroundColor: {
      default: 'transparent',
      ':hover': { default: null, [canHover]: t['--os-color-bg-interactive-primary'] },
      ':active': { default: t['--os-color-bg-interactive-secondary'], [canHover]: t['--os-color-bg-interactive-secondary'] },
    },
    cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
  },
});

/** One step of the trail. The last item is the current page. */
export type BreadcrumbItemData = {
  label: string;
  /** Where the step links to. Items without one render as text. */
  href?: string;
  /** An icon before the label. An `<Icon>` without a size renders at 16. */
  icon?: ReactNode;
};

/** The props a custom link component receives (see `linkAs`). */
export type BreadcrumbLinkProps = Omit<ComponentPropsWithRef<'a'>, 'href'> & { href: string };

export type BreadcrumbProps = Omit<ComponentPropsWithRef<'nav'>, 'children'> & {
  /** The trail, from the top level to the current page. */
  items: readonly BreadcrumbItemData[];
  /** Names the navigation landmark. Default "Breadcrumb". `aria-label` does the same. */
  label?: string;
  /** What sits between steps. Default "/". An `<Icon>` without a size renders at 14. */
  separator?: ReactNode;
  /** Show at most this many steps: the first, then the last `maxItems - 1`. The rest open from a "more" button. */
  maxItems?: number;
  /** Renders every link, for a router's link component. It receives `href`, `className`, `children` and the other link props. Default `a`. */
  linkAs?: ElementType<BreadcrumbLinkProps>;
  /** The accessible name of the "more" button and its popup. Default "More pages". */
  moreLabel?: string;
};

/** Gives an `<Icon>` without an explicit size the size the slot asks for. */
function sized(node: ReactNode, px: number): ReactNode {
  if (isValidElement(node) && node.type === Icon && (node.props as IconProps).size === undefined) {
    return cloneElement(node as ReactElement<IconProps>, { size: px });
  }
  return node;
}

type Entry = { kind: 'item'; item: BreadcrumbItemData; index: number } | { kind: 'more'; hidden: readonly BreadcrumbItemData[] };

function entriesOf(items: readonly BreadcrumbItemData[], maxItems: number | undefined): Entry[] {
  const all: Entry[] = items.map((item, index) => ({ kind: 'item', item, index }));
  if (maxItems === undefined || !Number.isFinite(maxItems)) return all;
  const max = Math.max(2, Math.floor(maxItems));
  if (items.length <= max) return all;
  const tail = max - 1;
  return [all[0], { kind: 'more', hidden: items.slice(1, items.length - tail) }, ...all.slice(items.length - tail)];
}

export function Breadcrumb({
  items, label = 'Breadcrumb', separator = '/', maxItems, linkAs, moreLabel = 'More pages', ...props
}: BreadcrumbProps) {
  const Link: ElementType<BreadcrumbLinkProps> = linkAs ?? 'a';
  const last = items.length - 1;
  const entries = entriesOf(items, maxItems);
  const divider = <span aria-hidden="true" {...stylex.props(s.separator)}>{sized(separator, 14)}</span>;
  const leading = (icon: ReactNode, style: stylex.StyleXStyles) => icon ? <span {...stylex.props(style)}>{sized(icon, 16)}</span> : null;

  return (
    <nav {...props} aria-label={props['aria-label'] ?? label}>
      <ol {...stylex.props(s.list)}>
        {entries.map((entry, position) => {
          const isLast = position === entries.length - 1;
          if (entry.kind === 'more') {
            return (
              <li key="more" {...stylex.props(s.item)}>
                <DialogTrigger>
                  <AriaButton aria-label={moreLabel} className={({ isHovered, isPressed, isFocusVisible }) => stylex.props(
                    s.more, radiusStyles.xs, transitionStyles.colorsAndPress,
                    isHovered && s.moreActive, isPressed && [s.morePressed, pressStyles.scale],
                    isFocusVisible ? focusStyles.ring : focusStyles.none,
                  ).className ?? ''}>
                    <Icon name="more-horizontal" size={14} />
                  </AriaButton>
                  <Popover placement="bottom start" offset={6} className={({ isExiting, placement }) => stylex.props(
                    overlayStyles.surface, overlayStyles.popup, s.popover, overlayStyles.popupMotion, popupPlacement(placement),
                    isExiting && overlayStyles.exit,
                  ).className ?? ''}>
                    <Dialog aria-label={moreLabel} {...stylex.props(s.dialog)}>
                      {({ close }) => (
                        <ul {...stylex.props(overlayItemStyles.list, s.menu)}>
                          {entry.hidden.map((item, index) => (
                            <li key={index}>
                              {item.href === undefined
                                ? <span {...stylex.props(overlayItemStyles.item)}>{leading(item.icon, overlayItemStyles.icon)}{item.label}</span>
                                : <Link href={item.href} onClick={close} {...stylex.props(overlayItemStyles.item, s.menuLink, focusStyles.ringInsetVisible)}>
                                  {leading(item.icon, overlayItemStyles.icon)}{item.label}
                                </Link>}
                            </li>
                          ))}
                        </ul>
                      )}
                    </Dialog>
                  </Popover>
                </DialogTrigger>
                {!isLast && divider}
              </li>
            );
          }
          const { item, index } = entry;
          const current = index === last;
          return (
            <li key={index} {...stylex.props(s.item)}>
              {current || item.href === undefined
                ? <span aria-current={current ? 'page' : undefined} {...stylex.props(s.crumb, current && s.current)}>{leading(item.icon, s.icon)}{item.label}</span>
                : <Link href={item.href} {...stylex.props(s.crumb, s.link, transitionStyles.colors, focusStyles.ringVisible)}>{leading(item.icon, s.icon)}{item.label}</Link>}
              {!isLast && divider}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
