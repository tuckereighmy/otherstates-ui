import * as stylex from '@stylexjs/stylex';
import { Textarea } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function TextareaReadOnly() {
  return (
    <div {...stylex.props(s.root)}>
      <Textarea
        label="Original request"
        defaultValue="Please move the review to Thursday afternoon and add Priya to the invite."
        isReadOnly
      />
    </div>
  );
}
