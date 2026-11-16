import * as stylex from '@stylexjs/stylex';
import { Slider } from '../../../components';

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function SliderRange() {
  return (
    <div {...stylex.props(s.root)}>
      <Slider
        label="Budget"
        defaultValue={[200, 800]}
        maxValue={1000}
        step={10}
        formatOptions={{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }}
      />
    </div>
  );
}
