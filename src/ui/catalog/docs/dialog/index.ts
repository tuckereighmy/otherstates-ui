import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Sizes from './sizes';
import sizesCode from './sizes.tsx?raw';
import CloseButton from './close-button';
import closeButtonCode from './close-button.tsx?raw';
import Controlled from './controlled';
import controlledCode from './controlled.tsx?raw';
import OpenFromMenu from './open-from-menu';
import openFromMenuCode from './open-from-menu.tsx?raw';
import Scrollable from './scrollable';
import scrollableCode from './scrollable.tsx?raw';
import Nested from './nested';
import nestedCode from './nested.tsx?raw';
import CloseConfirmation from './close-confirmation';
import closeConfirmationCode from './close-confirmation.tsx?raw';
import ExplicitClose from './explicit-close';
import explicitCloseCode from './explicit-close.tsx?raw';
import WithMedia from './with-media';
import withMediaCode from './with-media.tsx?raw';

export default defineDoc({
  id: 'dialog',
  title: 'Dialog',
  category: 'Overlays',
  description: 'Keep attention on a short task in a modal window.',
  source: [
    'components/dialog.tsx',
    'components/button.tsx',
    'components/Icon.tsx',
    'components/internal/overlay.tsx',
    'components/internal/size.ts',
    'components/internal/states.ts',
    'tokens.stylex.ts',
  ],
  exports: ['Dialog', 'DialogActions'],
  usage: `import { Button, Dialog } from '@/ui/components';

<Dialog
  trigger={<Button appearance="tertiary">Edit profile</Button>}
  title="Edit profile"
  description="Your display name appears to everyone in your workspace."
  footer={close => <Button onClick={close}>Save</Button>}
>
  …
</Dialog>`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode },
    { id: 'sizes', title: 'Sizes', description: 'Three widths: `sm` 320, `md` 400 (the default) and `lg` 560.', Component: Sizes, code: sizesCode },
    { id: 'close-button', title: 'Close button', description: 'A dialog with no footer, closed by its close button, Escape or the backdrop.', Component: CloseButton, code: closeButtonCode },
    { id: 'controlled', title: 'Controlled', description: 'Open and close the dialog from state with `isOpen` and `onOpenChange`; the footer submits a form in the body.', Component: Controlled, code: controlledCode },
    { id: 'open-from-menu', title: 'Open from a menu', description: 'A menu item opens a dialog that has no trigger of its own.', Component: OpenFromMenu, code: openFromMenuCode, minHeight: 240 },
    { id: 'scrollable', title: 'Scrollable body', description: 'When the content is taller than the viewport, the body scrolls between a fixed header and footer.', Component: Scrollable, code: scrollableCode },
    { id: 'nested', title: 'Nested dialogs', description: 'A dialog can open another one; Escape closes the top dialog first.', Component: Nested, code: nestedCode },
    { id: 'close-confirmation', title: 'Close confirmation', description: 'Intercept a close in `onOpenChange` and ask before unsaved work is lost.', Component: CloseConfirmation, code: closeConfirmationCode },
    { id: 'explicit-close', title: 'Explicit close', description: 'With `isDismissable={false}` and `isKeyboardDismissDisabled`, only a button in the dialog closes it.', Component: ExplicitClose, code: explicitCloseCode },
    { id: 'with-media', title: 'With media', description: '`media` puts an image above the title and centers the header; the actions stack.', Component: WithMedia, code: withMediaCode },
  ],
  api: [
    {
      name: 'Dialog',
      description: 'A modal window with a title, an optional description, a body and a footer row. It opens from `trigger` or from `isOpen`.',
      props: [
        { name: 'title', type: 'ReactNode', required: true, description: 'The heading. It names the dialog for assistive tech.' },
        { name: 'trigger', type: 'ReactNode', description: 'The element that opens the dialog. Leave it out to control the dialog with `isOpen`.' },
        { name: 'description', type: 'ReactNode', description: 'One or two sentences under the title, linked to the dialog with `aria-describedby`.' },
        { name: 'children', type: 'ReactNode | ((close: () => void) => ReactNode)', description: 'The body. It scrolls when the window runs out of height.' },
        { name: 'footer', type: 'ReactNode | ((close: () => void) => ReactNode)', description: 'Actions in an end-aligned row, primary action last. Below 480px of viewport they stack full width.' },
        { name: 'size', type: "'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large'", default: "'md'", description: 'Width: 320, 400 or 560, never wider than the viewport less 32px. The long names are aliases.' },
        { name: 'showCloseButton', type: 'boolean', default: 'false', description: 'Shows a close button at the top end of the window.' },
        { name: 'closeLabel', type: 'string', default: "'Close'", description: 'Accessible name of the close button.' },
        { name: 'isDismissable', type: 'boolean', default: 'true', description: 'Close when the backdrop is pressed.' },
        { name: 'dismissable', type: 'boolean', description: 'Deprecated. Use `isDismissable`; `false` also turns off Escape.' },
        { name: 'isKeyboardDismissDisabled', type: 'boolean', default: 'false', description: 'Ignore Escape.' },
        { name: 'media', type: "{ content: ReactNode; placement: 'thumbnail' | 'cover' }", description: 'An image above the title: a 120px thumbnail or a cover flush with the top edge. Centers the header and stacks the footer.' },
        { name: 'isOpen', type: 'boolean', description: 'Whether the dialog is open (controlled).' },
        { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Whether the dialog starts open (uncontrolled).' },
        { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the dialog opens or closes.' },
        { name: 'portalContainer', type: 'Element', default: 'document.body', description: 'Where the dialog renders.' },
        { name: 'className', type: 'string', description: 'Classes for the window surface.' },
        { name: 'style', type: 'CSSProperties', description: 'Inline styles for the window surface.' },
        { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'The window surface element.' },
      ],
    },
    {
      name: 'DialogActions',
      description: 'Deprecated: use `footer`. A footer row placed inside the body; in a dialog with `media` its actions stack.',
      props: [
        { name: 'children', type: 'ReactNode', required: true, description: 'The action buttons, primary action last.' },
      ],
    },
  ],
  accessibility: [
    'The window has `role="dialog"` and `aria-modal`; the title labels it and the description is linked with `aria-describedby`.',
    'Focus moves into the dialog when it opens, stays inside while it is open, and returns to the trigger when it closes.',
    'Escape closes the dialog unless `isKeyboardDismissDisabled` is set; with nested dialogs it closes the top one first.',
    'Content behind the dialog is hidden from assistive tech and page scrolling is locked.',
    'Give the close button and any icon-only trigger an accessible name (`closeLabel`, `aria-label`).',
    'With reduced motion the window and backdrop only fade, over 120ms.',
  ],
});
