import * as stylex from '@stylexjs/stylex';
import { Alert } from '../../../components';

const s = stylex.create({
  root: { width: 380, maxWidth: '100%' },
});

export default function AlertDefault() {
  return (
    <div {...stylex.props(s.root)}>
      <Alert heading="Scheduled maintenance">
        The workspace is read-only on Sunday from 02:00 to 03:00 UTC.
      </Alert>
    </div>
  );
}
