import * as stylex from '@stylexjs/stylex';
import { Badge } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: t['--os-space-2'] },
});

export default function BadgeWithCount() {
  return (
    <div {...stylex.props(s.row)}>
      <Badge variant="secondary" count={12}>Comments</Badge>
      <Badge variant="destructive" count={128}>Unread</Badge>
      <Badge variant="outline" count={1250} max={999}>Open tasks</Badge>
    </div>
  );
}
