import * as stylex from '@stylexjs/stylex';
import { Slider } from '../../../components';

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function SliderWithoutLabelAndValue() {
  return (
    <div {...stylex.props(s.root)}>
      <Slider aria-label="Zoom" defaultValue={60} showValue={false} />
    </div>
  );
}
