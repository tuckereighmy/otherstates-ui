'use client';

import * as stylex from '@stylexjs/stylex';
import { Children, isValidElement, useContext, useId, useMemo, type ComponentPropsWithRef, type ReactNode } from 'react';
import { FormContext } from 'react-aria-components';
import { tokens as t } from '../tokens.stylex';
import { withClassName } from './internal/class-name';
import { controlStyles, FieldsetContext, type FieldsetContextValue } from './internal/control';
import { disabledStyles } from './internal/states';

// Fieldset (DESIGN_SPEC 1.5 opt-in outline, 1.11): a 1px border-subtle outline at radius lg, padding
// 16 and 16 between fields. The legend is 14/20 500 and sits on the border with its text on the 16px
// content inset (padding 4, margin -4); `plain` drops the outline and keeps the same rhythm. One
// message slot sits 4px under the legend: the description, or the error in its place (1.8 Invalid).
// A disabled fieldset disables every native control inside it and dims its legend, its message and
// every Field it holds. Inside a Form, a fieldset after another child starts a section: 24 above it
// (the form's 16 plus 8).

const s = stylex.create({
  fieldset: {
    display: 'grid', gap: t['--os-space-4'], minWidth: 0, width: '100%', margin: 0, padding: t['--os-space-4'],
    borderWidth: 1, borderStyle: 'solid', borderColor: t['--os-color-border-subtle'],
    borderRadius: t['--os-radius-lg'],
  },
  plain: { padding: 0, borderWidth: 0, borderStyle: 'none', borderRadius: 0 },
  disabled: { borderColor: t['--os-color-border-disabled'] },
  legend: { maxWidth: '100%', paddingBlock: 0, paddingInline: t['--os-space-1'], marginInlineStart: `calc(-1 * ${t['--os-space-1']})` },
  legendPlain: { paddingInline: 0, marginInlineStart: 0, marginBlockEnd: t['--os-space-4'] },
  // The content starts 16 under the legend; the message slot belongs to the legend, 4 under it.
  message: { marginBlockStart: `calc(${t['--os-space-1']} - ${t['--os-space-4']})` },
  section: { marginBlockStart: { default: 0, ':not(:first-child)': t['--os-space-2'] } },
});

const hasContent = (node: ReactNode) => node != null && node !== false && node !== '';

export type FieldsetLegendProps = ComponentPropsWithRef<'legend'>;

/** The legend of the surrounding Fieldset. Use it as the fieldset's first child when you need more than the `legend` prop. */
export function FieldsetLegend({ className, ...props }: FieldsetLegendProps) {
  const fieldset = useContext(FieldsetContext);
  const sx = stylex.props(
    controlStyles.label, s.legend, fieldset?.variant === 'plain' && s.legendPlain, fieldset?.disabled && disabledStyles.label,
  );
  return <legend {...props} className={withClassName(sx, className)} />;
}

export type FieldsetProps = ComponentPropsWithRef<'fieldset'> & {
  /** The visible name of the group, rendered as its `<legend>`. */
  legend?: ReactNode;
  /** Help text under the legend. The error replaces it while one is set. */
  description?: ReactNode;
  /** An error for the whole group, shown under the legend in place of the description. */
  errorMessage?: ReactNode;
  /** `outline` draws a 1px border-subtle frame; `plain` keeps the legend and spacing without it. */
  variant?: 'outline' | 'plain';
  /** Disables every control inside and dims the legend, the message and each Field. Alias: `disabled`. */
  isDisabled?: boolean;
};

export function Fieldset({
  legend, description, errorMessage, variant = 'outline', isDisabled, disabled, children, className,
  'aria-describedby': ariaDescribedBy, ...props
}: FieldsetProps) {
  const parent = useContext(FieldsetContext);
  const inForm = useContext(FormContext) != null;
  const off = !!parent?.disabled || (isDisabled ?? disabled ?? false);
  const id = useId();
  const context = useMemo<FieldsetContextValue>(() => ({ disabled: off, variant }), [off, variant]);

  const items = Children.toArray(children);
  const first = items[0];
  const childLegend = !hasContent(legend) && isValidElement(first) && first.type === FieldsetLegend ? first : null;
  const hasLegend = hasContent(legend) || childLegend !== null;
  const hasError = hasContent(errorMessage);
  const message = hasError ? errorMessage : description;
  const messageId = hasContent(message) ? `${id}-message` : undefined;

  const sx = stylex.props(s.fieldset, variant === 'plain' && s.plain, off && s.disabled, inForm && !parent && s.section);
  const messageSx = stylex.props(
    controlStyles.description, hasError && controlStyles.error, off && !hasError && disabledStyles.label, hasLegend && s.message,
  );

  return <FieldsetContext.Provider value={context}>
    <fieldset
      {...props}
      disabled={off || undefined}
      aria-describedby={[ariaDescribedBy, messageId].filter(Boolean).join(' ') || undefined}
      className={withClassName(sx, className)}
    >
      {hasContent(legend) ? <FieldsetLegend>{legend}</FieldsetLegend> : childLegend}
      {messageId && <div id={messageId} {...messageSx}>{message}</div>}
      {childLegend ? items.slice(1) : items}
    </fieldset>
  </FieldsetContext.Provider>;
}
