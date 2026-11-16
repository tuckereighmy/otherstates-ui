'use client';

import * as stylex from '@stylexjs/stylex';
import { useId, useSyncExternalStore } from 'react';
import type { CSSProperties, ReactNode, Ref } from 'react';
import { Dialog, DialogTrigger, OverlayArrow, Popover as AriaPopover } from 'react-aria-components';
import { Button } from './button';
import { Icon } from './Icon';
import {
  PanelLayout, TriggerSlot, overlayStyles, panelStyles, popupPlacement, renderPanelContent,
  type OpenProps, type PanelContent, type PlacementProps, type PortalProps,
} from './internal/overlay';
import { tokens as t } from '../tokens.stylex';

// Popover (spec 1.9): a content popup anchored to its trigger. 256 wide by default, padding 16, gap 12,
// title 14/20 500 and description 13/18. Offset 6 from the trigger (the arrow adds its own 6), 12px
// from the viewport edge. Enters over 220ms from 4px toward the trigger, exits over 160ms.

const s = stylex.create({
  /** A column, so the body scrolls when React Aria caps the height to the space available. */
  surface: { display: 'flex', flexDirection: 'column' },
  arrow: { display: 'block', fill: t['--os-color-bg-elevated'], stroke: t['--os-color-border-subtle'], strokeWidth: 1 },
});

// Each arrow is open along the popover's edge, so only its two sides are stroked; the fill covers the
// surface's hairline under its base. Paths are per side so the box never needs rotating.
const arrows = {
  bottom: { width: 14, height: 7, d: 'M0 7 5.6 1.6Q7 .2 8.4 1.6L14 7' },
  top: { width: 14, height: 7, d: 'M0 0 5.6 5.4Q7 6.8 8.4 5.4L14 0' },
  right: { width: 7, height: 14, d: 'M7 0 1.6 5.6Q.2 7 1.6 8.4L7 14' },
  left: { width: 7, height: 14, d: 'M0 0 5.4 5.6Q6.8 7 5.4 8.4L0 14' },
} as const;

// Below 480px of viewport there is no room beside a trigger, so side placements open below it.
const narrowQuery = typeof window === 'undefined' ? null : window.matchMedia('(max-width: 479px)');
const subscribeNarrow = (onChange: () => void) => {
  narrowQuery?.addEventListener('change', onChange);
  return () => narrowQuery?.removeEventListener('change', onChange);
};
const isSide = (placement: string) => /^(left|right|start|end)/.test(placement);

export type PopoverProps = OpenProps & PortalProps & PlacementProps & {
  /** The element that opens the popover and anchors it. */
  trigger: ReactNode;
  /** The heading (14/20 500). Leave it out only with an `aria-label`. */
  title?: ReactNode;
  /** A line under the title (13/18). */
  description?: ReactNode;
  /** The content. A function receives `close`. */
  children?: PanelContent;
  /** Actions in a row at the end, primary action last. A function receives `close`. */
  footer?: PanelContent;
  /** Width in px, or any CSS width. Never wider than the viewport less 24px. */
  width?: number | string;
  /** Shows a close button at the top end. */
  showCloseButton?: boolean;
  /** Accessible name of the close button. */
  closeLabel?: string;
  /** Draws an arrow that points at the trigger. */
  showArrow?: boolean;
  /** Names the popover when it has no title. */
  'aria-label'?: string;
  /** Classes for the popover surface. */
  className?: string;
  /** Inline styles for the popover surface. */
  style?: CSSProperties;
  /** The popover surface element. */
  ref?: Ref<HTMLElement>;
};

export function Popover({
  trigger, title, description, children, footer, placement = 'bottom', offset, width = 256, showCloseButton = false,
  closeLabel = 'Close', showArrow = false, 'aria-label': ariaLabel, isOpen, defaultOpen, onOpenChange, portalContainer,
  className, style, ref,
}: PopoverProps) {
  const descriptionId = useId();
  const narrow = useSyncExternalStore(subscribeNarrow, () => !!narrowQuery?.matches, () => false);
  const openPlacement = narrow && isSide(placement) ? 'bottom' : placement;
  return (
    <DialogTrigger isOpen={isOpen} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <TriggerSlot>{trigger}</TriggerSlot>
      <AriaPopover
        ref={ref}
        placement={openPlacement}
        offset={offset ?? (showArrow ? 12 : 6)}
        containerPadding={12}
        arrowBoundaryOffset={20}
        UNSTABLE_portalContainer={portalContainer}
        style={{ width, ...style }}
        className={({ isExiting, placement: side }) => [
          stylex.props(overlayStyles.surface, overlayStyles.popup, s.surface, overlayStyles.popupMotion, popupPlacement(side), isExiting && overlayStyles.exit).className,
          className,
        ].filter(Boolean).join(' ')}
      >
        {showArrow && (
          <OverlayArrow>
            {({ placement: side }) => {
              const arrow = side === 'top' || side === 'left' || side === 'right' ? arrows[side] : arrows.bottom;
              return (
                <svg aria-hidden="true" width={arrow.width} height={arrow.height} viewBox={`0 0 ${arrow.width} ${arrow.height}`} {...stylex.props(s.arrow)}>
                  <path d={arrow.d} />
                </svg>
              );
            }}
          </OverlayArrow>
        )}
        <Dialog aria-label={title ? undefined : ariaLabel} {...stylex.props(panelStyles.frame, panelStyles.frameCompact)} aria-describedby={description ? descriptionId : undefined}>
          {({ close }) => (
            <PanelLayout
              descriptionId={descriptionId}
              compact
              title={title}
              description={description}
              close={showCloseButton && (
                <Button appearance="text" size="xs" iconOnly aria-label={closeLabel} onClick={close}>
                  <Icon name="x" />
                </Button>
              )}
              footer={footer === undefined ? undefined : renderPanelContent(footer, close)}
            >
              {children === undefined ? undefined : renderPanelContent(children, close)}
            </PanelLayout>
          )}
        </Dialog>
      </AriaPopover>
    </DialogTrigger>
  );
}
