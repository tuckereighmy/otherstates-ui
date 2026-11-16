import * as stylex from '@stylexjs/stylex';
import { Slider } from '../../../components';

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function SliderDefault() {
  return (
    <div {...stylex.props(s.root)}>
      <Slider label="Volume" defaultValue={40} />
    </div>
  );
}
