import * as stylex from '@stylexjs/stylex';
import { Field, Input, InputGroup } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function FieldInputGroup() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Project address" description="Lowercase letters, numbers and dashes.">
        <InputGroup start="notes.example.com/">
          <Input name="slug" defaultValue="spring-launch" />
        </InputGroup>
      </Field>
    </div>
  );
}
