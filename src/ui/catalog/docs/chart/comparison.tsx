import * as stylex from '@stylexjs/stylex';
import { LineChart } from '../../../components';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const s = stylex.create({
  root: { width: 640, maxWidth: '100%' },
});

export default function ChartComparison() {
  return (
    <div {...stylex.props(s.root)}>
      <LineChart
        aria-label="Orders, this week against last week"
        area
        labels={days}
        series={[
          { id: 'this-week', label: 'This week', values: [184, 212, 198, 241, 268, 152, 131] },
          { id: 'last-week', label: 'Last week', values: [171, 186, 190, 204, 236, 160, 118], muted: true },
        ]}
      />
    </div>
  );
}
