'use client';

import * as stylex from '@stylexjs/stylex';
import { useId, useRef, useState } from 'react';
import type { CSSProperties, ReactNode, Ref } from 'react';
import { Dialog } from 'react-aria-components';
import { Button } from './button';
import {
  ModalShell, PanelLayout, normalizeWindowSize, overlayStyles, panelStyles, renderPanelContent, useOpenState, windowStyles,
  type OpenProps, type PanelContent, type PortalProps, type WindowSizeProp,
} from './internal/overlay';

// AlertDialog (spec 1.9): a Dialog with role="alertdialog" that asks for a decision. It shares the
// Dialog window (400 wide by default, padding 20, start-aligned header) and its motion. The footer
// holds Button md: `tertiary` cancel, then `primary` or `destructive` confirm; it stacks below 480px.
// A promise returned from `onConfirm` keeps the dialog open with a loading confirm button.

export type AlertDialogProps = OpenProps & PortalProps & {
  /** The element that opens the dialog. Leave it out to control the dialog with `isOpen`. */
  trigger?: ReactNode;
  /** The question. It names the dialog for assistive tech. */
  title: ReactNode;
  /** What happens if the person confirms, linked with `aria-describedby`. */
  description?: ReactNode;
  /** Extra content between the header and the footer. */
  children?: ReactNode;
  /** Label of the confirm button. */
  confirmLabel?: string;
  /** Label of the cancel button. */
  cancelLabel?: string;
  /** Runs on confirm. Return a promise to keep the dialog open, with a loading button, until it settles; a rejection keeps it open. */
  onConfirm?: () => void | Promise<unknown>;
  /** Runs when the dialog closes any other way: Cancel, Escape or the backdrop. */
  onCancel?: () => void;
  /** Gives the confirm button the destructive appearance. */
  destructive?: boolean;
  /** Close when the backdrop is pressed. Off by default: a decision should be explicit. */
  isDismissable?: boolean;
  /** Width: `sm` 320, `md` 400, `lg` 560. `small`, `medium` and `large` are aliases. */
  size?: WindowSizeProp;
  /** Replaces the cancel and confirm buttons. A function receives `close`, which closes without calling `onCancel`. */
  footer?: PanelContent;
  /** Classes for the window surface. */
  className?: string;
  /** Inline styles for the window surface. */
  style?: CSSProperties;
  /** The window surface element. */
  ref?: Ref<HTMLDivElement>;
};

export function AlertDialog({
  trigger, title, description, children, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel,
  destructive = false, isDismissable = false, size, footer, isOpen, defaultOpen, onOpenChange, portalContainer,
  className, style, ref,
}: AlertDialogProps) {
  const [open, setOpen] = useOpenState({ isOpen, defaultOpen, onOpenChange });
  const [pending, setPending] = useState(false);
  const confirming = useRef(false);
  const width = normalizeWindowSize(size);
  const descriptionId = useId();

  const changeOpen = (next: boolean) => {
    if (!next && pending) return;
    if (next) setPending(false);
    if (!next && !confirming.current) onCancel?.();
    confirming.current = false;
    setOpen(next);
  };

  const confirm = () => {
    const result = onConfirm?.();
    if (result && typeof (result as Promise<unknown>).then === 'function') {
      setPending(true);
      (result as Promise<unknown>).then(() => { setPending(false); setOpen(false); }, () => setPending(false));
      return;
    }
    confirming.current = true;
    changeOpen(false);
  };

  return (
    <ModalShell
      trigger={trigger}
      isOpen={open}
      onOpenChange={changeOpen}
      portalContainer={portalContainer}
      isDismissable={isDismissable && !pending}
      isKeyboardDismissDisabled={pending}
      surfaceStyle={({ isExiting }) => [overlayStyles.surface, windowStyles.window, windowStyles[width], overlayStyles.windowMotion, isExiting && overlayStyles.exit]}
      className={className}
      style={style}
      ref={ref}
    >
      <Dialog role="alertdialog" {...stylex.props(panelStyles.frame)} aria-describedby={description ? descriptionId : undefined}>
        {({ close }) => (
          <PanelLayout
            descriptionId={descriptionId}
            title={title}
            description={description}
            footer={footer !== undefined ? renderPanelContent(footer, () => { confirming.current = true; close(); }) : <>
              <Button appearance="tertiary" autoFocus isDisabled={pending} onClick={() => changeOpen(false)}>{cancelLabel}</Button>
              <Button appearance={destructive ? 'destructive' : 'primary'} isLoading={pending} onClick={confirm}>{confirmLabel}</Button>
            </>}
          >
            {children}
          </PanelLayout>
        )}
      </Dialog>
    </ModalShell>
  );
}
