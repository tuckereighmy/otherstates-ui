import * as stylex from '@stylexjs/stylex';
import { Slider } from '../../../components';

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function SliderDisabled() {
  return (
    <div {...stylex.props(s.root)}>
      <Slider label="Brightness" defaultValue={70} isDisabled />
    </div>
  );
}
