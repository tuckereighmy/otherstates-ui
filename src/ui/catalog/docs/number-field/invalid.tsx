import * as stylex from '@stylexjs/stylex';
import { NumberField } from '../../../components';

const s = stylex.create({
  root: { width: 240, maxWidth: '100%' },
});

export default function NumberFieldInvalid() {
  return (
    <div {...stylex.props(s.root)}>
      <NumberField
        label="Licenses"
        description="Seats you pay for each month."
        defaultValue={12}
        isInvalid
        errorMessage="Your plan includes up to 10 licenses."
      />
    </div>
  );
}
