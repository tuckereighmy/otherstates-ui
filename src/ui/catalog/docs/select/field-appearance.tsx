import * as stylex from '@stylexjs/stylex';
import { Select } from '../../../components';

const regions = [
  { id: 'eu-west', label: 'Europe (Dublin)' },
  { id: 'eu-central', label: 'Europe (Frankfurt)' },
  { id: 'us-east', label: 'United States (Virginia)' },
  { id: 'ap-south', label: 'Asia Pacific (Singapore)' },
];

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function SelectFieldAppearance() {
  return (
    <div {...stylex.props(s.root)}>
      <Select appearance="field" label="Region" placeholder="Choose a region" options={regions} />
    </div>
  );
}
