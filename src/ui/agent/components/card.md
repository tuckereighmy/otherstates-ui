# Card

Give a distinct piece of content its own surface.

Category: Layout · Exports: `Card`, `CardPanel`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { Card } from '@/ui/components';

<Card heading="Storage" description="Shared by everyone in the workspace">
  18.4 GB of 50 GB used.
</Card>
```

## Card

An `<article>` with an optional header, a padded body and an optional footer.

Extends: <article> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `heading` | `ReactNode` |  | The title, rendered as a heading that also names the article. |
| `description` | `ReactNode` |  | A line of supporting text under the heading, in `fg-muted`. |
| `action` | `ReactNode` |  | Content at the end of the header, such as a button or a menu trigger. |
| `footer` | `ReactNode` |  | A strip at the bottom for meta, totals or the card's one action: behind a hairline on a filled card, bg-subtle on an outline card. |
| `variant` | `'filled' \| 'outline'` | `'filled'` | `filled` belongs on bg-subtle sections; `outline` adds a 1px `border-subtle` hairline for the canvas. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | The padding of the header, body and footer: 16, 20 or 24 px. `small`, `medium` and `large` are aliases. |
| `headingLevel` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `3` | The heading element used for `heading`, so it fits the page outline. |
| `children` | `ReactNode` |  | The body, in 14/20 type. It is padded; wrap edge-to-edge content in `CardPanel`. |

## CardPanel

A region of the card body that runs edge to edge, for a table or a list. Place it inside `Card`.

Extends: <div> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` |  | The full-bleed content. |

## Accessibility

- Renders an `<article>`. When `heading` is set, `aria-labelledby` names the article by it; an `aria-label` you pass wins.
- Set `headingLevel` so the card heading fits the page outline. The default is `h3`.
- The card itself is not focusable. Interactive content goes in the body, the `action` slot or the footer, in reading order.
- A `filled` card has no edge on the canvas. Use `outline` there, so the boundary does not depend on a fill difference.

## Examples

### Default

`src/ui/catalog/docs/card/default.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Card } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function CardDefault() {
  return (
    <div {...stylex.props(s.root)}>
      <Card heading="Storage" description="Shared by everyone in the workspace">
        18.4 GB of 50 GB used. Exports older than 30 days are removed
        automatically.
      </Card>
    </div>
  );
}
```

### Outline

On the canvas, `variant="outline"` adds the hairline a filled card has no need for on a subtle section.

`src/ui/catalog/docs/card/outline.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Card } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function CardOutline() {
  return (
    <div {...stylex.props(s.root)}>
      <Card
        variant="outline"
        heading="Weekly digest"
        description="Sent every Monday at 9:00"
      >
        A summary of new comments, mentions and finished tasks from the past
        seven days.
      </Card>
    </div>
  );
}
```

### With footer

The footer holds meta and the card's one action. On a filled card it sits behind a hairline; on an outline card it is a bg-subtle strip.

`src/ui/catalog/docs/card/with-footer.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Button, Card } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
  meta: { color: tokens['--os-color-fg-muted'], fontVariantNumeric: 'tabular-nums' },
});

export default function CardWithFooter() {
  return (
    <div {...stylex.props(s.root)}>
      <Card
        variant="outline"
        heading="Team plan"
        description="Billed yearly, renews on March 4"
        footer={
          <>
            <span {...stylex.props(s.meta)}>3 of 5 seats used</span>
            <Button size="sm" appearance="secondary">Add seats</Button>
          </>
        }
      >
        Invite two more people before the renewal date at no extra cost.
      </Card>
    </div>
  );
}
```

### With header action

The `action` slot sits at the end of the header, centered on the title line.

`src/ui/catalog/docs/card/with-action.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Button, Card, Icon } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function CardWithAction() {
  return (
    <div {...stylex.props(s.root)}>
      <Card
        heading="Release notes"
        description="Draft for version 2.4"
        action={
          <Button size="sm" appearance="tertiary" leadingIcon={<Icon name="edit" />}>
            Edit
          </Button>
        }
      >
        Faster search, a new export format and twelve smaller fixes.
      </Card>
    </div>
  );
}
```

### With a table

`CardPanel` cancels the body padding so a table runs to the card edges.

`src/ui/catalog/docs/card/with-table.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import {
  Card,
  CardPanel,
  Table,
  TableBody,
  TableCell,
  TableColumnHeader,
  TableHead,
  TableRow,
} from '../../../components';

const invoices = [
  { id: 'INV-041', project: 'Office redesign', amount: '$1,240.00' },
  { id: 'INV-042', project: 'Spring campaign', amount: '$380.00' },
  { id: 'INV-043', project: 'Website audit', amount: '$2,015.50' },
];

const s = stylex.create({
  root: { width: 480, maxWidth: '100%' },
});

export default function CardWithTable() {
  return (
    <div {...stylex.props(s.root)}>
      <Card heading="Recent invoices" description="Issued in the last 30 days">
        <CardPanel>
          <Table aria-label="Recent invoices">
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

### With a form

A settings card: a field in the body and the form actions in the footer.

`src/ui/catalog/docs/card/with-form.tsx`

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { Button, Card, Field, Input } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  root: { width: 400, maxWidth: '100%' },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: tokens['--os-space-2'], flexGrow: 1 },
});

export default function CardWithForm() {
  return (
    <form {...stylex.props(s.root)} onSubmit={event => event.preventDefault()}>
      <Card
        variant="outline"
        heading="Workspace name"
        description="Shown in the sidebar and in email notifications."
        footer={
          <div {...stylex.props(s.actions)}>
            <Button type="reset" size="sm" appearance="text">Reset</Button>
            <Button type="submit" size="sm">Save</Button>
          </div>
        }
      >
        <Field label="Name">
          <Input name="workspace" defaultValue="Linden studio" />
        </Field>
      </Card>
    </form>
  );
}
```

### Sizes

Padding of 16, 20 or 24 px. The radius and the type stay the same.

`src/ui/catalog/docs/card/sizes.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Card } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const sizes = [
  { size: 'sm', heading: 'Small', padding: '16 px padding' },
  { size: 'md', heading: 'Medium', padding: '20 px padding' },
  { size: 'lg', heading: 'Large', padding: '24 px padding' },
] as const;

const s = stylex.create({
  root: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    alignItems: 'start',
    gap: tokens['--os-space-4'],
    width: 640,
    maxWidth: '100%',
  },
});

export default function CardSizes() {
  return (
    <div {...stylex.props(s.root)}>
      {sizes.map(({ size, heading, padding }) => (
        <Card key={size} size={size} heading={heading}>
          {padding}
        </Card>
      ))}
    </div>
  );
}
```
