import * as stylex from '@stylexjs/stylex';
import { Badge } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: t['--os-space-2'] },
});

export default function BadgeStatus() {
  return (
    <div {...stylex.props(s.row)}>
      <Badge variant="info">Scheduled</Badge>
      <Badge variant="success">Paid</Badge>
      <Badge variant="warning">Expiring</Badge>
      <Badge variant="error">Failed</Badge>
    </div>
  );
}
