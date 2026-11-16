import * as stylex from '@stylexjs/stylex';
import { LineChart } from '../../../components';

const months = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];

const s = stylex.create({
  root: { width: 640, maxWidth: '100%' },
});

export default function ChartMultipleSeries() {
  return (
    <div {...stylex.props(s.root)}>
      <LineChart
        aria-label="Sign-ups by channel"
        labels={months}
        series={[
          { id: 'search', label: 'Search', values: [420, 460, 445, 510, 560, 540, 610, 650, 640, 700, 760, 820] },
          { id: 'referral', label: 'Referral', values: [210, 240, 260, 250, 300, 330, 320, 360, 410, 430, 450, 500] },
          { id: 'social', label: 'Social', values: [160, 150, 190, 210, 200, 240, 260, 250, 230, 280, 300, 290] },
        ]}
      />
    </div>
  );
}
