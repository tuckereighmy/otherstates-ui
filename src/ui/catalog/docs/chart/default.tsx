import * as stylex from '@stylexjs/stylex';
import { LineChart } from '../../../components';

const months = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
const visitors = [3120, 3410, 3290, 3860, 4120, 3980, 4470, 4810, 4630, 5140, 5520, 5890];

const s = stylex.create({
  root: { width: 640, maxWidth: '100%' },
});

export default function ChartDefault() {
  return (
    <div {...stylex.props(s.root)}>
      <LineChart aria-label="Visitors per month" area labels={months} series={[{ id: 'visitors', label: 'Visitors', values: visitors }]} />
    </div>
  );
}
