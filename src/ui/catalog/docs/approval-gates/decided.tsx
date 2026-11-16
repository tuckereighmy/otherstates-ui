import * as stylex from '@stylexjs/stylex';
import { ApprovalGates } from '../../../components';

const s = stylex.create({ box: { width: '100%', maxWidth: 460 } });

export default function ApprovalGatesDecided() {
  return (
    <ApprovalGates
      {...stylex.props(s.box)}
      title="Rotate the signing keys"
      defaultExpanded={[]}
      gates={[
        { id: 'issue', title: 'Issue the new key', meta: 'Ops agent · 4m ago', status: 'approved' },
        { id: 'revoke', title: 'Revoke the old key today', meta: 'Ops agent · 4m ago', status: 'rejected' },
      ]}
    />
  );
}
