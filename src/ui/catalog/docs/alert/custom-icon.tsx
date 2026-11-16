import * as stylex from '@stylexjs/stylex';
import { Alert, Icon } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-3'], width: 380, maxWidth: '100%' },
});

export default function AlertCustomIcon() {
  return (
    <div {...stylex.props(s.root)}>
      <Alert tone="info" icon={<Icon name="sparkle" size={16} />} heading="Smart replies">
        Suggested answers now appear under each thread.
      </Alert>
      <Alert tone="info" icon={null} heading="No icon">
        Pass null to leave the icon out.
      </Alert>
    </div>
  );
}
