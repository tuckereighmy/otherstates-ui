import { CheckboxGroup } from '../../../components';

const channels = [
  { id: 'email', label: 'Email' },
  { id: 'push', label: 'Push notifications' },
];

export default function CheckboxGroupInvalid() {
  return (
    <CheckboxGroup
      label="Alert channels"
      description="Where on-call alerts go."
      isRequired
      isInvalid
      errorMessage="Choose at least one channel."
      options={channels}
    />
  );
}
