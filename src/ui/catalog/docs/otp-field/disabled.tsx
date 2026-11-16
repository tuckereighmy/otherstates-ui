import { OtpField } from '../../../components';

export default function OtpFieldDisabled() {
  return <OtpField label="Verification code" length={4} defaultValue="4819" isDisabled />;
}
