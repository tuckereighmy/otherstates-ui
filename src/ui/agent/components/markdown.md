# Markdown

Render an assistant's reply as prose: lists, code, tables and links, built as React elements.

Category: Chat · Exports: `Markdown`, `CodeBlock`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { Markdown } from '@/ui/components';

<Markdown>{reply}</Markdown>
```

## Markdown

Markdown as prose in the system's type, built as React elements.

Extends: <div> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` (required) | `string` |  | The Markdown text. It may be partial while it streams. |
| `size` | `'md' \| 'sm'` | `'md'` | 16/24 text with 16 px between blocks, or 14/20 with 12. |

## CodeBlock

A fenced code block on its own: the language and Copy on top.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `code` (required) | `string` |  | The code. |
| `language` | `string` |  | Shown in the header. Default "Code". |

## Accessibility

- It renders real elements (headings, lists, tables, code), never an HTML string, so a reply cannot inject markup.
- Links open in a new tab only when they leave the site, and only http, https, mailto and in-page links are kept.
- Code blocks are focusable regions, so keyboard users can scroll them; Copy says "Copied" when it works.
- Headings in a reply start at level 3, under the page and the thread.

## Examples

### Default

`src/ui/catalog/docs/markdown/default.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Markdown } from '../../../components';

const reply = `The empty cart crashed because \`summary()\` read \`cart.total\` first.

**Fixed by**
- returning an empty summary for an empty cart
- adding two tests

\`\`\`ts
if (!cart || cart.items.length === 0) return emptySummary;
\`\`\`

| Check | Result |
| --- | --- |
| Unit tests | 214 passed |
| Type check | Clean |`;

const s = stylex.create({ box: { width: '100%', maxWidth: 560, marginInline: 'auto' } });

export default function MarkdownDefault() {
  return <Markdown {...stylex.props(s.box)}>{reply}</Markdown>;
}
```

### Small

`size="sm"` sets 14/20 text with 12 px between blocks, for side panels and cards.

`src/ui/catalog/docs/markdown/small.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { Markdown } from '../../../components';

const s = stylex.create({ box: { width: '100%', maxWidth: 360, marginInline: 'auto' } });

export default function MarkdownSmall() {
  return <Markdown {...stylex.props(s.box)} size="sm">{'**Next steps**\n\n1. Deploy to staging\n2. Check an empty cart\n3. Ship to production'}</Markdown>;
}
```
