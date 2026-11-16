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
