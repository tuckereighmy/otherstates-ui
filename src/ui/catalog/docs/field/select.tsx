import * as stylex from '@stylexjs/stylex';
import { Field, Select } from '../../../components';

const regions = [
  { id: 'eu-west', label: 'Europe (West)' },
  { id: 'us-east', label: 'United States (East)' },
  { id: 'ap-south', label: 'Asia Pacific (South)' },
];

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function FieldSelect() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Region" description="Where new projects store their files.">
        <Select name="region" options={regions} defaultValue="eu-west" />
      </Field>
    </div>
  );
}
