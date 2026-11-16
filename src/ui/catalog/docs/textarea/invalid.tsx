import * as stylex from '@stylexjs/stylex';
import { Textarea } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function TextareaInvalid() {
  return (
    <div {...stylex.props(s.root)}>
      <Textarea
        label="Reason for refund"
        description="Shared with the customer."
        errorMessage="Write at least 20 characters so the customer understands the refund."
        defaultValue="Damaged"
      />
    </div>
  );
}
