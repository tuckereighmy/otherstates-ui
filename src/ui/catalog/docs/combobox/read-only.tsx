import * as stylex from '@stylexjs/stylex';
import { Combobox } from '../../../components';

const owners = [
  { id: 'amara', label: 'Amara' },
  { id: 'jonas', label: 'Jonas' },
];

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function ComboboxReadOnly() {
  return (
    <div {...stylex.props(s.root)}>
      <Combobox label="Workspace owner" options={owners} defaultSelectedKey="amara" isReadOnly />
    </div>
  );
}
