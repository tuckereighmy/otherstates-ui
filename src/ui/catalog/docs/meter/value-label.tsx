import * as stylex from '@stylexjs/stylex';
import { Meter } from '../../../components';

const s = stylex.create({
  root: { width: 300, maxWidth: '100%' },
});

export default function MeterValueLabel() {
  return (
    <div {...stylex.props(s.root)}>
      <Meter label="Storage used" value={36} maxValue={50} valueLabel="36 of 50 GB" />
    </div>
  );
}
