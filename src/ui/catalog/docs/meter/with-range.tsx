import * as stylex from '@stylexjs/stylex';
import { Meter } from '../../../components';

const s = stylex.create({
  root: { width: 300, maxWidth: '100%' },
});

export default function MeterWithRange() {
  return (
    <div {...stylex.props(s.root)}>
      <Meter label="Seats in use" value={7} minValue={0} maxValue={10} />
    </div>
  );
}
