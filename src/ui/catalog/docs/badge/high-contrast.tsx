import * as stylex from '@stylexjs/stylex';
import { Badge } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: t['--os-space-2'] },
});

export default function BadgeHighContrast() {
  return (
    <div {...stylex.props(s.row)}>
      <Badge variant="info" contrast="high">Scheduled</Badge>
      <Badge variant="success" contrast="high">Paid</Badge>
      <Badge variant="warning" contrast="high">Expiring</Badge>
      <Badge variant="error" contrast="high">Failed</Badge>
    </div>
  );
}
