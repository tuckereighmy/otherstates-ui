'use client';

import * as stylex from '@stylexjs/stylex';
import { createContext, Fragment, useContext, type ComponentPropsWithRef, type ReactNode } from 'react';
import {
  Button as AriaButton,
  Disclosure,
  DisclosureGroup,
  DisclosurePanel,
  DisclosureStateContext,
} from 'react-aria-components';
import { tokens as t } from '../tokens.stylex';
import { Icon } from './Icon';
import { withClassName } from './internal/class-name';
import { focusStyles, hoverStyles, transitionStyles } from './internal/states';

// Accordion (DESIGN_SPEC 1.2, 1.5, 1.8, 1.10, 1.15): 48px rows (xl), the same row as Collapsible: padding 12
// around the 20px line, 12 between the title and the icon, the answer 14/20 fg-muted with 16 below. Border-subtle
// dividers, the 2px ring on a radius-sm trigger, an icon that goes fg-muted -> fg-base on hover, and the icon's
// turn over --os-motion-popup with ease-settle: the plus keeps its 135deg spin into a cross, the chevron turns
// 180deg, as in Collapsible. The panel's height moves over --os-motion-layout.

export type AccordionAppearance = 'list' | 'card';
export type AccordionIcon = 'plus' | 'chevron';
export type AccordionHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

type AccordionDefaults = { appearance?: AccordionAppearance; icon?: AccordionIcon; headingLevel?: AccordionHeadingLevel };
const GroupContext = createContext<AccordionDefaults>({});
const ItemContext = createContext<AccordionDefaults>({});

const reduce = '@media (prefers-reduced-motion: reduce)';

const s = stylex.create({
  group: { display: 'grid', width: '100%', minWidth: 0 },
  item: { width: '100%', minWidth: 0, fontFamily: t['--os-font-family'], letterSpacing: t['--os-tracking-tight'] },
  list: {
    borderBottomWidth: { default: 1, ':last-child': 0 }, borderBottomStyle: 'solid',
    borderBottomColor: t['--os-color-border-subtle'],
  },
  card: {
    paddingInline: t['--os-space-4'], borderRadius: t['--os-radius-lg'], backgroundColor: t['--os-color-bg-surface'],
    marginBlockStart: { default: 0, ':not(:first-child)': t['--os-space-2'] },
  },
  heading: { margin: 0, fontSize: 'inherit', fontWeight: 'inherit', lineHeight: 'inherit' },
  trigger: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: t['--os-space-3'],
    width: '100%', minHeight: t['--os-size-xl'], paddingInline: 0, paddingBlock: t['--os-space-3'],
    borderRadius: t['--os-radius-sm'], backgroundColor: 'transparent',
    color: t['--os-color-fg-base'],
    fontFamily: t['--os-font-family'], fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'],
    fontWeight: t['--os-font-weight-medium'], letterSpacing: t['--os-tracking-tight'],
    textAlign: 'start', cursor: 'pointer', outlineStyle: 'none',
  },
  triggerDisabled: { color: t['--os-color-fg-disabled'], cursor: 'default' },
  title: { minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  icon: {
    display: 'inline-flex', flexShrink: 0,
    transitionProperty: 'transform, color',
    transitionDuration: { default: `${t['--os-motion-popup']}, ${t['--os-motion-hover']}`, [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  plusOpen: { transform: 'rotate(135deg)' },
  chevronOpen: { transform: 'rotate(180deg)' },
  iconDisabled: { color: t['--os-color-fg-disabled'] },
  // React Aria measures --disclosure-panel-height and hides the panel only after the transition.
  panel: {
    height: 'var(--disclosure-panel-height)', overflow: 'hidden',
    transitionProperty: 'height',
    transitionDuration: { default: t['--os-motion-layout'], [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  body: {
    paddingBottom: t['--os-space-4'], paddingInlineEnd: t['--os-space-6'],
    color: t['--os-color-fg-muted'],
    fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'], fontWeight: t['--os-font-weight-regular'],
    letterSpacing: t['--os-tracking-tight'],
  },
  // A string answer arrives word by word as the panel opens: a staged reveal (spec 1.10).
  word: {
    display: 'inline-block', opacity: 0, filter: { default: 'blur(4px)', [reduce]: 'none' }, translate: { default: '0 6px', [reduce]: 'none' },
    transitionProperty: 'opacity, translate, filter',
    transitionDuration: { default: t['--os-motion-hover'], [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-exit'],
  },
  wordOpen: (index: number) => ({
    opacity: 1, filter: 'none', translate: 'none',
    transitionDuration: { default: t['--os-motion-popup'], [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
    transitionDelay: { default: `${60 + Math.min(index, 40) * 10}ms`, [reduce]: '0ms' },
  }),
});

export type AccordionGroupProps = ComponentPropsWithRef<typeof DisclosureGroup> & {
  /** The default `appearance` of every item: `list` (dividers) or `card` (separate surfaces 8px apart). */
  appearance?: AccordionAppearance;
  /** The default `icon` of every item. */
  icon?: AccordionIcon;
  /** The default heading level of every trigger. */
  headingLevel?: AccordionHeadingLevel;
};

/** A set of accordion items. One item opens at a time unless `allowsMultipleExpanded` is set. */
export function AccordionGroup({ appearance, icon, headingLevel, className, ...props }: AccordionGroupProps) {
  return (
    <GroupContext.Provider value={{ appearance, icon, headingLevel }}>
      <DisclosureGroup
        {...props}
        className={state => withClassName(stylex.props(s.group), typeof className === 'function' ? className(state) : className)}
      />
    </GroupContext.Provider>
  );
}

export type AccordionItemProps = Omit<ComponentPropsWithRef<typeof Disclosure>, 'children' | 'className' | 'render'> & {
  /** An AccordionTrigger followed by an AccordionPanel. */
  children: ReactNode;
  /** `list` (default) separates items with a hairline; `card` puts each item on its own surface. */
  appearance?: AccordionAppearance;
  /** The default `icon` of this item's trigger. */
  icon?: AccordionIcon;
  /** The default heading level of this item's trigger. */
  headingLevel?: AccordionHeadingLevel;
  className?: string;
};

/** One collapsible item, for custom content. Compose it from AccordionTrigger and AccordionPanel. */
export function AccordionItem({ children, appearance, icon, headingLevel, className, ...props }: AccordionItemProps) {
  const group = useContext(GroupContext);
  const resolved = {
    appearance: appearance ?? group.appearance ?? 'list',
    icon: icon ?? group.icon ?? 'plus',
    headingLevel: headingLevel ?? group.headingLevel ?? 3,
  };
  const styles = stylex.props(s.item, resolved.appearance === 'card' ? s.card : s.list);
  return (
    <ItemContext.Provider value={resolved}>
      <Disclosure {...props} className={withClassName(styles, className)}>{children}</Disclosure>
    </ItemContext.Provider>
  );
}

export type AccordionTriggerProps = Omit<ComponentPropsWithRef<'h3'>, 'children'> & {
  /** The trigger's label. Wraps in a heading so screen readers can jump between items. */
  children: ReactNode;
  /** `plus` (rotates to a cross) or `chevron` (turns over). Defaults to the item's icon. */
  icon?: AccordionIcon;
  /** The heading element, h1 to h6. Defaults to the item's level, 3. */
  headingLevel?: AccordionHeadingLevel;
};

/** The heading and button that open an AccordionItem. */
export function AccordionTrigger({ children, icon: iconProp, headingLevel: levelProp, className, ...props }: AccordionTriggerProps) {
  const item = useContext(ItemContext);
  const state = useContext(DisclosureStateContext);
  const isExpanded = state?.isExpanded ?? false;
  const icon = iconProp ?? item.icon ?? 'plus';
  const Heading = `h${levelProp ?? item.headingLevel ?? 3}` as const;
  return (
    <Heading {...props} className={withClassName(stylex.props(s.heading), className)}>
      <AriaButton
        slot="trigger"
        className={({ isFocusVisible, isDisabled }) => withClassName(stylex.props(
          s.trigger, transitionStyles.colors, isDisabled && s.triggerDisabled, isFocusVisible && focusStyles.ring,
        ))}
      >
        {({ isHovered, isDisabled }) => (
          <>
            <span {...stylex.props(s.title)}>{children}</span>
            <span {...stylex.props(
              s.icon, hoverStyles.text, isHovered && hoverStyles.textActive,
              isExpanded && (icon === 'plus' ? s.plusOpen : s.chevronOpen), isDisabled && s.iconDisabled,
            )}>
              <Icon name={icon === 'plus' ? 'plus' : 'chevron-down'} size={16} />
            </span>
          </>
        )}
      </AriaButton>
    </Heading>
  );
}

export type AccordionPanelProps = Omit<ComponentPropsWithRef<typeof DisclosurePanel>, 'className' | 'render'> & {
  className?: string;
};

/** The content of an AccordionItem. It animates its height as the item opens and closes. */
export function AccordionPanel({ children, className, ...props }: AccordionPanelProps) {
  return (
    <DisclosurePanel {...props} className={withClassName(stylex.props(s.panel), className)}>
      <div {...stylex.props(s.body)}>{children}</div>
    </DisclosurePanel>
  );
}

function RevealText({ text }: { text: string }) {
  const isExpanded = useContext(DisclosureStateContext)?.isExpanded ?? false;
  return text.trim().split(/\s+/).map((word, index) => (
    <Fragment key={index}>
      {index > 0 && ' '}
      <span {...stylex.props(s.word, isExpanded && s.wordOpen(index))}>{word}</span>
    </Fragment>
  ));
}

export type AccordionProps = Omit<AccordionItemProps, 'children'> & {
  /** The question or section name shown in the trigger. */
  title: ReactNode;
  /** The answer. A string arrives word by word as the item opens. */
  children: ReactNode;
};

/** One item with a title and an answer: the common case. For custom content use AccordionItem. */
export function Accordion({ title, children, ...props }: AccordionProps) {
  return (
    <AccordionItem {...props}>
      <AccordionTrigger>{title}</AccordionTrigger>
      <AccordionPanel>{typeof children === 'string' ? <RevealText text={children} /> : children}</AccordionPanel>
    </AccordionItem>
  );
}
