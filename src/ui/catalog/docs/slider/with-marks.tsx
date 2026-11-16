import * as stylex from '@stylexjs/stylex';
import { Slider } from '../../../components';

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function SliderWithMarks() {
  return (
    <div {...stylex.props(s.root)}>
      <Slider
        label="Priority"
        defaultValue={50}
        step={50}
        showValue={false}
        marks={[
          { value: 0, label: 'Low' },
          { value: 50, label: 'Normal' },
          { value: 100, label: 'High' },
        ]}
      />
    </div>
  );
}
