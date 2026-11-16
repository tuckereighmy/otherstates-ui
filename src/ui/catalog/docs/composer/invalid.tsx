'use client';

import { Composer } from '../../../components';

export default function ComposerInvalid() {
  return (
    <Composer
      isInvalid
      description="Replies are shared with the whole team."
      errorMessage="Write at least one sentence before you send."
      onSubmit={() => {}}
    />
  );
}
