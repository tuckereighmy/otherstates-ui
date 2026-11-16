import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import PrimaryAction from './primary-action';
import primaryActionCode from './primary-action.tsx?raw';
import Loading from './loading';
import loadingCode from './loading.tsx?raw';
import CustomFooter from './custom-footer';
import customFooterCode from './custom-footer.tsx?raw';
import CloseConfirmation from './close-confirmation';
import closeConfirmationCode from './close-confirmation.tsx?raw';
import Controlled from './controlled';
import controlledCode from './controlled.tsx?raw';

export default defineDoc({
  id: 'alert-dialog',
  title: 'Alert Dialog',
  category: 'Overlays',
  description: 'Ask for confirmation before a consequential action.',
  source: [
    'components/alert-dialog.tsx',
    'components/button.tsx',
    'components/Icon.tsx',
    'components/internal/overlay.tsx',
    'components/internal/size.ts',
    'components/internal/states.ts',
    'tokens.stylex.ts',
  ],
  exports: ['AlertDialog'],
  usage: `import { AlertDialog, Button } from '@/ui/components';

<AlertDialog
  trigger={<Button appearance="destructive-outline">Delete project</Button>}
  title="Delete this project?"
  description="This cannot be undone."
  confirmLabel="Delete project"
  destructive
  onConfirm={() => deleteProject()}
/>`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode },
    { id: 'primary-action', title: 'Primary action', description: 'Without `destructive` the confirm button is primary. This one also uses `size="sm"` (320).', Component: PrimaryAction, code: primaryActionCode },
    { id: 'loading', title: 'Loading', description: 'Return a promise from `onConfirm`: the confirm button shows a spinner and the dialog stays open until it settles.', Component: Loading, code: loadingCode },
    { id: 'custom-footer', title: 'Custom footer', description: '`footer` replaces the two buttons, here with a third choice.', Component: CustomFooter, code: customFooterCode },
    { id: 'close-confirmation', title: 'Close confirmation', description: 'Ask before a sheet with unsaved changes closes.', Component: CloseConfirmation, code: closeConfirmationCode },
    { id: 'controlled', title: 'Controlled', description: 'Open from state; `onCancel` runs on Cancel, Escape or, with `isDismissable`, a press on the backdrop.', Component: Controlled, code: controlledCode },
  ],
  api: [
    {
      name: 'AlertDialog',
      description: 'A modal window with `role="alertdialog"` that asks for a decision, with cancel and confirm buttons in the footer.',
      props: [
        { name: 'title', type: 'ReactNode', required: true, description: 'The question. It names the dialog for assistive tech.' },
        { name: 'trigger', type: 'ReactNode', description: 'The element that opens the dialog. Leave it out to control the dialog with `isOpen`.' },
        { name: 'description', type: 'ReactNode', description: 'What happens on confirm, linked with `aria-describedby`.' },
        { name: 'children', type: 'ReactNode', description: 'Extra content between the header and the footer.' },
        { name: 'confirmLabel', type: 'string', default: "'Confirm'", description: 'Label of the confirm button.' },
        { name: 'cancelLabel', type: 'string', default: "'Cancel'", description: 'Label of the cancel button, which takes focus when the dialog opens.' },
        { name: 'onConfirm', type: '() => void | Promise<unknown>', description: 'Runs on confirm. A promise keeps the dialog open with a loading button until it settles; a rejection keeps it open.' },
        { name: 'onCancel', type: '() => void', description: 'Runs when the dialog closes any other way: Cancel, Escape or the backdrop.' },
        { name: 'destructive', type: 'boolean', default: 'false', description: 'Gives the confirm button the destructive appearance.' },
        { name: 'isDismissable', type: 'boolean', default: 'false', description: 'Close when the backdrop is pressed. Off by default, so a decision is explicit.' },
        { name: 'size', type: "'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large'", default: "'md'", description: 'Width: 320, 400 or 560. The long names are aliases.' },
        { name: 'footer', type: 'ReactNode | ((close: () => void) => ReactNode)', description: 'Replaces the cancel and confirm buttons. Its `close` does not call `onCancel`.' },
        { name: 'isOpen', type: 'boolean', description: 'Whether the dialog is open (controlled).' },
        { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Whether the dialog starts open (uncontrolled).' },
        { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the dialog opens or closes.' },
        { name: 'portalContainer', type: 'Element', default: 'document.body', description: 'Where the dialog renders.' },
        { name: 'className', type: 'string', description: 'Classes for the window surface.' },
        { name: 'style', type: 'CSSProperties', description: 'Inline styles for the window surface.' },
        { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'The window surface element.' },
      ],
    },
  ],
  accessibility: [
    'The window has `role="alertdialog"` and `aria-modal`; the title labels it and the description is linked with `aria-describedby`.',
    'Cancel takes focus when the dialog opens, so pressing Enter by reflex never confirms a destructive action.',
    'Focus stays inside while the dialog is open and returns to the trigger when it closes.',
    'Escape cancels, except while a confirm is pending. The backdrop does nothing unless `isDismissable` is set.',
    'While a confirm is pending the confirm button sets `aria-busy` and ignores presses.',
    'With reduced motion the window and backdrop only fade, over 120ms.',
  ],
});
