import * as stylex from '@stylexjs/stylex';
import { NumberField } from '../../../components';

const s = stylex.create({
  root: { width: 240, maxWidth: '100%' },
});

export default function NumberFieldWithoutStepper() {
  return (
    <div {...stylex.props(s.root)}>
      <NumberField
        label="Fiscal year"
        defaultValue={2026}
        formatOptions={{ useGrouping: false }}
        hideStepper
      />
    </div>
  );
}
