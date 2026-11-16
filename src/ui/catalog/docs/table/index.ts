import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Compact from './compact';
import compactCode from './compact.tsx?raw';
import Sortable from './sortable';
import sortableCode from './sortable.tsx?raw';
import Selection from './selection';
import selectionCode from './selection.tsx?raw';
import Footer from './footer';
import footerCode from './footer.tsx?raw';
import Wrapping from './wrapping';
import wrappingCode from './wrapping.tsx?raw';
import StickyHeader from './sticky-header';
import stickyHeaderCode from './sticky-header.tsx?raw';
import Outline from './outline';
import outlineCode from './outline.tsx?raw';
import InCard from './in-card';
import inCardCode from './in-card.tsx?raw';
import InFrame from './in-frame';
import inFrameCode from './in-frame.tsx?raw';

const alignEnd = { name: 'alignEnd', type: 'boolean', default: 'false', description: 'End-aligns the cell in tabular figures, for a column of numbers.' };

export default defineDoc({
  id: 'table',
  title: 'Table',
  category: 'Layout',
  description: 'Make structured information easy to compare across rows.',
  source: [
    'components/table.tsx',
    'components/Icon.tsx',
    'components/internal/class-name.ts',
    'components/internal/states.ts',
    'components/internal/surface.ts',
    'tokens.stylex.ts',
  ],
  exports: ['Table', 'TableHead', 'TableBody', 'TableFooter', 'TableRow', 'TableColumnHeader', 'TableCell', 'TableCaption'],
  usage: `import {
  Table,
  TableBody,
  TableCell,
  TableColumnHeader,
  TableHead,
  TableRow,
} from '@/ui/components';

<Table aria-label="Invoices">
  <TableHead>
    <TableRow>
      <TableColumnHeader>Invoice</TableColumnHeader>
      <TableColumnHeader alignEnd>Amount</TableColumnHeader>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableCell>INV-012</TableCell>
      <TableCell alignEnd>$48.00</TableCell>
    </TableRow>
  </TableBody>
</Table>`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode },
    {
      id: 'compact',
      title: 'Compact',
      description: '`density="compact"` sets a 32px header and 36px rows for dense views.',
      Component: Compact,
      code: compactCode,
    },
    {
      id: 'sortable',
      title: 'Sortable column',
      description: 'Pass `onSort` and `sortDirection` to turn a header into a sort button.',
      Component: Sortable,
      code: sortableCode,
    },
    {
      id: 'selection',
      title: 'Row selection',
      description: 'A checkbox column with `isSelected` on each row, and a header checkbox that selects all.',
      Component: Selection,
      code: selectionCode,
    },
    {
      id: 'footer',
      title: 'Footer and caption',
      description: '`TableFooter` holds totals under a hairline; `caption` adds a note under the table.',
      Component: Footer,
      code: footerCode,
      minHeight: 300,
    },
    {
      id: 'wrapping',
      title: 'Wrapping and truncation',
      description: 'Text wraps by default. Set `wrap="nowrap"` to keep a cell on one line, or `wrap="truncate"` to cut it off.',
      Component: Wrapping,
      code: wrappingCode,
    },
    {
      id: 'sticky-header',
      title: 'Sticky header',
      description: 'With `maxHeight` the body scrolls inside the table, and `stickyHeader` keeps the header in view.',
      Component: StickyHeader,
      code: stickyHeaderCode,
      minHeight: 300,
    },
    {
      id: 'outline',
      title: 'Outline',
      description: '`variant="outline"` adds a hairline so the table keeps its edge on a canvas background.',
      Component: Outline,
      code: outlineCode,
      stage: 'canvas',
    },
    {
      id: 'in-card',
      title: 'In a card',
      description: 'A `plain` table inside `CardPanel` runs to the card’s edges.',
      Component: InCard,
      code: inCardCode,
      minHeight: 340,
    },
    {
      id: 'in-frame',
      title: 'In a frame',
      description: 'A `plain` table on a Frame panel, under the frame’s title.',
      Component: InFrame,
      code: inFrameCode,
      stage: 'canvas',
      minHeight: 300,
    },
  ],
  api: [
    {
      name: 'Table',
      description: 'The table and its scrolling wrapper. `className`, `style` and `ref` go to the `<table>`.',
      extends: '<table> attributes',
      props: [
        { name: 'caption', type: 'ReactNode', description: 'A note under the table, 12/16 `fg-muted`. It is also the accessible caption.' },
        { name: 'density', type: "'comfortable' | 'compact'", default: "'comfortable'", description: 'Header 40 and rows 48, or header 32 and rows 36.' },
        { name: 'variant', type: "'filled' | 'outline' | 'plain'", default: "'filled'", description: '`filled` for bg-subtle sections, `outline` adds a hairline for canvas, `plain` has no wrapper surface.' },
        { name: 'stickyHeader', type: 'boolean', default: 'false', description: 'Keeps the header row in view while the body scrolls. Pair it with `maxHeight`.' },
        { name: 'maxHeight', type: "CSSProperties['maxHeight']", description: 'The wrapper’s maximum height. Taller content scrolls inside it.' },
      ],
    },
    { name: 'TableHead', description: 'The header rows. Their rows have no hover.', extends: '<thead> attributes', props: [] },
    { name: 'TableBody', description: 'The body rows. Rows fill with `bg-subtle` on hover.', extends: '<tbody> attributes', props: [] },
    { name: 'TableFooter', description: 'Totals or a summary under the body. Its cells are 500 with a hairline above.', extends: '<tfoot> attributes', props: [] },
    {
      name: 'TableRow',
      extends: '<tr> attributes',
      props: [
        { name: 'isSelected', type: 'boolean', default: 'false', description: 'Fills the row with `bg-muted` and sets `data-selected`. Pair it with a checkbox in the row.' },
      ],
    },
    {
      name: 'TableColumnHeader',
      description: 'A header cell (`th scope="col"`), 12/16 500 `fg-muted`.',
      extends: '<th> attributes',
      props: [
        alignEnd,
        { name: 'sortDirection', type: "'ascending' | 'descending'", description: 'The column’s current sort. Sets `aria-sort` and the arrow icon.' },
        { name: 'onSort', type: '() => void', description: 'Makes the header a sort button and is called when it is pressed.' },
      ],
    },
    {
      name: 'TableCell',
      description: 'A body or footer cell, 13/20 `fg-base`.',
      extends: '<td> attributes',
      props: [
        alignEnd,
        { name: 'wrap', type: "'wrap' | 'nowrap' | 'truncate'", default: "'wrap'", description: 'Lets text wrap, keeps it on one line, or cuts it off with an ellipsis.' },
      ],
    },
    { name: 'TableCaption', description: 'The caption element, for custom caption content. Place it first inside `Table`.', extends: '<caption> attributes', props: [] },
  ],
  accessibility: [
    'Renders a native `table`, so screen readers announce rows, columns and header cells.',
    'Name the table with `aria-label`, `aria-labelledby` or a `caption`.',
    'Header cells are `th scope="col"`. A sorted column sets `aria-sort`; its sort button is a native `button` reached with Tab.',
    'Row selection is carried by the checkboxes, each with its own `aria-label`; `isSelected` only styles the row.',
    'A wide table scrolls sideways inside its wrapper instead of widening the page.',
  ],
});
