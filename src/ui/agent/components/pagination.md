# Pagination

Move between numbered pages of a result set.

Category: Navigation · Exports: `Pagination`, `PaginationProps`, `PaginationLabels`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { Pagination } from '@/ui/components';

<Pagination totalPages={9} defaultPage={2} onPageChange={page => console.log(page)} />
```

## Pagination

A navigation landmark with previous and next controls, page numbers and ellipses. Nothing renders when there are no pages.

Extends: <nav> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `totalPages` (required) | `number` |  | The number of pages; nothing renders when it is 0. |
| `page` | `number` |  | The current page, 1-based (controlled). |
| `defaultPage` | `number` | `1` | The page shown first (uncontrolled). |
| `onPageChange` | `(page: number) => void` |  | Called with the page a reader picks. |
| `getPageHref` | `(page: number) => string` |  | Renders every control as a link to the URL it returns. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'small' \| 'medium' \| 'large'` | `'sm'` | Item height; legacy names map to `sm`, `md` and `lg`. |
| `siblingCount` | `number` | `0` | Pages shown on each side of the current one. |
| `showFirstLast` | `boolean` | `false` | Adds buttons for the first and last page. |
| `controls` | `'icon' \| 'text'` | `'icon'` | `icon` shows chevrons only; `text` adds “Previous” and “Next” beside them. |
| `isDisabled` | `boolean` | `false` | Disables every control. |
| `labels` | `PaginationLabels` |  | Text for the controls, for translation. |

## PaginationLabels

The text Pagination shows or announces. Every key is optional.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `navigation` | `string` | `'Pagination'` | Names the navigation landmark; `aria-label` wins over it. |
| `previous` | `string` | `'Previous page'` | Accessible name of the icon-only previous button. |
| `next` | `string` | `'Next page'` | Accessible name of the icon-only next button. |
| `first` | `string` | `'First page'` | Accessible name of the first-page button. |
| `last` | `string` | `'Last page'` | Accessible name of the last-page button. |
| `previousText` | `string` | `'Previous'` | Visible text of the previous button with `controls="text"`. |
| `nextText` | `string` | `'Next'` | Visible text of the next button with `controls="text"`. |
| `page` | `(page: number) => string` | ``Page ${page}`` | Accessible name of a page button. |

## Accessibility

- Renders a `nav` landmark named “Pagination” (or `labels.navigation` / `aria-label`) around a list of controls.
- Page buttons are named “Page 3” and so on; the current page has `aria-current="page"`.
- Controls that lead nowhere, such as previous on the first page, are disabled: native `disabled` on buttons, `aria-disabled` on links.
- Ellipses are `aria-hidden`; icon-only controls take their names from `labels`.
- Tab moves through the controls, which show the 2 px focus ring on keyboard focus.

## Examples

### Default

`src/ui/catalog/docs/pagination/default.tsx`

```tsx
import { Pagination } from '../../../components';

export default function PaginationDefault() {
  return <Pagination aria-label="Invoice pages" totalPages={9} defaultPage={2} />;
}
```

### Sizes

Items follow the control sizes; sm (32) is the default.

`src/ui/catalog/docs/pagination/sizes.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Pagination } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-4'], justifyItems: 'center' },
});

export default function PaginationSizes() {
  return (
    <div {...stylex.props(s.root)}>
      {sizes.map(size => (
        <Pagination key={size} aria-label={`Pages, size ${size}`} size={size} totalPages={3} defaultPage={2} />
      ))}
    </div>
  );
}
```

### Sibling count

`siblingCount` shows more pages on each side of the current one; an ellipsis always hides two or more.

`src/ui/catalog/docs/pagination/sibling-count.tsx`

```tsx
import { Pagination } from '../../../components';

export default function PaginationSiblingCount() {
  return <Pagination aria-label="Project pages" totalPages={20} defaultPage={10} siblingCount={1} />;
}
```

### First and last

`showFirstLast` adds buttons that jump to either end.

`src/ui/catalog/docs/pagination/first-last.tsx`

```tsx
import { Pagination } from '../../../components';

export default function PaginationFirstLast() {
  return <Pagination aria-label="Activity pages" totalPages={12} defaultPage={6} showFirstLast />;
}
```

### Previous and next with text

With `controls="text"` the ends read “Previous” and “Next” beside their chevrons.

`src/ui/catalog/docs/pagination/text-controls.tsx`

```tsx
import { Pagination } from '../../../components';

export default function PaginationTextControls() {
  return <Pagination aria-label="Note pages" totalPages={9} controls="text" />;
}
```

### Links

`getPageHref` renders every page as a link, so pages can be opened in a new tab or crawled.

`src/ui/catalog/docs/pagination/links.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Pagination } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-3'], justifyItems: 'center' },
  url: { margin: 0, fontSize: tokens['--os-font-size-caption'], lineHeight: tokens['--os-line-height-md'], color: tokens['--os-color-fg-muted'] },
});

export default function PaginationLinks() {
  const [page, setPage] = useState(1);
  const href = (value: number) => `/invoices?page=${value}`;

  return (
    <div {...stylex.props(s.root)} onClick={event => event.preventDefault()}>
      <Pagination aria-label="Invoice pages" totalPages={6} page={page} onPageChange={setPage} getPageHref={href} />
      <p {...stylex.props(s.url)}>Links to {href(page)}</p>
    </div>
  );
}
```

### Controlled

Pass `page` and `onPageChange` to keep the page in your own state.

`src/ui/catalog/docs/pagination/controlled.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Pagination } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const total = 86;
const perPage = 10;

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-3'], justifyItems: 'center' },
  summary: { margin: 0, fontSize: tokens['--os-font-size-caption'], lineHeight: tokens['--os-line-height-md'], color: tokens['--os-color-fg-muted'], fontVariantNumeric: 'tabular-nums' },
});

export default function PaginationControlled() {
  const [page, setPage] = useState(3);
  const first = (page - 1) * perPage + 1;
  const last = Math.min(page * perPage, total);

  return (
    <div {...stylex.props(s.root)}>
      <Pagination aria-label="Deployment pages" totalPages={Math.ceil(total / perPage)} page={page} onPageChange={setPage} />
      <p role="status" {...stylex.props(s.summary)}>Showing {first}–{last} of {total} deployments</p>
    </div>
  );
}
```

### Disabled

`isDisabled` swaps every control to the disabled colors; the current page keeps a disabled fill.

`src/ui/catalog/docs/pagination/disabled.tsx`

```tsx
import { Pagination } from '../../../components';

export default function PaginationDisabled() {
  return <Pagination aria-label="Report pages" totalPages={9} defaultPage={4} isDisabled />;
}
```

### Labels

`labels` translates the landmark name, the control text and the page names.

`src/ui/catalog/docs/pagination/labels.tsx`

```tsx
'use client';

import { Pagination } from '../../../components';

export default function PaginationLabels() {
  return (
    <Pagination
      totalPages={9}
      controls="text"
      labels={{
        navigation: 'Paginación',
        previousText: 'Anterior',
        nextText: 'Siguiente',
        page: page => `Página ${page}`,
      }}
    />
  );
}
```
