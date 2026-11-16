import * as stylex from '@stylexjs/stylex';
import { NumberField } from '../../../components';

const s = stylex.create({
  root: { width: 240, maxWidth: '100%' },
});

export default function NumberFieldWithRange() {
  return (
    <div {...stylex.props(s.root)}>
      <NumberField
        label="Team size"
        description="From 1 to 12 people."
        defaultValue={4}
        minValue={1}
        maxValue={12}
      />
    </div>
  );
}
