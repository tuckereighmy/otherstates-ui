import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import TitleAndDescription from './title-and-description';
import titleAndDescriptionCode from './title-and-description.tsx?raw';
import SeparatedPanels from './separated-panels';
import separatedPanelsCode from './separated-panels.tsx?raw';
import WithFooter from './with-footer';
import withFooterCode from './with-footer.tsx?raw';
import Outline from './outline';
import outlineCode from './outline.tsx?raw';

export default defineDoc({
  id: 'frame',
  title: 'Frame',
  category: 'Layout',
  description: 'Give a group of related elements a visible boundary.',
  source: ['components/frame.tsx', 'components/internal/class-name.ts', 'components/internal/surface.ts', 'tokens.stylex.ts'],
  exports: ['Frame', 'FramePanel'],
  usage: `import { Frame } from '@/ui/components';

<Frame label="Build log">
  Deployed to production in 42 seconds.
</Frame>`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode, stage: 'canvas' },
    {
      id: 'title-and-description',
      title: 'Title and description',
      description: 'A heading, a line of help and actions at the end of the header bar.',
      Component: TitleAndDescription,
      code: titleAndDescriptionCode,
      stage: 'canvas',
    },
    {
      id: 'separated-panels',
      title: 'Separated panels',
      description: 'Several `FramePanel` children sit 8 px apart on one tray.',
      Component: SeparatedPanels,
      code: separatedPanelsCode,
      stage: 'canvas',
      minHeight: 320,
    },
    {
      id: 'with-footer',
      title: 'With footer',
      description: 'A muted bar under the panel for meta such as the last edit.',
      Component: WithFooter,
      code: withFooterCode,
      stage: 'canvas',
    },
    {
      id: 'outline',
      title: 'Outline',
      description: '`variant="outline"` adds a 1 px hairline around the tray. Insets and radii stay the same.',
      Component: Outline,
      code: outlineCode,
      stage: 'canvas',
    },
  ],
  api: [
    {
      name: 'Frame',
      description: 'A bg-subtle tray with an optional header bar, one or more surface panels and an optional footer bar.',
      extends: '<section> attributes (without `title`)',
      props: [
        { name: 'label', type: 'ReactNode', description: 'A short caption at the start of the header bar, in 12/16 `fg-muted`.' },
        { name: 'title', type: 'ReactNode', description: 'The frame title, rendered as a heading in the header bar.' },
        { name: 'description', type: 'ReactNode', description: 'A line of supporting text under the title, in 13/18 `fg-muted`.' },
        { name: 'actions', type: 'ReactNode', description: 'Controls at the end of the header bar.' },
        { name: 'footer', type: 'ReactNode', description: 'A muted bar under the panels.' },
        { name: 'variant', type: "'filled' | 'outline'", default: "'filled'", description: '`filled` is the bare tray; `outline` adds a 1px `border-subtle` hairline.' },
        { name: 'headingLevel', type: '1 | 2 | 3 | 4 | 5 | 6', default: '3', description: 'The heading element used for `title`.' },
        { name: 'children', type: 'ReactNode', description: 'The content of a single panel, or several `FramePanel` elements.' },
      ],
    },
    {
      name: 'FramePanel',
      description: 'One bg-surface panel inside a Frame, radius 8 by the nesting rule. Use several as direct children to separate them.',
      extends: '<div> attributes',
      props: [
        { name: 'children', type: 'ReactNode', description: 'The panel content, padded 16 px.' },
      ],
    },
  ],
  accessibility: [
    'Renders a `<section>` with no landmark role of its own. Give it an `aria-label` only if it should appear as a region.',
    'The `title` is a real heading. Set `headingLevel` so it fits the page outline.',
    '`label` is plain text. Use `title` when the caption should be part of the heading outline.',
    'Separate panels are read in source order. Start a panel with its own heading when it needs a name of its own.',
  ],
});
