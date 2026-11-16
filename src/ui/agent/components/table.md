# Table

Make structured information easy to compare across rows.

Category: Layout · Exports: `Table`, `TableHead`, `TableBody`, `TableFooter`, `TableRow`, `TableColumnHeader`, `TableCell`, `TableCaption`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import {
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
</Table>
```

## Table

The table and its scrolling wrapper. `className`, `style` and `ref` go to the `<table>`.

Extends: <table> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `caption` | `ReactNode` |  | A note under the table, 12/16 `fg-muted`. It is also the accessible caption. |
| `density` | `'comfortable' \| 'compact'` | `'comfortable'` | Header 40 and rows 48, or header 32 and rows 36. |
| `variant` | `'filled' \| 'outline' \| 'plain'` | `'filled'` | `filled` for bg-subtle sections, `outline` adds a hairline for canvas, `plain` has no wrapper surface. |
| `stickyHeader` | `boolean` | `false` | Keeps the header row in view while the body scrolls. Pair it with `maxHeight`. |
| `maxHeight` | `CSSProperties['maxHeight']` |  | The wrapper’s maximum height. Taller content scrolls inside it. |

## TableHead

The header rows. Their rows have no hover.

Extends: <thead> attributes

## TableBody

The body rows. Rows fill with `bg-subtle` on hover.

Extends: <tbody> attributes

## TableFooter

Totals or a summary under the body. Its cells are 500 with a hairline above.

Extends: <tfoot> attributes

## TableRow

Extends: <tr> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `isSelected` | `boolean` | `false` | Fills the row with `bg-muted` and sets `data-selected`. Pair it with a checkbox in the row. |

## TableColumnHeader

A header cell (`th scope="col"`), 12/16 500 `fg-muted`.

Extends: <th> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `sortDirection` | `'ascending' \| 'descending'` |  | The column’s current sort. Sets `aria-sort` and the arrow icon. |
| `onSort` | `() => void` |  | Makes the header a sort button and is called when it is pressed. |

## TableCell

A body or footer cell, 13/20 `fg-base`.

Extends: <td> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `wrap` | `'wrap' \| 'nowrap' \| 'truncate'` | `'wrap'` | Lets text wrap, keeps it on one line, or cuts it off with an ellipsis. |

## TableCaption

The caption element, for custom caption content. Place it first inside `Table`.

Extends: <caption> attributes

## Accessibility

- Renders a native `table`, so screen readers announce rows, columns and header cells.
- Name the table with `aria-label`, `aria-labelledby` or a `caption`.
- Header cells are `th scope="col"`. A sorted column sets `aria-sort`; its sort button is a native `button` reached with Tab.
- Row selection is carried by the checkboxes, each with its own `aria-label`; `isSelected` only styles the row.
- A wide table scrolls sideways inside its wrapper instead of widening the page.

## Examples

### Default

`src/ui/catalog/docs/table/default.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Table, TableBody, TableCell, TableColumnHeader, TableHead, TableRow } from '../../../components';

const invoices = [
  { id: 'INV-012', project: 'Office redesign', amount: '$480.00' },
  { id: 'INV-013', project: 'Spring campaign', amount: '$1,200.00' },
  { id: 'INV-014', project: 'Website audit', amount: '$960.00' },
];

const s = stylex.create({
  root: { width: 440, maxWidth: '100%' },
});

export default function TableDefault() {
  return (
    <div {...stylex.props(s.root)}>
      <Table aria-label="Invoices">
        <TableHead>
          <TableRow>
            <TableColumnHeader>Invoice</TableColumnHeader>
            <TableColumnHeader>Project</TableColumnHeader>
            <TableColumnHeader alignEnd>Amount</TableColumnHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoices.map(invoice => (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.id}</TableCell>
              <TableCell>{invoice.project}</TableCell>
              <TableCell alignEnd>{invoice.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

### Compact

`density="compact"` sets a 32px header and 36px rows for dense views.

`src/ui/catalog/docs/table/compact.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Table, TableBody, TableCell, TableColumnHeader, TableHead, TableRow } from '../../../components';

const deployments = [
  { id: 'd-311', branch: 'main', duration: '48s' },
  { id: 'd-310', branch: 'pricing-copy', duration: '52s' },
  { id: 'd-309', branch: 'main', duration: '47s' },
  { id: 'd-308', branch: 'search-fix', duration: '1m 04s' },
];

const s = stylex.create({
  root: { width: 440, maxWidth: '100%' },
});

export default function TableCompact() {
  return (
    <div {...stylex.props(s.root)}>
      <Table aria-label="Deployments" density="compact">
        <TableHead>
          <TableRow>
            <TableColumnHeader>Deployment</TableColumnHeader>
            <TableColumnHeader>Branch</TableColumnHeader>
            <TableColumnHeader alignEnd>Duration</TableColumnHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {deployments.map(deployment => (
            <TableRow key={deployment.id}>
              <TableCell>{deployment.id}</TableCell>
              <TableCell>{deployment.branch}</TableCell>
              <TableCell alignEnd>{deployment.duration}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

### Sortable column

Pass `onSort` and `sortDirection` to turn a header into a sort button.

`src/ui/catalog/docs/table/sortable.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Table, TableBody, TableCell, TableColumnHeader, TableHead, TableRow } from '../../../components';

type SortDirection = 'ascending' | 'descending';

const invoices = [
  { id: 'INV-012', status: 'Paid', amount: 48 },
  { id: 'INV-013', status: 'Open', amount: 120 },
  { id: 'INV-014', status: 'Paid', amount: 96 },
];

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const s = stylex.create({
  root: { width: 440, maxWidth: '100%' },
});

export default function TableSortable() {
  const [sort, setSort] = useState<SortDirection>();
  const rows = [...invoices].sort((a, b) => (sort === 'descending' ? b.amount - a.amount : sort ? a.amount - b.amount : 0));

  return (
    <div {...stylex.props(s.root)}>
      <Table aria-label="Invoices">
        <TableHead>
          <TableRow>
            <TableColumnHeader>Invoice</TableColumnHeader>
            <TableColumnHeader>Status</TableColumnHeader>
            <TableColumnHeader alignEnd sortDirection={sort} onSort={() => setSort(sort === 'ascending' ? 'descending' : 'ascending')}>
              Amount
            </TableColumnHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(invoice => (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.id}</TableCell>
              <TableCell>{invoice.status}</TableCell>
              <TableCell alignEnd>{currency.format(invoice.amount)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

### Row selection

A checkbox column with `isSelected` on each row, and a header checkbox that selects all.

`src/ui/catalog/docs/table/selection.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Checkbox, Table, TableBody, TableCell, TableColumnHeader, TableHead, TableRow } from '../../../components';

const members = [
  { id: 'ana', name: 'Ana', role: 'Owner' },
  { id: 'jonas', name: 'Jonas', role: 'Editor' },
  { id: 'priya', name: 'Priya', role: 'Viewer' },
];

const s = stylex.create({
  root: { width: 440, maxWidth: '100%' },
  check: { width: 48 },
});

export default function TableSelection() {
  const [selected, setSelected] = useState(new Set(['jonas']));
  const toggle = (id: string, on: boolean) => {
    const next = new Set(selected);
    if (on) next.add(id); else next.delete(id);
    setSelected(next);
  };

  return (
    <div {...stylex.props(s.root)}>
      <Table aria-label="Members">
        <TableHead>
          <TableRow>
            <TableColumnHeader {...stylex.props(s.check)}>
              <Checkbox
                aria-label="Select all members"
                isSelected={selected.size === members.length}
                isIndeterminate={selected.size > 0 && selected.size < members.length}
                onChange={on => setSelected(new Set(on ? members.map(m => m.id) : []))}
              />
            </TableColumnHeader>
            <TableColumnHeader>Name</TableColumnHeader>
            <TableColumnHeader>Role</TableColumnHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {members.map(member => (
            <TableRow key={member.id} isSelected={selected.has(member.id)}>
              <TableCell>
                <Checkbox aria-label={`Select ${member.name}`} isSelected={selected.has(member.id)} onChange={on => toggle(member.id, on)} />
              </TableCell>
              <TableCell>{member.name}</TableCell>
              <TableCell>{member.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

### Footer and caption

`TableFooter` holds totals under a hairline; `caption` adds a note under the table.

`src/ui/catalog/docs/table/footer.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Table, TableBody, TableCell, TableColumnHeader, TableFooter, TableHead, TableRow } from '../../../components';

const items = [
  { name: 'Design review', hours: 6, amount: '$540.00' },
  { name: 'Prototype', hours: 14, amount: '$1,260.00' },
  { name: 'Usability tests', hours: 8, amount: '$720.00' },
];

const s = stylex.create({
  root: { width: 440, maxWidth: '100%' },
});

export default function TableWithFooter() {
  return (
    <div {...stylex.props(s.root)}>
      <Table caption="Hours billed for the office redesign in May.">
        <TableHead>
          <TableRow>
            <TableColumnHeader>Item</TableColumnHeader>
            <TableColumnHeader alignEnd>Hours</TableColumnHeader>
            <TableColumnHeader alignEnd>Amount</TableColumnHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map(item => (
            <TableRow key={item.name}>
              <TableCell>{item.name}</TableCell>
              <TableCell alignEnd>{item.hours}</TableCell>
              <TableCell alignEnd>{item.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell alignEnd>28</TableCell>
            <TableCell alignEnd>$2,520.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
```

### Wrapping and truncation

Text wraps by default. Set `wrap="nowrap"` to keep a cell on one line, or `wrap="truncate"` to cut it off.

`src/ui/catalog/docs/table/wrapping.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Table, TableBody, TableCell, TableColumnHeader, TableHead, TableRow } from '../../../components';

const notes = [
  { id: 'n-1', title: 'Kickoff', summary: 'Agreed on scope, owners and the review date for the first milestone.', updated: 'May 2' },
  { id: 'n-2', title: 'Pricing research', summary: 'Compared three plan structures and picked usage-based seats for the pilot.', updated: 'May 9' },
];

const s = stylex.create({
  root: { width: 480, maxWidth: '100%' },
});

export default function TableWrapping() {
  return (
    <div {...stylex.props(s.root)}>
      <Table aria-label="Notes">
        <TableHead>
          <TableRow>
            <TableColumnHeader>Note</TableColumnHeader>
            <TableColumnHeader>Summary</TableColumnHeader>
            <TableColumnHeader alignEnd>Updated</TableColumnHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {notes.map(note => (
            <TableRow key={note.id}>
              <TableCell>{note.title}</TableCell>
              <TableCell wrap="truncate">{note.summary}</TableCell>
              <TableCell alignEnd wrap="nowrap">{note.updated}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

### Sticky header

With `maxHeight` the body scrolls inside the table, and `stickyHeader` keeps the header in view.

`src/ui/catalog/docs/table/sticky-header.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Table, TableBody, TableCell, TableColumnHeader, TableHead, TableRow } from '../../../components';

const events = Array.from({ length: 12 }, (_, index) => ({
  id: `evt-${120 - index}`,
  action: index % 3 === 0 ? 'Deploy finished' : index % 3 === 1 ? 'Member invited' : 'Domain verified',
  time: `${9 + Math.floor(index / 2)}:${index % 2 ? '30' : '05'}`,
}));

const s = stylex.create({
  root: { width: 440, maxWidth: '100%' },
});

export default function TableStickyHeader() {
  return (
    <div {...stylex.props(s.root)}>
      <Table aria-label="Activity" stickyHeader maxHeight={232}>
        <TableHead>
          <TableRow>
            <TableColumnHeader>Event</TableColumnHeader>
            <TableColumnHeader>Action</TableColumnHeader>
            <TableColumnHeader alignEnd>Time</TableColumnHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map(event => (
            <TableRow key={event.id}>
              <TableCell>{event.id}</TableCell>
              <TableCell>{event.action}</TableCell>
              <TableCell alignEnd>{event.time}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

### Outline

`variant="outline"` adds a hairline so the table keeps its edge on a canvas background.

`src/ui/catalog/docs/table/outline.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Badge, Table, TableBody, TableCell, TableColumnHeader, TableHead, TableRow } from '../../../components';

const projects = [
  { name: 'Office redesign', owner: 'Lena', status: 'Active' },
  { name: 'Spring campaign', owner: 'Omar', status: 'Paused' },
  { name: 'Website audit', owner: 'Ines', status: 'Active' },
];

const s = stylex.create({
  root: { width: 440, maxWidth: '100%' },
});

export default function TableOutline() {
  return (
    <div {...stylex.props(s.root)}>
      <Table aria-label="Projects" variant="outline">
        <TableHead>
          <TableRow>
            <TableColumnHeader>Project</TableColumnHeader>
            <TableColumnHeader>Owner</TableColumnHeader>
            <TableColumnHeader>Status</TableColumnHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {projects.map(project => (
            <TableRow key={project.name}>
              <TableCell>{project.name}</TableCell>
              <TableCell>{project.owner}</TableCell>
              <TableCell>
                <Badge variant={project.status === 'Active' ? 'success' : 'secondary'} size="sm">{project.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

### In a card

A `plain` table inside `CardPanel` runs to the card’s edges.

`src/ui/catalog/docs/table/in-card.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Card, CardPanel, Table, TableBody, TableCell, TableColumnHeader, TableHead, TableRow } from '../../../components';

const invoices = [
  { id: 'INV-041', project: 'Office redesign', amount: '$1,240.00' },
  { id: 'INV-042', project: 'Spring campaign', amount: '$380.00' },
  { id: 'INV-043', project: 'Website audit', amount: '$2,015.50' },
];

const s = stylex.create({
  root: { width: 480, maxWidth: '100%' },
});

export default function TableInCard() {
  return (
    <div {...stylex.props(s.root)}>
      <Card heading="Recent invoices" description="Issued in the last 30 days">
        <CardPanel>
          <Table aria-label="Recent invoices" variant="plain">
            <TableHead>
              <TableRow>
                <TableColumnHeader>Invoice</TableColumnHeader>
                <TableColumnHeader>Project</TableColumnHeader>
                <TableColumnHeader alignEnd>Amount</TableColumnHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map(invoice => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.id}</TableCell>
                  <TableCell>{invoice.project}</TableCell>
                  <TableCell alignEnd>{invoice.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardPanel>
      </Card>
    </div>
  );
}
```

### In a frame

A `plain` table on a Frame panel, under the frame’s title.

`src/ui/catalog/docs/table/in-frame.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Frame, Table, TableBody, TableCell, TableColumnHeader, TableHead, TableRow } from '../../../components';

const domains = [
  { name: 'notes.example.com', status: 'Verified' },
  { name: 'docs.example.com', status: 'Pending' },
];

const s = stylex.create({
  root: { width: 480, maxWidth: '100%' },
});

export default function TableInFrame() {
  return (
    <div {...stylex.props(s.root)}>
      <Frame title="Domains" description="Point a CNAME record at your project to add one.">
        <Table aria-label="Domains" variant="plain">
          <TableHead>
            <TableRow>
              <TableColumnHeader>Domain</TableColumnHeader>
              <TableColumnHeader alignEnd>Status</TableColumnHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {domains.map(domain => (
              <TableRow key={domain.name}>
                <TableCell>{domain.name}</TableCell>
                <TableCell alignEnd>{domain.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Frame>
    </div>
  );
}
```
