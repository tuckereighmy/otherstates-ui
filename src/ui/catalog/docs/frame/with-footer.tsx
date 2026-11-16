import * as stylex from '@stylexjs/stylex';
import { Frame } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function FrameWithFooter() {
  return (
    <div {...stylex.props(s.root)}>
      <Frame label="Meeting notes" footer="Edited 4 minutes ago by Lena">
        Agreed to move the launch review to Thursday and share the draft
        timeline with the support team first.
      </Frame>
    </div>
  );
}
