import { Switch } from '../../../components';

export default function SwitchReadOnly() {
  return <Switch label="Audit logging" description="Required on the scale plan." isReadOnly defaultSelected />;
}
