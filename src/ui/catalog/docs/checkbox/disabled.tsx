import * as stylex from '@stylexjs/stylex';
import { Checkbox } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  column: { display: 'grid', gap: t['--os-space-1'] },
});

export default function CheckboxDisabled() {
  return (
    <div {...stylex.props(s.column)}>
      <Checkbox label="Archive closed invoices" isDisabled />
      <Checkbox label="Keep audit log" isDisabled defaultSelected />
    </div>
  );
}
