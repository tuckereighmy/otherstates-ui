import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Sizes from './sizes';
import sizesCode from './sizes.tsx?raw';
import Dashed from './dashed';
import dashedCode from './dashed.tsx?raw';
import Plain from './plain';
import plainCode from './plain.tsx?raw';
import WithMedia from './with-media';
import withMediaCode from './with-media.tsx?raw';
import NoResults from './no-results';
import noResultsCode from './no-results.tsx?raw';

export default defineDoc({
  id: 'empty',
  title: 'Empty',
  category: 'Feedback',
  description: 'Explain what belongs here and how to get started.',
  source: ['components/empty.tsx', 'components/Icon.tsx', 'components/internal/class-name.ts', 'tokens.stylex.ts'],
  exports: ['Empty'],
  usage: `import { Button, Empty, Icon } from '@/ui/components';

<Empty
  icon={<Icon name="layers" />}
  heading="No projects yet"
  description="Create a project to start organizing your work."
  action={<Button size="sm">New project</Button>}
/>`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode },
    {
      id: 'sizes',
      title: 'Sizes',
      description: 'Padding, tile and type step down for panels and up for full pages.',
      Component: Sizes,
      code: sizesCode,
      minHeight: 320,
    },
    {
      id: 'dashed',
      title: 'Dashed',
      description: 'A dashed edge and no fill, for drop zones and slots waiting for content.',
      Component: Dashed,
      code: dashedCode,
    },
    {
      id: 'plain',
      title: 'Inside a card',
      description: '`variant="plain"` drops the fill so the empty state sits on the surface around it; `headingLevel` fits it into the outline.',
      Component: Plain,
      code: plainCode,
    },
    {
      id: 'with-media',
      title: 'With media',
      description: '`media` shows any content above the heading without the icon tile.',
      Component: WithMedia,
      code: withMediaCode,
    },
    {
      id: 'no-results',
      title: 'No results',
      description: 'An empty search result names the query and offers the way back.',
      Component: NoResults,
      code: noResultsCode,
    },
  ],
  api: [
    {
      name: 'Empty',
      description: 'A centered column with an icon or media, a heading, a description and actions.',
      extends: '<div> attributes',
      props: [
        { name: 'heading', type: 'ReactNode', required: true, description: 'The title, rendered as a heading that also names the group.' },
        { name: 'description', type: 'ReactNode', description: 'One or two lines that say what belongs here and how to start.' },
        { name: 'icon', type: 'ReactNode', description: 'A glyph in a bg-muted tile above the heading. An `Icon` without a size gets 16, 20 or 24 px by `size`.' },
        { name: 'media', type: 'ReactNode', description: 'Content above the heading with no tile, such as avatars or an illustration. Wins over `icon`.' },
        { name: 'action', type: 'ReactNode', description: 'The actions row: one primary action and at most one secondary.' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Padding, tile size and type scale. `md` has 40px above and below.' },
        { name: 'variant', type: "'filled' | 'dashed' | 'plain'", default: "'filled'", description: '`filled` is bg-surface for subtle sections, `dashed` draws a dashed edge, `plain` has neither.' },
        { name: 'headingLevel', type: '1 | 2 | 3 | 4 | 5 | 6', default: '3', description: 'The heading element, so the empty state fits the page outline.' },
        { name: 'children', type: 'ReactNode', description: 'Extra content between the copy and the actions.' },
      ],
    },
  ],
  accessibility: [
    'Renders a `group` named by its heading; pass `aria-label` to name it differently.',
    'The heading is a real `h1`–`h6`. Set `headingLevel` so it follows the headings around it.',
    'The icon tile is decorative and hidden from assistive tech; the heading carries the meaning.',
    'Actions are ordinary buttons or links in the tab order. Keep to one primary action.',
  ],
});
