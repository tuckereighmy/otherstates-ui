import * as stylex from '@stylexjs/stylex';
import { Collapsible } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function CollapsibleDefault() {
  return (
    <div {...stylex.props(s.root)}>
      <Collapsible title="Sharing settings">
        Everyone in the workspace can view this page. Only editors can change it.
      </Collapsible>
    </div>
  );
}
