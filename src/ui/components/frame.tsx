import * as stylex from '@stylexjs/stylex';
import { Children, isValidElement, type ComponentPropsWithRef, type ReactNode } from 'react';
import { tokens as t } from '../tokens.stylex';
import { withClassName } from './internal/class-name';
import { surfaceStyles } from './internal/surface';

// Frame (DESIGN_SPEC 2.2 Frame): a bg-subtle tray, padding and gap 8, holding one or more bg-surface
// panels at radius lg - 8 = 8 (nesting rule, spec 1.3). `outline` swaps 1px of padding for a hairline
// so every inset and radius stays the same.

export type FrameVariant = 'filled' | 'outline';
type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

const s = stylex.create({
  frame: {
    display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: t['--os-space-2'], padding: t['--os-space-2'],
    backgroundColor: t['--os-color-bg-subtle'],
  },
  frameOutline: { padding: `calc(${t['--os-space-2']} - 1px)` },
  bar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: t['--os-space-2'],
    minWidth: 0, paddingInline: t['--os-space-1-5'], paddingBlock: t['--os-space-0-5'],
    color: t['--os-color-fg-muted'],
    fontSize: t['--os-font-size-xs'], lineHeight: t['--os-line-height-xs'], fontWeight: t['--os-font-weight-medium'], letterSpacing: 0,
  },
  copy: { display: 'grid', gap: t['--os-space-0-5'], minWidth: 0, overflowWrap: 'anywhere' },
  title: {
    margin: 0, color: t['--os-color-fg-base'],
    fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'], fontWeight: t['--os-font-weight-medium'], letterSpacing: t['--os-tracking-tight'],
  },
  description: {
    margin: 0, color: t['--os-color-fg-muted'],
    fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-sm'], fontWeight: t['--os-font-weight-regular'], letterSpacing: t['--os-tracking-tight'],
  },
  // Buttons side by side are 8 apart, as in Card's action slot.
  actions: { display: 'flex', alignItems: 'center', gap: t['--os-space-2'], flexShrink: 0, marginInlineStart: 'auto' },
  panel: {
    minWidth: 0, padding: t['--os-space-4'],
    borderRadius: `max(${t['--os-radius-sm']}, calc(${t['--os-radius-lg']} - ${t['--os-space-2']}))`,
    fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'],
  },
});

export type FrameProps = Omit<ComponentPropsWithRef<'section'>, 'title'> & {
  /** A short caption at the start of the header bar (12/16, muted). */
  label?: ReactNode;
  /** The frame's title, rendered as a heading in the header bar. */
  title?: ReactNode;
  /** A line of supporting text under the title. */
  description?: ReactNode;
  /** Controls at the end of the header bar. */
  actions?: ReactNode;
  /** A muted bar under the panels. */
  footer?: ReactNode;
  /** `filled` (default) is the bg-subtle tray; `outline` adds a 1px hairline. */
  variant?: FrameVariant;
  /** The heading element used for `title`, h1 to h6. */
  headingLevel?: HeadingLevel;
};

export function Frame({
  label, title, description, actions, footer, variant = 'filled', headingLevel = 3,
  children, className, ...props
}: FrameProps) {
  const outline = variant === 'outline';
  const styles = stylex.props(surfaceStyles.surface, s.frame, outline && surfaceStyles.outline, outline && s.frameOutline);
  const hasHeader = label != null || title != null || description != null || actions != null;
  const Heading = `h${headingLevel}` as const;
  const hasPanels = Children.toArray(children).some(child => isValidElement(child) && child.type === FramePanel);

  return (
    <section {...props} className={withClassName(styles, className)}>
      {hasHeader && (
        <header {...stylex.props(s.bar)}>
          {(label != null || title != null || description != null) && (
            <div {...stylex.props(s.copy)}>
              {label != null && <div>{label}</div>}
              {title != null && <Heading {...stylex.props(s.title)}>{title}</Heading>}
              {description != null && <p {...stylex.props(s.description)}>{description}</p>}
            </div>
          )}
          {actions != null && <div {...stylex.props(s.actions)}>{actions}</div>}
        </header>
      )}
      {hasPanels ? children : <FramePanel>{children}</FramePanel>}
      {footer != null && <footer {...stylex.props(s.bar)}>{footer}</footer>}
    </section>
  );
}

export type FramePanelProps = ComponentPropsWithRef<'div'>;

/** One bg-surface panel inside a Frame. Place several as direct children to separate them by 8px. */
export function FramePanel({ className, ...props }: FramePanelProps) {
  const styles = stylex.props(surfaceStyles.surface, s.panel);
  return <div {...props} className={withClassName(styles, className)} />;
}
