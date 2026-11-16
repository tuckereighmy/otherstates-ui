import { OtpField } from '../../../components';

export default function OtpFieldInvalid() {
  return (
    <OtpField
      label="Verification code"
      defaultValue="481920"
      isInvalid
      errorMessage="That code has expired. Request a new one."
    />
  );
}
