import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Secondary from './secondary';
import secondaryCode from './secondary.tsx?raw';
import Outline from './outline';
import outlineCode from './outline.tsx?raw';
import Destructive from './destructive';
import destructiveCode from './destructive.tsx?raw';
import Status from './status';
import statusCode from './status.tsx?raw';
import HighContrast from './high-contrast';
import highContrastCode from './high-contrast.tsx?raw';
import Sizes from './sizes';
import sizesCode from './sizes.tsx?raw';
import WithIcon from './with-icon';
import withIconCode from './with-icon.tsx?raw';
import WithLink from './with-link';
import withLinkCode from './with-link.tsx?raw';
import WithCount from './with-count';
import withCountCode from './with-count.tsx?raw';

export default defineDoc({
  id: 'badge',
  title: 'Badge',
  category: 'Feedback',
  description: 'Mark a status or highlight a short label.',
  source: ['components/badge.tsx', 'components/Icon.tsx', 'components/internal/states.ts', 'tokens.stylex.ts'],
  exports: ['Badge'],
  usage: `import { Badge } from '@/ui/components';

<Badge variant="success" withIcon>Paid</Badge>`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode },
    {
      id: 'secondary',
      title: 'Secondary',
      description: 'A quiet neutral fill for labels that sit beside other content.',
      Component: Secondary,
      code: secondaryCode,
    },
    {
      id: 'outline',
      title: 'Outline',
      description: 'A hairline outline and no fill.',
      Component: Outline,
      code: outlineCode,
    },
    {
      id: 'destructive',
      title: 'Destructive',
      description: 'White text on the danger fill, for something that needs action now.',
      Component: Destructive,
      code: destructiveCode,
    },
    {
      id: 'status',
      title: 'Status',
      description: 'The four status tones: `info`, `success`, `warning` and `error`, each on its own tint.',
      Component: Status,
      code: statusCode,
    },
    {
      id: 'high-contrast',
      title: 'High contrast',
      description: '`contrast="high"` fills a status badge with its strong color.',
      Component: HighContrast,
      code: highContrastCode,
    },
    {
      id: 'sizes',
      title: 'Sizes',
      description: 'Heights of 20, 24 and 28 px. `md` is the default.',
      Component: Sizes,
      code: sizesCode,
    },
    {
      id: 'with-icon',
      title: 'With icon',
      description: '`withIcon` adds the status icon; `icon` takes any other icon, sized to the badge.',
      Component: WithIcon,
      code: withIconCode,
    },
    {
      id: 'with-link',
      title: 'With link',
      description: 'With `href`, the badge renders a link with a hover step and a focus ring.',
      Component: WithLink,
      code: withLinkCode,
    },
    {
      id: 'with-count',
      title: 'With count',
      description: '`count` adds a number in tabular figures; counts above `max` show as `max+`.',
      Component: WithCount,
      code: withCountCode,
    },
  ],
  api: [
    {
      name: 'Badge',
      description: 'A short label in the shared control shape (a pill by default): a `<span>`, or an `<a>` when it has an `href`.',
      extends: '<span> attributes',
      props: [
        {
          name: 'variant',
          type: "'neutral' | 'secondary' | 'outline' | 'destructive' | 'success' | 'error' | 'warning' | 'info'",
          default: "'neutral'",
          description: 'Color and weight. Defaults to `status` when one is given.',
        },
        {
          name: 'status',
          type: "'success' | 'error' | 'warning' | 'info'",
          description: 'Same as passing the tone as `variant`; kept for older code. Without children, the tone name is the label.',
        },
        { name: 'contrast', type: "'low' | 'high'", default: "'low'", description: '`high` fills a status badge with its strong color. Status tones only.' },
        {
          name: 'size',
          type: "'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large'",
          default: "'md'",
          description: 'Heights of 20, 24 and 28 px. `small`, `medium` and `large` are aliases.',
        },
        { name: 'withIcon', type: 'boolean', default: 'false', description: 'Shows the status icon before the label. Status tones only; use `icon` otherwise.' },
        { name: 'icon', type: 'ReactNode', description: 'A leading icon. An `Icon` without a size takes the badge\'s icon size: 12, 14 or 14 px.' },
        { name: 'count', type: 'number', description: 'A number after the label, in tabular figures.' },
        { name: 'max', type: 'number', default: '99', description: 'Counts above this show as `max+`.' },
        { name: 'href', type: 'string', description: 'Renders the badge as a link, with a hover step and a focus ring.' },
        { name: 'target', type: 'string', description: 'The link\'s `target`, used with `href`.' },
        { name: 'rel', type: 'string', description: 'The link\'s `rel`, used with `href`.' },
        { name: 'children', type: 'ReactNode', description: 'The label.' },
        { name: 'ref', type: 'Ref<HTMLElement>', description: 'The `<span>`, or the `<a>` with `href`.' },
      ],
    },
  ],
  accessibility: [
    'A badge is plain text, so its label carries the meaning: never rely on the tone color alone. Status icons are decorative.',
    'Status text meets 4.5:1 on its tint in both themes.',
    'A count on its own, such as "12", needs context: keep a label beside it, or put it inside a control whose name explains it.',
    'With `href`, the badge is a link: it joins the tab order, shows the focus ring for keyboard focus and gets a 24px hit area, 44px on touch screens.',
  ],
});
