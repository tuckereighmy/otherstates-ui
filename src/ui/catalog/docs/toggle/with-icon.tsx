import * as stylex from '@stylexjs/stylex';
import { Icon, Toggle } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: t['--os-space-2'] },
});

export default function ToggleWithIcon() {
  return (
    <div {...stylex.props(s.row)}>
      <Toggle>
        <Icon name="star" />
        Star
      </Toggle>
      <Toggle defaultSelected>
        <Icon name="bell" />
        Notify me
      </Toggle>
    </div>
  );
}
