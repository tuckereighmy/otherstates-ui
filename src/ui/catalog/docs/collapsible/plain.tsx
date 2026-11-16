import * as stylex from '@stylexjs/stylex';
import { Collapsible } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function CollapsiblePlain() {
  return (
    <div {...stylex.props(s.root)}>
      <Collapsible variant="plain" title="Why was this deploy skipped?">
        No files changed since the last successful deploy, so the previous build was reused.
      </Collapsible>
    </div>
  );
}
