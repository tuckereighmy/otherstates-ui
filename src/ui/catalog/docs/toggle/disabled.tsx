import * as stylex from '@stylexjs/stylex';
import { Toggle } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: t['--os-space-2'] },
});

export default function ToggleDisabled() {
  return (
    <div {...stylex.props(s.row)}>
      <Toggle isDisabled>Pin note</Toggle>
      <Toggle isDisabled defaultSelected>Show grid</Toggle>
      <Toggle isDisabled variant="outline">Show archived</Toggle>
    </div>
  );
}
