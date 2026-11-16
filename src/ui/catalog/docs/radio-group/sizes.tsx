import * as stylex from '@stylexjs/stylex';
import { RadioGroup } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'flex', flexWrap: 'wrap', gap: t['--os-space-10'] },
});

const density = [
  { value: 'compact', label: 'Compact' },
  { value: 'comfortable', label: 'Comfortable' },
];

export default function RadioGroupSizes() {
  return (
    <div {...stylex.props(s.row)}>
      <RadioGroup size="sm" label="Small" defaultValue="compact" options={density} />
      <RadioGroup size="md" label="Medium" defaultValue="compact" options={density} />
      <RadioGroup size="lg" label="Large" defaultValue="compact" options={density} />
    </div>
  );
}
