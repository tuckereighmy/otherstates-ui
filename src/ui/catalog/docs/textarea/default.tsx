import * as stylex from '@stylexjs/stylex';
import { Textarea } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function TextareaDefault() {
  return (
    <div {...stylex.props(s.root)}>
      <Textarea label="Release notes" placeholder="What changed in this version?" />
    </div>
  );
}
