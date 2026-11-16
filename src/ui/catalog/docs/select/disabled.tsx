import * as stylex from '@stylexjs/stylex';
import { Select } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const roles = [
  { id: 'viewer', label: 'Viewer' },
  { id: 'editor', label: 'Editor' },
  { id: 'admin', label: 'Admin', disabled: true },
];

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-4'], width: 280, maxWidth: '100%' },
});

export default function SelectDisabled() {
  return (
    <div {...stylex.props(s.root)}>
      <Select label="Role" options={roles} defaultValue="viewer" isDisabled />
      <Select appearance="field" label="Role" options={roles} defaultValue="editor" isDisabled />
      <Select appearance="field" label="Role with a locked option" options={roles} placeholder="Choose a role" />
    </div>
  );
}
