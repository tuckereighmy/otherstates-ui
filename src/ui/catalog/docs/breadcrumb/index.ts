import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import CustomSeparator from './custom-separator';
import customSeparatorCode from './custom-separator.tsx?raw';
import WithIcons from './with-icons';
import withIconsCode from './with-icons.tsx?raw';
import Collapsed from './collapsed';
import collapsedCode from './collapsed.tsx?raw';
import RouterLinks from './router-links';
import routerLinksCode from './router-links.tsx?raw';

export default defineDoc({
  id: 'breadcrumb',
  title: 'Breadcrumb',
  category: 'Navigation',
  description: 'Show the path from a parent page to the current view.',
  source: [
    'components/breadcrumb.tsx',
    'components/Icon.tsx',
    'components/internal/overlay.tsx',
    'components/internal/size.ts',
    'components/internal/states.ts',
    'tokens.stylex.ts',
  ],
  exports: ['Breadcrumb', 'BreadcrumbProps', 'BreadcrumbItemData', 'BreadcrumbLinkProps'],
  usage: `import { Breadcrumb } from '@/ui/components';

<Breadcrumb
  items={[
    { label: 'Projects', href: '/projects' },
    { label: 'Website refresh', href: '/projects/website-refresh' },
    { label: 'Settings' },
  ]}
/>`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode },
    {
      id: 'custom-separator',
      title: 'With custom separator',
      description: '`separator` replaces the slash; an `Icon` without a size renders at 14 px.',
      Component: CustomSeparator, code: customSeparatorCode,
    },
    {
      id: 'with-icons',
      title: 'With icons',
      description: 'An item `icon` sits before its label at 16 px.',
      Component: WithIcons, code: withIconsCode,
    },
    {
      id: 'collapsed',
      title: 'Collapsed items',
      description: 'With `maxItems`, the middle of a long trail folds into a button that lists the hidden pages.',
      Component: Collapsed, code: collapsedCode, minHeight: 320,
    },
    {
      id: 'router-links',
      title: 'Router links',
      description: '`linkAs` renders every link with your router’s link component, which receives `href`, `className` and the click handler.',
      Component: RouterLinks, code: routerLinksCode,
    },
  ],
  api: [
    {
      name: 'Breadcrumb',
      description: 'A navigation landmark with an ordered list of steps. The last item is the current page.',
      extends: '<nav> attributes',
      props: [
        { name: 'items', type: 'readonly BreadcrumbItemData[]', required: true, description: 'The trail, from the top level to the current page.' },
        { name: 'label', type: 'string', default: "'Breadcrumb'", description: 'Names the navigation landmark; `aria-label` does the same and wins.' },
        { name: 'separator', type: 'ReactNode', default: "'/'", description: 'What sits between steps, in `fg-subtle` and hidden from assistive tech.' },
        { name: 'maxItems', type: 'number', description: 'Shows the first step and the last `maxItems - 1`; the rest open from a “more” button. At least 2.' },
        { name: 'linkAs', type: 'ElementType<BreadcrumbLinkProps>', default: "'a'", description: 'The component every link renders as, for a router’s link component.' },
        { name: 'moreLabel', type: 'string', default: "'More pages'", description: 'The accessible name of the “more” button and its popup.' },
      ],
    },
    {
      name: 'BreadcrumbItemData',
      description: 'One step in `items`.',
      props: [
        { name: 'label', type: 'string', required: true, description: 'The visible text of the step.' },
        { name: 'href', type: 'string', description: 'Where the step links to. Steps without one, and the last step, render as text.' },
        { name: 'icon', type: 'ReactNode', description: 'An icon before the label; an `Icon` without a size renders at 16 px.' },
      ],
    },
    {
      name: 'BreadcrumbLinkProps',
      description: 'The props a `linkAs` component receives.',
      extends: '<a> attributes',
      props: [
        { name: 'href', type: 'string', required: true, description: 'The step’s destination.' },
      ],
    },
  ],
  accessibility: [
    'Renders a `nav` landmark named “Breadcrumb” (or `label` / `aria-label`) around an ordered list of steps.',
    'The last step is plain text with `aria-current="page"`, not a link.',
    'Separators are `aria-hidden`, so screen readers announce only the steps.',
    'With `maxItems`, the “more” button opens a dialog of the hidden pages; Escape closes it and focus returns to the button.',
    'Links show the 2 px focus ring on keyboard focus and keep a hit area of at least 24 px, 44 px on touch screens.',
  ],
});
