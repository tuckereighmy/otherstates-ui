import { CheckboxGroup } from '../../../components';

const channels = [
  { id: 'email', label: 'Email' },
  { id: 'push', label: 'Push notifications' },
  { id: 'sms', label: 'Text message' },
];

export default function CheckboxGroupDefault() {
  return <CheckboxGroup label="Notify me by" defaultValue={['email']} options={channels} />;
}
