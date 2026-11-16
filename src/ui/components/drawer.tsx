'use client';

import * as stylex from '@stylexjs/stylex';
import { useContext, useId } from 'react';
import type { CSSProperties, ReactNode, Ref } from 'react';
import { Menu as AriaMenu, OverlayTriggerStateContext, Sheet as AriaSheet, SheetBackdrop, SheetContent, SheetOverlay, SheetTrigger } from 'react-aria-components';
import type { Key, MenuProps as AriaMenuProps, SheetOverlayProps } from 'react-aria-components';
import { Button } from './button';
import { Icon } from './Icon';
import {
  PanelLayout, TriggerSlot, normalizeWindowSize, overlayStyles, panelStyles, renderPanelContent,
  type Edge, type OpenProps, type PanelContent, type PortalProps, type WindowSizeProp,
} from './internal/overlay';
import { tokens as t } from '../tokens.stylex';

// Drawer (spec 1.9): a swipeable panel on one edge, built on the React Aria Sheet. Top and bottom
// drawers span up to 640, left and right ones are 384 wide. Padding 20, the overlay surface, and a
// handle in border-control (3:1) on the inner edge. React Aria drives entry, exit and swipes by
// scrolling, so snap points and nested drawers come with it; under reduced motion it jumps.

const s = stylex.create({
  overlay: { zIndex: t['--os-z-modal'] },
  backdrop: { backgroundColor: t['--os-color-bg-overlay'] },
  // Snap points belong to the gesture scroller, not the drawer surface.
  surface: { overflow: 'clip' },
  sideSm: { width: 'min(100vw, 320px)' },
  sideMd: { width: 'min(100vw, 384px)' },
  sideLg: { width: 'min(100vw, 480px)' },
  endSm: { width: 'min(100%, 480px)' },
  endMd: { width: 'min(100%, 640px)' },
  endLg: { width: 'min(100%, 800px)' },
  straight: {
    borderTopLeftRadius: 0, borderTopRightRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0,
    borderStartStartRadius: 0, borderStartEndRadius: 0, borderEndStartRadius: 0, borderEndEndRadius: 0,
  },
  inset: {
    borderTopLeftRadius: t['--os-radius-lg'], borderTopRightRadius: t['--os-radius-lg'],
    borderBottomLeftRadius: t['--os-radius-lg'], borderBottomRightRadius: t['--os-radius-lg'],
    borderStartStartRadius: t['--os-radius-lg'], borderStartEndRadius: t['--os-radius-lg'],
    borderEndStartRadius: t['--os-radius-lg'], borderEndEndRadius: t['--os-radius-lg'],
  },
  /** `inset` floats 8px from the viewport. */
  insetTop: { marginTop: t['--os-space-2'], marginInline: t['--os-space-2'], maxWidth: `calc(100% - 2 * ${t['--os-space-2']})` },
  insetBottom: { marginBottom: t['--os-space-2'], marginInline: t['--os-space-2'], maxWidth: `calc(100% - 2 * ${t['--os-space-2']})` },
  insetLeft: { marginLeft: t['--os-space-2'], height: `calc(100dvh - 2 * ${t['--os-space-2']})` },
  insetRight: { marginRight: t['--os-space-2'], height: `calc(100dvh - 2 * ${t['--os-space-2']})` },
  handle: {
    position: 'absolute', zIndex: 1, pointerEvents: 'none', borderRadius: t['--os-radius-full'],
    backgroundColor: t['--os-color-border-control'],
  },
  handleTop: { width: 32, height: 4, bottom: 6, left: 'calc(50% - 16px)' },
  handleBottom: { width: 32, height: 4, top: 6, left: 'calc(50% - 16px)' },
  handleLeft: { width: 4, height: 32, right: 6, top: 'calc(50% - 16px)' },
  handleRight: { width: 4, height: 32, left: 6, top: 'calc(50% - 16px)' },
  /** Menu rows line their text up with the title: items have 10px (16 less 6) of inline padding. */
  menu: {
    '--os-color-bg-subtle': t['--os-color-bg-interactive-primary'],
    display: 'grid', gap: t['--os-space-0-5'], marginInline: `calc(${t['--os-space-1-5']} - ${t['--os-space-4']})`, outline: 'none',
  },
});

const edgeHandle = { top: s.handleTop, right: s.handleRight, bottom: s.handleBottom, left: s.handleLeft };
const edgeInset = { top: s.insetTop, right: s.insetRight, bottom: s.insetBottom, left: s.insetLeft };
const sideWidth = { sm: s.sideSm, md: s.sideMd, lg: s.sideLg };
const endWidth = { sm: s.endSm, md: s.endMd, lg: s.endLg };

export type DrawerProps = OpenProps & PortalProps & Pick<SheetOverlayProps, 'snapPoints' | 'swipeDirection'> & {
  /** The element that opens the drawer. Leave it out to control the drawer with `isOpen`. */
  trigger?: ReactNode;
  /** The heading. It names the drawer for assistive tech. */
  title: ReactNode;
  /** One or two sentences under the title, linked with `aria-describedby`. */
  description?: ReactNode;
  /** The body. A function receives `close`. It scrolls once the drawer is fully open. */
  children?: PanelContent;
  /** Actions pinned to the far end of the drawer, end-aligned, primary action last. A function receives `close`. */
  footer?: PanelContent;
  /** The viewport edge the drawer opens from. */
  edge?: Edge;
  /** Top and bottom: up to 480, 640 or 800 wide. Left and right: 320, 384 or 480 wide. */
  size?: WindowSizeProp;
  /** `default` rounds the inner corners, `inset` floats 8px from the viewport with every corner rounded, `straight` has square corners. */
  variant?: 'default' | 'inset' | 'straight';
  /** Shows a close button at the top end of the drawer. */
  showCloseButton?: boolean;
  /** Accessible name of the close button. */
  closeLabel?: string;
  /** Close on a swipe, Escape or a press on the backdrop. With snap points, a drawer that can't be dismissed rests at its smallest one. */
  isDismissable?: boolean;
  /** @deprecated Use `isDismissable`. */
  dismissable?: boolean;
  /** Classes for the drawer surface. */
  className?: string;
  /** Inline styles for the drawer surface. */
  style?: CSSProperties;
  /** The drawer surface element. */
  ref?: Ref<HTMLDivElement>;
};

export function Drawer({
  trigger, title, description, children, footer, edge = 'bottom', size, variant = 'default', showCloseButton = false,
  closeLabel = 'Close', isDismissable, dismissable, snapPoints, swipeDirection, isOpen, defaultOpen, onOpenChange,
  portalContainer, className, style, ref,
}: DrawerProps) {
  const width = normalizeWindowSize(size);
  const side = edge === 'left' || edge === 'right';
  const descriptionId = useId();
  const surface = stylex.props(
    overlayStyles.surface, overlayStyles.sheet, s.surface, side ? overlayStyles.horizontal : overlayStyles.vertical,
    side ? sideWidth[width] : endWidth[width], overlayStyles[edge],
    variant === 'straight' && s.straight, variant === 'inset' && [s.inset, edgeInset[edge]],
  );
  const layer = (open: OpenProps) => (
    <SheetOverlay
      {...open}
      position={edge}
      snapPoints={snapPoints}
      swipeDirection={swipeDirection}
      preventDismissal={!(isDismissable ?? dismissable ?? true)}
      UNSTABLE_portalContainer={portalContainer}
      {...stylex.props(s.overlay)}
    >
      <SheetBackdrop {...stylex.props(s.backdrop)} />
      <AriaSheet ref={ref} style={style} className={[surface.className, className].filter(Boolean).join(' ')}>
        {({ isExpanded }) => <>
          {variant !== 'inset' && <span aria-hidden="true" {...stylex.props(s.handle, edgeHandle[edge])} />}
          <SheetContent {...stylex.props(panelStyles.frame)} aria-describedby={description ? descriptionId : undefined}>
            {({ close }) => (
              <PanelLayout
                descriptionId={descriptionId}
                title={title}
                description={description}
                bodyStyle={!isExpanded && !!snapPoints?.length && panelStyles.bodyStill}
                close={showCloseButton && (
                  <Button appearance="text" size="sm" iconOnly aria-label={closeLabel} onClick={close}>
                    <Icon name="x" />
                  </Button>
                )}
                footer={footer === undefined ? undefined : renderPanelContent(footer, close)}
              >
                {children === undefined ? undefined : renderPanelContent(children, close)}
              </PanelLayout>
            )}
          </SheetContent>
        </>}
      </AriaSheet>
    </SheetOverlay>
  );
  if (trigger === undefined || trigger === null) return layer({ isOpen, defaultOpen, onOpenChange });
  return (
    <SheetTrigger isOpen={isOpen} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <TriggerSlot>{trigger}</TriggerSlot>
      {layer({})}
    </SheetTrigger>
  );
}

export type DrawerMenuProps<T extends object = object> = Omit<AriaMenuProps<T>, 'className' | 'style'> & {
  /** Keep the drawer open after an item is chosen. */
  keepOpen?: boolean;
  className?: string;
  style?: CSSProperties;
};

/**
 * A list of actions inside a drawer (a mobile menu). Put `MenuItem`, `MenuGroup` and `MenuSeparator`
 * in it. Choosing an item runs `onAction` and closes the drawer, unless `keepOpen` is set. Item
 * text lines up with the drawer title.
 */
export function DrawerMenu<T extends object = object>({ keepOpen = false, onAction, className, style, ...props }: DrawerMenuProps<T>) {
  const state = useContext(OverlayTriggerStateContext);
  const sx = stylex.props(s.menu);
  return (
    <AriaMenu
      {...props}
      className={[sx.className, className].filter(Boolean).join(' ')}
      style={style}
      onAction={(key: Key, value: T) => {
        onAction?.(key, value);
        if (!keepOpen) state?.close();
      }}
    />
  );
}
