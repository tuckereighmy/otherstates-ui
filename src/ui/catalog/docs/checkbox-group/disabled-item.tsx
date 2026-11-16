import { CheckboxGroup } from '../../../components';

const regions = [
  { id: 'eu', label: 'Frankfurt' },
  { id: 'us', label: 'Virginia' },
  { id: 'ap', label: 'Singapore', description: 'Available on the team plan.', disabled: true },
];

export default function CheckboxGroupDisabledItem() {
  return <CheckboxGroup label="Regions" defaultValue={['eu']} options={regions} />;
}
