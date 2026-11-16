import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Placements from './placements';
import placementsCode from './placements.tsx?raw';
import Tones from './tones';
import tonesCode from './tones.tsx?raw';
import Grouped from './grouped';
import groupedCode from './grouped.tsx?raw';
import Delay from './delay';
import delayCode from './delay.tsx?raw';
import Controlled from './controlled';
import controlledCode from './controlled.tsx?raw';

export default defineDoc({
  id: 'tooltip',
  title: 'Tooltip',
  category: 'Overlays',
  description: 'A short label that appears when a control is hovered or focused.',
  source: ['components/tooltip.tsx', 'components/internal/class-name.ts', 'components/internal/overlay.tsx', 'tokens.stylex.ts'],
  exports: ['Tooltip'],
  usage: `import { Button, Icon, Tooltip } from '@/ui/components';

<Tooltip trigger={<Button iconOnly aria-label="Copy link"><Icon name="link" /></Button>}>
  Copy link
</Tooltip>`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode },
    { id: 'placements', title: 'Placements', description: 'Four sides; the tooltip flips when the side has no room.', Component: Placements, code: placementsCode },
    { id: 'tones', title: 'Tones', description: '`contrast` inverts the page, `subtle` is a quiet chip with a hairline, `accent` uses the primary fill.', Component: Tones, code: tonesCode },
    { id: 'grouped', title: 'Grouped tooltips', description: 'Once one tooltip is showing, its neighbors open at once as the pointer moves along.', Component: Grouped, code: groupedCode },
    { id: 'delay', title: 'Delay', description: '`delay` sets the hover wait and `closeDelay` how long it stays; keyboard focus always opens at once.', Component: Delay, code: delayCode },
    { id: 'controlled', title: 'Controlled and disabled', description: 'Control the open state with `isOpen`, and switch tooltips off with `isDisabled`.', Component: Controlled, code: controlledCode },
  ],
  api: [
    {
      name: 'Tooltip',
      description: 'A trigger and the tooltip that describes it.',
      props: [
        { name: 'trigger', type: 'ReactNode', required: true, description: 'The control the tooltip describes: a Button or any focusable element.' },
        { name: 'children', type: 'ReactNode', required: true, description: 'The tooltip text. Keep it short and non-interactive.' },
        { name: 'tone', type: "'contrast' | 'subtle' | 'accent'", default: "'contrast'", description: 'The fill.' },
        { name: 'placement', type: "'top' | 'right' | 'bottom' | 'left'", default: "'top'", description: 'The side of the trigger it opens on.' },
        { name: 'offset', type: 'number', default: '6', description: 'Distance from the trigger in px.' },
        { name: 'crossOffset', type: 'number', description: 'Shift along the trigger’s edge, in px.' },
        { name: 'delay', type: 'number', default: '250', description: 'Milliseconds of hover before it opens.' },
        { name: 'closeDelay', type: 'number', default: '100', description: 'Milliseconds before it closes after the pointer leaves.' },
        { name: 'isDisabled', type: 'boolean', default: 'false', description: 'Never show the tooltip.' },
        { name: 'focusOnly', type: 'boolean', default: 'false', description: 'Open on keyboard focus only, not on hover.' },
        { name: 'showArrow', type: 'boolean', default: 'true', description: 'Draw the arrow that points at the trigger.' },
        { name: 'isOpen', type: 'boolean', description: 'Whether the tooltip is open, controlled.' },
        { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Whether the tooltip starts open, uncontrolled.' },
        { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the tooltip opens or closes.' },
        { name: 'className', type: 'string', description: 'Classes for the tooltip.' },
        { name: 'style', type: 'CSSProperties', description: 'Inline styles for the tooltip.' },
        { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'The tooltip element.' },
      ],
    },
  ],
  accessibility: [
    'The tooltip has `role="tooltip"` and is linked to its trigger with `aria-describedby` while it shows.',
    'It opens on hover after `delay` and at once on keyboard focus; Escape and pressing the trigger close it.',
    'A tooltip describes; it never names. An icon-only trigger still needs its own `aria-label`.',
    'Content is text only: people cannot move into a tooltip, so links and buttons belong in a Popover.',
    'Under reduced motion the tooltip fades without moving or scaling.',
  ],
});
