import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Kinds from './kinds';
import kindsCode from './kinds.tsx?raw';
import DiffStat from './diff-stat';
import diffStatCode from './diff-stat.tsx?raw';
import DiffView from './diff-view';
import diffViewCode from './diff-view.tsx?raw';

export default defineDoc({
  id: "diff",
  title: "Diff",
  category: 'Agents',
  description: "Show what an agent changed: line counts, changed files and changed lines.",
  source: ["components/diff.tsx", "components/Icon.tsx", "components/internal/class-name.ts", "components/internal/sr-only.tsx", "tokens.stylex.ts"],
  exports: ["DiffStat", "FileChanges", "FileChange", "DiffView", "DiffLine", "FileChangeKind"],
  usage: `import { FileChange, FileChanges } from '@/ui/components';

<FileChanges aria-label="Changed files">
  <FileChange path="src/billing/plans.ts" added={12} removed={4} />
</FileChanges>`,
  examples: [
    { id: "default", title: "Default", Component: Default, code: defaultCode },
    { id: "kinds", title: "New, deleted and renamed", description: "`kind` names a file that is new, deleted or renamed; a modified file shows only its counts.", Component: Kinds, code: kindsCode },
    { id: "diff-stat", title: "Line counts", description: "`DiffStat` alone, for a summary line or a table cell.", Component: DiffStat, code: diffStatCode },
    { id: "diff-view", title: "Changed lines", description: "`DiffView` shows the lines themselves, with signs and numbers. Long lines scroll sideways.", Component: DiffView, code: diffViewCode, align: "stretch" },
  ],
  api: [
    {
      name: "FileChanges",
      description: "A list of changed files.",
      extends: "<ul> attributes",
      props: [
        { name: "aria-label", type: "string", description: "Names the list: \"Changed files\"." },
        { name: "children", type: "ReactNode", required: true, description: "`FileChange` elements." },
      ],
    },
    {
      name: "FileChange",
      description: "One changed file: its path and its line counts.",
      extends: "<li> attributes",
      props: [
        { name: "path", type: "string", required: true, description: "The file path. The folder is quieter than the file name." },
        { name: "added", type: "number", description: "Lines added. Shown with `removed`." },
        { name: "removed", type: "number", description: "Lines removed. Shown with `added`." },
        { name: "kind", type: "'added' | 'modified' | 'deleted' | 'renamed'", default: "'modified'", description: "Shows \"New\", \"Deleted\" or \"Renamed\" before the counts." },
        { name: "end", type: "ReactNode", description: "Trailing content after the counts." },
      ],
    },
    {
      name: "DiffStat",
      description: "\"+18 \u22123\": lines added and removed.",
      extends: "<span> attributes",
      props: [
        { name: "added", type: "number", required: true, description: "Lines added." },
        { name: "removed", type: "number", required: true, description: "Lines removed." },
      ],
    },
    {
      name: "DiffView",
      description: "Changed lines with their signs and numbers.",
      extends: "<div> attributes",
      props: [
        { name: "lines", type: "DiffLine[]", required: true, description: "Each line's `type` (add, remove or context), `text` and optional `number`." },
        { name: "heading", type: "ReactNode", description: "A header row, usually the file path." },
        { name: "aria-label", type: "string", description: "Names the block when there is no heading." },
      ],
    },
  ],
  accessibility: [
    "`DiffStat` reads as \"18 lines added, 3 removed\"; the signs and colors are hidden from assistive tech.",
    "Each added or removed line in `DiffView` starts with visually hidden \"Added:\" or \"Removed:\".",
    "Line numbers and signs are hidden from assistive tech and from text selection, so copied code is clean.",
    "A truncated path keeps the whole path in its `title`.",
  ],
});
