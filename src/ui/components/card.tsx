'use client';

import * as stylex from '@stylexjs/stylex';
import { createContext, useContext, useId, type ComponentPropsWithRef, type ReactNode } from 'react';
import { tokens as t } from '../tokens.stylex';
import { withClassName } from './internal/class-name';
import { surfaceStyles } from './internal/surface';

// Card (DESIGN_SPEC 1.3 radius xl, 1.4 heading 16/24, 1.5 opt-in outline, 1.6 filled vs outline).
// `filled` is a bg-surface fill with no edge: put it on a bg-subtle section. On canvas, use `outline`.
// Padding sm 16, md 20, lg 24; the header and the body are 16 apart at every size (parts inside a card),
// the same rhythm as a dialog's header and body.

export type CardVariant = 'filled' | 'outline';
export type CardSize = 'sm' | 'md' | 'lg';
/** `CardSize` plus the legacy names `small`, `medium` and `large` (spec 3.0). */
export type CardSizeProp = CardSize | 'small' | 'medium' | 'large';
export type CardHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

const legacySizes = { small: 'sm', medium: 'md', large: 'lg' } as const;
const normalizeCardSize = (size: CardSizeProp | undefined): CardSize =>
  size === undefined ? 'md' : size in legacySizes ? legacySizes[size as keyof typeof legacySizes] : (size as CardSize);

const s = stylex.create({
  root: { display: 'flex', flexDirection: 'column' },
  header: { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', columnGap: t['--os-space-4'], alignItems: 'start' },
  headerWithAction: { gridTemplateColumns: 'minmax(0, 1fr) auto' },
  heading: {
    margin: 0, fontSize: t['--os-font-size-body'], lineHeight: t['--os-line-height-lg'],
    fontWeight: t['--os-font-weight-medium'], letterSpacing: t['--os-tracking-tight'],
  },
  // A control taller than the 24px title line overflows this box evenly, so it centers on the title.
  action: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: t['--os-space-2'], height: t['--os-line-height-lg'] },
  body: { minWidth: 0, fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'] },
  headerBeforeBody: { paddingBottom: 0 },
  bodyAfterHeader: { paddingTop: t['--os-space-4'] },
  footer: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: t['--os-space-2'],
    minWidth: 0, backgroundColor: t['--os-color-bg-subtle'], paddingBlock: t['--os-space-3'],
    fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'],
  },
  // A filled card already sits on bg-subtle, where a bg-subtle strip would read as the page showing through.
  // Its footer stays on the card's surface behind a hairline instead.
  footerFilled: {
    backgroundColor: t['--os-color-bg-surface'],
    borderTopWidth: { default: 1, ':first-child': 0 }, borderTopStyle: 'solid', borderTopColor: t['--os-color-border-subtle'],
  },
  footerRadius: {
    borderTopLeftRadius: { default: 0, ':first-child': t['--os-radius-xl'] },
    borderTopRightRadius: { default: 0, ':first-child': t['--os-radius-xl'] },
    borderBottomLeftRadius: t['--os-radius-xl'], borderBottomRightRadius: t['--os-radius-xl'],
  },
  // Inside the 1px outline the footer's corners sit 1px in: radius xl - 1 (nesting rule, spec 1.3).
  footerRadiusOutline: {
    borderTopLeftRadius: { default: 0, ':first-child': `calc(${t['--os-radius-xl']} - 1px)` },
    borderTopRightRadius: { default: 0, ':first-child': `calc(${t['--os-radius-xl']} - 1px)` },
    borderBottomLeftRadius: `calc(${t['--os-radius-xl']} - 1px)`, borderBottomRightRadius: `calc(${t['--os-radius-xl']} - 1px)`,
  },
  panel: { minWidth: 0 },
});

const pad = stylex.create({
  sm: { padding: t['--os-space-4'] },
  md: { padding: t['--os-space-5'] },
  lg: { padding: t['--os-space-6'] },
});

// CardPanel cancels the body padding so its content runs to the card's edges. It also hands that inset to a
// Table inside (--os-table-edge), so the first and last cells line up with the card's heading.
const bleed = stylex.create({
  sm: { '--os-table-edge': t['--os-space-4'], marginInline: `calc(-1 * ${t['--os-space-4']})`, marginBottom: { default: 0, ':last-child': `calc(-1 * ${t['--os-space-4']})` } },
  md: { '--os-table-edge': t['--os-space-5'], marginInline: `calc(-1 * ${t['--os-space-5']})`, marginBottom: { default: 0, ':last-child': `calc(-1 * ${t['--os-space-5']})` } },
  lg: { '--os-table-edge': t['--os-space-6'], marginInline: `calc(-1 * ${t['--os-space-6']})`, marginBottom: { default: 0, ':last-child': `calc(-1 * ${t['--os-space-6']})` } },
});

const bleedTop = stylex.create({
  sm: { marginTop: { default: 0, ':first-child': `calc(-1 * ${t['--os-space-4']})` } },
  md: { marginTop: { default: 0, ':first-child': `calc(-1 * ${t['--os-space-5']})` } },
  lg: { marginTop: { default: 0, ':first-child': `calc(-1 * ${t['--os-space-6']})` } },
});

type CardContextValue = { size: CardSize; hasHeader: boolean };
const CardContext = createContext<CardContextValue>({ size: 'md', hasHeader: false });

export type CardProps = ComponentPropsWithRef<'article'> & {
  /** The card's title, rendered as a heading. */
  heading?: ReactNode;
  /** A line of supporting text under the heading. */
  description?: ReactNode;
  /** Content at the end of the header, such as a button or a menu trigger. */
  action?: ReactNode;
  /** A strip at the bottom for totals, meta or actions: bg-subtle on an outline card, a hairline-divided row on a filled one. */
  footer?: ReactNode;
  /** `filled` (default) for bg-subtle sections; `outline` adds a 1px hairline for canvas. */
  variant?: CardVariant;
  /** Padding: sm 16, md 20, lg 24. `small`, `medium` and `large` are aliases. */
  size?: CardSizeProp;
  /** The heading element, h1 to h6. */
  headingLevel?: CardHeadingLevel;
};

export function Card({
  heading, description, action, footer, variant = 'filled', size: sizeProp, headingLevel = 3,
  children, className, ...props
}: CardProps) {
  const size = normalizeCardSize(sizeProp);
  const headingId = useId();
  const hasHeader = heading != null || description != null || action != null;
  const outline = variant === 'outline';
  const Heading = `h${headingLevel}` as const;
  const labelledBy = heading != null && props['aria-label'] == null ? headingId : undefined;
  const styles = stylex.props(surfaceStyles.surface, surfaceStyles.cardSurface, s.root, outline && surfaceStyles.outline);

  return (
    <CardContext.Provider value={{ size, hasHeader }}>
      <article aria-labelledby={labelledBy} {...props} className={withClassName(styles, className)}>
        {hasHeader && (
          <header {...stylex.props(s.header, action != null && s.headerWithAction, pad[size], children != null && s.headerBeforeBody)}>
            <div {...stylex.props(surfaceStyles.copy)}>
              {heading != null && <Heading id={headingId} {...stylex.props(s.heading)}>{heading}</Heading>}
              {description != null && <div {...stylex.props(surfaceStyles.description)}>{description}</div>}
            </div>
            {action != null && <div {...stylex.props(s.action)}>{action}</div>}
          </header>
        )}
        {children != null && <div {...stylex.props(s.body, pad[size], hasHeader && s.bodyAfterHeader)}>{children}</div>}
        {footer != null && <footer {...stylex.props(pad[size], s.footer, !outline && s.footerFilled, outline ? s.footerRadiusOutline : s.footerRadius)}>{footer}</footer>}
      </article>
    </CardContext.Provider>
  );
}

export type CardPanelProps = ComponentPropsWithRef<'div'>;

/** A region of the card body that runs edge to edge, for a table or a list. */
export function CardPanel({ className, ...props }: CardPanelProps) {
  const { size, hasHeader } = useContext(CardContext);
  const styles = stylex.props(s.panel, bleed[size], !hasHeader && bleedTop[size]);
  return <div {...props} className={withClassName(styles, className)} />;
}
