import * as stylex from '@stylexjs/stylex';
import { Combobox } from '../../../components';

const people = [
  { id: 'amara', label: 'Amara' },
  { id: 'jonas', label: 'Jonas' },
  { id: 'priya', label: 'Priya' },
  { id: 'tomas', label: 'Tomas' },
  { id: 'wren', label: 'Wren' },
];

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function ComboboxDefault() {
  return (
    <div {...stylex.props(s.root)}>
      <Combobox label="Assignee" placeholder="Choose a teammate" options={people} />
    </div>
  );
}
