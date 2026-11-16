import { RadioGroup } from '../../../components';

const roles = [
  { value: 'viewer', label: 'Viewer' },
  { value: 'editor', label: 'Editor' },
  { value: 'admin', label: 'Admin' },
];

export default function RadioGroupInvalid() {
  return (
    <RadioGroup
      label="Role"
      description="What the new member can do."
      isRequired
      isInvalid
      errorMessage="Choose a role for Priya."
      options={roles}
    />
  );
}
