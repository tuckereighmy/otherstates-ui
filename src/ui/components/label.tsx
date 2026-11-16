'use client';

import * as stylex from '@stylexjs/stylex';
import type { ComponentPropsWithRef } from 'react';
import { Label as AriaLabel } from 'react-aria-components';
import { tokens as t } from '../tokens.stylex';
import { withClassName } from './internal/class-name';
import { controlStyles } from './internal/control';
import { disabledStyles } from './internal/states';

// Labels (DESIGN_SPEC 1.11): 14/20 500 fg-base. A required control appends " *" in fg-muted (hidden
// from assistive tech: the control carries aria-required); "(optional)" marks the rest when most
// fields are required. A disabled control's label goes fg-disabled (1.8).
// Built on the React Aria Label, so inside a React Aria field it picks up that field's ids.

const s = stylex.create({
  marker: { color: t['--os-color-fg-muted'], fontWeight: t['--os-font-weight-regular'] },
});

export type LabelProps = ComponentPropsWithRef<'label'> & {
  /** Appends a " *" marker. Set `required` or `isRequired` on the control too. */
  isRequired?: boolean;
  /** Appends "(optional)". Ignored when `isRequired` is set. */
  isOptional?: boolean;
  /** Dims the label to match a disabled control. */
  isDisabled?: boolean;
  /** `span` names an element that a `<label>` cannot label, such as a group, through `aria-labelledby`. */
  elementType?: 'label' | 'span';
};

export function Label({ isRequired, isOptional, isDisabled, elementType = 'label', className, children, ...props }: LabelProps) {
  const sx = stylex.props(controlStyles.label, isDisabled && disabledStyles.label);
  const marker = stylex.props(s.marker, isDisabled && disabledStyles.label);
  return <AriaLabel {...props} elementType={elementType} className={withClassName(sx, className)}>
    {children}
    {isRequired ? <span aria-hidden="true" {...marker}> *</span>
      : isOptional ? <span {...marker}> (optional)</span> : null}
  </AriaLabel>;
}
