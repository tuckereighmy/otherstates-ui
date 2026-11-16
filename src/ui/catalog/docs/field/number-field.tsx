import * as stylex from '@stylexjs/stylex';
import { Field, NumberField } from '../../../components';

const s = stylex.create({
  root: { width: 240, maxWidth: '100%' },
});

export default function FieldNumberField() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Seats" description="Billed monthly for each seat.">
        <NumberField name="seats" defaultValue={5} minValue={1} maxValue={50} />
      </Field>
    </div>
  );
}
