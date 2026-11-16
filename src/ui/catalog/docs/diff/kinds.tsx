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
