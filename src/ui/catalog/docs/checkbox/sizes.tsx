import * as stylex from '@stylexjs/stylex';
import { Checkbox } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  column: { display: 'grid', gap: t['--os-space-1'] },
});

export default function CheckboxSizes() {
  return (
    <div {...stylex.props(s.column)}>
      <Checkbox size="sm" label="Small" defaultSelected />
      <Checkbox size="md" label="Medium" defaultSelected />
      <Checkbox size="lg" label="Large" defaultSelected />
    </div>
  );
}
