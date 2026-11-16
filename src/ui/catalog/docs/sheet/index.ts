import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Edges from './edges';
import edgesCode from './edges.tsx?raw';
import Inset from './inset';
import insetCode from './inset.tsx?raw';
import Sizes from './sizes';
import sizesCode from './sizes.tsx?raw';
import CloseButton from './close-button';
import closeButtonCode from './close-button.tsx?raw';
import Controlled from './controlled';
import controlledCode from './controlled.tsx?raw';

export default defineDoc({
  id: 'sheet',
  title: 'Sheet',
  category: 'Overlays',
  description: 'Open a side panel for details or settings.',
  source: [
    'components/sheet.tsx',
    'components/button.tsx',
    'components/Icon.tsx',
    'components/internal/overlay.tsx',
    'components/internal/size.ts',
    'components/internal/states.ts',
    'tokens.stylex.ts',
  ],
  exports: ['Sheet'],
  usage: `import { Button, Sheet } from '@/ui/components';

<Sheet
  trigger={<Button appearance="tertiary">Settings</Button>}
  title="Settings"
  description="Changes apply to this workspace."
  footer={close => <Button onClick={close}>Done</Button>}
>
  …
</Sheet>`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode },
    { id: 'edges', title: 'Edges', description: '`edge` picks the side: left and right sheets are full height, top and bottom ones span up to 640px.', Component: Edges, code: edgesCode },
    { id: 'inset', title: 'Inset', description: '`variant="inset"` floats the sheet 8px from the viewport with every corner rounded.', Component: Inset, code: insetCode },
    { id: 'sizes', title: 'Sizes', description: 'Left and right sheets are 320, 384 (the default) or 480 wide.', Component: Sizes, code: sizesCode },
    { id: 'close-button', title: 'Close button', description: 'A sheet without a footer, closed by its close button. Long content scrolls under the header.', Component: CloseButton, code: closeButtonCode },
    { id: 'controlled', title: 'Controlled', description: 'Open and close the sheet from state with `isOpen` and `onOpenChange`.', Component: Controlled, code: controlledCode },
  ],
  api: [
    {
      name: 'Sheet',
      description: 'A modal panel on one edge of the viewport, with a header, a scrolling body and a footer pinned to the far end.',
      props: [
        { name: 'title', type: 'ReactNode', required: true, description: 'The heading. It names the sheet for assistive tech.' },
        { name: 'trigger', type: 'ReactNode', description: 'The element that opens the sheet. Leave it out to control the sheet with `isOpen`.' },
        { name: 'description', type: 'ReactNode', description: 'One or two sentences under the title, linked with `aria-describedby`.' },
        { name: 'children', type: 'ReactNode | ((close: () => void) => ReactNode)', description: 'The body. It scrolls between the header and the footer.' },
        { name: 'footer', type: 'ReactNode | ((close: () => void) => ReactNode)', description: 'Actions pinned to the far end, end-aligned, primary action last. They stack below 480px of viewport.' },
        { name: 'edge', type: "'top' | 'right' | 'bottom' | 'left'", default: "'right'", description: 'The viewport edge the sheet opens from.' },
        { name: 'size', type: "'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large'", default: "'md'", description: 'Left and right: 320, 384 or 480 wide. Top and bottom: up to 480, 640 or 800 wide.' },
        { name: 'variant', type: "'flush' | 'inset'", default: "'flush'", description: '`flush` meets the viewport edge; `inset` floats 8px away with every corner rounded.' },
        { name: 'showCloseButton', type: 'boolean', default: 'false', description: 'Shows a close button at the top end of the sheet.' },
        { name: 'closeLabel', type: 'string', default: "'Close'", description: 'Accessible name of the close button.' },
        { name: 'isDismissable', type: 'boolean', default: 'true', description: 'Close when the backdrop is pressed.' },
        { name: 'dismissable', type: 'boolean', description: 'Deprecated. Use `isDismissable`; `false` also turns off Escape.' },
        { name: 'isKeyboardDismissDisabled', type: 'boolean', default: 'false', description: 'Ignore Escape.' },
        { name: 'isOpen', type: 'boolean', description: 'Whether the sheet is open (controlled).' },
        { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Whether the sheet starts open (uncontrolled).' },
        { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the sheet opens or closes.' },
        { name: 'portalContainer', type: 'Element', default: 'document.body', description: 'Where the sheet renders.' },
        { name: 'className', type: 'string', description: 'Classes for the sheet surface.' },
        { name: 'style', type: 'CSSProperties', description: 'Inline styles for the sheet surface.' },
        { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'The sheet surface element.' },
      ],
    },
  ],
  accessibility: [
    'The sheet has `role="dialog"` and `aria-modal`; the title labels it and the description is linked with `aria-describedby`.',
    'Focus moves into the sheet when it opens, stays inside while it is open, and returns to the trigger when it closes.',
    'Escape and a press on the backdrop close it, unless `isKeyboardDismissDisabled` or `isDismissable={false}` is set.',
    'Content behind the sheet is hidden from assistive tech and page scrolling is locked.',
    'With reduced motion the sheet fades instead of sliding, over 120ms.',
  ],
});
