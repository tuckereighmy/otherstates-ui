import * as stylex from '@stylexjs/stylex';
import { Step, Steps } from '../../../components';

const s = stylex.create({ box: { width: '100%', maxWidth: 340 } });

export default function StepsStates() {
  return (
    <Steps aria-label="Step states" {...stylex.props(s.box)}>
      <Step state="done" title="Done" meta="2s" />
      <Step state="running" title="Running" meta="5s" />
      <Step state="needs-input" title="Needs you" detail="Approve sending 1,280 emails" />
      <Step state="failed" title="Failed" detail="The calendar token expired" />
      <Step state="skipped" title="Skipped" />
      <Step title="Pending" />
    </Steps>
  );
}
