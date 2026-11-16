import * as stylex from '@stylexjs/stylex';
import { Step, Steps } from '../../../components';

const s = stylex.create({ box: { width: '100%', maxWidth: 340 } });

export default function StepsNumbered() {
  return (
    <Steps aria-label="Plan" numbered {...stylex.props(s.box)}>
      <Step title="Pull this month's invoices" detail="billing.list" />
      <Step title="Match them to bank payments" detail="ledger.match" />
      <Step title="Flag anything unpaid after 30 days" detail="sheets.write" />
      <Step title="Email the summary to finance" detail="mail.send" />
    </Steps>
  );
}
