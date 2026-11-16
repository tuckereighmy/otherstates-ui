import * as stylex from '@stylexjs/stylex';
import { Stat } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'grid', gap: t['--os-space-4'], gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', width: '100%' },
});

export default function StatDefault() {
  return (
    <div {...stylex.props(s.row)}>
      <Stat label="Waiting on you" value="3" unit="decisions" tone="warning" caption="Longest wait 22m" />
      <Stat label="Finished today" value="38" change={{ label: '12%', direction: 'up', against: 'than yesterday' }} trend={[22, 25, 24, 28, 30, 27, 31, 33, 29, 34, 36, 38]} />
      <Stat label="Spend today" value="$18.40" unit="of $40.00" limit={{ value: 18.4, max: 40 }} caption="Resets at midnight" />
    </div>
  );
}
