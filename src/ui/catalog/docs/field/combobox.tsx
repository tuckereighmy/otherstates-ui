import * as stylex from '@stylexjs/stylex';
import { Combobox, Field } from '../../../components';

const people = ['Ana', 'Bruno', 'Chen', 'Dalia', 'Emil', 'Farah']
  .map(name => ({ id: name.toLowerCase(), label: name }));

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function FieldCombobox() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Reviewer" description="They get a note when the draft is ready." isRequired>
        <Combobox name="reviewer" placeholder="Choose a teammate" options={people} />
      </Field>
    </div>
  );
}
