import * as stylex from '@stylexjs/stylex';
import { Badge, Icon } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: t['--os-space-2'] },
});

export default function BadgeWithIcon() {
  return (
    <div {...stylex.props(s.row)}>
      <Badge variant="success" withIcon>Deployed</Badge>
      <Badge variant="warning" withIcon>Needs review</Badge>
      <Badge variant="secondary" icon={<Icon name="clock" />}>Due Friday</Badge>
    </div>
  );
}
