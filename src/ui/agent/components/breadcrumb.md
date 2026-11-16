# Breadcrumb

Show the path from a parent page to the current view.

Category: Navigation · Exports: `Breadcrumb`, `BreadcrumbProps`, `BreadcrumbItemData`, `BreadcrumbLinkProps`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { Breadcrumb } from '@/ui/components';

<Breadcrumb
  items={[
    { label: 'Projects', href: '/projects' },
    { label: 'Website refresh', href: '/projects/website-refresh' },
    { label: 'Settings' },
  ]}
/>
```

## Breadcrumb

A navigation landmark with an ordered list of steps. The last item is the current page.

Extends: <nav> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` (required) | `readonly BreadcrumbItemData[]` |  | The trail, from the top level to the current page. |
| `label` | `string` | `'Breadcrumb'` | Names the navigation landmark; `aria-label` does the same and wins. |
| `separator` | `ReactNode` | `'/'` | What sits between steps, in `fg-subtle` and hidden from assistive tech. |
| `maxItems` | `number` |  | Shows the first step and the last `maxItems - 1`; the rest open from a “more” button. At least 2. |
| `linkAs` | `ElementType<BreadcrumbLinkProps>` | `'a'` | The component every link renders as, for a router’s link component. |
| `moreLabel` | `string` | `'More pages'` | The accessible name of the “more” button and its popup. |

## BreadcrumbItemData

One step in `items`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` |  | The visible text of the step. |
| `href` | `string` |  | Where the step links to. Steps without one, and the last step, render as text. |
| `icon` | `ReactNode` |  | An icon before the label; an `Icon` without a size renders at 16 px. |

## BreadcrumbLinkProps

The props a `linkAs` component receives.

Extends: <a> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `href` (required) | `string` |  | The step’s destination. |

## Accessibility

- Renders a `nav` landmark named “Breadcrumb” (or `label` / `aria-label`) around an ordered list of steps.
- The last step is plain text with `aria-current="page"`, not a link.
- Separators are `aria-hidden`, so screen readers announce only the steps.
- With `maxItems`, the “more” button opens a dialog of the hidden pages; Escape closes it and focus returns to the button.
- Links show the 2 px focus ring on keyboard focus and keep a hit area of at least 24 px, 44 px on touch screens.

## Examples

### Default

`src/ui/catalog/docs/breadcrumb/default.tsx`

```tsx
import { Breadcrumb } from '../../../components';

export default function BreadcrumbDefault() {
  return (
    <Breadcrumb
      items={[
        { label: 'Projects', href: '#' },
        { label: 'Website refresh', href: '#' },
        { label: 'Settings' },
      ]}
    />
  );
}
```

### With custom separator

`separator` replaces the slash; an `Icon` without a size renders at 14 px.

`src/ui/catalog/docs/breadcrumb/custom-separator.tsx`

```tsx
import { Breadcrumb, Icon } from '../../../components';

export default function BreadcrumbCustomSeparator() {
  return (
    <Breadcrumb
      separator={<Icon name="chevron-right" />}
      items={[
        { label: 'Workspace', href: '#' },
        { label: 'Billing', href: '#' },
        { label: 'Invoices' },
      ]}
    />
  );
}
```

### With icons

An item `icon` sits before its label at 16 px.

`src/ui/catalog/docs/breadcrumb/with-icons.tsx`

```tsx
import { Breadcrumb, Icon } from '../../../components';

export default function BreadcrumbWithIcons() {
  return (
    <Breadcrumb
      items={[
        { label: 'Home', href: '#', icon: <Icon name="home" /> },
        { label: 'Shared files', href: '#', icon: <Icon name="folder" /> },
        { label: 'Floor plan.pdf', icon: <Icon name="file" /> },
      ]}
    />
  );
}
```

### Collapsed items

With `maxItems`, the middle of a long trail folds into a button that lists the hidden pages.

`src/ui/catalog/docs/breadcrumb/collapsed.tsx`

```tsx
import { Breadcrumb } from '../../../components';

export default function BreadcrumbCollapsed() {
  return (
    <Breadcrumb
      maxItems={3}
      items={[
        { label: 'Workspace', href: '#' },
        { label: 'Clients', href: '#' },
        { label: 'Riverside clinic', href: '#' },
        { label: 'Contracts', href: '#' },
        { label: '2026', href: '#' },
        { label: 'Service agreement' },
      ]}
    />
  );
}
```

### Router links

`linkAs` renders every link with your router’s link component, which receives `href`, `className` and the click handler.

`src/ui/catalog/docs/breadcrumb/router-links.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { createContext, useContext, useState } from 'react';
import { Breadcrumb, type BreadcrumbLinkProps } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const Navigate = createContext<(href: string) => void>(() => {});

function RouterLink({ href, onClick, ...props }: BreadcrumbLinkProps) {
  const navigate = useContext(Navigate);
  return (
    <a
      {...props}
      href={href}
      onClick={event => {
        onClick?.(event);
        event.preventDefault();
        navigate(href);
      }}
    />
  );
}

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-3'], justifyItems: 'center' },
  route: { margin: 0, fontSize: tokens['--os-font-size-caption'], lineHeight: tokens['--os-line-height-md'], color: tokens['--os-color-fg-muted'] },
});

export default function BreadcrumbRouterLinks() {
  const [route, setRoute] = useState('/teams/design/members');

  return (
    <Navigate.Provider value={setRoute}>
      <div {...stylex.props(s.root)}>
        <Breadcrumb
          linkAs={RouterLink}
          items={[
            { label: 'Teams', href: '/teams' },
            { label: 'Design', href: '/teams/design' },
            { label: 'Members' },
          ]}
        />
        <p role="status" {...stylex.props(s.route)}>Route: {route}</p>
      </div>
    </Navigate.Provider>
  );
}
```
