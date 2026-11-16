import { OtpField } from '../../../components';

export default function OtpFieldWithHelpText() {
  return (
    <OtpField
      label="Verification code"
      description="We sent a 6-digit code to your email."
    />
  );
}
