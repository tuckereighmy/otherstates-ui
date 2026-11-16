import * as stylex from '@stylexjs/stylex';
import { Combobox } from '../../../components';

const channels = [
  {
    id: 'teams',
    label: 'Teams',
    options: [
      { id: 'design', label: 'Design' },
      { id: 'platform', label: 'Platform' },
      { id: 'support', label: 'Support' },
    ],
  },
  {
    id: 'projects',
    label: 'Projects',
    options: [
      { id: 'atlas', label: 'Atlas launch' },
      { id: 'harbor', label: 'Harbor migration' },
    ],
  },
];

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function ComboboxGroups() {
  return (
    <div {...stylex.props(s.root)}>
      <Combobox label="Post to" placeholder="Choose a channel" options={channels} />
    </div>
  );
}
