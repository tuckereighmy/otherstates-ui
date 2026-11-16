import { Checkbox } from '../../../components';

export default function CheckboxInvalid() {
  return (
    <Checkbox
      label="I accept the data processing terms"
      isRequired
      isInvalid
      errorMessage="Accept the terms to continue."
    />
  );
}
