import * as stylex from '@stylexjs/stylex';
import { Frame } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function FrameOutline() {
  return (
    <div {...stylex.props(s.root)}>
      <Frame variant="outline" label="Backup schedule">
        A full backup runs every night at 02:00 and is kept for 14 days.
      </Frame>
    </div>
  );
}
