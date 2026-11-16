import * as stylex from '@stylexjs/stylex';
import { Meter } from '../../../components';

const s = stylex.create({
  root: { width: 300, maxWidth: '100%' },
});

export default function MeterFormattedValue() {
  return (
    <div {...stylex.props(s.root)}>
      <Meter
        label="Monthly budget"
        value={1240}
        maxValue={2000}
        formatOptions={{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }}
      />
    </div>
  );
}
