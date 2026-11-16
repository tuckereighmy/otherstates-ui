import * as stylex from '@stylexjs/stylex';
import { Select } from '../../../components';

const days = [
  { id: 'mon', label: 'Monday' },
  { id: 'tue', label: 'Tuesday' },
  { id: 'wed', label: 'Wednesday' },
  { id: 'thu', label: 'Thursday' },
  { id: 'fri', label: 'Friday' },
];

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function SelectMultiple() {
  return (
    <div {...stylex.props(s.root)}>
      <Select
        selectionMode="multiple"
        label="Digest days"
        placeholder="Choose days"
        options={days}
        defaultValue={['mon', 'thu']}
      />
    </div>
  );
}
