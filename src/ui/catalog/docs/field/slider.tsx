import * as stylex from '@stylexjs/stylex';
import { Field, Slider } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function FieldSlider() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Storage alert" description="Warn the team when this much of the plan is used.">
        <Slider
          appearance="rail"
          defaultValue={80}
          minValue={50}
          maxValue={95}
          step={5}
          formatOptions={{ style: 'unit', unit: 'percent' }}
        />
      </Field>
    </div>
  );
}
