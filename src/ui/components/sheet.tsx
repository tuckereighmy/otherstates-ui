'use client';

import * as stylex from '@stylexjs/stylex';
import { useId } from 'react';
import type { CSSProperties, ReactNode, Ref } from 'react';
import { Dialog } from 'react-aria-components';
import { Button } from './button';
import { Icon } from './Icon';
import {
  ModalShell, PanelLayout, normalizeWindowSize, overlayStyles, panelStyles, renderPanelContent,
  type Edge, type OpenProps, type PanelContent, type PortalProps, type WindowSizeProp,
} from './internal/overlay';
import { tokens as t } from '../tokens.stylex';

// Sheet (spec 1.9): a modal panel on one edge of the viewport. Left and right sheets are 384 wide by
// default and full height; top and bottom sheets span up to 640. Padding 20, start-aligned header,
// a body that scrolls and a footer row pinned to the far end. Slides in over --os-motion-sheet (360,
// ease-settle) and out over 240 with ease-exit; under reduced motion it only fades.
// `variant="inset"` floats the sheet 8px from the viewport with every corner rounded.

const reduce = '@media (prefers-reduced-motion: reduce)';
const fadeIn = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const slideTop = stylex.keyframes({ from: { transform: 'translateY(calc(-100% - var(--os-sheet-gap, 0px)))' }, to: { transform: 'none' } });
const slideBottom = stylex.keyframes({ from: { transform: 'translateY(calc(100% + var(--os-sheet-gap, 0px)))' }, to: { transform: 'none' } });
const slideLeft = stylex.keyframes({ from: { transform: 'translateX(calc(-100% - var(--os-sheet-gap, 0px)))' }, to: { transform: 'none' } });
const slideRight = stylex.keyframes({ from: { transform: 'translateX(calc(100% + var(--os-sheet-gap, 0px)))' }, to: { transform: 'none' } });

const s = stylex.create({
  overlay: { padding: 0, overflow: 'hidden' },
  overlayInset: { padding: t['--os-space-2'] },
  topOverlay: { alignItems: 'start' },
  bottomOverlay: { alignItems: 'end' },
  leftOverlay: { justifyItems: 'start' },
  rightOverlay: { justifyItems: 'end' },
  enterTop: { animationName: { default: slideTop, [reduce]: fadeIn } },
  enterBottom: { animationName: { default: slideBottom, [reduce]: fadeIn } },
  enterLeft: { animationName: { default: slideLeft, [reduce]: fadeIn } },
  enterRight: { animationName: { default: slideRight, [reduce]: fadeIn } },
  // Left and right widths; top and bottom maximum widths.
  sideSm: { width: 'min(100%, 320px)' },
  sideMd: { width: 'min(100%, 384px)' },
  sideLg: { width: 'min(100%, 480px)' },
  endSm: { width: 'min(100%, 480px)' },
  endMd: { width: 'min(100%, 640px)' },
  endLg: { width: 'min(100%, 800px)' },
  /** Floats 8px from the viewport edges; every corner keeps radius lg. */
  inset: {
    '--os-sheet-gap': t['--os-space-2'],
    borderTopLeftRadius: t['--os-radius-lg'], borderTopRightRadius: t['--os-radius-lg'],
    borderBottomLeftRadius: t['--os-radius-lg'], borderBottomRightRadius: t['--os-radius-lg'],
    borderStartStartRadius: t['--os-radius-lg'], borderStartEndRadius: t['--os-radius-lg'],
    borderEndStartRadius: t['--os-radius-lg'], borderEndEndRadius: t['--os-radius-lg'],
  },
  insetSide: { height: `calc(100dvh - 2 * ${t['--os-space-2']})` },
  insetEnd: { maxHeight: `min(calc(100dvh - 2 * ${t['--os-space-2']}), 680px)` },
});

const edgeOverlay = { top: s.topOverlay, right: s.rightOverlay, bottom: s.bottomOverlay, left: s.leftOverlay };
const edgeEnter = { top: s.enterTop, right: s.enterRight, bottom: s.enterBottom, left: s.enterLeft };
const sideWidth = { sm: s.sideSm, md: s.sideMd, lg: s.sideLg };
const endWidth = { sm: s.endSm, md: s.endMd, lg: s.endLg };

export type SheetProps = OpenProps & PortalProps & {
  /** The element that opens the sheet. Leave it out to control the sheet with `isOpen`. */
  trigger?: ReactNode;
  /** The heading. It names the sheet for assistive tech. */
  title: ReactNode;
  /** One or two sentences under the title, linked with `aria-describedby`. */
  description?: ReactNode;
  /** The body. A function receives `close`. It scrolls between the header and the footer. */
  children?: PanelContent;
  /** Actions pinned to the far end of the sheet, end-aligned, primary action last. A function receives `close`. */
  footer?: PanelContent;
  /** The viewport edge the sheet opens from. */
  edge?: Edge;
  /** Left and right: 320, 384 or 480 wide. Top and bottom: up to 480, 640 or 800 wide. */
  size?: WindowSizeProp;
  /** `flush` meets the viewport edge; `inset` floats 8px away with every corner rounded. */
  variant?: 'flush' | 'inset';
  /** Shows a close button at the top end of the sheet. */
  showCloseButton?: boolean;
  /** Accessible name of the close button. */
  closeLabel?: string;
  /** Close when the backdrop is pressed. */
  isDismissable?: boolean;
  /** @deprecated Use `isDismissable`. `false` also turns off Escape, as it always did. */
  dismissable?: boolean;
  /** Ignore Escape. */
  isKeyboardDismissDisabled?: boolean;
  /** Classes for the sheet surface. */
  className?: string;
  /** Inline styles for the sheet surface. */
  style?: CSSProperties;
  /** The sheet surface element. */
  ref?: Ref<HTMLDivElement>;
};

export function Sheet({
  trigger, title, description, children, footer, edge = 'right', size, variant = 'flush', showCloseButton = false,
  closeLabel = 'Close', isDismissable, dismissable, isKeyboardDismissDisabled, isOpen, defaultOpen, onOpenChange,
  portalContainer, className, style, ref,
}: SheetProps) {
  const width = normalizeWindowSize(size);
  const side = edge === 'left' || edge === 'right';
  const descriptionId = useId();
  const inset = variant === 'inset';
  return (
    <ModalShell
      trigger={trigger}
      isOpen={isOpen}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      portalContainer={portalContainer}
      isDismissable={isDismissable ?? dismissable ?? true}
      isKeyboardDismissDisabled={isKeyboardDismissDisabled ?? dismissable === false}
      overlayStyle={[s.overlay, inset && s.overlayInset, edgeOverlay[edge]]}
      surfaceStyle={({ isEntering, isExiting }) => [
        overlayStyles.surface, overlayStyles.sheet, side ? overlayStyles.horizontal : overlayStyles.vertical,
        side ? sideWidth[width] : endWidth[width], overlayStyles[edge], inset && [s.inset, side ? s.insetSide : s.insetEnd],
        (isEntering || isExiting) && edgeEnter[edge], isExiting && overlayStyles.exit,
      ]}
      className={className}
      style={style}
      ref={ref}
    >
      <Dialog {...stylex.props(panelStyles.frame)} aria-describedby={description ? descriptionId : undefined}>
        {({ close }) => (
          <PanelLayout
            descriptionId={descriptionId}
            title={title}
            description={description}
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
      </Dialog>
    </ModalShell>
  );
}
