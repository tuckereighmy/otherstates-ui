import * as stylex from '@stylexjs/stylex';
import { Field, Fieldset, Input } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function FieldsetPlain() {
  return (
    <div {...stylex.props(s.root)}>
      <Fieldset variant="plain" legend="Deployment window" description="Times are in your workspace time zone.">
        <Field label="Starts">
          <Input type="time" name="start" defaultValue="22:00" />
        </Field>
        <Field label="Ends">
          <Input type="time" name="end" defaultValue="23:30" />
        </Field>
      </Fieldset>
    </div>
  );
}
