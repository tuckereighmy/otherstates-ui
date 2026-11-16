import * as stylex from '@stylexjs/stylex';
import { Step, Steps } from '../../../components';

const s = stylex.create({ box: { width: '100%', maxWidth: 300 } });

export default function StepsCompact() {
  return (
    <Steps aria-label="Run steps" density="compact" {...stylex.props(s.box)}>
      <Step state="done" title="Collect the survey answers" meta="3s" />
      <Step state="done" title="Group them by theme" meta="11s" />
      <Step state="running" title="Write the summary" />
      <Step title="Share it in the team channel" />
    </Steps>
  );
}
