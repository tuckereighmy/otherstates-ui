import { CheckboxGroup } from '../../../components';

const scopes = [
  { id: 'read', label: 'Read repositories' },
  { id: 'write', label: 'Write repositories' },
  { id: 'admin', label: 'Administer the organization' },
];

export default function CheckboxGroupReadOnly() {
  return <CheckboxGroup label="Token scopes" isReadOnly defaultValue={['read', 'write']} options={scopes} />;
}
