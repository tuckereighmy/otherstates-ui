'use client';

import * as stylex from '@stylexjs/stylex';
import { Children, isValidElement } from 'react';
import type { ComponentPropsWithRef, ReactNode } from 'react';
import { tokens as t } from '../tokens.stylex';
import { Icon } from './Icon';
import type { IconName } from './Icon';
import { withClassName } from './internal/class-name';
import { radiusStyles } from './internal/size';
import { focusStyles, transitionStyles } from './internal/states';

// Alert (DESIGN_SPEC 2.2 Alert): a tinted container, radius lg, padding 12 16. A 16px status icon in
// the tone foreground sits 2px down so it centers on the first 20px line. `outline` swaps the tint for
// bg-surface and a 1px border-subtle hairline, with the padding 1px smaller so the box keeps its size.

const reduce = '@media (prefers-reduced-motion: reduce)';
const canHover = '@media (hover: hover)';
const coarse = '@media (pointer: coarse)';

const s = stylex.create({
  root: {
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'flex-start',
    gap: t['--os-space-3'],
    minWidth: 0,
    maxWidth: '100%',
    paddingBlock: t['--os-space-3'],
    paddingInline: t['--os-space-4'],
    borderRadius: t['--os-radius-lg'],
    color: t['--os-color-fg-base'],
    fontFamily: t['--os-font-family'],
    fontSize: t['--os-font-size-sm'],
    fontWeight: t['--os-font-weight-regular'],
    lineHeight: t['--os-line-height-md'],
    letterSpacing: t['--os-tracking-tight'],
  },
  neutral: { backgroundColor: t['--os-color-bg-subtle'] },
  info: { backgroundColor: t['--os-color-bg-info'] },
  success: { backgroundColor: t['--os-color-bg-success'] },
  warning: { backgroundColor: t['--os-color-bg-warning'] },
  error: { backgroundColor: t['--os-color-bg-error'] },
  outline: {
    backgroundColor: t['--os-color-bg-surface'],
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: t['--os-color-border-subtle'],
    paddingBlock: `calc(${t['--os-space-3']} - 1px)`,
    paddingInline: `calc(${t['--os-space-4']} - 1px)`,
  },
  icon: { flex: 'none', display: 'flex', width: 16, height: 16, marginTop: t['--os-space-0-5'] },
  neutralIcon: { color: t['--os-color-fg-muted'] },
  infoIcon: { color: t['--os-color-fg-info'] },
  successIcon: { color: t['--os-color-fg-success'] },
  warningIcon: { color: t['--os-color-fg-warning'] },
  errorIcon: { color: t['--os-color-fg-error'] },
  // Copy and actions share a wrapping row: actions sit at the end when there is room and drop below the copy when not.
  body: {
    flex: '1 1 0',
    minWidth: 0,
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    columnGap: t['--os-space-3'],
    rowGap: t['--os-space-3'],
  },
  copy: { flex: '1 1 200px', minWidth: 0, display: 'grid', gap: t['--os-space-1'], overflowWrap: 'anywhere' },
  title: { margin: 0, color: t['--os-color-fg-base'], fontWeight: t['--os-font-weight-medium'] },
  description: { margin: 0, color: t['--os-color-fg-muted'] },
  actions: { flex: 'none', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: t['--os-space-2'] },
  // An xs (24) icon-only close button with the xs control radius and a 14px icon, centered on the first 20px line
  // and pulled 4px into the end padding. Its hover fill is a mix of fg-base, so it steps toward fg on every tint.
  close: {
    position: 'relative',
    flex: 'none',
    display: 'grid',
    placeItems: 'center',
    width: t['--os-size-xs'],
    height: t['--os-size-xs'],
    marginTop: `calc(-1 * ${t['--os-space-0-5']})`,
    marginInlineEnd: `calc(-1 * ${t['--os-space-1']})`,
    padding: 0,
    color: { default: t['--os-color-fg-muted'], ':hover': { default: null, [canHover]: t['--os-color-fg-base'] } },
    backgroundColor: {
      default: 'transparent',
      ':hover': { default: null, [canHover]: `color-mix(in srgb, ${t['--os-color-fg-base']} 8%, transparent)` },
      ':active': `color-mix(in srgb, ${t['--os-color-fg-base']} 12%, transparent)`,
    },
    cursor: 'pointer',
    transform: { default: 'none', ':active': { default: 'scale(.97)', [reduce]: 'none' } },
    '::after': {
      content: '""',
      position: 'absolute',
      insetBlockStart: '50%',
      insetInlineStart: '50%',
      width: { default: '100%', [coarse]: 'max(100%, 44px)' },
      height: { default: '100%', [coarse]: 'max(100%, 44px)' },
      transform: 'translate(-50%, -50%)',
    },
  },
});

export type AlertTone = 'neutral' | 'info' | 'success' | 'warning' | 'error';
export type AlertVariant = 'filled' | 'outline';

const toneIcon: Record<AlertTone, IconName> = {
  neutral: 'info',
  info: 'info',
  success: 'check-circle',
  warning: 'alert-triangle',
  error: 'alert-circle',
};

const toneIconColor = {
  neutral: s.neutralIcon,
  info: s.infoIcon,
  success: s.successIcon,
  warning: s.warningIcon,
  error: s.errorIcon,
};

export type AlertProps = ComponentPropsWithRef<'div'> & {
  /** The title line, 14/20 500. */
  heading?: ReactNode;
  /** Supporting text under the title, in `fg-muted`. Plain `children` render the same way. */
  description?: ReactNode;
  /** Colors the fill and the status icon. Default `neutral`. */
  tone?: AlertTone;
  /** `filled` (default) tints the container; `outline` uses bg-surface with a hairline. */
  variant?: AlertVariant;
  /** Replaces the tone's status icon. Pass `null` for no icon. */
  icon?: ReactNode;
  /** Buttons at the end of the alert; they move below the text when the alert is narrow. */
  action?: ReactNode;
  /** Shows a close button and calls this when it is pressed. */
  onDismiss?: () => void;
  /** Accessible name of the close button. Default "Dismiss". */
  dismissLabel?: string;
  /** Announces the alert when it appears: `polite` sets `role="status"`, `assertive` sets `role="alert"`. */
  announce?: 'polite' | 'assertive';
};

export type AlertTitleProps = ComponentPropsWithRef<'div'>;
export type AlertDescriptionProps = ComponentPropsWithRef<'div'>;

/** The title of an Alert, for composing its content by hand. */
export function AlertTitle({ className, ...props }: AlertTitleProps) {
  return <div {...props} className={withClassName(stylex.props(s.title), className)} />;
}

/** The supporting text of an Alert, for composing its content by hand. */
export function AlertDescription({ className, ...props }: AlertDescriptionProps) {
  return <div {...props} className={withClassName(stylex.props(s.description), className)} />;
}

const isPart = (node: ReactNode) => isValidElement(node) && (node.type === AlertTitle || node.type === AlertDescription);

export function Alert({
  heading, description, children, icon, tone = 'neutral', variant = 'filled', action, onDismiss,
  dismissLabel = 'Dismiss', announce, className, role, ...props
}: AlertProps) {
  const styles = stylex.props(s.root, s[tone], variant === 'outline' && s.outline);
  const composed = Children.toArray(children).some(isPart);

  return (
    <div {...props} className={withClassName(styles, className)} role={announce === 'assertive' ? 'alert' : announce === 'polite' ? 'status' : role}>
      {icon !== null && (
        <span aria-hidden="true" {...stylex.props(s.icon, toneIconColor[tone])}>
          {icon ?? <Icon name={toneIcon[tone]} size={16} />}
        </span>
      )}
      <div {...stylex.props(s.body)}>
        <div {...stylex.props(s.copy)}>
          {heading != null && <AlertTitle>{heading}</AlertTitle>}
          {description != null && <AlertDescription>{description}</AlertDescription>}
          {children != null && (composed ? children : <AlertDescription>{children}</AlertDescription>)}
        </div>
        {action != null && <div {...stylex.props(s.actions)}>{action}</div>}
      </div>
      {onDismiss && (
        <button type="button" aria-label={dismissLabel} onClick={onDismiss} {...stylex.props(s.close, radiusStyles.xs, transitionStyles.colorsAndPress, focusStyles.ringVisible)}>
          <Icon name="x" size={14} />
        </button>
      )}
    </div>
  );
}
