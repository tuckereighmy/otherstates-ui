import * as stylex from '@stylexjs/stylex';
import { FileChange, FileChanges, Step, Steps } from '../../../components';

const s = stylex.create({ box: { width: '100%', maxWidth: 360 } });

export default function StepsWithContent() {
  return (
    <Steps aria-label="Run steps" {...stylex.props(s.box)}>
      <Step state="done" title="Reproduce the empty-cart error" meta="34s" />
      <Step state="running" title="Patch the checkout form" meta="Editing">
        <FileChanges aria-label="Changed files">
          <FileChange path="src/checkout/cart.ts" added={14} removed={2} />
          <FileChange path="src/checkout/cart.test.ts" added={22} removed={0} kind="added" />
        </FileChanges>
      </Step>
      <Step title="Write the release note" />
    </Steps>
  );
}
