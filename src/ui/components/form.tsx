'use client';

import * as stylex from '@stylexjs/stylex';
import type { ComponentPropsWithRef, Ref } from 'react';
import { Form as AriaForm, type FormProps as AriaFormProps } from 'react-aria-components';
import { tokens as t } from '../tokens.stylex';
import { withClassName } from './internal/class-name';

// Form (DESIGN_SPEC 1.11): a fluid column with 16 between fields. FormActions is the actions row:
// 24 under the last field (the form's 16 plus 8), buttons 8 apart. Server or submit-time errors go in
// `validationErrors`, keyed by control name; every Field inside shows the one for its control until
// the user edits it.

const s = stylex.create({
  form: { display: 'grid', gap: t['--os-space-4'], width: '100%', minWidth: 0 },
  actions: {
    display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: t['--os-space-2'], minWidth: 0, marginBlockStart: t['--os-space-2'],
  },
  start: { justifyContent: 'flex-start' },
  end: { justifyContent: 'flex-end' },
});

export type FormProps = AriaFormProps & { ref?: Ref<HTMLFormElement> };

export function Form({ className, ...props }: FormProps) {
  return <AriaForm {...props} className={withClassName(stylex.props(s.form), className)} />;
}

export type FormActionsProps = ComponentPropsWithRef<'div'> & {
  /** Where the buttons sit in the row. */
  align?: 'start' | 'end';
};

/** The row of buttons at the end of a form: 24 under the last field, buttons 8 apart, wrapping on narrow screens. */
export function FormActions({ align = 'start', className, ...props }: FormActionsProps) {
  const sx = stylex.props(s.actions, align === 'end' ? s.end : s.start);
  return <div {...props} className={withClassName(sx, className)} />;
}
