import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import CloseButton from './close-button';
import closeButtonCode from './close-button.tsx?raw';
import WithArrow from './with-arrow';
import withArrowCode from './with-arrow.tsx?raw';
import Placement from './placement';
import placementCode from './placement.tsx?raw';
import Width from './width';
import widthCode from './width.tsx?raw';
import Controlled from './controlled';
import controlledCode from './controlled.tsx?raw';

export default defineDoc({
  id: 'popover',
  title: 'Popover',
  category: 'Overlays',
  description: 'Open a small panel beside its trigger.',
  source: [
    'components/popover.tsx',
    'components/button.tsx',
    'components/Icon.tsx',
    'components/internal/overlay.tsx',
    'components/internal/size.ts',
    'components/internal/states.ts',
    'tokens.stylex.ts',
  ],
  exports: ['Popover'],
  usage: `import { Button, Popover } from '@/ui/components';

<Popover
  trigger={<Button appearance="tertiary">Rename</Button>}
  title="Rename note"
  footer={close => <Button size="sm" onClick={close}>Save</Button>}
>
  …
</Popover>`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode, minHeight: 440 },
    { id: 'close-button', title: 'Close button', description: '`showCloseButton` adds a 24px close button beside the title.', Component: CloseButton, code: closeButtonCode, minHeight: 320 },
    { id: 'with-arrow', title: 'With arrow', description: '`showArrow` points at the trigger, like a tooltip that can hold richer content.', Component: WithArrow, code: withArrowCode, minHeight: 280 },
    { id: 'placement', title: 'Placement', description: 'Each popover enters from 4px toward its trigger and settles away from it. On narrow screens the side placements open below.', Component: Placement, code: placementCode, minHeight: 360 },
    { id: 'width', title: 'Width', description: '`width` sets the width in px or any CSS length; the default is 256.', Component: Width, code: widthCode, minHeight: 480 },
    { id: 'controlled', title: 'Controlled', description: 'Close the popover from state once a choice is made.', Component: Controlled, code: controlledCode, minHeight: 380 },
  ],
  api: [
    {
      name: 'Popover',
      description: 'A panel anchored to its trigger, with a compact header, content and an optional footer.',
      props: [
        { name: 'trigger', type: 'ReactNode', required: true, description: 'The element that opens the popover and anchors it.' },
        { name: 'title', type: 'ReactNode', description: 'The heading, 14/20 500. Leave it out only with an `aria-label`.' },
        { name: 'description', type: 'ReactNode', description: 'A line under the title, 13/18 in `fg-muted`.' },
        { name: 'children', type: 'ReactNode | ((close: () => void) => ReactNode)', description: 'The content.' },
        { name: 'footer', type: 'ReactNode | ((close: () => void) => ReactNode)', description: 'Actions in an end-aligned row, primary action last.' },
        { name: 'placement', type: 'Placement', default: "'bottom'", description: 'Where the popover opens relative to the trigger, for example `bottom start`. It flips when there is no room; below 480px of viewport, left and right placements open below the trigger.' },
        { name: 'offset', type: 'number', default: '6 (12 with an arrow)', description: 'Distance from the trigger in px.' },
        { name: 'width', type: 'number | string', default: '256', description: 'Width in px or any CSS width. Never wider than the viewport less 24px.' },
        { name: 'showCloseButton', type: 'boolean', default: 'false', description: 'Shows a close button at the top end.' },
        { name: 'closeLabel', type: 'string', default: "'Close'", description: 'Accessible name of the close button.' },
        { name: 'showArrow', type: 'boolean', default: 'false', description: 'Draws an arrow that points at the trigger.' },
        { name: 'aria-label', type: 'string', description: 'Names the popover when it has no title.' },
        { name: 'isOpen', type: 'boolean', description: 'Whether the popover is open (controlled).' },
        { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Whether the popover starts open (uncontrolled).' },
        { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the popover opens or closes.' },
        { name: 'portalContainer', type: 'Element', default: 'document.body', description: 'Where the popover renders.' },
        { name: 'className', type: 'string', description: 'Classes for the popover surface.' },
        { name: 'style', type: 'CSSProperties', description: 'Inline styles for the popover surface.' },
        { name: 'ref', type: 'Ref<HTMLElement>', description: 'The popover surface element.' },
      ],
    },
  ],
  accessibility: [
    'The trigger gets `aria-expanded` and `aria-controls`; the panel is a `dialog` labeled by its title, or by `aria-label` when there is none.',
    'Focus moves into the popover when it opens and returns to the trigger when it closes. Escape or a press outside closes it.',
    'The arrow is decorative and hidden from assistive tech.',
    'Give an icon-only trigger an `aria-label`.',
    'With reduced motion the popover only fades, over 120ms.',
  ],
});
