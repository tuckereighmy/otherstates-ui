import * as stylex from '@stylexjs/stylex';
import { Field, Select } from '../../../components';

const frequencies = [
  { id: 'instant', label: 'As it happens' },
  { id: 'daily', label: 'Daily summary' },
  { id: 'weekly', label: 'Weekly summary' },
];

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function SelectInField() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Email updates" description="Mentions always arrive right away.">
        <Select options={frequencies} defaultValue="daily" />
      </Field>
    </div>
  );
}
