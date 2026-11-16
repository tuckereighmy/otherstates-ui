import * as stylex from '@stylexjs/stylex';
import { Textarea } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function TextareaAutoResize() {
  return (
    <div {...stylex.props(s.root)}>
      <Textarea
        label="Comment"
        description="Grows from two to six lines, then scrolls."
        placeholder="Reply to the thread"
        minRows={2}
        maxRows={6}
      />
    </div>
  );
}
