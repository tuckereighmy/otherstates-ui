import * as stylex from '@stylexjs/stylex';
import { cloneElement, isValidElement } from 'react';
import type { HTMLAttributes, ReactElement, ReactNode, Ref } from 'react';
import { tokens as t } from '../tokens.stylex';
import { Icon } from './Icon';
import type { IconName, IconProps } from './Icon';
import { focusStyles, transitionStyles } from './internal/states';

export type BadgeStatus = 'success' | 'error' | 'warning' | 'info';
export type BadgeVariant = 'neutral' | 'secondary' | 'outline' | 'destructive' | BadgeStatus;
export type BadgeSize = 'sm' | 'md' | 'lg';

const canHover = '@media (hover: hover)';
const coarse = '@media (pointer: coarse)';

const s = stylex.create({
  base: {
    boxSizing: 'border-box', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: t['--os-space-1'],
    flexShrink: 0, verticalAlign: 'middle', borderRadius: t['--os-radius-control'], fontFamily: t['--os-font-family'],
    fontWeight: t['--os-font-weight-medium'], fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap',
    textDecorationLine: 'none',
  },
  // Spec 2.2 Badge: sm 20 / md 24 / lg 28; 12/16 (lg 13/18); padding 6 / 8 / 12 on the spacing scale. Radius (spec 1.3):
  // sm and md take the xs control radius (radius-sm on a corner ladder), lg the control radius; all three are pills at Round.
  sm: { borderRadius: `calc(${t['--os-radius-control']} - ${t['--os-radius-md']} + ${t['--os-radius-sm']})`, height: 20, minWidth: 20, paddingInline: t['--os-space-1-5'], fontSize: t['--os-font-size-xs'], lineHeight: t['--os-line-height-xs'], letterSpacing: 0 },
  md: { borderRadius: `calc(${t['--os-radius-control']} - ${t['--os-radius-md']} + ${t['--os-radius-sm']})`, height: t['--os-size-xs'], minWidth: t['--os-size-xs'], paddingInline: t['--os-space-2'], fontSize: t['--os-font-size-xs'], lineHeight: t['--os-line-height-xs'], letterSpacing: 0 },
  lg: { borderRadius: t['--os-radius-control'], height: 28, minWidth: 28, paddingInline: t['--os-space-3'], fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-sm'], letterSpacing: t['--os-tracking-tight'] },
  icon: { display: 'inline-flex', flexShrink: 0 },

  neutral: { backgroundColor: t['--os-color-accent-moderate'], color: t['--os-color-accent-on-accent'] },
  secondary: { backgroundColor: t['--os-color-accent-subtle'], color: t['--os-color-fg-base'] },
  outline: { backgroundColor: 'transparent', color: t['--os-color-fg-base'], boxShadow: `inset 0 0 0 1px ${t['--os-color-border-muted']}` },
  destructive: { backgroundColor: t['--os-color-bg-danger-secondary'], color: t['--os-color-fg-static-light'] },
  success: { backgroundColor: t['--os-color-bg-success'], color: t['--os-color-fg-success'] },
  error: { backgroundColor: t['--os-color-bg-error'], color: t['--os-color-fg-error'] },
  warning: { backgroundColor: t['--os-color-bg-warning'], color: t['--os-color-fg-warning'] },
  info: { backgroundColor: t['--os-color-bg-info'], color: t['--os-color-fg-info'] },
  successHigh: { backgroundColor: t['--os-color-bg-success-contrast'], color: t['--os-color-fg-static-light'] },
  errorHigh: { backgroundColor: t['--os-color-bg-error-contrast'], color: t['--os-color-fg-static-light'] },
  // 8% lighter than the token: dark text on the dark theme's warning fill measures 4.28:1, and 4.89:1 with the
  // mix (spec 1.7). Light moves from 4.97 to 5.56.
  warningHigh: {
    backgroundColor: `color-mix(in srgb, ${t['--os-color-bg-warning-contrast']} 92%, ${t['--os-color-fg-static-light']})`,
    color: t['--os-color-fg-static-dark'],
  },
  infoHigh: { backgroundColor: t['--os-color-bg-info-contrast'], color: t['--os-color-fg-static-light'] },

  // A badge rendered as a link: hover steps toward its foreground (spec 1.8), plus focus ring and hit area.
  link: {
    position: 'relative', cursor: 'pointer',
    '::after': {
      content: '""', position: 'absolute', insetBlockStart: '50%', insetInlineStart: '50%',
      width: { default: 'max(100%, 24px)', [coarse]: 'max(100%, 44px)' },
      height: { default: 'max(100%, 24px)', [coarse]: 'max(100%, 44px)' },
      transform: 'translate(-50%, -50%)',
    },
  },
  linkTint: {
    backgroundImage: {
      default: 'none',
      ':hover': { default: null, [canHover]: 'linear-gradient(color-mix(in srgb, currentColor 10%, transparent), color-mix(in srgb, currentColor 10%, transparent))' },
    },
  },
  linkHigh: {
    backgroundImage: {
      default: 'none',
      ':hover': { default: null, [canHover]: `linear-gradient(color-mix(in srgb, ${t['--os-color-fg-base']} 14%, transparent), color-mix(in srgb, ${t['--os-color-fg-base']} 14%, transparent))` },
    },
  },
  // Hover fills from the spec 1.8 table: primary, neutral filled, transparent compact control, destructive.
  neutralLink: { backgroundColor: { default: t['--os-color-accent-moderate'], ':hover': { default: null, [canHover]: t['--os-color-accent-bold'] } } },
  secondaryLink: { backgroundColor: { default: t['--os-color-accent-subtle'], ':hover': { default: null, [canHover]: t['--os-color-accent-muted'] } } },
  outlineLink: { backgroundColor: { default: 'transparent', ':hover': { default: null, [canHover]: t['--os-color-bg-interactive-primary'] } } },
  destructiveLink: { backgroundColor: { default: t['--os-color-bg-danger-secondary'], ':hover': { default: null, [canHover]: t['--os-color-bg-danger-tertiary'] } } },
});

const linkHover = { neutral: s.neutralLink, secondary: s.secondaryLink, outline: s.outlineLink, destructive: s.destructiveLink };

const sizes = { sm: s.sm, md: s.md, lg: s.lg };
const iconSize: Record<BadgeSize, number> = { sm: 12, md: 14, lg: 14 };
const statusIcon: Record<BadgeStatus, IconName> = { success: 'check-circle', error: 'alert-circle', warning: 'alert-triangle', info: 'info' };
const highContrast = { success: s.successHigh, error: s.errorHigh, warning: s.warningHigh, info: s.infoHigh };
const isStatus = (v: BadgeVariant): v is BadgeStatus => v === 'success' || v === 'error' || v === 'warning' || v === 'info';

function sizedIcon(node: ReactNode, px: number): ReactNode {
  if (isValidElement(node) && node.type === Icon && (node.props as IconProps).size === undefined) {
    return cloneElement(node as ReactElement<IconProps>, { size: px });
  }
  return node;
}

export type BadgeProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  ref?: Ref<HTMLElement>;
  /** Color and weight. Default `neutral`, or the `status` when one is given. */
  variant?: BadgeVariant;
  /** The four status tones. Same as passing them as `variant`; kept for older code. */
  status?: BadgeStatus;
  /** `high` fills a status badge with its strong color. Status variants only. */
  contrast?: 'low' | 'high';
  /** 20, 24 or 28 px tall. Default `md`. `small`, `medium` and `large` are aliases. */
  size?: BadgeSize | 'small' | 'medium' | 'large';
  /** Shows the status icon before the label. Status variants only; use `icon` otherwise. */
  withIcon?: boolean;
  /** A leading icon. An `<Icon>` without a size takes the badge's icon size. */
  icon?: ReactNode;
  /** A number shown after the label, in tabular figures. */
  count?: number;
  /** Counts above this show as `max+`. Default 99. */
  max?: number;
  /** Renders the badge as a link, with a hover step and a focus ring. */
  href?: string;
  /** The link's `target`, with `href`. */
  target?: string;
  /** The link's `rel`, with `href`. */
  rel?: string;
  children?: ReactNode;
};

export function Badge({
  variant: variantProp, status, contrast = 'low', size = 'md', withIcon = false, icon, count, max = 99,
  href, target, rel, children, className, ref, ...props
}: BadgeProps) {
  const sz: BadgeSize = size === 'small' ? 'sm' : size === 'medium' ? 'md' : size === 'large' ? 'lg' : size;
  const variant: BadgeVariant = variantProp ?? status ?? 'neutral';
  const status_ = isStatus(variant) ? variant : undefined;
  const high = !!status_ && contrast === 'high';
  const tone = status_ ? (high ? highContrast[status_] : s[status_]) : s[variant as 'neutral' | 'secondary' | 'outline' | 'destructive'];
  const isLink = href !== undefined;
  const sx = stylex.props(
    s.base, sizes[sz], tone,
    isLink && [
      s.link, transitionStyles.colors, focusStyles.ringVisible,
      status_ ? (high ? s.linkHigh : s.linkTint) : linkHover[variant as keyof typeof linkHover],
    ],
  );
  const leading = icon ?? (withIcon && status_ ? <Icon name={statusIcon[status_]} /> : null);
  const label = children ?? (count === undefined && status_ ? `${status_[0].toUpperCase()}${status_.slice(1)}` : null);
  const content = <>
    {leading && <span {...stylex.props(s.icon)}>{sizedIcon(leading, iconSize[sz])}</span>}
    {label}
    {count !== undefined && <span>{count > max ? `${max}+` : count}</span>}
  </>;
  const classes = [sx.className, className].filter(Boolean).join(' ');

  if (isLink) {
    return <a {...props} ref={ref as Ref<HTMLAnchorElement>} href={href} target={target} rel={rel} className={classes}>{content}</a>;
  }
  return <span {...props} ref={ref as Ref<HTMLSpanElement>} className={classes}>{content}</span>;
}
