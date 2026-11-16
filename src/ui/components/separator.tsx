import * as stylex from '@stylexjs/stylex';
import type { ComponentPropsWithRef } from 'react';
import { tokens as t } from '../tokens.stylex';
import { withClassName } from './internal/class-name';

const s = stylex.create({
  rule: { display: 'block', flexShrink: 0, margin: 0, backgroundColor: t['--os-color-border-subtle'] },
  horizontal: { width: '100%', height: 1 },
  vertical: { width: 1, alignSelf: 'stretch' },
});

export type SeparatorProps = Omit<ComponentPropsWithRef<'div'>, 'children'> & {
  /** Default `horizontal`. A vertical separator stretches to the height of its flex row. */
  orientation?: 'horizontal' | 'vertical';
  /** Hides the separator from assistive tech when it is only visual. */
  decorative?: boolean;
};

export function Separator({ orientation = 'horizontal', decorative, className, ...props }: SeparatorProps) {
  const styles = stylex.props(s.rule, orientation === 'vertical' ? s.vertical : s.horizontal);
  return (
    <div
      role={decorative ? 'none' : 'separator'}
      aria-orientation={decorative ? undefined : orientation}
      {...props}
      className={withClassName(styles, className)}
    />
  );
}
