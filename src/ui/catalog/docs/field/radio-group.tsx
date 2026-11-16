import * as stylex from '@stylexjs/stylex';
import { Field, RadioGroup } from '../../../components';

const visibility = [
  { value: 'team', label: 'Everyone on the team' },
  { value: 'invited', label: 'Only invited people' },
  { value: 'private', label: 'Only me' },
];

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function FieldRadioGroup() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Who can see this project" description="You can change it later in settings.">
        <RadioGroup name="visibility" options={visibility} defaultValue="team" />
      </Field>
    </div>
  );
}
