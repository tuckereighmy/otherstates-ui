import * as stylex from '@stylexjs/stylex';
import { NumberField } from '../../../components';

const s = stylex.create({
  root: { width: 240, maxWidth: '100%' },
});

export default function NumberFieldWithScrub() {
  return (
    <div {...stylex.props(s.root)}>
      <NumberField
        label="Corner radius"
        description="Drag the label left or right."
        defaultValue={12}
        minValue={0}
        maxValue={48}
        scrub
      />
    </div>
  );
}
