import { CheckboxGroup } from '../../../components';

const permissions = [
  { id: 'view', label: 'View projects' },
  { id: 'edit', label: 'Edit settings' },
  { id: 'invite', label: 'Invite members' },
];

export default function CheckboxGroupParent() {
  return (
    <CheckboxGroup
      label="Permissions"
      selectAllLabel="All permissions"
      defaultValue={['view']}
      options={permissions}
    />
  );
}
