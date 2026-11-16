import * as stylex from '@stylexjs/stylex';
import { Combobox } from '../../../components';

const tags = [
  { id: 'research', label: 'Research' },
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'meeting', label: 'Meeting notes' },
  { id: 'decision', label: 'Decision' },
  { id: 'follow-up', label: 'Follow-up' },
];

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function ComboboxMultiple() {
  return (
    <div {...stylex.props(s.root)}>
      <Combobox
        selectionMode="multiple"
        label="Tags"
        placeholder="Add tags"
        options={tags}
        defaultValue={['roadmap', 'decision']}
      />
    </div>
  );
}
