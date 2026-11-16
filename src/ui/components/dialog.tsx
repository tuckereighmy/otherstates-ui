'use client';

import * as stylex from '@stylexjs/stylex';
import { createContext, useContext, useId } from 'react';
import type { CSSProperties, ReactNode, Ref } from 'react';
import { Dialog as AriaDialog } from 'react-aria-components';
import { Button } from './button';
import { Icon } from './Icon';
import {
  ModalShell, PanelLayout, normalizeWindowSize, overlayStyles, panelStyles, renderPanelContent, windowStyles,
  type OpenProps, type PanelContent, type PortalProps, type WindowSizeProp,
} from './internal/overlay';
import { tokens as t } from '../tokens.stylex';

// Dialog (spec 1.9): a modal window on bg-elevated with the overlay hairline and shadow, 400 wide by
// default (320 / 400 / 560), padding 20. Header, body and footer are start-aligned; the footer is an
// end-aligned row that stacks below 480px. The centered layout is kept only for `media`.
// Enters over --os-motion-modal (rises 8px, settles from .98) and exits over 160ms.

const s = stylex.create({
  /** A tile inside the window: radius md, like washes and tiles inside a card. */
  thumbnail: {
    width: 120, maxWidth: '100%', aspectRatio: '1 / 1', alignSelf: 'center', flexShrink: 0,
    borderRadius: t['--os-radius-md'], overflow: 'hidden',
  },
  /** Flush with the window's top edge (out through the 20px padding); the surface's radius clips its corners. */
  cover: {
    marginBlockStart: `calc(-1 * ${t['--os-space-5']})`, marginInline: `calc(-1 * ${t['--os-space-5']})`,
    flexShrink: 0, aspectRatio: '327 / 270', overflow: 'hidden',
  },
});

const CenteredContext = createContext(false);

export type DialogMedia = { content: ReactNode; placement: 'thumbnail' | 'cover' };

export type DialogProps = OpenProps & PortalProps & {
  /** The element that opens the dialog. Leave it out to control the dialog with `isOpen`. */
  trigger?: ReactNode;
  /** The heading. It names the dialog for assistive tech. */
  title: ReactNode;
  /** One or two sentences under the title, linked to the dialog with `aria-describedby`. */
  description?: ReactNode;
  /** The body. A function receives `close`. The body scrolls when the window runs out of height. */
  children?: PanelContent;
  /** Actions in the footer row, end-aligned, primary action last. A function receives `close`. */
  footer?: PanelContent;
  /** Width: `sm` 320, `md` 400, `lg` 560. `small`, `medium` and `large` are aliases. */
  size?: WindowSizeProp;
  /** Shows a close button at the top end of the window. */
  showCloseButton?: boolean;
  /** Accessible name of the close button. */
  closeLabel?: string;
  /** Close when the backdrop is pressed. */
  isDismissable?: boolean;
  /** @deprecated Use `isDismissable`. `false` also turns off Escape, as it always did. */
  dismissable?: boolean;
  /** Ignore Escape. */
  isKeyboardDismissDisabled?: boolean;
  /** An image or illustration above the title. Centers the header and stacks the footer. */
  media?: DialogMedia;
  /** Classes for the window surface. */
  className?: string;
  /** Inline styles for the window surface. */
  style?: CSSProperties;
  /** The window surface element. */
  ref?: Ref<HTMLDivElement>;
};

export function Dialog({
  trigger, title, description, children, footer, size, showCloseButton = false, closeLabel = 'Close',
  isDismissable, dismissable, isKeyboardDismissDisabled, media, isOpen, defaultOpen, onOpenChange,
  portalContainer, className, style, ref,
}: DialogProps) {
  const width = normalizeWindowSize(size);
  const centered = !!media;
  const descriptionId = useId();
  return (
    <ModalShell
      trigger={trigger}
      isOpen={isOpen}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      portalContainer={portalContainer}
      isDismissable={isDismissable ?? dismissable ?? true}
      isKeyboardDismissDisabled={isKeyboardDismissDisabled ?? dismissable === false}
      surfaceStyle={({ isExiting }) => [overlayStyles.surface, windowStyles.window, windowStyles[width], overlayStyles.windowMotion, isExiting && overlayStyles.exit]}
      className={className}
      style={style}
      ref={ref}
    >
      <AriaDialog {...stylex.props(panelStyles.frame)} aria-describedby={description ? descriptionId : undefined}>
        {({ close }) => (
          <CenteredContext.Provider value={centered}>
            <PanelLayout
              descriptionId={descriptionId}
              title={title}
              description={description}
              centered={centered}
              lead={media && <div {...stylex.props(media.placement === 'cover' ? s.cover : s.thumbnail)}>{media.content}</div>}
              close={showCloseButton && (
                <Button appearance="text" size="sm" iconOnly aria-label={closeLabel} onClick={close}>
                  <Icon name="x" />
                </Button>
              )}
              footer={footer === undefined ? undefined : renderPanelContent(footer, close)}
            >
              {children === undefined ? undefined : renderPanelContent(children, close)}
            </PanelLayout>
          </CenteredContext.Provider>
        )}
      </AriaDialog>
    </ModalShell>
  );
}

/**
 * @deprecated Use the `footer` prop. Renders the footer row (end-aligned, gap 8, stacked below 480px)
 * inside the body; in a dialog with `media` the actions stack full width.
 */
export function DialogActions({ children }: { children: ReactNode }) {
  const centered = useContext(CenteredContext);
  return <div {...stylex.props(panelStyles.footer, centered && panelStyles.footerStacked)}>{children}</div>;
}
