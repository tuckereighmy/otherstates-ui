import * as stylex from '@stylexjs/stylex';
import { Combobox, Field } from '../../../components';

const projects = [
  { id: 'atlas', label: 'Atlas' },
  { id: 'harbor', label: 'Harbor' },
  { id: 'meadow', label: 'Meadow' },
];

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function ComboboxInField() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Project" description="Notes move with their project." isRequired>
        <Combobox placeholder="Choose a project" options={projects} />
      </Field>
    </div>
  );
}
