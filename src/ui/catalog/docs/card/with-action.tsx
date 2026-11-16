import * as stylex from '@stylexjs/stylex';
import { Button, Card, Icon } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function CardWithAction() {
  return (
    <div {...stylex.props(s.root)}>
      <Card
        heading="Release notes"
        description="Draft for version 2.4"
        action={
          <Button size="sm" appearance="tertiary" leadingIcon={<Icon name="edit" />}>
            Edit
          </Button>
        }
      >
        Faster search, a new export format and twelve smaller fixes.
      </Card>
    </div>
  );
}
