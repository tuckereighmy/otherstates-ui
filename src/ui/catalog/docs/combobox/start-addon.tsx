import * as stylex from '@stylexjs/stylex';
import { Combobox, Icon } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const people = [
  { id: 'amara', label: 'Amara' },
  { id: 'jonas', label: 'Jonas' },
  { id: 'priya', label: 'Priya' },
  { id: 'wren', label: 'Wren' },
];

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-4'], width: 320, maxWidth: '100%' },
});

export default function ComboboxStartAddon() {
  return (
    <div {...stylex.props(s.root)}>
      <Combobox label="Owner" placeholder="Find a person" options={people} startAddon={<Icon name="user" size={16} />} />
      <Combobox
        selectionMode="multiple"
        label="Watchers"
        placeholder="Add people"
        options={people}
        defaultValue={['jonas']}
        startAddon={<Icon name="users" size={16} />}
      />
    </div>
  );
}
