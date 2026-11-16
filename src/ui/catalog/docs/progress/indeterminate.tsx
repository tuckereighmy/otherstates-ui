import * as stylex from '@stylexjs/stylex';
import { Progress } from '../../../components';

const s = stylex.create({
  root: { width: 300, maxWidth: '100%' },
});

export default function ProgressIndeterminate() {
  return (
    <div {...stylex.props(s.root)}>
      <Progress label="Preparing the export" isIndeterminate showLabel />
    </div>
  );
}
