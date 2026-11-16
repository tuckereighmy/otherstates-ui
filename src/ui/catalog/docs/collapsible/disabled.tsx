import * as stylex from '@stylexjs/stylex';
import { Collapsible } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function CollapsibleDisabled() {
  return (
    <div {...stylex.props(s.root)}>
      <Collapsible title="Audit log" isDisabled>
        Every change to members, roles and billing from the last 90 days.
      </Collapsible>
    </div>
  );
}
