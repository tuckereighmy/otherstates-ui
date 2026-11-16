import { Switch } from '../../../components';

export default function SwitchInvalid() {
  return (
    <Switch
      label="Allow production deploys"
      isRequired
      isInvalid
      errorMessage="Turn this on to finish the release."
    />
  );
}
