'use client';

import * as stylex from '@stylexjs/stylex';
import { BarChart } from '../../../components';

const months = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const s = stylex.create({
  root: { width: 640, maxWidth: '100%' },
});

export default function ChartBar() {
  return (
    <div {...stylex.props(s.root)}>
      <BarChart
        aria-label="Revenue per month"
        labels={months}
        highlight={months.length - 1}
        formatValue={value => currency.format(value)}
        series={[{ id: 'revenue', label: 'Revenue', values: [18200, 19400, 17800, 21000, 22600, 21900, 24100, 25800, 24900, 27400, 28800, 31200] }]}
      />
    </div>
  );
}
