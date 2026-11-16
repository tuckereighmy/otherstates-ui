import * as stylex from '@stylexjs/stylex';
import type { ComponentPropsWithRef } from 'react';
import { tokens as t } from '../tokens.stylex';
import { withClassName } from './internal/class-name';

export type SpinnerSize = 'sm' | 'md' | 'lg';
export type SpinnerTone = 'default' | 'muted' | 'current';

const spin = stylex.keyframes({ to: { transform: 'rotate(360deg)' } });
const reduce = '@media (prefers-reduced-motion: reduce)';

const s = stylex.create({
  root: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: t['--os-space-2'],
    color: t['--os-color-fg-muted'],
    fontFamily: t['--os-font-family'],
    fontSize: t['--os-font-size-sm'],
    fontWeight: t['--os-font-weight-medium'],
    lineHeight: t['--os-line-height-md'],
    letterSpacing: t['--os-tracking-tight'],
  },
  inherit: { color: 'inherit' },
  // A track in border-muted with a quarter arc in the tone color (spec 2.0 row 6). One period: --os-motion-spin.
  // Reduced motion stops the rotation and shows a static three-quarter arc.
  ring: {
    display: 'inline-block',
    boxSizing: 'border-box',
    flexShrink: 0,
    borderStyle: 'solid',
    borderRadius: t['--os-radius-full'],
    borderTopColor: 'currentColor',
    borderRightColor: { default: 'var(--os-spinner-track)', [reduce]: 'currentColor' },
    borderBottomColor: { default: 'var(--os-spinner-track)', [reduce]: 'currentColor' },
    borderLeftColor: 'var(--os-spinner-track)',
    animationName: { default: spin, [reduce]: 'none' },
    animationDuration: t['--os-motion-spin'],
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
  },
  default: { color: t['--os-color-accent-moderate'], '--os-spinner-track': t['--os-color-border-muted'] },
  muted: { color: t['--os-color-fg-muted'], '--os-spinner-track': t['--os-color-border-muted'] },
  current: { color: 'currentColor', '--os-spinner-track': 'color-mix(in srgb, currentColor 24%, transparent)' },
  sm: { width: 16, height: 16, borderWidth: 2 },
  md: { width: 24, height: 24, borderWidth: 2 },
  lg: { width: 32, height: 32, borderWidth: 2.5 },
});

const legacy = { small: 'sm', medium: 'md', large: 'lg' } as const;

export type SpinnerProps = Omit<ComponentPropsWithRef<'span'>, 'children'> & {
  /** Visible text next to the spinner. It also names the status for assistive tech. */
  label?: string;
  /** 16, 24 or 32 px. Default `md`. `small`, `medium` and `large` are aliases. */
  size?: SpinnerSize | keyof typeof legacy;
  /** Arc color: `default` (accent), `muted`, or `current` to follow the text color around it. */
  tone?: SpinnerTone;
};

export function Spinner({ label, size = 'md', tone = 'default', className, ...props }: SpinnerProps) {
  const px: SpinnerSize = size in legacy ? legacy[size as keyof typeof legacy] : size as SpinnerSize;
  const styles = stylex.props(s.root, tone === 'current' && s.inherit);
  const named = !!(label || props['aria-label'] || props['aria-labelledby']);
  return (
    <span role={named ? 'status' : undefined} aria-hidden={named ? undefined : true} {...props} className={withClassName(styles, className)}>
      <span aria-hidden="true" {...stylex.props(s.ring, s[tone], s[px])} />
      {label}
    </span>
  );
}
