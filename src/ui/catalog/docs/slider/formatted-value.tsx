import * as stylex from '@stylexjs/stylex';
import { Slider } from '../../../components';

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function SliderFormattedValue() {
  return (
    <div {...stylex.props(s.root)}>
      <Slider
        label="Opacity"
        defaultValue={0.8}
        maxValue={1}
        step={0.01}
        formatOptions={{ style: 'percent' }}
      />
    </div>
  );
}
