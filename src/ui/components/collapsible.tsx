'use client';

import * as stylex from '@stylexjs/stylex';
import type { ComponentPropsWithRef, ReactNode } from 'react';
import {
  Button as AriaButton,
  Disclosure as AriaDisclosure,
  DisclosurePanel as AriaDisclosurePanel,
} from 'react-aria-components';
import { tokens as t } from '../tokens.stylex';
import { Icon } from './Icon';
import { withClassName } from './internal/class-name';
import { focusStyles, hoverStyles, transitionStyles } from './internal/states';
import { surfaceStyles } from './internal/surface';

// Collapsible (DESIGN_SPEC 1.6 filled vs outline, 1.8 row hover and inset ring, 1.10 layout motion).
// The trigger is a 48px (xl) row like Accordion's: padding 12 around the 20px line and 16 at the sides;
// the panel text sits 16 in with 16 below. `plain` is an sm (32) inline trigger.
// `filled` is a bg-surface fill with no edge, for bg-subtle sections; on canvas use `outline`.
// `plain` drops the surface: an inline text trigger with the panel straight below it.

export type CollapsibleVariant = 'filled' | 'outline' | 'plain';
export type CollapsibleHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type CollapsibleTriggerState = { isExpanded: boolean; isDisabled: boolean };

const reduce = '@media (prefers-reduced-motion: reduce)';

const s = stylex.create({
  plainRoot: {
    minWidth: 0, maxWidth: '100%', color: t['--os-color-fg-base'],
    fontFamily: t['--os-font-family'], letterSpacing: t['--os-tracking-tight'],
  },
  heading: { margin: 0, fontSize: 'inherit', fontWeight: 'inherit', lineHeight: 'inherit' },
  trigger: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: t['--os-space-3'],
    width: '100%', minHeight: t['--os-size-xl'], paddingInline: t['--os-space-4'], paddingBlock: t['--os-space-3'],
    borderRadius: t['--os-radius-lg'],
    color: t['--os-color-fg-base'],
    fontFamily: t['--os-font-family'], fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'],
    fontWeight: t['--os-font-weight-medium'], letterSpacing: t['--os-tracking-tight'],
    textAlign: 'start', cursor: 'pointer', outlineStyle: 'none',
  },
  // Inside the 1px outline the trigger's corners sit 1px in (nesting rule, spec 1.3).
  triggerOutline: { borderRadius: `calc(${t['--os-radius-lg']} - 1px)` },
  // While open, the trigger's hover fill meets the panel: square bottom corners.
  triggerExpanded: { borderEndStartRadius: 0, borderEndEndRadius: 0 },
  plainTrigger: {
    display: 'inline-flex', alignItems: 'center', gap: t['--os-space-2'],
    minHeight: t['--os-size-sm'], paddingInline: 0, paddingBlock: t['--os-space-1-5'],
    borderRadius: t['--os-radius-sm'], backgroundColor: 'transparent',
    color: t['--os-color-fg-base'],
    fontFamily: t['--os-font-family'], fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'],
    fontWeight: t['--os-font-weight-medium'], letterSpacing: t['--os-tracking-tight'],
    textAlign: 'start', cursor: 'pointer', outlineStyle: 'none',
  },
  title: { minWidth: 0 },
  icon: {
    display: 'inline-flex', flexShrink: 0, color: t['--os-color-fg-muted'],
    transitionProperty: 'transform, color',
    transitionDuration: { default: `${t['--os-motion-popup']}, ${t['--os-motion-hover']}`, [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  iconExpanded: { transform: 'rotate(180deg)' },
  disabled: { color: t['--os-color-fg-disabled'], backgroundColor: 'transparent', cursor: 'default' },
  iconDisabled: { color: t['--os-color-fg-disabled'] },
  // React Aria measures --disclosure-panel-height and hides the panel only after the transition.
  panel: {
    height: 'var(--disclosure-panel-height)', overflow: 'hidden',
    transitionProperty: 'height',
    transitionDuration: { default: t['--os-motion-layout'], [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  // Panel text is secondary (fg-muted, 14/20), as in Accordion; nested components set their own colors.
  body: {
    paddingInline: t['--os-space-4'], paddingBottom: t['--os-space-4'], color: t['--os-color-fg-muted'],
    fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'], fontWeight: t['--os-font-weight-regular'],
    letterSpacing: t['--os-tracking-tight'],
  },
  plainBody: {
    color: t['--os-color-fg-muted'],
    fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'], fontWeight: t['--os-font-weight-regular'],
    letterSpacing: t['--os-tracking-tight'],
  },
});

export type CollapsibleProps = Omit<ComponentPropsWithRef<typeof AriaDisclosure>, 'children' | 'className' | 'render'> & {
  /** The trigger's label. The chevron follows it. */
  title?: ReactNode;
  /** The panel content. */
  children: ReactNode;
  /** `filled` (default) for bg-subtle sections, `outline` adds a 1px hairline for canvas, `plain` has no surface. */
  variant?: CollapsibleVariant;
  /** Wraps the trigger in a heading element, h1 to h6. Without it the trigger is a plain button. */
  headingLevel?: CollapsibleHeadingLevel;
  /** Replaces the trigger's content (title and chevron). A function receives the expanded and disabled state. */
  trigger?: ReactNode | ((state: CollapsibleTriggerState) => ReactNode);
  className?: string;
};

export function Collapsible({ title, children, variant = 'filled', headingLevel, trigger, className, ...props }: CollapsibleProps) {
  const plain = variant === 'plain';
  const outline = variant === 'outline';
  const rootStyles = plain
    ? stylex.props(s.plainRoot)
    : stylex.props(surfaceStyles.surface, outline && surfaceStyles.outline);
  const Heading = headingLevel ? (`h${headingLevel}` as const) : null;

  return (
    <AriaDisclosure {...props} className={withClassName(rootStyles, className)}>
      {({ isExpanded, isDisabled }) => {
        const button = (
          <AriaButton
            slot="trigger"
            className={({ isHovered, isFocusVisible }) => withClassName(stylex.props(
              plain ? s.plainTrigger : s.trigger,
              transitionStyles.colors,
              outline && s.triggerOutline,
              !plain && isExpanded && s.triggerExpanded,
              !plain && hoverStyles.row,
              !plain && isHovered && hoverStyles.rowActive,
              isDisabled && s.disabled,
              isFocusVisible && (plain ? focusStyles.ring : focusStyles.ringInset),
            ))}
          >
            {({ isHovered }) => trigger !== undefined
              ? (typeof trigger === 'function' ? trigger({ isExpanded, isDisabled }) : trigger)
              : (
                <>
                  <span {...stylex.props(s.title)}>{title}</span>
                  <span {...stylex.props(s.icon, isHovered && hoverStyles.textActive, isExpanded && s.iconExpanded, isDisabled && s.iconDisabled)}>
                    <Icon name="chevron-down" size={16} />
                  </span>
                </>
              )}
          </AriaButton>
        );
        return (
          <>
            {Heading ? <Heading {...stylex.props(s.heading)}>{button}</Heading> : button}
            <AriaDisclosurePanel {...stylex.props(s.panel)}>
              <div {...stylex.props(plain ? s.plainBody : s.body)}>{children}</div>
            </AriaDisclosurePanel>
          </>
        );
      }}
    </AriaDisclosure>
  );
}
