import * as stylex from '@stylexjs/stylex';
import { Textarea } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function TextareaWithLabel() {
  return (
    <div {...stylex.props(s.root)}>
      <Textarea
        label="Project summary"
        description="Two or three sentences for the overview page."
        placeholder="What is this project about?"
        isRequired
      />
    </div>
  );
}
