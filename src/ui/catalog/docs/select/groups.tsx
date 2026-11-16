import * as stylex from '@stylexjs/stylex';
import { Select } from '../../../components';

const owners = [
  {
    id: 'design',
    label: 'Design',
    options: [
      { id: 'amara', label: 'Amara' },
      { id: 'jonas', label: 'Jonas' },
    ],
  },
  {
    id: 'engineering',
    label: 'Engineering',
    options: [
      { id: 'priya', label: 'Priya' },
      { id: 'tomas', label: 'Tomas' },
      { id: 'wren', label: 'Wren' },
    ],
  },
];

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function SelectGroups() {
  return (
    <div {...stylex.props(s.root)}>
      <Select label="Owner" placeholder="Choose an owner" options={owners} />
    </div>
  );
}
