'use client';

import * as stylex from '@stylexjs/stylex';
import { cloneElement, isValidElement, useId } from 'react';
import type { ComponentPropsWithRef, ReactElement, ReactNode } from 'react';
import { tokens as t } from '../tokens.stylex';
import { Icon } from './Icon';
import type { IconProps } from './Icon';
import { withClassName } from './internal/class-name';

// Empty (DESIGN_SPEC 1.3 radius xl, 1.4 heading 16/24, 2.2 Empty): a centered column with an icon tile
// in bg-muted, a real heading and an actions row. `md` uses the 40px section rhythm (space-10) above
// and below. `dashed` drops the fill for a 1px dashed edge, the padding 1px smaller so the box keeps its size.

export type EmptySize = 'sm' | 'md' | 'lg';
export type EmptyVariant = 'filled' | 'dashed' | 'plain';
type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

const s = stylex.create({
  root: {
    boxSizing: 'border-box',
    display: 'grid',
    justifyItems: 'center',
    alignContent: 'center',
    textAlign: 'center',
    minWidth: 0,
    maxWidth: '100%',
    borderRadius: t['--os-radius-xl'],
    color: t['--os-color-fg-base'],
    fontFamily: t['--os-font-family'],
    letterSpacing: t['--os-tracking-tight'],
  },
  filled: { backgroundColor: t['--os-color-bg-surface'] },
  dashed: { backgroundColor: 'transparent', borderWidth: 1, borderStyle: 'dashed', borderColor: t['--os-color-border-muted'] },
  plain: { backgroundColor: 'transparent' },
  tile: {
    display: 'grid',
    placeItems: 'center',
    flex: 'none',
    borderRadius: t['--os-radius-md'],
    backgroundColor: t['--os-color-bg-muted'],
    color: t['--os-color-fg-muted'],
  },
  media: { display: 'flex', justifyContent: 'center', maxWidth: '100%' },
  copy: { display: 'grid', justifyItems: 'center', gap: t['--os-space-1'], minWidth: 0, maxWidth: '100%', overflowWrap: 'anywhere' },
  heading: { margin: 0, fontWeight: t['--os-font-weight-medium'], color: t['--os-color-fg-base'] },
  description: { margin: 0, color: t['--os-color-fg-muted'], fontWeight: t['--os-font-weight-regular'] },
  actions: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: t['--os-space-2'] },
});

const sizes = stylex.create({
  sm: { gap: t['--os-space-3'], paddingBlock: t['--os-space-6'], paddingInline: t['--os-space-5'] },
  md: { gap: t['--os-space-4'], paddingBlock: t['--os-space-10'], paddingInline: t['--os-space-6'] },
  lg: { gap: t['--os-space-5'], paddingBlock: t['--os-space-14'], paddingInline: t['--os-space-8'] },
});

// The dashed edge takes 1px of the padding on every side.
const dashedSizes = stylex.create({
  sm: { paddingBlock: `calc(${t['--os-space-6']} - 1px)`, paddingInline: `calc(${t['--os-space-5']} - 1px)` },
  md: { paddingBlock: `calc(${t['--os-space-10']} - 1px)`, paddingInline: `calc(${t['--os-space-6']} - 1px)` },
  lg: { paddingBlock: `calc(${t['--os-space-14']} - 1px)`, paddingInline: `calc(${t['--os-space-8']} - 1px)` },
});

// Icon tiles on the control scale (sm 32, md 40, xl 48), each twice its icon (16, 20, 24).
const tiles = stylex.create({
  sm: { width: t['--os-size-sm'], height: t['--os-size-sm'] },
  md: { width: t['--os-size-md'], height: t['--os-size-md'] },
  lg: { width: t['--os-size-xl'], height: t['--os-size-xl'] },
});

const headings = stylex.create({
  sm: { fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'] },
  md: { fontSize: t['--os-font-size-body'], lineHeight: t['--os-line-height-lg'] },
  lg: { fontSize: t['--os-font-size-lg'], lineHeight: t['--os-line-height-lg'] },
});

const descriptions = stylex.create({
  sm: { fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-sm'] },
  md: { fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'] },
  lg: { fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'] },
});

const iconSizes = { sm: 16, md: 20, lg: 24 } as const;

/** Gives an `<Icon>` without an explicit size the icon size of the tile. */
function sizedIcon(node: ReactNode, px: number): ReactNode {
  if (isValidElement(node) && node.type === Icon && (node.props as IconProps).size === undefined) {
    return cloneElement(node as ReactElement<IconProps>, { size: px });
  }
  return node;
}

export type EmptyProps = ComponentPropsWithRef<'div'> & {
  /** The title, rendered as a heading (`headingLevel`). */
  heading: ReactNode;
  /** One or two lines that say what belongs here and how to start. */
  description?: ReactNode;
  /** A glyph shown in a bg-muted tile above the heading. An `<Icon>` without a size gets 16, 20 or 24 px by `size`. */
  icon?: ReactNode;
  /** Content shown above the heading as it is, with no tile: an illustration, avatars, a preview. Wins over `icon`. */
  media?: ReactNode;
  /** The actions row under the copy: one primary action, at most one secondary. */
  action?: ReactNode;
  /** Padding, tile and type scale. Default `md`. */
  size?: EmptySize;
  /** `filled` (default) is bg-surface for subtle sections; `dashed` draws a dashed edge; `plain` has neither. */
  variant?: EmptyVariant;
  /** The heading element, h1 to h6. Default 3. */
  headingLevel?: HeadingLevel;
};

export function Empty({
  heading, description, icon, media, action, size = 'md', variant = 'filled', headingLevel = 3,
  children, className, ...props
}: EmptyProps) {
  const headingId = useId();
  const Heading = `h${headingLevel}` as const;
  const labelledBy = props['aria-label'] == null && props['aria-labelledby'] == null ? headingId : undefined;
  const styles = stylex.props(s.root, s[variant], sizes[size], variant === 'dashed' && dashedSizes[size]);

  return (
    <div role="group" aria-labelledby={labelledBy} {...props} className={withClassName(styles, className)}>
      {media != null
        ? <div {...stylex.props(s.media)}>{media}</div>
        : icon != null && <span aria-hidden="true" {...stylex.props(s.tile, tiles[size])}>{sizedIcon(icon, iconSizes[size])}</span>}
      <div {...stylex.props(s.copy)}>
        <Heading id={headingId} {...stylex.props(s.heading, headings[size])}>{heading}</Heading>
        {description != null && <div {...stylex.props(s.description, descriptions[size])}>{description}</div>}
      </div>
      {children}
      {action != null && <div {...stylex.props(s.actions)}>{action}</div>}
    </div>
  );
}
