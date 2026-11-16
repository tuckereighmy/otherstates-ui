import * as stylex from '@stylexjs/stylex';
import { NumberField } from '../../../components';

const s = stylex.create({
  root: { width: 240, maxWidth: '100%' },
});

export default function NumberFieldWithStep() {
  return (
    <div {...stylex.props(s.root)}>
      <NumberField
        label="Reminder"
        description="Minutes before the meeting, in steps of 5."
        defaultValue={15}
        minValue={0}
        maxValue={120}
        step={5}
      />
    </div>
  );
}
