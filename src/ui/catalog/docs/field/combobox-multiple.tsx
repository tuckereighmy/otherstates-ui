import * as stylex from '@stylexjs/stylex';
import { Combobox, Field } from '../../../components';

const labels = ['Bug', 'Design', 'Docs', 'Performance', 'Security']
  .map(label => ({ id: label.toLowerCase(), label }));

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function FieldComboboxMultiple() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Labels" description="Pick as many as apply.">
        <Combobox selectionMode="multiple" name="labels" placeholder="Add labels" options={labels} defaultValue={['design']} />
      </Field>
    </div>
  );
}
