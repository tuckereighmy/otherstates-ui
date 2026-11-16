'use client';

import * as stylex from '@stylexjs/stylex';
import { isValidElement, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactElement, ReactNode, Ref } from 'react';
import { Focusable, OverlayArrow, Tooltip as AriaTooltip, TooltipTrigger } from 'react-aria-components';
import { withClassName } from './internal/class-name';
import type { OpenProps } from './internal/overlay';
import { tokens as t } from '../tokens.stylex';

// Tooltip (DESIGN_SPEC 1.9, 2.2 Tooltip): a short label for a control, shown after 250ms of hover or
// at once on keyboard focus. 32 tall (control sm), padding 8 12 from the outer edge (the same as the
// AvatarGroup name tip and the chart readout), 12/16 500, radius md, at most 240 wide, 6px from the trigger. Enters over 160ms (opacity,
// 2px away from the trigger, scale .96) and leaves over 120ms; reduced motion keeps the fades only.
// The default tone is `contrast` (spec 2.2 Tooltip), the same fill as the AvatarGroup name tip.

export type TooltipTone = 'subtle' | 'contrast' | 'accent';
export type TooltipSide = 'top' | 'bottom' | 'left' | 'right';

const reduce = '@media (prefers-reduced-motion: reduce)';

const enter = stylex.keyframes({
  from: { opacity: 0, transform: 'translate(var(--os-tooltip-x, 0px), var(--os-tooltip-y, 2px)) scale(.96)' },
  to: { opacity: 1, transform: 'none' },
});
const fadeIn = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const leave = stylex.keyframes({ from: { opacity: 1, transform: 'none' }, to: { opacity: 0, transform: 'scale(.98)' } });
const fadeOut = stylex.keyframes({ from: { opacity: 1 }, to: { opacity: 0 } });

const s = stylex.create({
  tooltip: {
    position: 'relative', boxSizing: 'border-box', display: 'inline-block', maxWidth: 'min(240px, calc(100vw - 24px))', minHeight: t['--os-size-sm'],
    // 1px edge + 7 = 8 above the text, so the box measures 32 on one line.
    paddingBlock: `calc(${t['--os-space-2']} - ${t['--os-stroke']})`,
    // 12 from the outer edge, like the AvatarGroup name tip and the chart readout (inline padding of rows and washes).
    paddingInline: `calc(${t['--os-space-3']} - ${t['--os-stroke']})`,
    borderWidth: t['--os-stroke'], borderStyle: 'solid', borderRadius: t['--os-radius-md'],
    fontFamily: t['--os-font-family'], fontSize: t['--os-font-size-xs'], fontWeight: t['--os-font-weight-medium'],
    lineHeight: t['--os-line-height-xs'], letterSpacing: 0, overflowWrap: 'anywhere', boxShadow: t['--os-shadow-popup'],
    animationName: { default: enter, [reduce]: fadeIn },
    animationDuration: { default: t['--os-motion-hover'], [reduce]: t['--os-motion-press'] },
    animationTimingFunction: t['--os-ease-settle'], animationFillMode: 'both',
  },
  exit: {
    animationName: { default: leave, [reduce]: fadeOut },
    // Quicker than the shared 160ms overlay exit so a tooltip never trails the pointer.
    animationDuration: t['--os-motion-press'], animationTimingFunction: t['--os-ease-exit'], animationFillMode: 'both',
  },
  /** The entry starts 2px toward the trigger and moves away from it; the origin sits on the trigger side. */
  top: { transformOrigin: 'bottom center', '--os-tooltip-x': '0px', '--os-tooltip-y': '2px' },
  bottom: { transformOrigin: 'top center', '--os-tooltip-x': '0px', '--os-tooltip-y': '-2px' },
  left: { transformOrigin: 'right center', '--os-tooltip-x': '2px', '--os-tooltip-y': '0px' },
  right: { transformOrigin: 'left center', '--os-tooltip-x': '-2px', '--os-tooltip-y': '0px' },
  /** A quiet bg-subtle chip with the spec 1.9 hairline, so it keeps an edge on canvas and in dark. */
  subtle: { backgroundColor: t['--os-color-bg-subtle'], borderColor: t['--os-color-border-subtle'], color: t['--os-color-fg-base'] },
  contrast: { backgroundColor: t['--os-color-bg-contrast'], borderColor: t['--os-color-bg-contrast'], color: t['--os-color-fg-on-contrast'] },
  accent: { backgroundColor: t['--os-color-accent-moderate'], borderColor: t['--os-color-accent-moderate'], color: t['--os-color-accent-on-accent'] },
  arrow: { display: 'flex', lineHeight: 0, pointerEvents: 'none' },
  arrowSvg: { display: 'block', flexShrink: 0, overflow: 'visible' },
  // The arrow overlaps the tooltip's 1px edge so its fill covers the hairline where they meet.
  arrowTop: { transform: 'translateY(-1px)' },
  arrowBottom: { transform: 'translateY(1px) rotate(180deg)' },
  arrowLeft: { transform: 'translateX(-1px) rotate(-90deg)' },
  arrowRight: { transform: 'translateX(1px) rotate(90deg)' },
  arrowHorizontal: { width: 5, height: 10, alignItems: 'center', justifyContent: 'center' },
  subtleFill: { fill: t['--os-color-bg-subtle'], stroke: t['--os-color-border-subtle'] },
  contrastFill: { fill: t['--os-color-bg-contrast'], stroke: t['--os-color-bg-contrast'] },
  accentFill: { fill: t['--os-color-accent-moderate'], stroke: t['--os-color-accent-moderate'] },
});

const fills = { subtle: s.subtleFill, contrast: s.contrastFill, accent: s.accentFill };
const arrowSides = { top: s.arrowTop, bottom: s.arrowBottom, left: s.arrowLeft, right: s.arrowRight };

function TooltipArrow({ tone, side }: { tone: TooltipTone; side: TooltipSide }) {
  // Drawn pointing down (a tooltip above its trigger) and turned for the other sides.
  // 10 wide and 5 tall, 1px of it over the tooltip's edge: the tip stops 2px short of the trigger.
  return <svg aria-hidden="true" width="10" height="5" viewBox="0 0 10 5" {...stylex.props(s.arrowSvg, arrowSides[side])}>
    <path d="M0 0h10L5 4.5z" strokeWidth="0" {...stylex.props(fills[tone])} />
    <path d="M0 0.5L5 4.5L10 0.5" fill="none" strokeWidth="1" strokeLinejoin="round" {...stylex.props(fills[tone])} />
  </svg>;
}

/**
 * The element that shows the tooltip. React Aria focusables (RAC Button and the parts built on it)
 * take the trigger's handlers themselves; any other element, such as the library Button, is wrapped
 * in React Aria `Focusable`. React Aria elements carry `data-rac`; the check runs before paint.
 */
function TooltipTarget({ children }: { children: ReactNode }) {
  const marker = useRef<HTMLSpanElement>(null);
  const native = isValidElement(children) && typeof children.type === 'string';
  const [wrap, setWrap] = useState(native);
  useLayoutEffect(() => {
    if (wrap) return;
    const el = marker.current?.previousElementSibling;
    if (el && !el.hasAttribute('data-rac')) setWrap(true);
  }, [wrap]);
  if (wrap && isValidElement(children)) return <Focusable>{children as ReactElement<Record<string, unknown>, string>}</Focusable>;
  return <>{children}{!wrap && <span hidden ref={marker} />}</>;
}

export type TooltipProps = OpenProps & {
  /** The control the tooltip describes: a Button or any focusable element. */
  trigger: ReactNode;
  /** The tooltip text. Keep it short; a tooltip cannot hold interactive content. */
  children: ReactNode;
  /** `contrast` (default) inverts the page; `subtle` is a quiet chip with a hairline; `accent` uses the primary fill. */
  tone?: TooltipTone;
  /** The side of the trigger it opens on. It flips when there is no room. */
  placement?: TooltipSide;
  /** Distance from the trigger in px. Default 6. */
  offset?: number;
  /** Shift along the trigger's edge, in px. */
  crossOffset?: number;
  /** Milliseconds of hover before it opens. Default 250. Focus opens it at once. */
  delay?: number;
  /** Milliseconds before it closes after the pointer leaves. Default 100. */
  closeDelay?: number;
  /** Never show the tooltip. */
  isDisabled?: boolean;
  /** Show only on keyboard focus, not on hover. */
  focusOnly?: boolean;
  /** Draw the arrow that points at the trigger. Default true. */
  showArrow?: boolean;
  /** Classes for the tooltip. */
  className?: string;
  /** Inline styles for the tooltip. */
  style?: CSSProperties;
  /** The tooltip element. */
  ref?: Ref<HTMLDivElement>;
};

export function Tooltip({
  trigger, children, tone = 'contrast', placement = 'top', offset = 6, crossOffset, delay = 250, closeDelay = 100,
  isDisabled, focusOnly = false, showArrow = true, isOpen, defaultOpen, onOpenChange, className, style, ref,
}: TooltipProps) {
  return <TooltipTrigger delay={delay} closeDelay={closeDelay} isDisabled={isDisabled} trigger={focusOnly ? 'focus' : undefined}
    isOpen={isOpen} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
    <TooltipTarget>{trigger}</TooltipTarget>
    <AriaTooltip ref={ref} placement={placement} offset={offset} crossOffset={crossOffset} style={style}
      className={({ isExiting, placement: side }) => withClassName(stylex.props(s.tooltip, s[tone], s[side && side !== 'center' ? side : placement], isExiting && s.exit), className)}>
      {({ placement: side }) => <>
        {showArrow && <OverlayArrow className={({ placement: arrowSide }) => stylex.props(s.arrow, (arrowSide === 'left' || arrowSide === 'right') && s.arrowHorizontal).className ?? ''}>
          <TooltipArrow tone={tone} side={side && side !== 'center' ? side : placement} />
        </OverlayArrow>}
        {children}
      </>}
    </AriaTooltip>
  </TooltipTrigger>;
}
