'use client';

import * as stylex from '@stylexjs/stylex';
import type { ComponentPropsWithRef, ReactNode } from 'react';
import { Meter as AriaMeter } from 'react-aria-components';
import { tokens as t } from '../tokens.stylex';
import { withClassName } from './internal/class-name';

const reduce = '@media (prefers-reduced-motion: reduce)';

const s = stylex.create({
  meter: { display: 'grid', gap: t['--os-space-2'], width: '100%', minWidth: 0 },
  header: { display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', columnGap: t['--os-space-3'], rowGap: 0 },
  label: {
    color: t['--os-color-fg-base'], fontSize: t['--os-font-size-sm'], fontWeight: t['--os-font-weight-medium'], lineHeight: t['--os-line-height-md'],
    letterSpacing: t['--os-tracking-tight'],
  },
  value: {
    marginInlineStart: 'auto', color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-sm'], fontWeight: t['--os-font-weight-regular'],
    lineHeight: t['--os-line-height-md'], letterSpacing: t['--os-tracking-tight'], fontVariantNumeric: 'tabular-nums',
  },
  track: { borderRadius: t['--os-radius-full'], overflow: 'hidden', backgroundColor: t['--os-color-bg-muted'] },
  fill: {
    height: '100%', borderRadius: t['--os-radius-full'], backgroundColor: t['--os-color-accent-moderate'],
    transitionProperty: 'width', transitionDuration: { default: t['--os-motion-layout'], [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  width: (width: string) => ({ width }),
  success: { backgroundColor: t['--os-color-fg-success'] },
  warning: { backgroundColor: t['--os-color-fg-warning'] },
  error: { backgroundColor: t['--os-color-fg-error'] },
});

/** Track heights. md is the 6px track. */
const trackSizes = stylex.create({ sm: { height: 4 }, md: { height: 6 }, lg: { height: 8 } });
type MeterSize = 'sm' | 'md' | 'lg';
const sizeAliases: Record<string, MeterSize> = { small: 'sm', medium: 'md', large: 'lg' };

export type MeterProps = Omit<ComponentPropsWithRef<typeof AriaMeter>, 'children' | 'className' | 'render' | 'valueLabel'> & {
  /** Names the measurement. Shown above the track unless `hideLabel` is set; it names the meter either way. */
  label: string;
  /** Hides the label visually. */
  hideLabel?: boolean;
  /** Shows the value text at the end of the header. */
  showValue?: boolean;
  /** Replaces the formatted value, for example "36 of 50 GB". A string is also read out by screen readers. */
  valueLabel?: ReactNode;
  /** The fill color. Pick a status tone for meaning, not decoration. */
  tone?: 'accent' | 'success' | 'warning' | 'error';
  /** Track height: 4, 6 or 8 px. `small`, `medium` and `large` are aliases. */
  size?: 'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large';
  className?: string;
};

export function Meter({ label, hideLabel = false, showValue = true, valueLabel, tone = 'accent', size: sizeProp = 'md', className, ...props }: MeterProps) {
  const size: MeterSize = sizeAliases[sizeProp] ?? (sizeProp as MeterSize);
  const styles = stylex.props(s.meter);
  return (
    <AriaMeter {...props} valueLabel={typeof valueLabel === 'string' ? valueLabel : undefined}
      aria-label={props['aria-label'] ?? label} className={withClassName(styles, className)}>
      {({ percentage, valueText }) => (
        <>
          {(!hideLabel || showValue) && <div {...stylex.props(s.header)} aria-hidden="true">
            {!hideLabel && <span {...stylex.props(s.label)}>{label}</span>}
            {showValue && <span {...stylex.props(s.value)}>{valueLabel ?? valueText}</span>}
          </div>}
          <div {...stylex.props(s.track, trackSizes[size] ?? trackSizes.md)} aria-hidden="true">
            <div {...stylex.props(s.fill, s.width(`${percentage}%`), tone === 'success' && s.success, tone === 'warning' && s.warning, tone === 'error' && s.error)} />
          </div>
        </>
      )}
    </AriaMeter>
  );
}
