import * as stylex from '@stylexjs/stylex';
import { Step, Steps } from '../../../components';

const s = stylex.create({ box: { width: '100%', maxWidth: 340 } });

export default function StepsDefault() {
  return (
    <Steps aria-label="Run steps" {...stylex.props(s.box)}>
      <Step state="done" title="Read the support ticket" meta="6s" />
      <Step state="done" title="Find the failed payment" meta="21s" />
      <Step state="running" title="Draft a reply" meta="14s" />
      <Step title="Refund the duplicate charge" />
      <Step title="Close the ticket" />
    </Steps>
  );
}
