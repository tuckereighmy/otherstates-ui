import { RadioGroup } from '../../../components';

const intervals = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
];

export default function RadioGroupHorizontal() {
  return <RadioGroup label="Billing interval" orientation="horizontal" defaultValue="monthly" options={intervals} />;
}
