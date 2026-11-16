'use client';

import { OtpField } from '../../../components';

export default function OtpFieldAutoValidation() {
  return (
    <OtpField
      label="Verification code"
      length={4}
      validate={code => code === '2468'}
      description="Try 2468, or any other code to see it rejected."
    />
  );
}
