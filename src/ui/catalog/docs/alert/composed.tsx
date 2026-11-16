import * as stylex from '@stylexjs/stylex';
import { Alert, AlertDescription, AlertTitle } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { width: 380, maxWidth: '100%' },
  list: { margin: 0, paddingInlineStart: t['--os-space-5'], listStyleType: 'disc' },
});

export default function AlertComposed() {
  return (
    <div {...stylex.props(s.root)}>
      <Alert tone="error">
        <AlertTitle>The invoice could not be sent</AlertTitle>
        <AlertDescription>
          <ul {...stylex.props(s.list)}>
            <li>Add a billing address</li>
            <li>Choose a payment term</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
}
