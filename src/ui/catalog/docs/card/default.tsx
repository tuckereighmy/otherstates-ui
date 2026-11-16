import * as stylex from '@stylexjs/stylex';
import { Card } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function CardDefault() {
  return (
    <div {...stylex.props(s.root)}>
      <Card heading="Storage" description="Shared by everyone in the workspace">
        18.4 GB of 50 GB used. Exports older than 30 days are removed
        automatically.
      </Card>
    </div>
  );
}
