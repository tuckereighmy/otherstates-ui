import { CheckboxGroup } from '../../../components';

const days = [
  { id: 'mon', label: 'Mon' },
  { id: 'tue', label: 'Tue' },
  { id: 'wed', label: 'Wed' },
  { id: 'thu', label: 'Thu' },
  { id: 'fri', label: 'Fri' },
];

export default function CheckboxGroupHorizontal() {
  return (
    <CheckboxGroup
      label="Backup days"
      orientation="horizontal"
      defaultValue={['mon', 'wed', 'fri']}
      options={days}
    />
  );
}
