import * as stylex from '@stylexjs/stylex';
import { Meter } from '../../../components';

const s = stylex.create({
  root: { width: 300, maxWidth: '100%' },
});

export default function MeterWithoutLabelAndValue() {
  return (
    <div {...stylex.props(s.root)}>
      <Meter label="Storage used" value={72} hideLabel showValue={false} />
    </div>
  );
}
