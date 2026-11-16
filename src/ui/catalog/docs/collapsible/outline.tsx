import * as stylex from '@stylexjs/stylex';
import { Collapsible } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function CollapsibleOutline() {
  return (
    <div {...stylex.props(s.root)}>
      <Collapsible variant="outline" title="Release notes" headingLevel={3}>
        Faster project search, a new archive view, and fixes for invoice exports.
      </Collapsible>
    </div>
  );
}
