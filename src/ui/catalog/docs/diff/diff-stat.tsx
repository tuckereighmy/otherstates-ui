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
