import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Inset from './inset';
import insetCode from './inset.tsx?raw';
import Straight from './straight';
import straightCode from './straight.tsx?raw';
import Edges from './edges';
import edgesCode from './edges.tsx?raw';
import Scrollable from './scrollable';
import scrollableCode from './scrollable.tsx?raw';
import TextField from './text-field';
import textFieldCode from './text-field.tsx?raw';
import Nested from './nested';
import nestedCode from './nested.tsx?raw';
import SnapPoints from './snap-points';
import snapPointsCode from './snap-points.tsx?raw';
import MobileMenu from './mobile-menu';
import mobileMenuCode from './mobile-menu.tsx?raw';
import ResponsiveDialog from './responsive-dialog';
import responsiveDialogCode from './responsive-dialog.tsx?raw';
import ResponsiveMenu from './responsive-menu';
import responsiveMenuCode from './responsive-menu.tsx?raw';

export default defineDoc({
  id: 'drawer',
  title: 'Drawer',
  category: 'Overlays',
  description: 'Slide a panel in from an edge, with swipe gestures and snap points.',
  source: [
    'components/drawer.tsx',
    'components/button.tsx',
    'components/Icon.tsx',
    'components/internal/overlay.tsx',
    'components/internal/size.ts',
    'components/internal/states.ts',
    'tokens.stylex.ts',
  ],
  exports: ['Drawer', 'DrawerMenu'],
  usage: `import { Button, Drawer } from '@/ui/components';

<Drawer
  trigger={<Button appearance="tertiary">Filters</Button>}
  title="Filters"
  description="Narrow the project list."
  footer={close => <Button onClick={close}>Apply filters</Button>}
>
  …
</Drawer>`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode },
    { id: 'inset', title: 'Inset', description: '`variant="inset"` floats the drawer 8px from the screen edges with every corner rounded.', Component: Inset, code: insetCode },
    { id: 'straight', title: 'Straight', description: '`variant="straight"` keeps every corner square.', Component: Straight, code: straightCode },
    { id: 'edges', title: 'Edges', description: '`edge` picks the side the drawer opens from; it swipes back toward the same edge.', Component: Edges, code: edgesCode },
    { id: 'scrollable', title: 'Scrollable content', description: 'Long content scrolls between the header and the footer.', Component: Scrollable, code: scrollableCode },
    { id: 'text-field', title: 'With a text field', description: 'A field that takes focus on open. On touch devices the drawer waits for the software keyboard before it slides in.', Component: TextField, code: textFieldCode },
    { id: 'nested', title: 'Nested drawers', description: 'A drawer can open another one on top; each closes on its own.', Component: Nested, code: nestedCode },
    { id: 'snap-points', title: 'Snap points', description: '`snapPoints` lets the drawer rest part way; the body scrolls once it is fully open.', Component: SnapPoints, code: snapPointsCode },
    { id: 'mobile-menu', title: 'Mobile menu', description: '`DrawerMenu` holds menu items; choosing one closes the drawer.', Component: MobileMenu, code: mobileMenuCode },
    { id: 'responsive-dialog', title: 'Responsive dialog', description: 'Dialog and Drawer take the same props, so one can stand in for the other by screen width.', Component: ResponsiveDialog, code: responsiveDialogCode },
    { id: 'responsive-menu', title: 'Responsive menu', description: 'A Menu on wide screens and a drawer with the same items on narrow ones.', Component: ResponsiveMenu, code: responsiveMenuCode, minHeight: 240 },
  ],
  api: [
    {
      name: 'Drawer',
      description: 'A swipeable panel on one edge of the viewport, built on the React Aria Sheet, with a header, a body and a footer.',
      props: [
        { name: 'title', type: 'ReactNode', required: true, description: 'The heading. It names the drawer for assistive tech.' },
        { name: 'trigger', type: 'ReactNode', description: 'The element that opens the drawer. Leave it out to control the drawer with `isOpen`.' },
        { name: 'description', type: 'ReactNode', description: 'One or two sentences under the title, linked with `aria-describedby`.' },
        { name: 'children', type: 'ReactNode | ((close: () => void) => ReactNode)', description: 'The body. With snap points it scrolls only once the drawer is fully open.' },
        { name: 'footer', type: 'ReactNode | ((close: () => void) => ReactNode)', description: 'Actions pinned to the far end, end-aligned, primary action last. They stack below 480px of viewport.' },
        { name: 'edge', type: "'top' | 'right' | 'bottom' | 'left'", default: "'bottom'", description: 'The viewport edge the drawer opens from.' },
        { name: 'size', type: "'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large'", default: "'md'", description: 'Top and bottom: up to 480, 640 or 800 wide. Left and right: 320, 384 or 480 wide.' },
        { name: 'variant', type: "'default' | 'inset' | 'straight'", default: "'default'", description: '`default` rounds the inner corners, `inset` floats 8px from the viewport, `straight` has square corners.' },
        { name: 'snapPoints', type: 'Array<number | string>', description: 'Heights (or widths) the drawer rests at: numbers are px, percentages are of the drawer. It opens at the first one.' },
        { name: 'swipeDirection', type: "'top' | 'bottom' | 'left' | 'right' | 'vertical' | 'horizontal'", description: 'The direction a swipe dismisses. Defaults to `edge`.' },
        { name: 'showCloseButton', type: 'boolean', default: 'false', description: 'Shows a close button at the top end of the drawer.' },
        { name: 'closeLabel', type: 'string', default: "'Close'", description: 'Accessible name of the close button.' },
        { name: 'isDismissable', type: 'boolean', default: 'true', description: 'Close on a swipe, Escape or a press on the backdrop. With snap points, a drawer that can’t be dismissed rests at its smallest one.' },
        { name: 'dismissable', type: 'boolean', description: 'Deprecated. Use `isDismissable`.' },
        { name: 'isOpen', type: 'boolean', description: 'Whether the drawer is open (controlled).' },
        { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Whether the drawer starts open (uncontrolled).' },
        { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the drawer opens or closes.' },
        { name: 'portalContainer', type: 'Element', default: 'document.body', description: 'Where the drawer renders.' },
        { name: 'className', type: 'string', description: 'Classes for the drawer surface.' },
        { name: 'style', type: 'CSSProperties', description: 'Inline styles for the drawer surface.' },
        { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'The drawer surface element.' },
      ],
    },
    {
      name: 'DrawerMenu',
      description: 'A list of actions inside a drawer. Put `MenuItem`, `MenuGroup` and `MenuSeparator` in it; item text lines up with the drawer title.',
      extends: 'React Aria MenuProps',
      props: [
        { name: 'keepOpen', type: 'boolean', default: 'false', description: 'Keep the drawer open after an item is chosen.' },
        { name: 'onAction', type: '(key: Key, value: T) => void', description: 'Runs when an item is chosen, before the drawer closes.' },
        { name: 'className', type: 'string', description: 'Classes for the list.' },
        { name: 'style', type: 'CSSProperties', description: 'Inline styles for the list.' },
      ],
    },
  ],
  accessibility: [
    'The drawer has `role="dialog"` and `aria-modal`; the title labels it and the description is linked with `aria-describedby`.',
    'Focus moves into the drawer once it has entered, stays inside while it is open, and returns to the trigger when it closes.',
    'Escape, a press on the backdrop and a swipe toward the edge close it, unless `isDismissable={false}`. The handle is decorative; every gesture has a keyboard equivalent.',
    '`DrawerMenu` is a `menu`: arrow keys move between items, Enter or Space chooses one, and typing jumps to an item by its label.',
    'With reduced motion the drawer appears and leaves without sliding.',
  ],
});
