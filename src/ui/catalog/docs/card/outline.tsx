import * as stylex from '@stylexjs/stylex';
import { Card } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function CardOutline() {
  return (
    <div {...stylex.props(s.root)}>
      <Card
        variant="outline"
        heading="Weekly digest"
        description="Sent every Monday at 9:00"
      >
        A summary of new comments, mentions and finished tasks from the past
        seven days.
      </Card>
    </div>
  );
}
