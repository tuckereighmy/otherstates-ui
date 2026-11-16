import * as stylex from '@stylexjs/stylex';
import { Alert } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-3'], width: 380, maxWidth: '100%' },
});

export default function AlertTones() {
  return (
    <div {...stylex.props(s.root)}>
      <Alert tone="info" heading="New billing page">
        Invoices now live under Settings.
      </Alert>
      <Alert tone="success" heading="Deployment finished">
        Version 2.4 is live in all regions.
      </Alert>
      <Alert tone="warning" heading="Storage almost full">
        You have used 92% of your plan.
      </Alert>
      <Alert tone="error" heading="Payment failed">
        Update the card on file to keep your projects running.
      </Alert>
    </div>
  );
}
