import * as stylex from '@stylexjs/stylex';
import { Progress } from '../../../components';

const s = stylex.create({
  root: { width: 300, maxWidth: '100%' },
});

export default function ProgressWithLabelAndValue() {
  return (
    <div {...stylex.props(s.root)}>
      <Progress label="Uploading files" value={64} showLabel showValue />
    </div>
  );
}
