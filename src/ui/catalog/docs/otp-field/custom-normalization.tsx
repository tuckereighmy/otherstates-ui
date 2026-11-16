'use client';

import { OtpField } from '../../../components';

export default function OtpFieldCustomNormalization() {
  return (
    <OtpField
      label="Invite code"
      type="alphanumeric"
      normalize={text => text.toUpperCase()}
      description="Letters are uppercased as you type or paste."
    />
  );
}
