import * as stylex from '@stylexjs/stylex';
import { Select } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const projects = [
  { id: 'atlas', label: 'Atlas' },
  { id: 'harbor', label: 'Harbor' },
  { id: 'meadow', label: 'Meadow' },
];

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-4'], width: 280, maxWidth: '100%' },
});

export default function SelectInvalid() {
  return (
    <div {...stylex.props(s.root)}>
      <Select label="Project" options={projects} placeholder="Choose a project" errorMessage="Choose a project to move this note." />
      <Select
        appearance="field"
        label="Project"
        options={projects}
        placeholder="Choose a project"
        errorMessage="Choose a project to move this note."
      />
    </div>
  );
}
