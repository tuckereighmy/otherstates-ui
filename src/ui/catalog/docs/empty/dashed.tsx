import * as stylex from '@stylexjs/stylex';
import { Button, Empty, Icon } from '../../../components';

const s = stylex.create({
  root: { width: 420, maxWidth: '100%' },
});

export default function EmptyDashed() {
  return (
    <div {...stylex.props(s.root)}>
      <Empty
        variant="dashed"
        icon={<Icon name="upload" />}
        heading="Drop receipts here"
        description="PDF, PNG or JPG, up to 10 MB each."
        action={<Button appearance="secondary" size="sm">Choose files</Button>}
      />
    </div>
  );
}
