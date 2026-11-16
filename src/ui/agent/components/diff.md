# Diff

Show what an agent changed: line counts, changed files and changed lines.

Category: Agents · Exports: `DiffStat`, `FileChanges`, `FileChange`, `DiffView`, `DiffLine`, `FileChangeKind`

Generated from the docs page by src/ui/agent/build-docs.mjs. Rules: src/ui/AGENTS.md.

## Usage

```tsx
import { FileChange, FileChanges } from '@/ui/components';

<FileChanges aria-label="Changed files">
  <FileChange path="src/billing/plans.ts" added={12} removed={4} />
</FileChanges>
```

## FileChanges

A list of changed files.

Extends: <ul> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `aria-label` | `string` |  | Names the list: "Changed files". |
| `children` (required) | `ReactNode` |  | `FileChange` elements. |

## FileChange

One changed file: its path and its line counts.

Extends: <li> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `path` (required) | `string` |  | The file path. The folder is quieter than the file name. |
| `added` | `number` |  | Lines added. Shown with `removed`. |
| `removed` | `number` |  | Lines removed. Shown with `added`. |
| `kind` | `'added' \| 'modified' \| 'deleted' \| 'renamed'` | `'modified'` | Shows "New", "Deleted" or "Renamed" before the counts. |
| `end` | `ReactNode` |  | Trailing content after the counts. |

## DiffStat

"+18 −3": lines added and removed.

Extends: <span> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `added` (required) | `number` |  | Lines added. |
| `removed` (required) | `number` |  | Lines removed. |

## DiffView

Changed lines with their signs and numbers.

Extends: <div> attributes

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `lines` (required) | `DiffLine[]` |  | Each line's `type` (add, remove or context), `text` and optional `number`. |
| `heading` | `ReactNode` |  | A header row, usually the file path. |
| `aria-label` | `string` |  | Names the block when there is no heading. |

## Accessibility

- `DiffStat` reads as "18 lines added, 3 removed"; the signs and colors are hidden from assistive tech.
- Each added or removed line in `DiffView` starts with visually hidden "Added:" or "Removed:".
- Line numbers and signs are hidden from assistive tech and from text selection, so copied code is clean.
- A truncated path keeps the whole path in its `title`.

## Examples

### Default

`src/ui/catalog/docs/diff/default.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { FileChange, FileChanges } from '../../../components';

const s = stylex.create({ box: { width: '100%', maxWidth: 360 } });

export default function DiffDefault() {
  return (
    <FileChanges aria-label="Changed files" {...stylex.props(s.box)}>
      <FileChange path="src/billing/plans.ts" added={12} removed={4} />
      <FileChange path="src/billing/invoice.tsx" added={31} removed={9} />
      <FileChange path="tests/billing/plans.test.ts" added={46} removed={0} />
    </FileChanges>
  );
}
```

### New, deleted and renamed

`kind` names a file that is new, deleted or renamed; a modified file shows only its counts.

`src/ui/catalog/docs/diff/kinds.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { FileChange, FileChanges } from '../../../components';

const s = stylex.create({ box: { width: '100%', maxWidth: 360 } });

export default function DiffKinds() {
  return (
    <FileChanges aria-label="Changed files" {...stylex.props(s.box)}>
      <FileChange path="src/reports/export.ts" added={58} removed={0} kind="added" />
      <FileChange path="src/reports/legacy-csv.ts" added={0} removed={112} kind="deleted" />
      <FileChange path="src/reports/format.ts" added={3} removed={3} kind="renamed" />
    </FileChanges>
  );
}
```

### Line counts

`DiffStat` alone, for a summary line or a table cell.

`src/ui/catalog/docs/diff/diff-stat.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { DiffStat } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  line: { display: 'flex', alignItems: 'baseline', gap: t['--os-space-2'], fontSize: t['--os-font-size-sm'], color: t['--os-color-fg-muted'] },
});

export default function DiffDiffStat() {
  return (
    <p {...stylex.props(s.line)}>
      4 files changed <DiffStat added={89} removed={17} />
    </p>
  );
}
```

### Changed lines

`DiffView` shows the lines themselves, with signs and numbers. Long lines scroll sideways.

`src/ui/catalog/docs/diff/diff-view.tsx`

```tsx
import * as stylex from '@stylexjs/stylex';
import { DiffView, type DiffLine } from '../../../components';

const lines: DiffLine[] = [
  { type: 'context', number: 11, text: 'export const plans = {' },
  { type: 'remove', number: 12, text: "  team: { seat: 12, currency: 'usd' }," },
  { type: 'add', number: 12, text: "  team: { seat: 14, currency: 'usd' }," },
  { type: 'context', number: 13, text: "  free: { seat: 0, currency: 'usd' }," },
  { type: 'context', number: 14, text: '};' },
];

const s = stylex.create({ box: { maxWidth: 480, marginInline: 'auto', width: '100%' } });

export default function DiffDiffView() {
  return <DiffView heading="src/billing/plans.ts" lines={lines} {...stylex.props(s.box)} />;
}
```
