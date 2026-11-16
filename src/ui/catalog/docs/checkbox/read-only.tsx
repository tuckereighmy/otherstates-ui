import * as stylex from '@stylexjs/stylex';
import { Checkbox } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  column: { display: 'grid', gap: t['--os-space-1'] },
});

export default function CheckboxReadOnly() {
  return (
    <div {...stylex.props(s.column)}>
      <Checkbox label="Two-step sign-in" isReadOnly defaultSelected />
      <Checkbox label="Single sign-on" isReadOnly />
    </div>
  );
}
