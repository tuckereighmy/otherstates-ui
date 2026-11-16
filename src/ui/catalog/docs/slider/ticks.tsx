import * as stylex from '@stylexjs/stylex';
import { Slider } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function SliderTicks() {
  return (
    <div {...stylex.props(s.root)}>
      <Slider label="Volume" hideLabel appearance="ticks" defaultValue={50} />
    </div>
  );
}
