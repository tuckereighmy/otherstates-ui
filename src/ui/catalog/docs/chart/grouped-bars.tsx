import * as stylex from '@stylexjs/stylex';
import { BarChart } from '../../../components';

const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

const s = stylex.create({
  root: { width: 640, maxWidth: '100%' },
});

export default function ChartGroupedBars() {
  return (
    <div {...stylex.props(s.root)}>
      <BarChart
        aria-label="New and returning customers per quarter"
        labels={quarters}
        series={[
          { id: 'new', label: 'New', values: [320, 410, 380, 470] },
          { id: 'returning', label: 'Returning', values: [540, 590, 640, 720] },
        ]}
      />
    </div>
  );
}
