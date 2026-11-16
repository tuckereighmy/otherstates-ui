import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Sizes from './sizes';
import sizesCode from './sizes.tsx?raw';
import SiblingCount from './sibling-count';
import siblingCountCode from './sibling-count.tsx?raw';
import FirstLast from './first-last';
import firstLastCode from './first-last.tsx?raw';
import TextControls from './text-controls';
import textControlsCode from './text-controls.tsx?raw';
import Links from './links';
import linksCode from './links.tsx?raw';
import Controlled from './controlled';
import controlledCode from './controlled.tsx?raw';
import Disabled from './disabled';
import disabledCode from './disabled.tsx?raw';
import Labels from './labels';
import labelsCode from './labels.tsx?raw';

export default defineDoc({
  id: 'pagination',
  title: 'Pagination',
  category: 'Navigation',
  description: 'Move between numbered pages of a result set.',
  source: [
    'components/pagination.tsx',
    'components/Icon.tsx',
    'components/internal/size.ts',
    'components/internal/states.ts',
    'tokens.stylex.ts',
  ],
  exports: ['Pagination', 'PaginationProps', 'PaginationLabels'],
  usage: `import { Pagination } from '@/ui/components';

<Pagination totalPages={9} defaultPage={2} onPageChange={page => console.log(page)} />`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode, stage: 'canvas' },
    {
      id: 'sizes',
      title: 'Sizes',
      description: 'Items follow the control sizes; sm (32) is the default.',
      Component: Sizes, code: sizesCode, stage: 'canvas', minHeight: 320,
    },
    {
      id: 'sibling-count',
      title: 'Sibling count',
      description: '`siblingCount` shows more pages on each side of the current one; an ellipsis always hides two or more.',
      Component: SiblingCount, code: siblingCountCode, stage: 'canvas',
    },
    {
      id: 'first-last',
      title: 'First and last',
      description: '`showFirstLast` adds buttons that jump to either end.',
      Component: FirstLast, code: firstLastCode, stage: 'canvas',
    },
    {
      id: 'text-controls',
      title: 'Previous and next with text',
      description: 'With `controls="text"` the ends read “Previous” and “Next” beside their chevrons.',
      Component: TextControls, code: textControlsCode, stage: 'canvas',
    },
    {
      id: 'links',
      title: 'Links',
      description: '`getPageHref` renders every page as a link, so pages can be opened in a new tab or crawled.',
      Component: Links, code: linksCode, stage: 'canvas',
    },
    {
      id: 'controlled',
      title: 'Controlled',
      description: 'Pass `page` and `onPageChange` to keep the page in your own state.',
      Component: Controlled, code: controlledCode, stage: 'canvas',
    },
    {
      id: 'disabled',
      title: 'Disabled',
      description: '`isDisabled` swaps every control to the disabled colors; the current page keeps a disabled fill.',
      Component: Disabled, code: disabledCode, stage: 'canvas',
    },
    {
      id: 'labels',
      title: 'Labels',
      description: '`labels` translates the landmark name, the control text and the page names.',
      Component: Labels, code: labelsCode, stage: 'canvas',
    },
  ],
  api: [
    {
      name: 'Pagination',
      description: 'A navigation landmark with previous and next controls, page numbers and ellipses. Nothing renders when there are no pages.',
      extends: '<nav> attributes',
      props: [
        { name: 'totalPages', type: 'number', required: true, description: 'The number of pages; nothing renders when it is 0.' },
        { name: 'page', type: 'number', description: 'The current page, 1-based (controlled).' },
        { name: 'defaultPage', type: 'number', default: '1', description: 'The page shown first (uncontrolled).' },
        { name: 'onPageChange', type: '(page: number) => void', description: 'Called with the page a reader picks.' },
        { name: 'getPageHref', type: '(page: number) => string', description: 'Renders every control as a link to the URL it returns.' },
        { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'small' | 'medium' | 'large'", default: "'sm'", description: 'Item height; legacy names map to `sm`, `md` and `lg`.' },
        { name: 'siblingCount', type: 'number', default: '0', description: 'Pages shown on each side of the current one.' },
        { name: 'showFirstLast', type: 'boolean', default: 'false', description: 'Adds buttons for the first and last page.' },
        { name: 'controls', type: "'icon' | 'text'", default: "'icon'", description: '`icon` shows chevrons only; `text` adds “Previous” and “Next” beside them.' },
        { name: 'isDisabled', type: 'boolean', default: 'false', description: 'Disables every control.' },
        { name: 'labels', type: 'PaginationLabels', description: 'Text for the controls, for translation.' },
      ],
    },
    {
      name: 'PaginationLabels',
      description: 'The text Pagination shows or announces. Every key is optional.',
      props: [
        { name: 'navigation', type: 'string', default: "'Pagination'", description: 'Names the navigation landmark; `aria-label` wins over it.' },
        { name: 'previous', type: 'string', default: "'Previous page'", description: 'Accessible name of the icon-only previous button.' },
        { name: 'next', type: 'string', default: "'Next page'", description: 'Accessible name of the icon-only next button.' },
        { name: 'first', type: 'string', default: "'First page'", description: 'Accessible name of the first-page button.' },
        { name: 'last', type: 'string', default: "'Last page'", description: 'Accessible name of the last-page button.' },
        { name: 'previousText', type: 'string', default: "'Previous'", description: 'Visible text of the previous button with `controls="text"`.' },
        { name: 'nextText', type: 'string', default: "'Next'", description: 'Visible text of the next button with `controls="text"`.' },
        { name: 'page', type: '(page: number) => string', default: '`Page ${page}`', description: 'Accessible name of a page button.' },
      ],
    },
  ],
  accessibility: [
    'Renders a `nav` landmark named “Pagination” (or `labels.navigation` / `aria-label`) around a list of controls.',
    'Page buttons are named “Page 3” and so on; the current page has `aria-current="page"`.',
    'Controls that lead nowhere, such as previous on the first page, are disabled: native `disabled` on buttons, `aria-disabled` on links.',
    'Ellipses are `aria-hidden`; icon-only controls take their names from `labels`.',
    'Tab moves through the controls, which show the 2 px focus ring on keyboard focus.',
  ],
});
