import * as stylex from '@stylexjs/stylex';
import { RadioGroup } from '../../../components';

const s = stylex.create({
  root: { width: 340, maxWidth: '100%' },
});

const visibility = [
  { value: 'private', label: 'Private', description: 'Only invited members can open the project.' },
  { value: 'team', label: 'Team', description: 'Everyone in the workspace can view it.' },
  { value: 'public', label: 'Public', description: 'Anyone with the link can view it.' },
];

export default function RadioGroupWithDescription() {
  return (
    <div {...stylex.props(s.root)}>
      <RadioGroup label="Visibility" description="You can change this later." defaultValue="team" options={visibility} />
    </div>
  );
}
