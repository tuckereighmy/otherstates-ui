'use client';

import { Composer } from '../../../components';

export default function ComposerKeyboardShortcuts() {
  return (
    <Composer
      enterToSubmit={false}
      placeholder="Write a longer note"
      description="Enter adds a line. Cmd+Enter or Ctrl+Enter sends."
      onSubmit={() => {}}
    />
  );
}
