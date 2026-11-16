import * as stylex from '@stylexjs/stylex';
import { Button, Empty, Icon } from '../../../components';

const s = stylex.create({
  root: { width: 380, maxWidth: '100%' },
});

export default function EmptyDefault() {
  return (
    <div {...stylex.props(s.root)}>
      <Empty
        icon={<Icon name="layers" />}
        heading="No projects yet"
        description="Create a project to start organizing your work."
        action={<Button size="sm">New project</Button>}
      />
    </div>
  );
}
