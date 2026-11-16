import * as stylex from '@stylexjs/stylex';
import { Checkbox, Field } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function FieldCheckbox() {
  return (
    <div {...stylex.props(s.root)}>
      <Field description="One email every Monday with the week's changes.">
        <Checkbox label="Weekly summary" name="weeklySummary" defaultSelected />
      </Field>
    </div>
  );
}
