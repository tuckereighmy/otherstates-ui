import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Fade from './fade';
import fadeCode from './fade.tsx?raw';
import Horizontal from './horizontal';
import horizontalCode from './horizontal.tsx?raw';
import Gutter from './gutter';
import gutterCode from './gutter.tsx?raw';
import Both from './both';
import bothCode from './both.tsx?raw';
import Fill from './fill';
import fillCode from './fill.tsx?raw';
import Overscroll from './overscroll';
import overscrollCode from './overscroll.tsx?raw';
import ContentMinWidth from './content-min-width';
import contentMinWidthCode from './content-min-width.tsx?raw';
import Bordered from './bordered';
import borderedCode from './bordered.tsx?raw';

export default defineDoc({
  id: 'scroll-area',
  title: 'Scroll Area',
  category: 'Layout',
  description: 'Let long content scroll inside a bounded region.',
  source: [
    'components/scroll-area.tsx',
    'components/internal/class-name.ts',
    'components/internal/states.ts',
    'components/internal/surface.ts',
    'tokens.stylex.ts',
  ],
  exports: ['ScrollArea'],
  usage: `import { ScrollArea } from '@/ui/components';

<ScrollArea aria-label="Project files" maxHeight={180} padding={6}>
  <ul>
    <li>Project brief</li>
    <li>Audience research</li>
    <li>Interview notes</li>
  </ul>
</ScrollArea>`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode },
    {
      id: 'fade',
      title: 'Scroll fade',
      description: 'With `fade`, content fades out at each edge that has more to scroll to. The fill stays crisp.',
      Component: Fade,
      code: fadeCode,
    },
    {
      id: 'horizontal',
      title: 'Horizontal',
      description: '`orientation="horizontal"` scrolls sideways and clips the other axis.',
      Component: Horizontal,
      code: horizontalCode,
    },
    {
      id: 'gutter',
      title: 'Scrollbar gutter',
      description: 'The default `gutter="stable"` keeps room for the scrollbar, so an area that scrolls lines up with one that does not.',
      Component: Gutter,
      code: gutterCode,
    },
    {
      id: 'both',
      title: 'Both scrollbars',
      description: '`orientation="both"` scrolls a grid that is taller and wider than its area.',
      Component: Both,
      code: bothCode,
      minHeight: 280,
    },
    {
      id: 'fill',
      title: 'Fill a flex column',
      description: 'Set `maxHeight="none"` and let `className` grow the area into the space a flex layout leaves.',
      Component: Fill,
      code: fillCode,
      minHeight: 300,
    },
    {
      id: 'overscroll',
      title: 'Overscroll',
      description: '`overscroll="contain"`, the default, stops at the end; `auto` passes the rest of the scroll to the page.',
      Component: Overscroll,
      code: overscrollCode,
    },
    {
      id: 'content-min-width',
      title: 'Content min-width',
      description: 'Content with a minimum width scrolls sideways on narrow screens instead of squeezing.',
      Component: ContentMinWidth,
      code: contentMinWidthCode,
    },
    {
      id: 'bordered',
      title: 'Bordered',
      description: 'On the canvas, `bordered` adds the 1 px hairline that marks the edge.',
      Component: Bordered,
      code: borderedCode,
      stage: 'canvas',
    },
  ],
  api: [
    {
      name: 'ScrollArea',
      description: 'A bg-surface box, radius 16, around a native scrolling viewport. `className` and `style` go to the box; `ref` and the other props go to the viewport.',
      extends: '<div> attributes',
      props: [
        { name: 'maxHeight', type: 'number | string', default: "160 ('none' when horizontal)", description: 'The height the area grows to before it scrolls.' },
        { name: 'orientation', type: "'vertical' | 'horizontal' | 'both'", default: "'vertical'", description: 'The axes that scroll. The other axis clips.' },
        { name: 'fade', type: 'boolean', default: 'false', description: 'Fades the content out over 24 px at each edge that has more to scroll to.' },
        { name: 'padding', type: 'number | string', description: 'Space between the edge and the content. The content scrolls through it.' },
        { name: 'gutter', type: "'stable' | 'both-edges' | 'auto'", default: "'stable'", description: 'Reserves room for the vertical scrollbar so content does not shift when it appears.' },
        { name: 'overscroll', type: "'contain' | 'auto'", default: "'contain'", description: '`contain` stops a scroll that reaches the end from scrolling the page behind.' },
        { name: 'bordered', type: 'boolean', default: 'false', description: 'Adds a 1px `border-subtle` hairline, for an area that sits straight on the canvas.' },
        { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'The scrolling viewport, so `scrollTo()` and `scrollTop` work.' },
        { name: 'children', type: 'ReactNode', description: 'The content that scrolls.' },
      ],
    },
  ],
  accessibility: [
    'The viewport takes a Tab stop only while its content overflows. Then arrow keys, Page Up, Page Down, Home, End and Space scroll it, and the focus ring shows on the box.',
    'With an `aria-label` or `aria-labelledby` the viewport becomes a `region`, so screen readers can find it and say what scrolls.',
    'Content inside stays in reading order; focusable children scroll into view when they take focus.',
    '`fade` is a static mask that follows the scroll position, with no animation, so it needs no reduced-motion branch.',
  ],
});
