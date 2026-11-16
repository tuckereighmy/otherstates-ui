import * as stylex from '@stylexjs/stylex';
import { Stat } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'grid', gap: t['--os-space-4'], gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', width: '100%' },
});

export default function StatLimit() {
  return (
    <div {...stylex.props(s.row)}>
      <Stat label="Spend today" value="$34.10" unit="of $40.00" limit={{ value: 34.1, max: 40 }} caption="Runs pause at $40" />
      <Stat label="Seats" value="25" unit="of 25" limit={{ value: 25, max: 25 }} tone="error" caption="Invite more from Billing" />
    </div>
  );
}
