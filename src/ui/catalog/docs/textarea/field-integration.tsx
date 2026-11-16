import * as stylex from '@stylexjs/stylex';
import { Field, Textarea } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function TextareaFieldIntegration() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Feedback" description="Only your team lead can read this." isOptional>
        <Textarea placeholder="What went well, and what would you change?" />
      </Field>
    </div>
  );
}
