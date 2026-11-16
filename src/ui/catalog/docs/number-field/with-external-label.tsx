import * as stylex from '@stylexjs/stylex';
import { Field, NumberField } from '../../../components';

const s = stylex.create({
  root: { width: 240, maxWidth: '100%' },
});

export default function NumberFieldWithExternalLabel() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Retention period" description="Days to keep deleted projects.">
        <NumberField defaultValue={30} minValue={1} maxValue={90} />
      </Field>
    </div>
  );
}
