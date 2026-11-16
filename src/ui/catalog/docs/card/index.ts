import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Outline from './outline';
import outlineCode from './outline.tsx?raw';
import WithFooter from './with-footer';
import withFooterCode from './with-footer.tsx?raw';
import WithAction from './with-action';
import withActionCode from './with-action.tsx?raw';
import WithTable from './with-table';
import withTableCode from './with-table.tsx?raw';
import WithForm from './with-form';
import withFormCode from './with-form.tsx?raw';
import Sizes from './sizes';
import sizesCode from './sizes.tsx?raw';

export default defineDoc({
  id: 'card',
  title: 'Card',
  category: 'Layout',
  description: 'Give a distinct piece of content its own surface.',
  source: ['components/card.tsx', 'components/internal/class-name.ts', 'components/internal/surface.ts', 'tokens.stylex.ts'],
  exports: ['Card', 'CardPanel'],
  usage: `import { Card } from '@/ui/components';

<Card heading="Storage" description="Shared by everyone in the workspace">
  18.4 GB of 50 GB used.
</Card>`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode },
    {
      id: 'outline',
      title: 'Outline',
      description: 'On the canvas, `variant="outline"` adds the hairline a filled card has no need for on a subtle section.',
      Component: Outline,
      code: outlineCode,
      stage: 'canvas',
    },
    {
      id: 'with-footer',
      title: 'With footer',
      description: 'The footer holds meta and the card\'s one action. On a filled card it sits behind a hairline; on an outline card it is a bg-subtle strip.',
      Component: WithFooter,
      code: withFooterCode,
      stage: 'canvas',
    },
    {
      id: 'with-action',
      title: 'With header action',
      description: 'The `action` slot sits at the end of the header, centered on the title line.',
      Component: WithAction,
      code: withActionCode,
    },
    {
      id: 'with-table',
      title: 'With a table',
      description: '`CardPanel` cancels the body padding so a table runs to the card edges.',
      Component: WithTable,
      code: withTableCode,
      minHeight: 320,
    },
    {
      id: 'with-form',
      title: 'With a form',
      description: 'A settings card: a field in the body and the form actions in the footer.',
      Component: WithForm,
      code: withFormCode,
      stage: 'canvas',
    },
    {
      id: 'sizes',
      title: 'Sizes',
      description: 'Padding of 16, 20 or 24 px. The radius and the type stay the same.',
      Component: Sizes,
      code: sizesCode,
    },
  ],
  api: [
    {
      name: 'Card',
      description: 'An `<article>` with an optional header, a padded body and an optional footer.',
      extends: '<article> attributes',
      props: [
        { name: 'heading', type: 'ReactNode', description: 'The title, rendered as a heading that also names the article.' },
        { name: 'description', type: 'ReactNode', description: 'A line of supporting text under the heading, in `fg-muted`.' },
        { name: 'action', type: 'ReactNode', description: 'Content at the end of the header, such as a button or a menu trigger.' },
        { name: 'footer', type: 'ReactNode', description: 'A strip at the bottom for meta, totals or the card\'s one action: behind a hairline on a filled card, bg-subtle on an outline card.' },
        { name: 'variant', type: "'filled' | 'outline'", default: "'filled'", description: '`filled` belongs on bg-subtle sections; `outline` adds a 1px `border-subtle` hairline for the canvas.' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'The padding of the header, body and footer: 16, 20 or 24 px. `small`, `medium` and `large` are aliases.' },
        { name: 'headingLevel', type: '1 | 2 | 3 | 4 | 5 | 6', default: '3', description: 'The heading element used for `heading`, so it fits the page outline.' },
        { name: 'children', type: 'ReactNode', description: 'The body, in 14/20 type. It is padded; wrap edge-to-edge content in `CardPanel`.' },
      ],
    },
    {
      name: 'CardPanel',
      description: 'A region of the card body that runs edge to edge, for a table or a list. Place it inside `Card`.',
      extends: '<div> attributes',
      props: [
        { name: 'children', type: 'ReactNode', description: 'The full-bleed content.' },
      ],
    },
  ],
  accessibility: [
    'Renders an `<article>`. When `heading` is set, `aria-labelledby` names the article by it; an `aria-label` you pass wins.',
    'Set `headingLevel` so the card heading fits the page outline. The default is `h3`.',
    'The card itself is not focusable. Interactive content goes in the body, the `action` slot or the footer, in reading order.',
    'A `filled` card has no edge on the canvas. Use `outline` there, so the boundary does not depend on a fill difference.',
  ],
});
