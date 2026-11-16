import * as stylex from '@stylexjs/stylex';
import { Card, Empty, Icon } from '../../../components';

const s = stylex.create({
  root: { width: 420, maxWidth: '100%' },
});

export default function EmptyPlain() {
  return (
    <div {...stylex.props(s.root)}>
      <Card heading="Invoices" description="Billed to the workspace owner">
        <Empty
          variant="plain"
          size="sm"
          headingLevel={4}
          icon={<Icon name="file" />}
          heading="No invoices this month"
          description="Invoices appear here on the 1st."
        />
      </Card>
    </div>
  );
}
