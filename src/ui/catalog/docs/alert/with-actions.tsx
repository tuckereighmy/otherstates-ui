import * as stylex from '@stylexjs/stylex';
import { Alert, Button } from '../../../components';

const s = stylex.create({
  root: { width: 560, maxWidth: '100%' },
});

export default function AlertWithActions() {
  return (
    <div {...stylex.props(s.root)}>
      <Alert
        tone="warning"
        heading="Your trial ends in 3 days"
        action={
          <>
            <Button appearance="tertiary" size="sm">Later</Button>
            <Button size="sm">Choose a plan</Button>
          </>
        }
      >
        Pick a plan to keep your projects and history.
      </Alert>
    </div>
  );
}
