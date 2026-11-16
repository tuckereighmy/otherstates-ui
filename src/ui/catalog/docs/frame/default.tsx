import * as stylex from '@stylexjs/stylex';
import { Frame } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function FrameDefault() {
  return (
    <div {...stylex.props(s.root)}>
      <Frame label="Build log">
        Deployed to production in 42 seconds. Three warnings were reported
        during the build.
      </Frame>
    </div>
  );
}
