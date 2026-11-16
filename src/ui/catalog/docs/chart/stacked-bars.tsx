import * as stylex from '@stylexjs/stylex';
import { BarChart } from '../../../components';

const weeks = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'];

const s = stylex.create({
  root: { width: 640, maxWidth: '100%' },
});

export default function ChartStackedBars() {
  return (
    <div {...stylex.props(s.root)}>
      <BarChart
        aria-label="Tickets closed by priority"
        stacked
        labels={weeks}
        series={[
          { id: 'low', label: 'Low', values: [42, 38, 45, 51, 40, 47, 53, 49] },
          { id: 'medium', label: 'Medium', values: [28, 31, 26, 34, 37, 30, 35, 39] },
          { id: 'high', label: 'High', values: [9, 12, 8, 14, 11, 7, 10, 13] },
        ]}
      />
    </div>
  );
}
