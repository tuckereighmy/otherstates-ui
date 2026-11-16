# Empty

Explain what belongs here and how to get started.

Category: Feedback · Exports: `Empty`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { Button, Empty, Icon } from '@/ui/components';

<Empty
  icon={<Icon name="layers" />}
  heading="No projects yet"
  description="Create a project to start organizing your work."
  action={<Button size="sm">New project</Button>}
/>
```

## Empty

A centered column with an icon or media, a heading, a description and actions.

Extends: <div> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `heading` (required) | `ReactNode` |  | The title, rendered as a heading that also names the group. |
| `description` | `ReactNode` |  | One or two lines that say what belongs here and how to start. |
| `icon` | `ReactNode` |  | A glyph in a bg-muted tile above the heading. An `Icon` without a size gets 16, 20 or 24 px by `size`. |
| `media` | `ReactNode` |  | Content above the heading with no tile, such as avatars or an illustration. Wins over `icon`. |
| `action` | `ReactNode` |  | The actions row: one primary action and at most one secondary. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Padding, tile size and type scale. `md` has 40px above and below. |
| `variant` | `'filled' \| 'dashed' \| 'plain'` | `'filled'` | `filled` is bg-surface for subtle sections, `dashed` draws a dashed edge, `plain` has neither. |
| `headingLevel` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `3` | The heading element, so the empty state fits the page outline. |
| `children` | `ReactNode` |  | Extra content between the copy and the actions. |

## Accessibility

- Renders a `group` named by its heading; pass `aria-label` to name it differently.
- The heading is a real `h1`–`h6`. Set `headingLevel` so it follows the headings around it.
- The icon tile is decorative and hidden from assistive tech; the heading carries the meaning.
- Actions are ordinary buttons or links in the tab order. Keep to one primary action.

## Examples

### Default

`src/ui/catalog/docs/empty/default.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Button, Empty, Icon } from '../../../components';

const s = stylex.create({
  root: { width: 380, maxWidth: '100%' },
});

export default function EmptyDefault() {
  return (
    <div {...stylex.props(s.root)}>
      <Empty
        icon={<Icon name="layers" />}
        heading="No projects yet"
        description="Create a project to start organizing your work."
        action={<Button size="sm">New project</Button>}
      />
    </div>
  );
}
```

### Sizes

Padding, tile and type step down for panels and up for full pages.

`src/ui/catalog/docs/empty/sizes.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Empty, Icon } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const sizes = ['sm', 'md', 'lg'] as const;

const s = stylex.create({
  root: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    alignItems: 'center',
    gap: t['--os-space-4'],
    width: 720,
    maxWidth: '100%',
  },
});

export default function EmptySizes() {
  return (
    <div {...stylex.props(s.root)}>
      {sizes.map(size => (
        <Empty
          key={size}
          size={size}
          icon={<Icon name="inbox" />}
          heading="Inbox zero"
          description="New requests land here."
        />
      ))}
    </div>
  );
}
```

### Dashed

A dashed edge and no fill, for drop zones and slots waiting for content.

`src/ui/catalog/docs/empty/dashed.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Button, Empty, Icon } from '../../../components';

const s = stylex.create({
  root: { width: 420, maxWidth: '100%' },
});

export default function EmptyDashed() {
  return (
    <div {...stylex.props(s.root)}>
      <Empty
        variant="dashed"
        icon={<Icon name="upload" />}
        heading="Drop receipts here"
        description="PDF, PNG or JPG, up to 10 MB each."
        action={<Button appearance="secondary" size="sm">Choose files</Button>}
      />
    </div>
  );
}
```

### Inside a card

`variant="plain"` drops the fill so the empty state sits on the surface around it; `headingLevel` fits it into the outline.

`src/ui/catalog/docs/empty/plain.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Card, Empty, Icon } from '../../../components';

const s = stylex.create({
  root: { width: 420, maxWidth: '100%' },
});

export default function EmptyPlain() {
  return (
    <div {...stylex.props(s.root)}>
      <Card heading="Invoices" description="Billed to the workspace owner">
        <Empty
          variant="plain"
          size="sm"
          headingLevel={4}
          icon={<Icon name="file" />}
          heading="No invoices this month"
          description="Invoices appear here on the 1st."
        />
      </Card>
    </div>
  );
}
```

### With media

`media` shows any content above the heading without the icon tile.

`src/ui/catalog/docs/empty/with-media.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { AvatarGroup, Button, Empty } from '../../../components';

const s = stylex.create({
  root: { width: 380, maxWidth: '100%' },
});

export default function EmptyWithMedia() {
  return (
    <div {...stylex.props(s.root)}>
      <Empty
        media={
          <AvatarGroup
            label="Suggested teammates"
            size="sm"
            items={[
              { name: 'Ines Okafor', fallback: 'gradient' },
              { name: 'Tomas Berg', fallback: 'gradient' },
              { name: 'Mei Tanaka', fallback: 'gradient' },
            ]}
          />
        }
        heading="Invite your team"
        description="Projects are better with a few more people."
        action={
          <>
            <Button appearance="tertiary" size="sm">Copy invite link</Button>
            <Button size="sm">Invite</Button>
          </>
        }
      />
    </div>
  );
}
```

### No results

An empty search result names the query and offers the way back.

`src/ui/catalog/docs/empty/no-results.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, Empty, Icon } from '../../../components';

const s = stylex.create({
  root: { width: 380, maxWidth: '100%' },
});

export default function EmptyNoResults() {
  const [query, setQuery] = useState('quarterly report');

  return (
    <div {...stylex.props(s.root)}>
      <Empty
        icon={<Icon name="search" />}
        heading={query ? `No results for “${query}”` : 'Search your notes'}
        description={query ? 'Check the spelling or try fewer words.' : 'Type a word from the title or body.'}
        action={
          query ? (
            <Button appearance="secondary" size="sm" onClick={() => setQuery('')}>
              Clear search
            </Button>
          ) : null
        }
      />
    </div>
  );
}
```
