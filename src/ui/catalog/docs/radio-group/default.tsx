import { RadioGroup } from '../../../components';

const delivery = [
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'Text message' },
  { value: 'none', label: 'Do not send' },
];

export default function RadioGroupDefault() {
  return <RadioGroup label="Send receipts by" defaultValue="email" options={delivery} />;
}
