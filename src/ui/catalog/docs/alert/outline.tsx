import * as stylex from '@stylexjs/stylex';
import { Alert } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-3'], width: 380, maxWidth: '100%' },
});

export default function AlertOutline() {
  return (
    <div {...stylex.props(s.root)}>
      <Alert variant="outline" heading="Exports are queued">
        We email you a link when the file is ready.
      </Alert>
      <Alert variant="outline" tone="error" heading="Sync stopped">
        Reconnect your calendar to resume.
      </Alert>
    </div>
  );
}
