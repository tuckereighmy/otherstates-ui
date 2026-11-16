import * as stylex from '@stylexjs/stylex';
import { Autocomplete } from '../../../components';

const recipients = [
  { id: 'people', label: 'People', options: ['Amara', 'Jonas', 'Priya'].map(name => ({ id: name.toLowerCase(), label: name })) },
  { id: 'teams', label: 'Teams', options: ['Design', 'Finance', 'Support'].map(team => ({ id: team.toLowerCase(), label: team })) },
];

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function AutocompleteGroups() {
  return (
    <div {...stylex.props(s.root)}>
      <Autocomplete label="Share with" placeholder="Name or team" options={recipients} showTrigger />
    </div>
  );
}
