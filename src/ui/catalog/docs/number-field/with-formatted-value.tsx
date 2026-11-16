import * as stylex from '@stylexjs/stylex';
import { NumberField } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-4'], width: 240, maxWidth: '100%' },
});

export default function NumberFieldWithFormattedValue() {
  return (
    <div {...stylex.props(s.root)}>
      <NumberField
        label="Hourly rate"
        defaultValue={85}
        minValue={0}
        formatOptions={{ style: 'currency', currency: 'EUR' }}
      />
      <NumberField
        label="Discount"
        defaultValue={0.15}
        minValue={0}
        maxValue={1}
        step={0.05}
        formatOptions={{ style: 'percent' }}
      />
    </div>
  );
}
