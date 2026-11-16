import * as stylex from '@stylexjs/stylex';
import { Combobox } from '../../../components';

const folders = [
  { id: 'inbox', label: 'Inbox' },
  { id: 'drafts', label: 'Drafts' },
  { id: 'archive', label: 'Archive' },
  { id: 'shared', label: 'Shared with me' },
];

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function ComboboxClearButton() {
  return (
    <div {...stylex.props(s.root)}>
      <Combobox label="Folder" options={folders} defaultSelectedKey="drafts" isClearable />
    </div>
  );
}
